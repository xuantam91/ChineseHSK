import { describe, it, expect } from 'vitest';
import {
  scoreQuestion,
  gradeQuizSubmission,
  QuizAttemptLimitError,
} from '@/lib/quiz';
import { Quiz, QuizQuestion } from '@/types/database';

describe('Quiz Grading: Question Scoring by Type', () => {
  const singleChoiceQ: QuizQuestion = {
    id: 'q-sc-1',
    quiz_id: 'quiz-1',
    type: 'single_choice',
    prompt_jsonb: {
      question: 'Phát âm của chữ 你 là gì?',
      options: [
        { id: 'opt-a', text: 'nǐ' },
        { id: 'opt-b', text: 'hǎo' },
        { id: 'opt-c', text: 'ma' },
      ],
    },
    correct_answer_jsonb: { answer: 'opt-a' },
    points: 10,
    sort_order: 1,
    created_at: new Date().toISOString(),
  };

  const multipleChoiceQ: QuizQuestion = {
    id: 'q-mc-1',
    quiz_id: 'quiz-1',
    type: 'multiple_choice',
    prompt_jsonb: {
      question: 'Những từ nào mang thanh 3 trong tiếng Trung?',
      options: [
        { id: 'opt-1', text: 'nǐ (你)' },
        { id: 'opt-2', text: 'hǎo (好)' },
        { id: 'opt-3', text: 'bà (爸)' },
      ],
    },
    correct_answer_jsonb: { answer: ['opt-1', 'opt-2'] },
    points: 20,
    sort_order: 2,
    created_at: new Date().toISOString(),
  };

  const trueFalseQ: QuizQuestion = {
    id: 'q-tf-1',
    quiz_id: 'quiz-1',
    type: 'true_false',
    prompt_jsonb: {
      question: 'Trong tiếng Trung, khi hai thanh 3 đi liền nhau, thanh 3 thứ nhất đọc thành thanh 2?',
    },
    correct_answer_jsonb: { answer: true },
    points: 10,
    sort_order: 3,
    created_at: new Date().toISOString(),
  };

  it('correctly scores single choice questions', () => {
    // Correct
    const resultCorrect = scoreQuestion(singleChoiceQ, 'opt-a');
    expect(resultCorrect.isCorrect).toBe(true);
    expect(resultCorrect.awardedPoints).toBe(10);

    // Incorrect
    const resultIncorrect = scoreQuestion(singleChoiceQ, 'opt-b');
    expect(resultIncorrect.isCorrect).toBe(false);
    expect(resultIncorrect.awardedPoints).toBe(0);

    // Empty
    const resultEmpty = scoreQuestion(singleChoiceQ, undefined);
    expect(resultEmpty.isCorrect).toBe(false);
    expect(resultEmpty.awardedPoints).toBe(0);
  });

  it('correctly scores multiple choice questions with set equality', () => {
    // Correct regardless of order
    const resExact = scoreQuestion(multipleChoiceQ, ['opt-1', 'opt-2']);
    expect(resExact.isCorrect).toBe(true);
    expect(resExact.awardedPoints).toBe(20);

    const resReversed = scoreQuestion(multipleChoiceQ, ['opt-2', 'opt-1']);
    expect(resReversed.isCorrect).toBe(true);
    expect(resReversed.awardedPoints).toBe(20);

    // Incomplete subset -> fails
    const resIncomplete = scoreQuestion(multipleChoiceQ, ['opt-1']);
    expect(resIncomplete.isCorrect).toBe(false);
    expect(resIncomplete.awardedPoints).toBe(0);

    // Superset with extra incorrect option -> fails
    const resExtra = scoreQuestion(multipleChoiceQ, ['opt-1', 'opt-2', 'opt-3']);
    expect(resExtra.isCorrect).toBe(false);
    expect(resExtra.awardedPoints).toBe(0);
  });

  it('correctly scores true/false questions with flexible boolean representations', () => {
    // Exact boolean
    expect(scoreQuestion(trueFalseQ, true).isCorrect).toBe(true);
    expect(scoreQuestion(trueFalseQ, false).isCorrect).toBe(false);

    // String representation ("true", "Đúng")
    expect(scoreQuestion(trueFalseQ, 'true').isCorrect).toBe(true);
    expect(scoreQuestion(trueFalseQ, 'Đúng').isCorrect).toBe(true);
    expect(scoreQuestion(trueFalseQ, 'false').isCorrect).toBe(false);
    expect(scoreQuestion(trueFalseQ, 'Sai').isCorrect).toBe(false);
  });
});

