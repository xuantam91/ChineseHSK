import { describe, it, expect } from 'vitest';
import {
  EQUIPMENT_CHECKLIST,
  FIVE_STEP_LEARNING_PROCESS,
  CRITICAL_MISTAKES_TO_AVOID,
  AGE_TIER_ROADMAPS,
  TEXTBOOK_SELECTION_MATRIX,
} from '@/lib/curriculum/methodology-guide';

describe('Notion Methodology Guide Knowledge Base', () => {
  it('contains valid equipment items with Craven speaker and tutorial link', () => {
    expect(EQUIPMENT_CHECKLIST.length).toBeGreaterThanOrEqual(4);
    const craven = EQUIPMENT_CHECKLIST.find((e) => e.id === 'eq-craven-speaker');
    expect(craven).toBeDefined();
    expect(craven?.purpose).toContain('thụ động');
    expect(craven?.tutorialUrl).toMatch(/^https:\/\/youtu\.be\/ktOfkyIrB68/);
  });

  it('contains the complete 5-step daily learning process', () => {
    expect(FIVE_STEP_LEARNING_PROCESS).toHaveLength(5);
    const steps = FIVE_STEP_LEARNING_PROCESS.map((s) => s.stepNumber);
    expect(steps).toEqual([1, 2, 3, 4, 5]);

    // Check key methodology concepts
    expect(FIVE_STEP_LEARNING_PROCESS[0].name).toContain('Bối Cảnh');
    expect(FIVE_STEP_LEARNING_PROCESS[1].name).toContain('Loa');
    expect(FIVE_STEP_LEARNING_PROCESS[2].name).toContain('Tương Tác');
    expect(FIVE_STEP_LEARNING_PROCESS[3].name).toContain('Phản Xạ');
    expect(FIVE_STEP_LEARNING_PROCESS[4].name).toContain('Lồng Tiếng');
  });

  it('contains 7 critical mistakes to avoid with explicit solutions', () => {
    expect(CRITICAL_MISTAKES_TO_AVOID).toHaveLength(7);
    for (const mistake of CRITICAL_MISTAKES_TO_AVOID) {
      expect(mistake.mistakeTitle.length).toBeGreaterThan(5);
      expect(mistake.impactWhyBad.length).toBeGreaterThan(10);
      expect(mistake.solutionHowToFix.length).toBeGreaterThan(10);
    }

    // Must warn against early Pinyin for kids under 6
    const pinyinMistake = CRITICAL_MISTAKES_TO_AVOID.find((m) => m.id === 'mis-7');
    expect(pinyinMistake).toBeDefined();
    expect(pinyinMistake?.mistakeTitle).toContain('Pinyin');
  });

  it('contains 4 age-tiered roadmaps spanning 0 to 18+ years', () => {
    expect(AGE_TIER_ROADMAPS).toHaveLength(4);
    const ageRanges = AGE_TIER_ROADMAPS.map((r) => r.ageRange);
    expect(ageRanges).toContain('0 - 3 tuổi');
    expect(ageRanges).toContain('3 - 6 tuổi');
    expect(ageRanges).toContain('6 - 11 tuổi');
    expect(ageRanges).toContain('12 - 18+ tuổi');

    for (const roadmap of AGE_TIER_ROADMAPS) {
      expect(roadmap.recommendedChannels.length).toBeGreaterThan(0);
      expect(roadmap.coreMethodology.length).toBeGreaterThan(0);
      expect(roadmap.dailyRoutine.length).toBeGreaterThan(10);
      expect(roadmap.pinyinGuidance.length).toBeGreaterThan(5);
    }
  });

  it('contains comprehensive textbook recommendations across primary, secondary, and HSK levels', () => {
    expect(TEXTBOOK_SELECTION_MATRIX.length).toBeGreaterThanOrEqual(4);
    const yct = TEXTBOOK_SELECTION_MATRIX.find((t) => t.targetStage.includes('Tiểu học'));
    expect(yct).toBeDefined();
    expect(yct?.recommendedBook).toContain('YCT');
    expect(yct?.driveFolderUrl).toContain('drive.google.com');

    const hsk = TEXTBOOK_SELECTION_MATRIX.find((t) => t.targetStage.includes('HSK 1 - 6'));
    expect(hsk).toBeDefined();
    expect(hsk?.recommendedBook).toContain('Chuẩn HSK');
  });
});
