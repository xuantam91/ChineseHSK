import { TTSVoicePersona } from './types';

export interface PersonaAcousticProfile {
  /** Fundamental frequency F0 ratio (< 1.0 deeper, > 1.0 higher, 1.0 = original) */
  pitchRatio: number;
  /** Vocal tract formant scale (< 1.0 longer male vocal tract, > 1.0 shorter child tract) */
  formantRatio: number;
  /** Low-shelf gain in dB at ~160Hz (gentle chest warmth) */
  lowShelfDb: number;
  /** Mid/presence peaking gain in dB (keeps voice friendly & articulate) */
  midPeakFreq: number;
  midPeakDb: number;
  /** High-shelf gain in dB at ~3200Hz */
  highShelfDb: number;
}

export const PERSONA_ACOUSTIC_PROFILES: Record<TTSVoicePersona, PersonaAcousticProfile> = {
  female: {
    pitchRatio: 1.0,
    formantRatio: 1.0,
    lowShelfDb: 0,
    midPeakFreq: 2400,
    midPeakDb: 1.0,
    highShelfDb: 1.0,
  },
  male: {
    // True adult male range (~125-138Hz from ~240Hz female) while keeping natural 0.85x male vocal tract formants
    pitchRatio: 0.53,
    formantRatio: 0.85,
    lowShelfDb: 2.2,
    midPeakFreq: 2200,
    midPeakDb: 2.0,
    highShelfDb: 0.5,
  },
  adult: {
    // Calm, friendly mature teacher (~170-185Hz)
    pitchRatio: 0.72,
    formantRatio: 0.91,
    lowShelfDb: 1.5,
    midPeakFreq: 1900,
    midPeakDb: 2.0,
    highShelfDb: 1.0,
  },
  child: {
    pitchRatio: 1.28,
    formantRatio: 1.07,
    lowShelfDb: -2.5,
    midPeakFreq: 2800,
    midPeakDb: 2.0,
    highShelfDb: 2.5,
  },
};

function resampleLinear(input: Float32Array, targetLen: number): Float32Array {
  if (targetLen === input.length) return input;
  const out = new Float32Array(targetLen);
  const ratio = (input.length - 1) / Math.max(1, targetLen - 1);
  for (let i = 0; i < targetLen; i++) {
    const pos = i * ratio;
    const i0 = Math.floor(pos);
    const i1 = Math.min(input.length - 1, i0 + 1);
    const frac = pos - i0;
    out[i] = input[i0] * (1 - frac) + input[i1] * frac;
  }
  return out;
}

interface PitchMark {
  pos: number;
  t0: number;
  voiced: boolean;
}

/**
 * Formant-Independent TD-PSOLA (Time-Domain Pitch-Synchronous Overlap-Add).
 * Independently scales vocal tract formants (`formantRatio`) and fundamental pitch F0 (`pitchRatio`)
 * while preserving exact output duration (`output.length === input.length`) and leaving unvoiced
 * Mandarin consonants crisp.
 */