describe('Quiz Grading: Submission, Passing Threshold & Attempt Limits', () => {
  const sampleQuiz: Quiz = {
    id: 'quiz-checkpoint-1',
    lesson_id: 'lesson-checkpoint',
    title: 'Kiểm tra chặng 1',
    passing_score: 80, // 80% to pass
    attempt_limit: 3, // maximum 3 attempts
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const questions: QuizQuestion[] = [
    {
      id: 'q1',
      quiz_id: sampleQuiz.id,
      type: 'single_choice',
      prompt_jsonb: { question: 'Q1' },
      correct_answer_jsonb: { answer: 'A' },
      points: 25,
      sort_order: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 'q2',
      quiz_id: sampleQuiz.id,
      type: 'single_choice',
      prompt_jsonb: { question: 'Q2' },
      correct_answer_jsonb: { answer: 'B' },
      points: 25,
      sort_order: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: 'q3',
      quiz_id: sampleQuiz.id,
      type: 'single_choice',
      prompt_jsonb: { question: 'Q3' },
      correct_answer_jsonb: { answer: 'C' },
      points: 25,
      sort_order: 3,
      created_at: new Date().toISOString(),
    },
    {
      id: 'q4',
      quiz_id: sampleQuiz.id,
      type: 'single_choice',
      prompt_jsonb: { question: 'Q4' },
      correct_answer_jsonb: { answer: 'D' },
      points: 25,
      sort_order: 4,
      created_at: new Date().toISOString(),
    },
  ];

  it('evaluates passing threshold (80%) accurately', () => {
    // 4/4 correct = 100% -> passed
    const fullResult = gradeQuizSubmission({
      quiz: sampleQuiz,
      questions,
      answers: { q1: 'A', q2: 'B', q3: 'C', q4: 'D' },
      previousAttemptsCount: 0,
    });
    expect(fullResult.score).toBe(100);
    expect(fullResult.rawScore).toBe(100);
    expect(fullResult.maxScore).toBe(100);
    expect(fullResult.passed).toBe(true);

    // 3/4 correct = 75% -> failed (passing score is 80%)
    const failResult = gradeQuizSubmission({
      quiz: sampleQuiz,
      questions,
      answers: { q1: 'A', q2: 'B', q3: 'C', q4: 'WRONG' },
      previousAttemptsCount: 0,
    });
    expect(failResult.score).toBe(75);
    expect(failResult.passed).toBe(false);
  });

  it('enforces attempt limits strictly', () => {
    // Attempt 1, 2, 3 succeed
    expect(() =>
      gradeQuizSubmission({
        quiz: sampleQuiz,
        questions,
        answers: { q1: 'A' },
        previousAttemptsCount: 0,
      })
    ).not.toThrow();

    expect(() =>
      gradeQuizSubmission({
        quiz: sampleQuiz,
        questions,
        answers: { q1: 'A' },
        previousAttemptsCount: 2, // 3rd attempt
      })
    ).not.toThrow();

    // 4th attempt exceeds limit (attempt_limit = 3)
    expect(() =>
      gradeQuizSubmission({
        quiz: sampleQuiz,
        questions,
        answers: { q1: 'A' },
        previousAttemptsCount: 3, // already made 3 attempts
      })
    ).toThrow(QuizAttemptLimitError);
  });

  it('allows unlimited attempts when attempt_limit is null', () => {
    const unlimitedQuiz: Quiz = {
      ...sampleQuiz,
      attempt_limit: null,
    };

    expect(() =>
      gradeQuizSubmission({
        quiz: unlimitedQuiz,
        questions,
        answers: { q1: 'A' },
        previousAttemptsCount: 10,
      })
    ).not.toThrow();
  });
});
