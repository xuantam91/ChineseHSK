/**
 * Speech & Pronunciation Evaluation Library for Chinese LMS
 * Handles Pinyin tone normalization, character alignment, Levenshtein distance,
 * tone accuracy verification, and comprehensive pronunciation scoring.
 */

export interface ToneMapEntry {
  base: string;
  tone: number; // 1: flat, 2: rising, 3: falling-rising, 4: falling, 5: neutral
}

// Full mapping for Pinyin accented vowels
export const PINYIN_TONE_MAP: Record<string, ToneMapEntry> = {
  // Lowercase vowels
  'ā': { base: 'a', tone: 1 },
  'á': { base: 'a', tone: 2 },
  'ǎ': { base: 'a', tone: 3 },
  'à': { base: 'a', tone: 4 },
  'ē': { base: 'e', tone: 1 },
  'é': { base: 'e', tone: 2 },
  'ě': { base: 'e', tone: 3 },
  'è': { base: 'e', tone: 4 },
  'ī': { base: 'i', tone: 1 },
  'í': { base: 'i', tone: 2 },
  'ǐ': { base: 'i', tone: 3 },
  'ì': { base: 'i', tone: 4 },
  'ō': { base: 'o', tone: 1 },
  'ó': { base: 'o', tone: 2 },
  'ǒ': { base: 'o', tone: 3 },
  'ò': { base: 'o', tone: 4 },
  'ū': { base: 'u', tone: 1 },
  'ú': { base: 'u', tone: 2 },
  'ǔ': { base: 'u', tone: 3 },
  'ù': { base: 'u', tone: 4 },
  'ǖ': { base: 'ü', tone: 1 },
  'ǘ': { base: 'ü', tone: 2 },
  'ǚ': { base: 'ü', tone: 3 },
  'ǜ': { base: 'ü', tone: 4 },
  // Uppercase vowels
  'Ā': { base: 'A', tone: 1 },
  'Á': { base: 'A', tone: 2 },
  'Ǎ': { base: 'A', tone: 3 },
  'À': { base: 'A', tone: 4 },
  'Ē': { base: 'E', tone: 1 },
  'É': { base: 'E', tone: 2 },
  'Ě': { base: 'E', tone: 3 },
  'È': { base: 'E', tone: 4 },
  'Ī': { base: 'I', tone: 1 },
  'Í': { base: 'I', tone: 2 },
  'Ǐ': { base: 'I', tone: 3 },
  'Ì': { base: 'I', tone: 4 },
  'Ō': { base: 'O', tone: 1 },
  'Ó': { base: 'O', tone: 2 },
  'Ǒ': { base: 'O', tone: 3 },
  'Ò': { base: 'O', tone: 4 },
  'Ū': { base: 'U', tone: 1 },
  'Ú': { base: 'U', tone: 2 },
  'Ǔ': { base: 'U', tone: 3 },
  'Ù': { base: 'U', tone: 4 },
  'Ǖ': { base: 'Ü', tone: 1 },
  'Ǘ': { base: 'Ü', tone: 2 },
  'Ǚ': { base: 'Ü', tone: 3 },
  'Ǜ': { base: 'Ü', tone: 4 },
};

/**
 * Strips tone marks from Pinyin string, preserving base characters.
 * Example: "nǐ hǎo" -> "ni hao", "Lǐ Nà" -> "Li Na", "lǜ sè" -> "lü se"
 */
export function stripToneMarks(pinyin: string): string {
  if (!pinyin) return '';
  let result = '';
  for (const char of pinyin) {
    if (PINYIN_TONE_MAP[char]) {
      result += PINYIN_TONE_MAP[char].base;
    } else {
      result += char;
    }
  }
  return result;
}

/**
 * Converts tone marks in a Pinyin syllable or sentence to numeric tone notations.
 * Example: "nǐ hǎo" -> "ni3 hao3", "mā ma" -> "ma1 ma5" (or "ma1 ma")
 */
