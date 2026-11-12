import { describe, it, expect } from 'vitest';
import {
  HSK4_TO_9_OVERVIEWS,
  HSK4_LESSONS,
  HSK5_LESSONS,
  HSK6_LESSONS,
  HSK7_TO_9_FRAMEWORK,
  getHSK4To9Lessons,
  getHSK4To9LessonById,
  getHSK7To9Framework,
  getAllHSK4To9Vocabulary,
} from '@/lib/curriculum/hsk4-9-data';

describe('HSK 4 - 9 Curriculum Dataset & Overviews', () => {
  it('defines comprehensive overviews for HSK4, HSK5, HSK6, and HSK7-9', () => {
    expect(HSK4_TO_9_OVERVIEWS.HSK4.wordCountTotal).toBe(3245);
    expect(HSK4_TO_9_OVERVIEWS.HSK5.wordCountTotal).toBe(4316);
    expect(HSK4_TO_9_OVERVIEWS.HSK6.wordCountTotal).toBe(5456);
    expect(HSK4_TO_9_OVERVIEWS['HSK7-9'].wordCountTotal).toBe(11092);
  });

  it('contains structured lessons for HSK4 with workplace & interview dialogues', () => {
    expect(HSK4_LESSONS.length).toBeGreaterThan(0);
    const lesson1 = HSK4_LESSONS[0];
    expect(lesson1.level).toBe('HSK4');
    expect(lesson1.dialogue.length).toBeGreaterThan(0);
    expect(lesson1.speechDrills.length).toBeGreaterThan(0);
    expect(lesson1.vocabulary.length).toBeGreaterThan(0);
    expect(lesson1.grammarNotes.length).toBeGreaterThan(0);
  });

  it('contains structured lessons for HSK5 with news & economic trends', () => {
    expect(HSK5_LESSONS.length).toBeGreaterThan(0);
    const lesson1 = HSK5_LESSONS[0];
    expect(lesson1.level).toBe('HSK5');
    expect(lesson1.summaryVi).toContain('nghe tin tức');
  });

  it('contains structured lessons for HSK6 with commercial negotiation & idioms', () => {
    expect(HSK6_LESSONS.length).toBeGreaterThan(0);
    const lesson1 = HSK6_LESSONS[0];
    expect(lesson1.level).toBe('HSK6');
    expect(lesson1.speechDrills[0].hanzi).toContain('互利共赢');
  });

  it('defines HSK 7-9 framework modules for academic, debate, and diplomacy', () => {
    const modules = getHSK7To9Framework();
    expect(modules.length).toBe(3);
    expect(modules.map((m) => m.code)).toEqual([
      'ACADEMIC_RESEARCH',
      'DEBATE_AND_LOGIC',
      'DIPLOMACY_TRANSLATION',
    ]);
  });

  it('retrieves lessons correctly via helper functions', () => {
    const hsk4List = getHSK4To9Lessons('HSK4');
    expect(hsk4List.length).toBe(HSK4_LESSONS.length);

    const found = getHSK4To9LessonById('hsk4-01');
    expect(found).toBeDefined();
    expect(found?.title).toContain('面试');

    const notFound = getHSK4To9LessonById('invalid-id');
    expect(notFound).toBeUndefined();
  });

  it('aggregates all intermediate and advanced vocabulary', () => {
    const allVocab = getAllHSK4To9Vocabulary();
    expect(allVocab.length).toBeGreaterThan(0);
    expect(allVocab.some((v) => v.hanzi === '面试')).toBe(true);
    expect(allVocab.some((v) => v.hanzi === '趋势')).toBe(true);
    expect(allVocab.some((v) => v.hanzi === '互利共赢')).toBe(true);
  });
});
