'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Play,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DEMO_DAYS, DEMO_LESSONS } from '@/lib/mock-data';
import { getCompletedLessonIds } from '@/lib/student-store';

export default function DayOverviewPage({
  params,
}: {
  params: Promise<{ dayId: string }>;
}) {
  const router = useRouter();
  const { dayId } = use(params);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  useEffect(() => {
    setCompletedLessonIds(getCompletedLessonIds());
  }, []);

  const day = DEMO_DAYS.find((d) => d.id === dayId) || DEMO_DAYS[0];
  const lessons = DEMO_LESSONS[day.id] || DEMO_LESSONS['day-01'] || [];

  const firstLessonId = lessons[0]?.id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/roadmap"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Lộ trình</span>
        </Link>
      </div>

      {/* Day Header Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
            Tháng {day.monthIndex} • Tuần {day.weekIndex}
          </span>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">
            Dạng bài: {day.dayType}
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium ml-auto">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{day.estimatedMinutes} phút học</span>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
          {day.title}
        </h1>

        {/* Objectives Checklist */}
        {day.objectives && day.objectives.length > 0 && (
          <div className="mt-4 rounded-lg bg-slate-50 border border-slate-200 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              Mục tiêu bài học cần đạt
            </h3>
            <ul className="space-y-2">
              {day.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 font-normal">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        {firstLessonId && (
          <div className="mt-6 flex justify-end">
            <Link href={`/lesson/${firstLessonId}`} className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                rightIcon={<Play className="w-3.5 h-3.5 fill-white" />}
                className="w-full sm:w-auto font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs text-xs px-6"
              >
                Bắt đầu bài đầu tiên
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Lesson Breakdown */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-3">
          Danh sách các bài học ({lessons.length} bài)
        </h2>

        <div className="space-y-3">
          {lessons.map((lesson, idx) => {
            const isDone = completedLessonIds.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-2xs gap-3"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${
                      isDone
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {lesson.title}
                      </h3>
                      {lesson.isRequired && (
                        <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Bắt buộc
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {lesson.description}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-medium">
                      <span>{lesson.estimatedMinutes} phút</span>
                      <span>•</span>
                      <span>{lesson.blocks?.length || 0} phần học</span>
                    </div>
                  </div>
                </div>

                <div className="self-end sm:self-center">
                  <Link href={`/lesson/${lesson.id}`}>
                    <Button
                      variant={isDone ? 'outline' : 'primary'}
                      size="sm"
                      className={`text-xs whitespace-nowrap ${
                        isDone
                          ? 'border-slate-300 text-slate-700 hover:bg-slate-50'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white font-bold'
                      }`}
                    >
                      {isDone ? 'Ôn lại bài' : 'Vào bài'}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
