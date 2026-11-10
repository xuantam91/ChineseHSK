import { LessonBlock } from '@/types';

export interface EnrollmentProgressResult {
  percent: number;
  completed: number;
  total: number;
}

/**
 * Calculates overall enrollment progress percentage and counts.
 * Safely handles edge cases like total = 0 or completed > total.
 */
export function calculateEnrollmentProgress(
  totalRequiredLessons: number,
  completedLessons: number
): EnrollmentProgressResult {
  if (totalRequiredLessons <= 0) {
    return { percent: 0, completed: 0, total: 0 };
  }

  const validCompleted = Math.max(0, completedLessons);
  const percent = Math.min(
    100,
    Math.max(0, Math.round((validCompleted / totalRequiredLessons) * 100))
  );

  return {
    percent,
    completed: validCompleted,
    total: totalRequiredLessons,
  };
}

/**
 * Evaluates whether a lesson is considered completed.
 * A lesson is completed if:
 * 1. All required blocks have their IDs in completedBlockIds.
 * 2. If the lesson contains any quiz block or quizPassed is specified,
 *    the quiz must be passed.
 */
export function isLessonCompleted(
  blocks: LessonBlock[],
  completedBlockIds: Set<string>,
  quizPassed?: boolean
): boolean {
  if (!blocks || blocks.length === 0) {
    return true;
  }

  const requiredBlocks = blocks.filter(
    (b) => b.is_required !== false && b.isRequired !== false
  );

  const targetBlocks = requiredBlocks.length > 0 ? requiredBlocks : blocks;

  // Check if all target blocks are in completedBlockIds
  const allBlocksDone = targetBlocks.every((block) => completedBlockIds.has(block.id));
  if (!allBlocksDone) {
    return false;
  }

  // Check quiz requirement
  const hasQuizBlock = blocks.some((b) => b.type === 'quiz');

  if (hasQuizBlock) {
    return quizPassed === true;
  }

  if (quizPassed !== undefined && !quizPassed) {
    return false;
  }

  return true;
}
