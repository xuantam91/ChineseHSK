import { TTSVoicePersona } from './types';

export interface PersonaAcousticProfile {
  /** Pitch multiplier (< 1.0 deeper, > 1.0 brighter, 1.0 = original) */
  pitchFactor: number;
  /** Low-shelf gain in dB at ~160Hz (chest warmth vs thinning) */
  lowShelfDb: number;
  /** Mid/body peaking gain in dB */
  midPeakFreq: number;
  midPeakDb: number;
  /** High-shelf gain in dB at ~3200Hz (brightness vs warmth) */
  highShelfDb: number;
}

export const PERSONA_ACOUSTIC_PROFILES: Record<TTSVoicePersona, PersonaAcousticProfile> = {
  female: {
    pitchFactor: 1.03,
    lowShelfDb: 0.5,
    midPeakFreq: 2200,
    midPeakDb: 1.5,
    highShelfDb: 1.5,
  },
  male: {
    pitchFactor: 0.75,
    lowShelfDb: 5.5,
    midPeakFreq: 250,
    midPeakDb: 3.0,
    highShelfDb: -4.0,
  },
  adult: {
    pitchFactor: 0.88,
    lowShelfDb: 2.5,
    midPeakFreq: 950,
    midPeakDb: 2.8,
    highShelfDb: -1.5,
  },
  child: {
    pitchFactor: 1.28,
    lowShelfDb: -4.0,
    midPeakFreq: 2600,
    midPeakDb: 2.5,
    highShelfDb: 3.5,
  },
};

/**
 * Pure time-domain WSOLA (Waveform Similarity Overlap-Add) time-stretcher.
 * Compresses or stretches a Float32Array by `stretchFactor` WITHOUT altering pitch,
 * so subsequent resampling via AudioBufferSourceNode.playbackRate shifts pitch cleanly
 * while preserving speaking tempo and Beijing Mandarin tones.
 *
 * stretchFactor < 1.0 -> shorter output buffer (used before slower playbackRate -> lower pitch)
 * stretchFactor > 1.0 -> longer output buffer (used before faster playbackRate -> higher pitch)
 */
export function timeStretchFloat32(
  input: Float32Array,
  sampleRate: number,
  stretchFactor: number
): Float32Array {
  if (
    !input ||
    input.length < 1024 ||
    !Number.isFinite(stretchFactor) ||
    Math.abs(stretchFactor - 1.0) < 0.015
  ) {
    return input;
  }

  // Clamp reasonable factor range
  const factor = Math.max(0.6, Math.min(1.6, stretchFactor));

  // Scale window to sampleRate (~42ms window, ~10.5ms synthesis hop, ±7ms search)
  const winSize = Math.max(512, Math.min(2048, Math.round((sampleRate * 0.042) / 4) * 4));
  const hopS = winSize / 4; // 75% overlap for constant-overlap-add Hann
  const hopA = hopS / factor;
  const searchRadius = Math.max(32, Math.round(sampleRate * 0.007));

  const outLen = Math.max(winSize, Math.round(input.length * factor));
  const output = new Float32Array(outLen);
  const weightSum = new Float32Array(outLen);

  // Periodic Hann window
  const win = new Float32Array(winSize);
  for (let i = 0; i < winSize; i++) {
    win[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / winSize));
  }

  // First frame direct copy at index 0
  const firstLimit = Math.min(winSize, input.length, outLen);
  for (let i = 0; i < firstLimit; i++) {
    output[i] += input[i] * win[i];
    weightSum[i] += win[i];
  }

  let outPos = hopS;
  let idealInPos = hopA;
  let prevInPos = 0;

  while (outPos + winSize < outLen && idealInPos + winSize < input.length) {
    // Expected natural continuation point from previous analysis frame
    const natPos = prevInPos + hopS;

    // Find best phase-aligned offset around idealInPos matching waveform at natPos
    let bestInPos = Math.round(idealInPos);
    if (natPos + winSize / 2 < input.length) {
      let bestCorr = -Infinity;
      const minSearch = Math.max(0, Math.round(idealInPos) - searchRadius);
      const maxSearch = Math.min(
        input.length - winSize,
        Math.round(idealInPos) + searchRadius
      );
      const cmpLen = hopS;

      // Coarse-to-fine search (step 2 then ±1 refinement) for speed & precision
      for (let cand = minSearch; cand <= maxSearch; cand += 2) {
        let corr = 0;
        for (let k = 0; k < cmpLen; k += 2) {
          corr += input[natPos + k] * input[cand + k];
        }
        if (corr > bestCorr) {
          bestCorr = corr;
          bestInPos = cand;
        }
      }

      const refineStart = Math.max(minSearch, bestInPos - 1);
      const refineEnd = Math.min(maxSearch, bestInPos + 1);
      for (let cand = refineStart; cand <= refineEnd; cand++) {
        let corr = 0;
        for (let k = 0; k < cmpLen; k += 2) {
          corr += input[natPos + k] * input[cand + k];
        }
        if (corr > bestCorr) {
          bestCorr = corr;
          bestInPos = cand;
        }
      }
    }

    bestInPos = Math.max(0, Math.min(input.length - winSize, bestInPos));

    for (let i = 0; i < winSize; i++) {
      const w = win[i];
      output[outPos + i] += input[bestInPos + i] * w;
      weightSum[outPos + i] += w;
    }

    prevInPos = bestInPos;
    outPos += hopS;
    idealInPos += hopA;
  }

  // Normalize by Hann overlap weights to guarantee flat amplitude envelope
  for (let i = 0; i < outLen; i++) {
    if (weightSum[i] > 1e-4) {
      output[i] /= weightSum[i];
    }
  }

  return output;
}

/**
 * Produces a new AudioBuffer time-stretched by `pitchFactor` so playing it at
 * `playbackRate = pitchFactor * desiredSpeed` changes pitch cleanly without altering tempo.
 */
export function createPersonaShiftedBuffer(
  ctx: AudioContext,
  source: AudioBuffer,
  pitchFactor: number
): AudioBuffer {
  if (Math.abs(pitchFactor - 1.0) < 0.015) {
    return source;
  }

  const ch0 = timeStretchFloat32(source.getChannelData(0), source.sampleRate, pitchFactor);
  const targetLen = ch0.length;
  const out = ctx.createBuffer(source.numberOfChannels, targetLen, source.sampleRate);
  out.copyToChannel(new Float32Array(ch0), 0);

  for (let ch = 1; ch < source.numberOfChannels; ch++) {
    const stretched = timeStretchFloat32(
      source.getChannelData(ch),
      source.sampleRate,
      pitchFactor
    );
    const copy = new Float32Array(targetLen);
    copy.set(stretched.subarray(0, targetLen));
    out.copyToChannel(copy, ch);
  }

  return out;
}
