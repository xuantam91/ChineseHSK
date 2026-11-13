import { describe, it, expect } from 'vitest';
import {
  HSK_LEVEL_OVERVIEWS,
  HSK1_PINYIN_FUNDAMENTALS,
  HSK1_LESSONS,
  HSK2_LESSONS,
  HSK3_LESSONS,
  ALL_HSK_LESSONS,
  getHSKLevelLessons,
  getHSKLessonById,
  getAllHSK1To3Vocabulary,
  getHSKSpeechDrillsByLevel,
  getHSKLevelOverview,
} from '@/lib/curriculum/hsk1-3-data';

describe('HSK 1 - 3 Curriculum Dataset', () => {
  describe('Pinyin Fundamentals Module', () => {
    it('contains exactly 21 standard initials', () => {
      const initials = HSK1_PINYIN_FUNDAMENTALS.initials;
      expect(initials).toHaveLength(21);

      const requiredLetters = [
        'b', 'p', 'm', 'f',
        'd', 't', 'n', 'l',
        'g', 'k', 'h',
        'j', 'q', 'x',
        'zh', 'ch', 'sh', 'r',
        'z', 'c', 's',
      ];

      const foundLetters = initials.map((i) => i.letter);
      expect(foundLetters).toEqual(requiredLetters);

      for (const initial of initials) {
        expect(initial.ipa).toBeTruthy();
        expect(initial.categoryVi).toBeTruthy();
        expect(initial.vietnameseGuide).toBeTruthy();
        expect(initial.example.hanzi).toBeTruthy();
        expect(initial.example.pinyin).toBeTruthy();
        expect(initial.example.meaningVi).toBeTruthy();
      }
    });

    it('contains exactly 36 standard finals', () => {
      const finals = HSK1_PINYIN_FUNDAMENTALS.finals;
      expect(finals).toHaveLength(36);

      const simpleFinals = finals.filter((f) => f.type === 'simple');
      expect(simpleFinals).toHaveLength(6);
      expect(simpleFinals.map((f) => f.pinyin)).toEqual(['a', 'o', 'e', 'i', 'u', 'ü']);

      const compoundFinals = finals.filter((f) => f.type === 'compound' || f.type === 'special');
      expect(compoundFinals).toHaveLength(14); // 13 compound + 1 special (er)

      const nasalFinals = finals.filter((f) => f.type === 'front_nasal' || f.type === 'back_nasal');
      expect(nasalFinals).toHaveLength(16); // 8 front (-n) + 8 back (-ng)
    });

    it('contains 4 tones and neutral tone, plus sandhi rules', () => {
      const tones = HSK1_PINYIN_FUNDAMENTALS.tones;
      expect(tones).toHaveLength(5);

      const toneRules = HSK1_PINYIN_FUNDAMENTALS.toneRules;
      expect(toneRules.length).toBeGreaterThanOrEqual(3);

      const ruleIds = toneRules.map((r) => r.id);
      expect(ruleIds).toContain('sandhi-tone3');
      expect(ruleIds).toContain('sandhi-yi');
      expect(ruleIds).toContain('sandhi-bu');

      // Verify tone 3 sandhi has examples
      const tone3Rule = toneRules.find((r) => r.id === 'sandhi-tone3')!;
      expect(tone3Rule.examples.some((ex) => ex.hanzi === '你好' && ex.sandhiPinyin === 'ní hǎo')).toBe(true);

      // Verify yi sandhi has examples
      const yiRule = toneRules.find((r) => r.id === 'sandhi-yi')!;
      expect(yiRule.examples.some((ex) => ex.hanzi === '一共' && ex.sandhiPinyin === 'yí gòng')).toBe(true);

      // Verify bu sandhi has examples
      const buRule = toneRules.find((r) => r.id === 'sandhi-bu')!;
      expect(buRule.examples.some((ex) => ex.hanzi === '不是' && ex.sandhiPinyin === 'bú shì')).toBe(true);
    });
  });

  describe('HSK Level Overviews (New HSK 3.0)', () => {
    it('HSK 1 specifies 500 core vocabulary and goals', () => {
      const hsk1 = HSK_LEVEL_OVERVIEWS.HSK1;
      expect(hsk1.targetCumulativeVocab).toBe(500);
      expect(hsk1.newVocabCount).toBe(500);
      expect(hsk1.listeningSpeakingGoals.length).toBeGreaterThanOrEqual(3);
    });

    it('HSK 2 specifies 772 new words (1272 total)', () => {
      const hsk2 = HSK_LEVEL_OVERVIEWS.HSK2;
      expect(hsk2.newVocabCount).toBe(772);
      expect(hsk2.targetCumulativeVocab).toBe(1272);
      expect(hsk2.listeningSpeakingGoals.length).toBeGreaterThanOrEqual(3);
    });

    it('HSK 3 specifies 973 new words (2245 total)', () => {
      const hsk3 = HSK_LEVEL_OVERVIEWS.HSK3;
      expect(hsk3.newVocabCount).toBe(973);
      expect(hsk3.targetCumulativeVocab).toBe(2245);
      expect(hsk3.listeningSpeakingGoals.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Lessons Pedagogical Structure', () => {
    it('has 5 lessons for HSK 1, 5 lessons for HSK 2, 4 lessons for HSK 3 (14 total)', () => {
      expect(HSK1_LESSONS).toHaveLength(5);
      expect(HSK2_LESSONS).toHaveLength(5);
      expect(HSK3_LESSONS).toHaveLength(4);
      expect(ALL_HSK_LESSONS).toHaveLength(14);
    });

    it('validates required content in every lesson', () => {
      for (const lesson of ALL_HSK_LESSONS) {
        expect(lesson.id).toBeTruthy();
        expect(lesson.title).toBeTruthy();
        expect(['HSK1', 'HSK2', 'HSK3']).toContain(lesson.level);
        expect(lesson.topicIcon).toBeTruthy();
        expect(lesson.estimatedMinutes).toBeGreaterThanOrEqual(20);

        // Dialogues
        expect(lesson.dialogue.length).toBeGreaterThanOrEqual(4);
        for (const line of lesson.dialogue) {
          expect(['A', 'B']).toContain(line.speaker);
          expect(line.speakerName).toBeTruthy();
          expect(line.hanzi).toBeTruthy();
          expect(line.pinyin).toBeTruthy();
          expect(line.vietnamese).toBeTruthy();
        }

        // Speech drills
        expect(lesson.speechDrills.length).toBeGreaterThanOrEqual(3);
        for (const drill of lesson.speechDrills) {
          expect(drill.hanzi).toBeTruthy();
          expect(drill.pinyin).toBeTruthy();
          expect(drill.vietnamese).toBeTruthy();
          expect(['easy', 'medium', 'hard']).toContain(drill.difficulty);
        }

        // Shadow sentences
        expect(lesson.shadowSentences.length).toBeGreaterThanOrEqual(1);
        for (const ss of lesson.shadowSentences) {
          expect(ss.hanzi).toBeTruthy();
          expect(ss.pinyin).toBeTruthy();
          expect(ss.vietnamese).toBeTruthy();
        }

        // Vocabulary with radical breakdown
        expect(lesson.vocabulary.length).toBeGreaterThanOrEqual(5);
        for (const vocab of lesson.vocabulary) {
          expect(vocab.hanzi).toBeTruthy();
          expect(vocab.pinyin).toBeTruthy();
          expect(vocab.meaningVi).toBeTruthy();
          expect(vocab.radical).toBeTruthy();
          expect(vocab.strokeCount).toBeGreaterThan(0);
          expect(vocab.exampleSentence).toBeTruthy();
          expect(vocab.hskLevel).toBe(lesson.level);
        }

        // Grammar notes
        expect(lesson.grammarNotes.length).toBeGreaterThanOrEqual(2);
        for (const note of lesson.grammarNotes) {
          expect(note.title).toBeTruthy();
          expect(note.pattern).toBeTruthy();
          expect(note.explanationVi).toBeTruthy();
          expect(note.examples.length).toBeGreaterThanOrEqual(1);
        }

        // Multimodal Quiz questions
        expect(lesson.quizQuestions.length).toBeGreaterThanOrEqual(3);
        const types = lesson.quizQuestions.map((q) => q.type);
        expect(types).toContain('single_choice');
        expect(types).toContain('ordering');
        expect(types).toContain('speaking_response');
      }
    });

    it('verifies specific topics for HSK 1 lessons', () => {
      const titles = HSK1_LESSONS.map((l) => l.title);
      expect(titles[0]).toContain('Chào hỏi & Làm quen');
      expect(titles[1]).toContain('Tên & Quốc tịch');
      expect(titles[2]).toContain('Gia đình & Đại từ nhân xưng');
      expect(titles[3]).toContain('Số đếm, Thời gian & Ngày tháng');
      expect(titles[4]).toContain('Mua sắm cơ bản & Tiền tệ');
    });

    it('verifies specific topics for HSK 2 lessons', () => {
      const titles = HSK2_LESSONS.map((l) => l.title);
      expect(titles[0]).toContain('Gọi món tại quán ăn');
      expect(titles[1]).toContain('Hỏi đường & Phương tiện');
      expect(titles[2]).toContain('Thời tiết & Bốn mùa');
      expect(titles[3]).toContain('Sở thích & Thời gian rảnh');
      expect(titles[4]).toContain('Khám bệnh & Sức khỏe');
    });

    it('verifies specific topics for HSK 3 lessons', () => {
      const titles = HSK3_LESSONS.map((l) => l.title);
      expect(titles[0]).toContain('Thuê phòng & Khách sạn');
      expect(titles[1]).toContain('Du lịch & Đặt vé máy bay');
      expect(titles[2]).toContain('So sánh & Lựa chọn');
      expect(titles[3]).toContain('Kể về một chuyến đi đáng nhớ');
    });
  });

  describe('Helper Functions', () => {
    it('getHSKLevelLessons filters correctly by level', () => {
      expect(getHSKLevelLessons('HSK1')).toHaveLength(5);
      expect(getHSKLevelLessons('HSK2')).toHaveLength(5);
      expect(getHSKLevelLessons('HSK3')).toHaveLength(4);
    });

    it('getHSKLessonById finds existing and returns undefined for unknown', () => {
      const lesson = getHSKLessonById('hsk1-lesson-01');
      expect(lesson).toBeDefined();
      expect(lesson?.title).toContain('Chào hỏi');

      const nonExistent = getHSKLessonById('unknown-lesson-id');
      expect(nonExistent).toBeUndefined();
    });

    it('getAllHSK1To3Vocabulary returns deduplicated rich vocabulary', () => {
      const vocab = getAllHSK1To3Vocabulary();
      expect(vocab.length).toBeGreaterThanOrEqual(60);

      // Verify no duplicates
      const hanziList = vocab.map((v) => v.hanzi);
      const uniqueHanzi = new Set(hanziList);
      expect(uniqueHanzi.size).toBe(hanziList.length);
    });

    it('getHSKSpeechDrillsByLevel returns speech drills for level', () => {
      const drills = getHSKSpeechDrillsByLevel('HSK1');
      expect(drills.length).toBeGreaterThanOrEqual(15);
      expect(drills.some((d) => d.hanzi.includes('你好'))).toBe(true);
    });

    it('getHSKLevelOverview returns correct overview', () => {
      const overview = getHSKLevelOverview('HSK3');
      expect(overview.level).toBe('HSK3');
      expect(overview.targetCumulativeVocab).toBe(2245);
    });
  });
});
