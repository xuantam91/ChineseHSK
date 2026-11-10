import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '@/lib/db';
import { mockStore } from '@/lib/db/mock-store';

describe('Server-Side Quiz Security & Zero Answer Leakage', () => {
  beforeEach(() => {
    mockStore.reset();
  });

  it('never returns correct_answer_jsonb in student safe quiz query', async () => {
    const safeQuiz = await db.getSafeQuizForLesson('les-01');
    expect(safeQuiz).not.toBeNull();
    expect(safeQuiz?.questions.length).toBeGreaterThan(0);

    for (const q of safeQuiz!.questions) {
      // Must NOT leak answer keys or explanations to student
      expect((q as any).correct_answer_jsonb).toBeUndefined();
      expect((q as any).explanation_jsonb).toBeUndefined();
      expect(q.prompt_jsonb).toBeDefined();
      expect(q.points).toBeGreaterThan(0);
    }
  });

  it('correctly grades submission on server and calculates pass/fail against passing_score', async () => {
    const enrollment = await db.getEnrollmentByUserId('usr-student-01');
    expect(enrollment).not.toBeNull();

    // Submit correct answers: q-01-01 -> 'opt-b', q-01-02 -> 'opt-2a'
    const result = await db.gradeAndSubmitQuiz(enrollment!.id, 'quiz-01', {
      'q-01-01': 'opt-b',
      'q-01-02': 'opt-2a',
    });

    expect(result.score).toBe(100);
    expect(result.passed).toBe(true);
    expect(result.question_results.length).toBe(2);
    expect(result.question_results[0].is_correct).toBe(true);
    expect(result.question_results[1].is_correct).toBe(true);
  });

  it('marks failed when score is below passing_score', async () => {
    const enrollment = await db.getEnrollmentByUserId('usr-student-01');
    expect(enrollment).not.toBeNull();

    // Submit incorrect answers
    const result = await db.gradeAndSubmitQuiz(enrollment!.id, 'quiz-01', {
      'q-01-01': 'wrong-answer-1',
      'q-01-02': 'wrong-answer-2',
    });

    expect(result.score).toBe(0);
    expect(result.passed).toBe(false);
  });
});
