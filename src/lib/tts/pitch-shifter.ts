import { TTSVoicePersona } from './types';

export interface PersonaAcousticProfile {
  /** Pitch multiplier (< 1.0 deeper, > 1.0 brighter, 1.0 = pristine studio original) */
  pitchFactor: number;
  /** Low-shelf gain in dB at ~150Hz (gentle chest warmth vs thinning) */
  lowShelfDb: number;
  /** Mid/presence peaking gain in dB (keeps voice friendly, warm & articulate) */
  midPeakFreq: number;
  midPeakDb: number;
  /** High-shelf gain in dB at ~3400Hz (preserves consonant clarity & smile) */
  highShelfDb: number;
}

export const PERSONA_ACOUSTIC_PROFILES: Record<TTSVoicePersona, PersonaAcousticProfile> = {
  female: {
    pitchFactor: 1.0,
    lowShelfDb: 0,
    midPeakFreq: 2400,
    midPeakDb: 1.0,
    highShelfDb: 1.0,
  },
  male: {
    pitchFactor: 0.84,
    lowShelfDb: 2.5,
    midPeakFreq: 2600,
    midPeakDb: 2.0,
    highShelfDb: 0.5,
  },
  adult: {
    pitchFactor: 0.94,
    lowShelfDb: 1.5,
    midPeakFreq: 1900,
    midPeakDb: 2.0,
    highShelfDb: 1.0,
  },
  child: {
    pitchFactor: 1.24,
    lowShelfDb: -2.5,
    midPeakFreq: 2800,
    midPeakDb: 2.0,
    highShelfDb: 2.5,
  },
};

/**
 * Pure time-domain WSOLA (Waveform Similarity Overlap-Add) time-stretcher
 * using Energy-Normalized Cross-Correlation (NCC) and a crisp ~26ms speech window.
 * Stretches or compresses a Float32Array by `stretchFactor` WITHOUT altering pitch,
 * so subsequent resampling via AudioBufferSourceNode.playbackRate shifts pitch cleanly
 * while preserving speaking tempo, consonants, and Mandarin tones.
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

  const factor = Math.max(0.65, Math.min(1.55, stretchFactor));

  // Tight ~26ms speech window (preserves Mandarin initials & avoids metallic smearing)
  const winSize = Math.max(480, Math.min(1024, Math.round((sampleRate * 0.026) / 4) * 4));
  const hopS = winSize / 4; // 75% overlap for constant-overlap-add Hann
  const hopA = hopS / factor;
  const searchRadius = Math.max(40, Math.round(sampleRate * 0.008));

  const outLen = Math.max(winSize, Math.round(input.length * factor));
  const output = new Float32Array(outLen);
  const weightSum = new Float32Array(outLen);

  // Periodic Hann window
  const win = new Float32Array(winSize);
  for (let i = 0; i < winSize; i++) {
    win[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / winSize));
  }

  // First frame at index 0
  const firstLimit = Math.min(winSize, input.length, outLen);
  for (let i = 0; i < firstLimit; i++) {
    output[i] += input[i] * win[i];
    weightSum[i] += win[i];
  }

  let outPos = hopS;
  let idealInPos = hopA;
  let prevInPos = 0;

  while (outPos + winSize < outLen && idealInPos + winSize < input.length) {
    const natPos = prevInPos + hopS;

    let bestInPos = Math.round(idealInPos);
    if (natPos + winSize / 2 < input.length) {
      let bestScore = -Infinity;
      const minSearch = Math.max(0, Math.round(idealInPos) - searchRadius);
      const maxSearch = Math.min(
        input.length - winSize,
        Math.round(idealInPos) + searchRadius
      );
      const cmpLen = hopS * 2;

      // Normalized Cross-Correlation (NCC) coarse-to-fine search avoids amplitude bias
      for (let cand = minSearch; cand <= maxSearch; cand += 2) {
        let dot = 0;
        let energyCand = 0;
        for (let k = 0; k < cmpLen && natPos + k < input.length; k += 2) {
          const a = input[natPos + k];
          const b = input[cand + k];
          dot += a * b;
          energyCand += b * b;
        }
        const score = energyCand > 1e-8 ? dot / Math.sqrt(energyCand) : dot;
        if (score > bestScore) {
          bestScore = score;
          bestInPos = cand;
        }
      }

      const refineStart = Math.max(minSearch, bestInPos - 1);
      const refineEnd = Math.min(maxSearch, bestInPos + 1);
      for (let cand = refineStart; cand <= refineEnd; cand++) {
        let dot = 0;
        let energyCand = 0;
        for (let k = 0; k < cmpLen && natPos + k < input.length; k += 2) {
          const a = input[natPos + k];
          const b = input[cand + k];
          dot += a * b;
          energyCand += b * b;
        }
        const score = energyCand > 1e-8 ? dot / Math.sqrt(energyCand) : dot;
        if (score > bestScore) {
          bestScore = score;
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
