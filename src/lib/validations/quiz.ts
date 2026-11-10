import { z } from 'zod';

export const quizSubmissionSchema = z
  .object({
    quizId: z.string().min(1, 'quizId is required').optional(),
    quiz_id: z.string().min(1).optional(),
    answers: z.record(z.any()),
  })
  .transform((data) => {
    const quizId = data.quizId || data.quiz_id;
    if (!quizId) {
      throw new Error('quizId or quiz_id is required');
    }
    return {
      quizId,
      quiz_id: quizId,
      answers: data.answers,
    };
  });

export type QuizSubmission = z.infer<typeof quizSubmissionSchema>;

export const quizQuestionSchema = z.object({
  id: z.string().optional(),
  quizId: z.string().optional(),
  quiz_id: z.string().optional(),
  type: z.enum(['single_choice', 'multiple_choice', 'true_false', 'fill_blank']),
  prompt: z.object({
    question: z.string().min(1, 'Question text is required'),
    options: z
      .array(
        z.object({
          id: z.string(),
          text: z.string(),
          pinyin: z.string().optional(),
        })
      )
      .optional(),
    pinyin_prompt: z.string().optional(),
    explanation: z.string().optional(),
  }),
  correctAnswer: z.any().optional(),
  correct_answer_jsonb: z.any().optional(),
  points: z.number().int().min(1).default(10),
  sortOrder: z.number().int().default(1),
  sort_order: z.number().int().optional(),
});

export const quizSchema = z.object({
  id: z.string().optional(),
  lessonId: z.string().optional(),
  lesson_id: z.string().optional(),
  title: z.string().min(1, 'Quiz title is required'),
  passingScore: z.number().min(0).max(100).default(80),
  passing_score: z.number().min(0).max(100).optional(),
  attemptLimit: z.number().int().min(1).nullable().optional(),
  attempt_limit: z.number().int().min(1).nullable().optional(),
  questions: z.array(quizQuestionSchema).optional(),
});
