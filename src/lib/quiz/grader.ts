import { Quiz, QuizQuestion } from '@/types/database';

export interface QuestionGradingDetail {
  questionId: string;
  isCorrect: boolean;
  awardedPoints: number;
  maxPoints: number;
  studentAnswer: any;
  correctAnswer: any;
  explanation?: string;
}

export interface QuizGradingResult {
  score: number; // percentage 0 - 100
  rawScore: number;
  maxScore: number;
  passingScore: number;
  passed: boolean;
  attemptNo: number;
  details: QuestionGradingDetail[];
}

export class QuizAttemptLimitError extends Error {
  constructor(message: string = 'Đã đạt giới hạn số lần làm bài kiểm tra này.') {
    super(message);
    this.name = 'QuizAttemptLimitError';
  }
}

/**
 * Normalizes answer for comparison (handles strings, booleans, arrays).
 */
function extractCorrectAnswer(question: QuizQuestion): any {
  const raw = question.correct_answer_jsonb;
  if (raw && typeof raw === 'object' && 'answer' in raw) {
    return raw.answer;
  }
  return raw;
}

/**
 * Scores a single question based on its type.
 */
export function scoreQuestion(
  question: QuizQuestion,
  studentAnswer: any
): { isCorrect: boolean; awardedPoints: number; correctAnswer: any } {
  const correctAnswer = extractCorrectAnswer(question);
  const points = question.points || 10;

  if (studentAnswer === undefined || studentAnswer === null) {
    return { isCorrect: false, awardedPoints: 0, correctAnswer };
  }

  let isCorrect = false;

  switch (question.type) {
    case 'single_choice': {
      const studentStr = String(studentAnswer).trim().toLowerCase();
      const correctStr = String(correctAnswer).trim().toLowerCase();
      isCorrect = studentStr === correctStr;
      break;
    }

    case 'multiple_choice': {
      if (Array.isArray(studentAnswer) && Array.isArray(correctAnswer)) {
        const studentSet = new Set(studentAnswer.map((item) => String(item).trim().toLowerCase()));
        const correctSet = new Set(correctAnswer.map((item) => String(item).trim().toLowerCase()));

        if (studentSet.size === correctSet.size) {
          isCorrect = Array.from(correctSet).every((val) => studentSet.has(val));
        }
      }
      break;
    }

    case 'true_false': {
      const parseBool = (val: any): boolean | null => {
        if (typeof val === 'boolean') return val;
        if (typeof val === 'string') {
          const lower = val.trim().toLowerCase();
          if (lower === 'true' || lower === '1' || lower === 'đúng') return true;
          if (lower === 'false' || lower === '0' || lower === 'sai') return false;
        }
        return null;
      };

      const studentBool = parseBool(studentAnswer);
      const correctBool = parseBool(correctAnswer);
      isCorrect = studentBool !== null && correctBool !== null && studentBool === correctBool;
      break;
    }

    default: {
      // Fallback: direct string or JSON comparison
      isCorrect =
        JSON.stringify(studentAnswer) === JSON.stringify(correctAnswer) ||
        String(studentAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();
      break;
    }
  }

  return {
    isCorrect,
    awardedPoints: isCorrect ? points : 0,
    correctAnswer,
  };
}

/**
 * Grades a full quiz submission with attempt limit enforcement.
 */
export function gradeQuizSubmission(params: {
  quiz: Quiz;
  questions: QuizQuestion[];
  answers: Record<string, any>;
  previousAttemptsCount?: number;
}): QuizGradingResult {
  const { quiz, questions, answers, previousAttemptsCount = 0 } = params;

  // Enforce attempt limits
  if (quiz.attempt_limit !== null && quiz.attempt_limit !== undefined && quiz.attempt_limit > 0) {
    if (previousAttemptsCount >= quiz.attempt_limit) {
      throw new QuizAttemptLimitError(
        `Đã vượt quá số lần thử tối đa (${quiz.attempt_limit} lần).`
      );
    }
  }

  let totalMaxScore = 0;
  let totalRawScore = 0;
  const details: QuestionGradingDetail[] = [];

  for (const q of questions) {
    const studentAnswer = answers[q.id];
    const { isCorrect, awardedPoints, correctAnswer } = scoreQuestion(q, studentAnswer);

    totalMaxScore += q.points || 10;
    totalRawScore += awardedPoints;

    const explanation =
      (q.explanation_jsonb as any)?.text || (q.prompt_jsonb as any)?.explanation;

    details.push({
      questionId: q.id,
      isCorrect,
      awardedPoints,
      maxPoints: q.points || 10,
      studentAnswer,
      correctAnswer,
      explanation: typeof explanation === 'string' ? explanation : undefined,
    });
  }

  const scorePercentage =
    totalMaxScore > 0 ? Math.round((totalRawScore / totalMaxScore) * 100) : 0;

  const passingScore = quiz.passing_score ?? 80;
  // If passing_score is <= 100, compare percentage; otherwise compare raw points
  const passed =
    passingScore <= 100
      ? scorePercentage >= passingScore
      : totalRawScore >= passingScore;

  return {
    score: scorePercentage,
    rawScore: totalRawScore,
    maxScore: totalMaxScore,
    passingScore,
    passed,
    attemptNo: previousAttemptsCount + 1,
    details,
  };
}