export function transformVoiceTDPSOLA(
  input: Float32Array,
  sampleRate: number,
  pitchRatio: number,
  formantRatio: number
): Float32Array {
  if (
    !input ||
    input.length < 1024 ||
    (Math.abs(pitchRatio - 1.0) < 0.02 && Math.abs(formantRatio - 1.0) < 0.02)
  ) {
    return input;
  }

  const safePitch = Math.max(0.45, Math.min(1.6, pitchRatio));
  const safeFormant = Math.max(0.72, Math.min(1.25, formantRatio));

  // 1. Shift vocal-tract formants cleanly via linear resampling (1 / safeFormant)
  const work =
    Math.abs(safeFormant - 1.0) > 0.015
      ? resampleLinear(input, Math.max(1024, Math.round(input.length / safeFormant)))
      : input;

  // Remaining pitch shift required inside TD-PSOLA without moving formants
  const psolaPitchRatio = safePitch / safeFormant;

  // 2. Analyze pitch marks sequentially on `work`
  const lagMin = Math.max(20, Math.floor(sampleRate / 400));
  const lagMax = Math.min(480, Math.ceil(sampleRate / 75));
  const marks: PitchMark[] = [];
  const unvoicedHop = Math.max(64, Math.round(sampleRate * 0.008));
  let pos = Math.round(sampleRate * 0.01);
  let prevVoicedLag = 0;

  while (pos + lagMax + 64 < work.length) {
    let rms = 0;
    const rmsSpan = Math.min(200, work.length - pos);
    for (let i = 0; i < rmsSpan; i++) {
      rms += work[pos + i] * work[pos + i];
    }
    rms = Math.sqrt(rms / Math.max(1, rmsSpan));

    let bestLag = 0;
    let bestR = 0;
    if (rms > 0.014) {
      const localMin =
        prevVoicedLag > 0 ? Math.max(lagMin, Math.round(prevVoicedLag * 0.72)) : lagMin;
      const localMax =
        prevVoicedLag > 0 ? Math.min(lagMax, Math.round(prevVoicedLag * 1.38)) : lagMax;
      const win = Math.min(280, work.length - pos - localMax);

      if (win > 32) {
        for (let lag = localMin; lag <= localMax; lag++) {
          let dot = 0;
          let e1 = 0;
          let e2 = 0;
          for (let i = 0; i < win; i += 2) {
            const a = work[pos + i];
            const b = work[pos + i + lag];
            dot += a * b;
            e1 += a * a;
            e2 += b * b;
          }
          const r = e1 > 1e-8 && e2 > 1e-8 ? dot / Math.sqrt(e1 * e2) : 0;
          if (r > bestR) {
            bestR = r;
            bestLag = lag;
          }
        }
      }

      if (bestR < 0.45 && prevVoicedLag > 0) {
        const win2 = Math.min(280, work.length - pos - lagMax);
        if (win2 > 32) {
          bestR = 0;
          for (let lag = lagMin; lag <= lagMax; lag++) {
            let dot = 0;
            let e1 = 0;
            let e2 = 0;
            for (let i = 0; i < win2; i += 2) {
              const a = work[pos + i];
              const b = work[pos + i + lag];
              dot += a * b;
              e1 += a * a;
              e2 += b * b;
            }
            const r = e1 > 1e-8 && e2 > 1e-8 ? dot / Math.sqrt(e1 * e2) : 0;
            if (r > bestR) {
              bestR = r;
              bestLag = lag;
            }
          }
        }
      }
    }

    if (bestR > 0.42 && bestLag > 0) {
      const halfSearch = Math.max(8, Math.round(bestLag * 0.4));
      const pStart = Math.max(0, pos - halfSearch);
      const pEnd = Math.min(work.length - 1, pos + halfSearch);
      let peakIdx = pos;
      let peakVal = -Infinity;
      for (let p = pStart; p <= pEnd; p++) {
        if (work[p] > peakVal) {
          peakVal = work[p];
          peakIdx = p;
        }
      }
      marks.push({ pos: peakIdx, t0: bestLag, voiced: true });
      prevVoicedLag = bestLag;
      pos = peakIdx + bestLag;
    } else {
      marks.push({ pos, t0: unvoicedHop, voiced: false });
      prevVoicedLag = 0;
      pos += unvoicedHop;
    }
  }

  if (marks.length === 0) {
    return input;
  }

  // 3. Pitch-synchronous overlap-add onto output buffer of exact original duration
  const outLen = input.length;
  const output = new Float32Array(outLen);
  const weightSum = new Float32Array(outLen);
  const timeMap = work.length / outLen;
  // Guarantee adjacent voiced Hann grains always overlap without zero gaps
  const grainScale = Math.max(0.98, 0.65 / Math.max(0.45, psolaPitchRatio));

  let outPos = Math.round(sampleRate * 0.01);
  let markIdx = 0;

  while (outPos < outLen - 16) {
    const targetWorkPos = outPos * timeMap;
    while (markIdx + 1 < marks.length && marks[markIdx + 1].pos < targetWorkPos) {
      markIdx++;
    }
    const m = marks[markIdx];
    const halfW = m.voiced
      ? Math.max(24, Math.round(m.t0 * grainScale))
      : Math.round(sampleRate * 0.011);

    for (let k = -halfW; k <= halfW; k++) {
      const wi = m.pos + k;
      const oi = outPos + k;
      if (wi >= 0 && wi < work.length && oi >= 0 && oi < outLen) {
        const w = 0.5 * (1 + Math.cos((Math.PI * k) / halfW));
        output[oi] += work[wi] * w;
        weightSum[oi] += w;
      }
    }

    if (m.voiced) {
      outPos += Math.max(24, Math.round(m.t0 / psolaPitchRatio));
    } else {
      outPos += Math.max(24, Math.round(halfW * 0.65));
    }
  }

  for (let i = 0; i < outLen; i++) {
    if (weightSum[i] > 1e-4) {
      output[i] /= weightSum[i];
    }
  }

  return output;
}

/**
 * Produces a new AudioBuffer transformed to the target persona's vocal pitch & formant profile
 * while preserving exact buffer duration (so AudioBufferSourceNode.playbackRate controls speed only).
 */
export function createPersonaShiftedBuffer(
  ctx: AudioContext,
  source: AudioBuffer,
  profile: PersonaAcousticProfile
): AudioBuffer {
  if (
    Math.abs(profile.pitchRatio - 1.0) < 0.02 &&
    Math.abs(profile.formantRatio - 1.0) < 0.02
  ) {
    return source;
  }

  const ch0 = transformVoiceTDPSOLA(
    source.getChannelData(0),
    source.sampleRate,
    profile.pitchRatio,
    profile.formantRatio
  );
  const out = ctx.createBuffer(source.numberOfChannels, ch0.length, source.sampleRate);
  out.copyToChannel(new Float32Array(ch0), 0);

  for (let ch = 1; ch < source.numberOfChannels; ch++) {
    const transformed = transformVoiceTDPSOLA(
      source.getChannelData(ch),
      source.sampleRate,
      profile.pitchRatio,
      profile.formantRatio
    );
    const copy = new Float32Array(ch0.length);
    copy.set(transformed.subarray(0, ch0.length));
    out.copyToChannel(copy, ch);
  }

  return out;
}
