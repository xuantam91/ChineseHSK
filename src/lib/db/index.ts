import { mockStore } from './mock-store';
import {
  CurriculumDay,
  CurriculumMonth,
  CurriculumWeek,
  Enrollment,
  Lesson,
  LessonBlock,
  LessonProgress,
  Profile,
  Program,
  ProgramVersion,
  Quiz,
  QuizAttempt,
  QuizQuestion,
  Asset,
} from '@/types/database';
import {
  DayDetailResponse,
  DayRoadmapItem,
  LessonDetailResponse,
  MonthRoadmapItem,
  QuizSubmitResult,
  RoadmapResponse,
  SafeQuiz,
  SafeQuizQuestion,
  TodayResponse,
  WeekRoadmapItem,
} from '@/types/api';
import { calculateDayStatus, calculateStreak, getLocalToday, getUnlockDate, isDayUnlocked } from '@/lib/scheduling';

/**
 * Repository interface for database interactions.
 * Works seamlessly with in-memory mock or Supabase backend.
 */
export const db = {
  // Profiles
  async getProfile(userId: string): Promise<Profile | null> {
    return mockStore.profiles.get(userId) || null;
  },

  async getAllProfiles(): Promise<Profile[]> {
    return Array.from(mockStore.profiles.values());
  },

  async upsertProfile(profile: Profile): Promise<Profile> {
    mockStore.profiles.set(profile.id, profile);
    return profile;
  },

  // Programs & Versions
  async getPrograms(): Promise<Program[]> {
    return Array.from(mockStore.programs.values());
  },

  async getPublishedProgramVersion(): Promise<ProgramVersion | null> {
    const versions = Array.from(mockStore.programVersions.values());
    return versions.find((v) => v.status === 'published') || null;
  },

  async getProgramVersions(programId?: string): Promise<ProgramVersion[]> {
    const versions = Array.from(mockStore.programVersions.values());
    if (programId) {
      return versions.filter((v) => v.program_id === programId);
    }
    return versions;
  },

  async publishProgramVersion(versionId: string): Promise<ProgramVersion | null> {
    const target = mockStore.programVersions.get(versionId);
    if (!target) return null;

    // Transition previous published version to archived
    for (const v of mockStore.programVersions.values()) {
      if (v.program_id === target.program_id && v.status === 'published' && v.id !== versionId) {
        v.status = 'archived';
        mockStore.programVersions.set(v.id, { ...v });
      }
    }

    target.status = 'published';
    target.published_at = new Date().toISOString();
    mockStore.programVersions.set(target.id, { ...target });
    return target;
  },

  // Enrollments
  async getEnrollmentByUserId(userId: string): Promise<Enrollment | null> {
    const enrollments = Array.from(mockStore.enrollments.values());
    return enrollments.find((e) => e.user_id === userId && e.status === 'active') || null;
  },

  async getAllEnrollments(): Promise<Enrollment[]> {
    return Array.from(mockStore.enrollments.values());
  },

  async upsertEnrollment(enrollment: Enrollment): Promise<Enrollment> {
    mockStore.enrollments.set(enrollment.id, enrollment);
    return enrollment;
  },

  // Curriculum Retrieval
  async getMonths(versionId: string): Promise<CurriculumMonth[]> {
    return Array.from(mockStore.curriculumMonths.values())
      .filter((m) => m.program_version_id === versionId)
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  async getWeeks(monthId: string): Promise<CurriculumWeek[]> {
    return Array.from(mockStore.curriculumWeeks.values())
      .filter((w) => w.curriculum_month_id === monthId)
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  async getDays(weekId: string): Promise<CurriculumDay[]> {
    return Array.from(mockStore.curriculumDays.values())
      .filter((d) => d.curriculum_week_id === weekId)
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  async getDay(dayId: string): Promise<CurriculumDay | null> {
    return mockStore.curriculumDays.get(dayId) || null;
  },

  async getLessons(dayId: string): Promise<Lesson[]> {
    return Array.from(mockStore.lessons.values())
      .filter((l) => l.curriculum_day_id === dayId)
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  async getLesson(lessonId: string): Promise<Lesson | null> {
    return mockStore.lessons.get(lessonId) || null;
  },

  async getLessonBlocks(lessonId: string): Promise<LessonBlock[]> {
    return Array.from(mockStore.lessonBlocks.values())
      .filter((b) => b.lesson_id === lessonId)
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  // Safe Quiz fetching for students (NO ANSWER KEYS LEAKED)
  async getSafeQuizForLesson(lessonId: string): Promise<SafeQuiz | null> {
    const quizzes = Array.from(mockStore.quizzes.values());
    const quiz = quizzes.find((q) => q.lesson_id === lessonId && q.status === 'active');
    if (!quiz) return null;

    const questions = Array.from(mockStore.quizQuestions.values())
      .filter((q) => q.quiz_id === quiz.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(
        (q): SafeQuizQuestion => ({
          id: q.id,
          type: q.type,
          prompt_jsonb: q.prompt_jsonb,
          points: q.points,
          sort_order: q.sort_order,
          // CRITICAL: correct_answer_jsonb & explanation_jsonb are omitted!
        })
      );

    return {
      id: quiz.id,
      title: quiz.title,
      passing_score: quiz.passing_score,
      attempt_limit: quiz.attempt_limit,
      questions,
    };
  },

  // Roadmap & Today calculations
  async getStudentRoadmap(enrollment: Enrollment): Promise<RoadmapResponse> {
    const version = mockStore.programVersions.get(enrollment.program_version_id);
    const todayLocal = getLocalToday(enrollment.timezone);

    const months = await this.getMonths(enrollment.program_version_id);
    const monthItems: MonthRoadmapItem[] = [];

    for (const m of months) {
      const weeks = await this.getWeeks(m.id);
      const weekItems: WeekRoadmapItem[] = [];

      for (const w of weeks) {
        const days = await this.getDays(w.id);
        const dayItems: DayRoadmapItem[] = [];

        for (const d of days) {
          const lessons = await this.getLessons(d.id);
          const unlockDate = getUnlockDate(enrollment.start_date, d.unlock_offset_days);

          // Check completion
          let completedLessons = 0;
          for (const l of lessons) {
            const prog = mockStore.lessonProgress.get(`${enrollment.id}_${l.id}`);
            if (prog && prog.status === 'completed') {
              completedLessons++;
            }
          }
          const isCompleted = lessons.length > 0 && completedLessons === lessons.length;
          const status = calculateDayStatus({
            startDate: enrollment.start_date,
            unlockOffsetDays: d.unlock_offset_days,
            dayType: d.day_type,
            isCompleted,
            todayLocal,
          });

          dayItems.push({
            id: d.id,
            day_index: d.day_index,
            day_type: d.day_type,
            title: d.title,
            estimated_minutes: d.estimated_minutes,
            unlock_offset_days: d.unlock_offset_days,
            unlock_date: unlockDate,
            status,
            is_required: d.is_required,
            lesson_count: lessons.length,
            completed_lesson_count: completedLessons,
          });
        }

        weekItems.push({
          id: w.id,
          week_index: w.week_index,
          title: w.title,
          days: dayItems,
        });
      }

      monthItems.push({
        id: m.id,
        month_index: m.month_index,
        title: m.title,
        weeks: weekItems,
      });
    }

    return {
      program_version: {
        id: version?.id || enrollment.program_version_id,
        version_number: version?.version_number || 'v1.0.0',
        title: 'Lộ trình Tiếng Trung 12 Tháng [DEMO]',
      },
      enrollment: {
        start_date: enrollment.start_date,
        timezone: enrollment.timezone,
        status: enrollment.status,
      },
      today_local: todayLocal,
      months: monthItems,
    };
  },

  async getTodayOverview(enrollment: Enrollment): Promise<TodayResponse> {
    const roadmap = await this.getStudentRoadmap(enrollment);
    const allDays = roadmap.months.flatMap((m) => m.weeks.flatMap((w) => w.days));

    const currentDay = allDays.find((d) => d.status === 'today') || null;
    const overdueDays = allDays.filter((d) => d.status === 'overdue');

    // Total required lessons & completed count
    let totalRequiredLessons = 0;
    let completedLessons = 0;
    const completedDates: string[] = [];

    for (const d of allDays) {
      if (d.is_required) {
        totalRequiredLessons += d.lesson_count;
      }
      completedLessons += d.completed_lesson_count;
      if (d.status === 'completed') {
        completedDates.push(d.unlock_date);
      }
    }

    const streak = calculateStreak(completedDates, roadmap.today_local);
    const percentage = totalRequiredLessons > 0 ? Math.round((completedLessons / totalRequiredLessons) * 100) : 0;

    return {
      today_local: roadmap.today_local,
      enrollment,
      current_day: currentDay,
      overdue_days: overdueDays,
      streak,
      stats: {
        completed_lessons: completedLessons,
        total_required_lessons: totalRequiredLessons,
        completion_percentage: percentage,
      },
    };
  },

  // Authorize student access to day
  async getDayDetailForStudent(dayId: string, enrollment: Enrollment): Promise<DayDetailResponse | null> {
    const day = mockStore.curriculumDays.get(dayId);
    if (!day) return null;

    const todayLocal = getLocalToday(enrollment.timezone);
    const unlocked = isDayUnlocked(enrollment.start_date, day.unlock_offset_days, todayLocal);

    if (!unlocked) {
      // Access denied to future locked days!
      return null;
    }

    const lessons = await this.getLessons(day.id);
    const lessonDetails = lessons.map((l) => {
      const prog = mockStore.lessonProgress.get(`${enrollment.id}_${l.id}`);
      return {
        id: l.id,
        title: l.title,
        description: l.description,
        estimated_minutes: l.estimated_minutes,
        is_required: l.is_required,
        progress_status: prog ? prog.status : 'not_started',
      };
    });

    const isCompleted = lessonDetails.length > 0 && lessonDetails.every((l) => l.progress_status === 'completed');
    const status = calculateDayStatus({
      startDate: enrollment.start_date,
      unlockOffsetDays: day.unlock_offset_days,
      dayType: day.day_type,
      isCompleted,
      todayLocal,
    });

    return {
      id: day.id,
      day_index: day.day_index,
      day_type: day.day_type,
      title: day.title,
      estimated_minutes: day.estimated_minutes,
      unlock_offset_days: day.unlock_offset_days,
      status,
      lessons: lessonDetails,
    };
  },

  // Authorize student access to lesson
  async getLessonDetailForStudent(lessonId: string, enrollment: Enrollment): Promise<LessonDetailResponse | null> {
    const lesson = mockStore.lessons.get(lessonId);
    if (!lesson) return null;

    const day = mockStore.curriculumDays.get(lesson.curriculum_day_id);
    if (!day) return null;

    const todayLocal = getLocalToday(enrollment.timezone);
    const unlocked = isDayUnlocked(enrollment.start_date, day.unlock_offset_days, todayLocal);
    if (!unlocked) {
      // Future locked lesson
      return null;
    }

    const blocks = await this.getLessonBlocks(lesson.id);
    const quiz = await this.getSafeQuizForLesson(lesson.id);
    const progress = mockStore.lessonProgress.get(`${enrollment.id}_${lesson.id}`) || null;

    // Completed block IDs
    const completedBlockIds = blocks
      .filter((b) => mockStore.blockProgress.has(`${enrollment.id}_${b.id}`))
      .map((b) => b.id);

    return {
      lesson,
      blocks,
      quiz,
      progress,
      completed_block_ids: completedBlockIds,
    };
  },

  // Block completion
  async completeBlock(enrollmentId: string, blockId: string, metadata?: Record<string, any>) {
    const block = mockStore.lessonBlocks.get(blockId);
    if (!block) throw new Error('Block not found');

    const key = `${enrollmentId}_${blockId}`;
    mockStore.blockProgress.set(key, {
      id: `bp-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      enrollment_id: enrollmentId,
      lesson_block_id: blockId,
      completed_at: new Date().toISOString(),
      metadata_jsonb: metadata,
    });

    // Check if lesson can now be marked completed
    await this.checkAndUpdateLessonCompletion(enrollmentId, block.lesson_id);
  },

  async checkAndUpdateLessonCompletion(enrollmentId: string, lessonId: string) {
    const lesson = mockStore.lessons.get(lessonId);
    if (!lesson) return;

    const blocks = await this.getLessonBlocks(lessonId);
    const requiredBlocks = blocks.filter((b) => b.is_required);

    const allRequiredBlocksDone = requiredBlocks.every((b) =>
      mockStore.blockProgress.has(`${enrollmentId}_${b.id}`)
    );

    // Check quiz if lesson has quiz block
    const hasQuiz = blocks.some((b) => b.type === 'quiz');
    let quizPassed = true;
    if (hasQuiz) {
      const quiz = Array.from(mockStore.quizzes.values()).find(
        (q) => q.lesson_id === lessonId && q.status === 'active'
      );
      if (quiz) {
        const attempts = Array.from(mockStore.quizAttempts.values()).filter(
          (a) => a.enrollment_id === enrollmentId && a.quiz_id === quiz.id
        );
        quizPassed = attempts.some((a) => a.passed);
      }
    }

    const progressKey = `${enrollmentId}_${lessonId}`;
    const existing = mockStore.lessonProgress.get(progressKey);

    if (allRequiredBlocksDone && quizPassed) {
      mockStore.lessonProgress.set(progressKey, {
        id: existing?.id || `lp-${Date.now()}`,
        enrollment_id: enrollmentId,
        lesson_id: lessonId,
        status: 'completed',
        started_at: existing?.started_at || new Date().toISOString(),
        completed_at: existing?.completed_at || new Date().toISOString(),
        completed_required_blocks: true,
        score: existing?.score || 100,
        updated_at: new Date().toISOString(),
      });
    } else {
      mockStore.lessonProgress.set(progressKey, {
        id: existing?.id || `lp-${Date.now()}`,
        enrollment_id: enrollmentId,
        lesson_id: lessonId,
        status: 'in_progress',
        started_at: existing?.started_at || new Date().toISOString(),
        completed_at: null,
        completed_required_blocks: allRequiredBlocksDone,
        score: existing?.score || null,
        updated_at: new Date().toISOString(),
      });
    }
  },

  // Server-Side Quiz Grading
  async gradeAndSubmitQuiz(
    enrollmentId: string,
    quizId: string,
    studentAnswers: Record<string, any>
  ): Promise<QuizSubmitResult> {
    const quiz = mockStore.quizzes.get(quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    // Check attempt limit
    const existingAttempts = Array.from(mockStore.quizAttempts.values()).filter(
      (a) => a.enrollment_id === enrollmentId && a.quiz_id === quizId
    );
    if (quiz.attempt_limit !== null && quiz.attempt_limit !== undefined && existingAttempts.length >= quiz.attempt_limit) {
      throw new Error(`Đã vượt quá số lần làm bài cho phép (${quiz.attempt_limit} lần).`);
    }

    // Fetch questions WITH AUTHORITATIVE CORRECT ANSWERS (Server-side only)
    const questions = Array.from(mockStore.quizQuestions.values())
      .filter((q) => q.quiz_id === quizId)
      .sort((a, b) => a.sort_order - b.sort_order);

    let totalPoints = 0;
    let earnedPoints = 0;
    const questionResults: QuizSubmitResult['question_results'] = [];

    for (const q of questions) {
      totalPoints += q.points;
      const studentAns = studentAnswers[q.id];
      const isCorrect = JSON.stringify(studentAns) === JSON.stringify(q.correct_answer_jsonb);
      const awarded = isCorrect ? q.points : 0;
      earnedPoints += awarded;

      questionResults.push({
        question_id: q.id,
        is_correct: isCorrect,
        awarded_points: awarded,
        correct_answer: q.correct_answer_jsonb,
        explanation: (q.explanation_jsonb as any)?.text || (q.explanation_jsonb as any)?.explanation,
      });
    }

    const calculatedScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = calculatedScore >= quiz.passing_score;

    // Record attempt
    const attemptNo = existingAttempts.length + 1;
    const attemptId = `att-${Date.now()}-${attemptNo}`;
    const attempt: QuizAttempt = {
      id: attemptId,
      enrollment_id: enrollmentId,
      quiz_id: quizId,
      attempt_no: attemptNo,
      submitted_at: new Date().toISOString(),
      score: calculatedScore,
      passed,
    };
    mockStore.quizAttempts.set(attempt.id, attempt);

    // Record answers
    for (const qr of questionResults) {
      const ansId = `qa-${Date.now()}-${qr.question_id}`;
      mockStore.quizAnswers.set(ansId, {
        id: ansId,
        attempt_id: attemptId,
        question_id: qr.question_id,
        answer_jsonb: studentAnswers[qr.question_id],
        is_correct: qr.is_correct,
        awarded_points: qr.awarded_points,
      });
    }

    // Update lesson progress if passed
    if (passed && quiz.lesson_id) {
      await this.checkAndUpdateLessonCompletion(enrollmentId, quiz.lesson_id);
    }

    const lessonProg = quiz.lesson_id ? mockStore.lessonProgress.get(`${enrollmentId}_${quiz.lesson_id}`) : null;
    const lessonCompleted = lessonProg?.status === 'completed';

    return {
      attempt_id: attempt.id,
      attempt_no: attemptNo,
      score: calculatedScore,
      passing_score: quiz.passing_score,
      passed,
      question_results: questionResults,
      lesson_completed: lessonCompleted,
    };
  },

  // Assets
  async getAssets(): Promise<Asset[]> {
    return Array.from(mockStore.assets.values());
  },

  async getAsset(assetId: string): Promise<Asset | null> {
    return mockStore.assets.get(assetId) || null;
  },

  async upsertAsset(asset: Asset): Promise<Asset> {
    mockStore.assets.set(asset.id, asset);
    return asset;
  },

  // Admin mutations
  async upsertDay(day: CurriculumDay): Promise<CurriculumDay> {
    mockStore.curriculumDays.set(day.id, day);
    return day;
  },

  async upsertLesson(lesson: Lesson): Promise<Lesson> {
    mockStore.lessons.set(lesson.id, lesson);
    return lesson;
  },

  async upsertBlock(block: LessonBlock): Promise<LessonBlock> {
    mockStore.lessonBlocks.set(block.id, block);
    return block;
  },

  async deleteDay(dayId: string): Promise<boolean> {
    return mockStore.curriculumDays.delete(dayId);
  },

  async deleteLesson(lessonId: string): Promise<boolean> {
    return mockStore.lessons.delete(lessonId);
  },

  async deleteBlock(blockId: string): Promise<boolean> {
    return mockStore.lessonBlocks.delete(blockId);
  },
};