export function pinyinToNumbered(pinyin: string): string {
  if (!pinyin) return '';

  // Process word by word or syllable separated by space or apostrophe
  const tokens = pinyin.split(/(\s+|['’])/);

  return tokens
    .map((token) => {
      if (/^\s+$/.test(token) || token === "'" || token === "’") {
        return token;
      }

      // Check if token already ends with a tone number (1-5)
      if (/[1-5]$/.test(token)) {
        return token;
      }

      let detectedTone: number | null = null;
      let baseWord = '';

      for (const char of token) {
        if (PINYIN_TONE_MAP[char]) {
          detectedTone = PINYIN_TONE_MAP[char].tone;
          baseWord += PINYIN_TONE_MAP[char].base;
        } else {
          baseWord += char;
        }
      }

      // If tone was found in accented vowel, append number
      if (detectedTone !== null) {
        return `${baseWord}${detectedTone}`;
      }

      // If it's a valid alphabetic word with no tone mark, consider neutral tone (5)
      if (/^[a-zA-ZüÜvV]+$/.test(token)) {
        return `${baseWord}5`;
      }

      return baseWord;
    })
    .join('');
}

/**
 * Normalizes text by removing punctuation, extra spaces, and symbols.
 * Handles both Chinese and Western punctuation.
 */
export function cleanChineseText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[，。？！；：（）「」『』、“”‘’《》…—·\s,.?!;:()[\]{}"'\\/`~@#$%^&*+=|<>_-]/g, '')
    .trim();
}

/**
 * Standard Levenshtein distance calculation between two strings.
 */
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;

  if (m === 0) return n;
  if (n === 0) return m;

  // Single row DP optimization
  const prevRow: number[] = Array.from({ length: n + 1 }, (_, i) => i);
  const currRow: number[] = new Array(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    currRow[0] = i;
    const aChar = a[i - 1];

    for (let j = 1; j <= n; j++) {
      const cost = aChar === b[j - 1] ? 0 : 1;
      currRow[j] = Math.min(
        currRow[j - 1] + 1,       // insertion
        prevRow[j] + 1,           // deletion
        prevRow[j - 1] + cost     // substitution
      );
    }

    for (let j = 0; j <= n; j++) {
      prevRow[j] = currRow[j];
    }
  }

  return prevRow[n];
}

/**
 * Normalized similarity score between 0 and 1 based on Levenshtein distance.
 */
export function stringSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  const dist = levenshteinDistance(a, b);
  return Math.max(0, 1 - dist / maxLen);
}

/**
 * Aligns expected characters with received characters using Longest Common Subsequence (LCS).
 * Returns an array of booleans of length equal to expected.length, indicating which
 * characters in expected were correctly pronounced/transcribed.
 */
export function alignCharacters(expected: string, received: string): boolean[] {
  const expChars = Array.from(expected);
  const recChars = Array.from(received);
  const m = expChars.length;
  const n = recChars.length;

  if (m === 0) return [];
  if (n === 0) return expChars.map(() => false);

  // LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (expChars[i - 1] === recChars[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to identify matched indices in expected
  const matched: boolean[] = new Array(m).fill(false);
  let i = m;
  let j = n;

  while (i > 0 && j > 0) {
    if (expChars[i - 1] === recChars[j - 1]) {
      matched[i - 1] = true;
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return matched;
}

export interface PinyinSyllableInfo {
  syllable: string;
  base: string;
  tone: number;
}

/**
 * Parses a Pinyin sentence into individual syllables with base phonetic part and tone number (1-5).
 */
export function parsePinyinSyllables(pinyin: string): PinyinSyllableInfo[] {
  if (!pinyin) return [];

  // Replace common punctuation with space
  const cleaned = pinyin.replace(/[,.?!;:，。？！]/g, ' ').trim();
  const words = cleaned.split(/\s+/).filter(Boolean);

  const results: PinyinSyllableInfo[] = [];

  for (const word of words) {
    // Check if word has numeric tone at the end (e.g. "ni3")
    const numMatch = word.match(/^([a-zA-ZüÜvV]+)([1-5])$/);
    if (numMatch) {
      results.push({
        syllable: word,
        base: numMatch[1].toLowerCase(),
        tone: parseInt(numMatch[2], 10),
      });
      continue;
    }

    // Inspect accented characters
    let tone = 5;
    let base = '';
    for (const char of word) {
      if (PINYIN_TONE_MAP[char]) {
        tone = PINYIN_TONE_MAP[char].tone;
        base += PINYIN_TONE_MAP[char].base;
      } else {
        base += char;
      }
    }

    results.push({
      syllable: word,
      base: base.toLowerCase(),
      tone,
    });
  }

  return results;
}

export interface ToneAccuracyResult {
  totalSyllables: number;
  correctTones: number;
  toneScore: number; // 0 - 100
  isTonePassed: boolean;
  syllableDetails: {
    expected: string;
    received: string;
    expectedTone: number;
    receivedTone: number;
    toneMatches: boolean;
    baseMatches: boolean;
  }[];
}

/**
 * Checks tone accuracy between expected Pinyin and received Pinyin syllables.
 */
export function checkToneAccuracy(expectedPinyin: string, receivedPinyin: string): ToneAccuracyResult {
  const expSyllables = parsePinyinSyllables(expectedPinyin);
  const recSyllables = parsePinyinSyllables(receivedPinyin);

  const totalSyllables = expSyllables.length;
  if (totalSyllables === 0) {
    return {
      totalSyllables: 0,
      correctTones: 0,
      toneScore: 100,
      isTonePassed: true,
      syllableDetails: [],
    };
  }

  let correctTones = 0;
  const syllableDetails = expSyllables.map((exp, index) => {
    const rec = recSyllables[index];
    if (!rec) {
      return {
        expected: exp.syllable,
        received: '',
        expectedTone: exp.tone,
        receivedTone: 0,
        toneMatches: false,
        baseMatches: false,
      };
    }

    const toneMatches = exp.tone === rec.tone;
    const baseMatches = exp.base === rec.base;

    if (toneMatches) {
      correctTones++;
    }

    return {
      expected: exp.syllable,
      received: rec.syllable,
      expectedTone: exp.tone,
      receivedTone: rec.tone,
      toneMatches,
      baseMatches,
    };
  });

  const toneScore = Math.round((correctTones / totalSyllables) * 100);
  const isTonePassed = toneScore >= 70;

  return {
    totalSyllables,
    correctTones,
    toneScore,
    isTonePassed,
    syllableDetails,
  };
}

export interface SpeechEvaluationInput {
  expectedHanzi: string;
  expectedPinyin?: string;
  receivedText: string;
  passingThreshold?: number; // default: 70
}

export interface SyllableFeedback {
  char: string;
  pinyin?: string;
  isMatched: boolean;
}

export interface EvaluationResult {
  score: number; // 0 - 100
  isPassed: boolean;
  feedback: string;
  matchedChars: boolean[];
  expectedPinyin: string;
  receivedText: string;
  charDetails?: SyllableFeedback[];
  toneAccuracy?: ToneAccuracyResult;
}

/**
 * Primary speech evaluation function.
 * Compares student's spoken/transcribed text (Hanzi or Pinyin) with expected Hanzi and Pinyin.
 */
export function evaluateSpeech({
  expectedHanzi,
  expectedPinyin = '',
  receivedText,
  passingThreshold = 70,
}: SpeechEvaluationInput): EvaluationResult {
  const cleanExp = cleanChineseText(expectedHanzi);
  const cleanRec = cleanChineseText(receivedText);
  const expChars = Array.from(cleanExp);

  // If received text is empty or purely whitespace/punctuation
  if (!cleanRec || cleanRec.length === 0) {
    return {
      score: 0,
      isPassed: false,
      feedback: 'Chưa nhận diện được giọng nói. Vui lòng nói to và rõ hơn gần microphone.',
      matchedChars: expChars.map(() => false),
      expectedPinyin,
      receivedText: receivedText || '',
      charDetails: expChars.map((char) => ({ char, isMatched: false })),
    };
  }

  // Check if student spoke/entered Latin letters / Pinyin instead of Hanzi
  const isReceivedPinyin = /^[a-zA-Z0-9üÜvV\s'’]+$/.test(receivedText.trim());

  if (isReceivedPinyin && expectedPinyin) {
    // Pinyin evaluation path
    const normalizedExpected = stripToneMarks(expectedPinyin.toLowerCase()).replace(/\s+/g, '');
    const normalizedReceived = stripToneMarks(receivedText.toLowerCase()).replace(/\s+/g, '');

    const sim = stringSimilarity(normalizedExpected, normalizedReceived);
    const score = Math.round(sim * 100);
    const isPassed = score >= passingThreshold;

    const toneResult = checkToneAccuracy(expectedPinyin, receivedText);
    const matchedChars = expChars.map(() => isPassed);

    let feedback = '';
    if (score === 100) {
      feedback = 'Xuất sắc! Phát âm Pinyin rất chuẩn.';
    } else if (score >= 80) {
      feedback = 'Rất tốt! Âm đọc cơ bản đã chính xác.';
    } else if (isPassed) {
      feedback = 'Đạt yêu cầu. Hãy chú ý thanh điệu và ngữ điệu hơn nhé.';
    } else {
      feedback = 'Chưa đạt. Hãy nghe lại âm mẫu và thử lại.';
    }

    return {
      score,
      isPassed,
      feedback,
      matchedChars,
      expectedPinyin,
      receivedText,
      charDetails: expChars.map((char) => ({ char, isMatched: isPassed })),
      toneAccuracy: toneResult,
    };
  }

  // Exact Match Check
  if (cleanRec === cleanExp) {
    return {
      score: 100,
      isPassed: true,
      feedback: 'Xuất sắc! Bạn phát âm hoàn hảo 100%.',
      matchedChars: expChars.map(() => true),
      expectedPinyin,
      receivedText,
      charDetails: expChars.map((char) => ({ char, isMatched: true })),
    };
  }

  // Hanzi Character Alignment & Match
  const matchedChars = alignCharacters(cleanExp, cleanRec);
  const matchedCount = matchedChars.filter(Boolean).length;
  const matchRatio = expChars.length > 0 ? matchedCount / expChars.length : 0;

  // Levenshtein similarity provides insertion/deletion penalty
  const similarity = stringSimilarity(cleanExp, cleanRec);

  // Combined score: 65% weight on character recall, 35% on Levenshtein sequence similarity
  let calculatedScore = Math.round((matchRatio * 0.65 + similarity * 0.35) * 100);

  // If all characters were matched but user said additional words (e.g. extra prefix/suffix),
  // ensure score is capped reasonably but remains high
  if (matchedCount === expChars.length) {
    calculatedScore = Math.max(85, calculatedScore);
  }

  // Clamp score between 0 and 100
  const score = Math.min(100, Math.max(0, calculatedScore));
  const isPassed = score >= passingThreshold;

  // Prepare charDetails with optional pinyin per syllable if matched
  const expPinyinTokens = expectedPinyin.trim().split(/\s+/);
  const charDetails: SyllableFeedback[] = expChars.map((char, idx) => ({
    char,
    pinyin: expPinyinTokens[idx] || undefined,
    isMatched: matchedChars[idx],
  }));

  // Missing characters summary for actionable feedback
  const missedChars = expChars.filter((_, idx) => !matchedChars[idx]);

  let feedback = '';
  if (score >= 90) {
    feedback = 'Xuất sắc! Bạn phát âm rất chuẩn và tự nhiên.';
  } else if (score >= 80) {
    feedback = 'Rất tốt! Phát âm chuẩn xác, hãy tiếp tục phát huy.';
  } else if (isPassed) {
    if (missedChars.length > 0) {
      feedback = `Khá tốt! Bạn cần chú ý rõ hơn chữ: "${missedChars.join(', ')}".`;
    } else {
      feedback = 'Đạt yêu cầu! Phát âm khá tốt, cần chú ý độ liền mạch.';
    }
  } else if (score >= 40) {
    if (missedChars.length > 0) {
      feedback = `Cần cải thiện. Bạn chưa đọc rõ chữ: "${missedChars.join(', ')}". Hãy nghe mẫu và thử lại nhé!`;
    } else {
      feedback = 'Tạm ổn. Hãy nghe lại âm mẫu để phát âm rõ ràng hơn nhé!';
    }
  } else {
    feedback = 'Chưa nhận diện đúng câu mục tiêu. Hãy nghe lại phát âm mẫu và thử lại nhé!';
  }

  return {
    score,
    isPassed,
    feedback,
    matchedChars,
    expectedPinyin,
    receivedText,
    charDetails,
  };
}
