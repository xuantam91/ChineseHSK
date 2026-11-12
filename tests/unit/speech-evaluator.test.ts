import { describe, it, expect } from 'vitest';
import {
  stripToneMarks,
  pinyinToNumbered,
  cleanChineseText,
  levenshteinDistance,
  stringSimilarity,
  alignCharacters,
  parsePinyinSyllables,
  checkToneAccuracy,
  evaluateSpeech,
} from '@/lib/speech/evaluator';

describe('Speech & Pinyin Evaluator', () => {
  describe('Pinyin Normalization & Tone Conversion', () => {
    it('strips tone marks correctly from standard Pinyin', () => {
      expect(stripToneMarks('nǐ hǎo')).toBe('ni hao');
      expect(stripToneMarks('Lǐ Nà')).toBe('Li Na');
      expect(stripToneMarks('lǜ sè')).toBe('lü se');
      expect(stripToneMarks('zhōngguó')).toBe('zhongguo');
      expect(stripToneMarks('māma')).toBe('mama');
      expect(stripToneMarks('Ā Á Ǎ À')).toBe('A A A A');
      expect(stripToneMarks('ē é ě è')).toBe('e e e e');
      expect(stripToneMarks('ī í ǐ ì')).toBe('i i i i');
      expect(stripToneMarks('ō ó ǒ ò')).toBe('o o o o');
      expect(stripToneMarks('ū ú ǔ ù')).toBe('u u u u');
      expect(stripToneMarks('ǖ ǘ ǚ ǜ')).toBe('ü ü ü ü');
    });

    it('converts accented Pinyin to numbered tone format', () => {
      expect(pinyinToNumbered('nǐ hǎo')).toBe('ni3 hao3');
      expect(pinyinToNumbered('mā ma')).toBe('ma1 ma5');
      expect(pinyinToNumbered('bà ba')).toBe('ba4 ba5');
      expect(pinyinToNumbered('lǜ')).toBe('lü4');
      expect(pinyinToNumbered('xiè xie')).toBe('xie4 xie5');
    });

    it('cleans Chinese and Western punctuation and spaces', () => {
      expect(cleanChineseText('你好，世界！')).toBe('你好世界');
      expect(cleanChineseText('  我是学生。  ')).toBe('我是学生');
      expect(cleanChineseText('“谢谢你” (Thank you)')).toBe('谢谢你Thankyou');
      expect(cleanChineseText('A: 你好？ B: 我很好！')).toBe('A你好B我很好');
    });
  });

  describe('Levenshtein Distance & Character Alignment', () => {
    it('computes Levenshtein distance accurately', () => {
      expect(levenshteinDistance('你好', '你好')).toBe(0);
      expect(levenshteinDistance('你好', '您好')).toBe(1);
      expect(levenshteinDistance('我是学生', '我是人')).toBe(2);
      expect(levenshteinDistance('apple', 'apples')).toBe(1);
    });

    it('computes string similarity between 0 and 1', () => {
      expect(stringSimilarity('你好', '你好')).toBe(1);
      expect(stringSimilarity('你好', '再见')).toBe(0);
      expect(stringSimilarity('你好吗', '你好')).toBeCloseTo(2 / 3, 2);
    });

    it('aligns characters using LCS to locate correct and missing characters', () => {
      // Exact match
      expect(alignCharacters('你好', '你好')).toEqual([true, true]);

      // Missing middle character: '我是学生' vs '我学生'
      // Indices: 0: 我 (matched), 1: 是 (missing), 2: 学 (matched), 3: 生 (matched)
      expect(alignCharacters('我是学生', '我学生')).toEqual([true, false, true, true]);

      // Partial match: '我是学生' vs '我是人'
      // Indices: 0: 我 (matched), 1: 是 (matched), 2: 学 (missing), 3: 生 (missing)
      expect(alignCharacters('我是学生', '我是人')).toEqual([true, true, false, false]);

      // Complete mismatch
      expect(alignCharacters('你好', '苹果')).toEqual([false, false]);

      // Substring match: '你们好' vs '你好'
      expect(alignCharacters('你们好', '你好')).toEqual([true, false, true]);
    });
  });

  describe('Tone Accuracy Verification', () => {
    it('parses Pinyin syllables with tone numbers correctly', () => {
      const parsed = parsePinyinSyllables('nǐ hǎo ma');
      expect(parsed).toEqual([
        { syllable: 'nǐ', base: 'ni', tone: 3 },
        { syllable: 'hǎo', base: 'hao', tone: 3 },
        { syllable: 'ma', base: 'ma', tone: 5 },
      ]);
    });

    it('evaluates tone accuracy comparing expected vs received Pinyin', () => {
      const result = checkToneAccuracy('mā má mǎ mà', 'ma1 ma2 ma3 ma4');
      expect(result.correctTones).toBe(4);
      expect(result.totalSyllables).toBe(4);
      expect(result.toneScore).toBe(100);
      expect(result.isTonePassed).toBe(true);

      // One tone mistake (ma3 instead of ma4 for last syllable)
      const wrongToneResult = checkToneAccuracy('mā má mǎ mà', 'ma1 ma2 ma3 ma3');
      expect(wrongToneResult.correctTones).toBe(3);
      expect(wrongToneResult.toneScore).toBe(75);
      expect(wrongToneResult.syllableDetails[3].toneMatches).toBe(false);
    });
  });

  describe('Primary Speech Evaluation (evaluateSpeech)', () => {
    it('awards 100% score for exact Hanzi match', () => {
      const result = evaluateSpeech({
        expectedHanzi: '你好',
        expectedPinyin: 'nǐ hǎo',
        receivedText: '你好',
      });

      expect(result.score).toBe(100);
      expect(result.isPassed).toBe(true);
      expect(result.matchedChars).toEqual([true, true]);
      expect(result.charDetails?.every((c) => c.isMatched)).toBe(true);
      expect(result.feedback).toContain('Xuất sắc');
    });

    it('ignores punctuation and spacing differences in exact match', () => {
      const result = evaluateSpeech({
        expectedHanzi: '你好，很高兴认识你！',
        expectedPinyin: 'nǐ hǎo, hěn gāoxìng rènshí nǐ!',
        receivedText: '你好很高兴认识你',
      });

      expect(result.score).toBe(100);
      expect(result.isPassed).toBe(true);
      expect(result.matchedChars.every(Boolean)).toBe(true);
    });

    it('handles empty transcript gracefully with 0 score and helpful feedback', () => {
      const emptyResult = evaluateSpeech({
        expectedHanzi: '谢谢',
        expectedPinyin: 'xièxie',
        receivedText: '',
      });

      expect(emptyResult.score).toBe(0);
      expect(emptyResult.isPassed).toBe(false);
      expect(emptyResult.matchedChars).toEqual([false, false]);
      expect(emptyResult.feedback).toContain('Chưa nhận diện được giọng nói');

      // Whitespace and punctuation only
      const punctOnlyResult = evaluateSpeech({
        expectedHanzi: '谢谢',
        expectedPinyin: 'xièxie',
        receivedText: '   ，。？！  ',
      });

      expect(punctOnlyResult.score).toBe(0);
      expect(punctOnlyResult.isPassed).toBe(false);
    });

    it('detects partial matches and flags mispronounced characters', () => {
      const result = evaluateSpeech({
        expectedHanzi: '我是学生',
        expectedPinyin: 'wǒ shì xuésheng',
        receivedText: '我是老师',
        passingThreshold: 70,
      });

      // '我' and '是' matched; '学' and '生' missed
      expect(result.matchedChars).toEqual([true, true, false, false]);
      expect(result.score).toBeGreaterThan(0);
      expect(result.score).toBeLessThan(70);
      expect(result.isPassed).toBe(false);
      expect(result.feedback).toContain('chữ: "学, 生"');
    });

    it('evaluates high-accuracy speech with minor noise as passed', () => {
      const result = evaluateSpeech({
        expectedHanzi: '北京欢迎你',
        expectedPinyin: 'Běijīng huānyíng nǐ',
        receivedText: '北京欢迎你呀', // extra particle '呀'
        passingThreshold: 70,
      });

      // All 5 target characters are present
      expect(result.matchedChars).toEqual([true, true, true, true, true]);
      expect(result.score).toBeGreaterThanOrEqual(85);
      expect(result.isPassed).toBe(true);
    });

    it('scores irrelevant speech near zero', () => {
      const result = evaluateSpeech({
        expectedHanzi: '你好',
        expectedPinyin: 'nǐ hǎo',
        receivedText: '苹果香蕉西瓜',
      });

      expect(result.score).toBeLessThan(20);
      expect(result.isPassed).toBe(false);
      expect(result.matchedChars).toEqual([false, false]);
    });

    it('supports Pinyin spoken/transcribed input', () => {
      const result = evaluateSpeech({
        expectedHanzi: '你好',
        expectedPinyin: 'nǐ hǎo',
        receivedText: 'ni hao',
      });

      expect(result.score).toBe(100);
      expect(result.isPassed).toBe(true);
    });
  });
});
