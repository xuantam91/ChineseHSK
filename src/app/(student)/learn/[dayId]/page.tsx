'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Play,
  FileText,
  HelpCircle,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Lộ trình</span>
        </Link>
      </div>

      {/* Day Header Card */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="warning" size="sm">
            Tháng {day.monthIndex} • Tuần {day.weekIndex}
          </Badge>
          <Badge variant="default" size="sm" className="capitalize">
            Dạng bài: {day.dayType}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-gray-500 font-medium ml-auto">
            <Clock className="w-3.5 h-3.5" />
            <span>{day.estimatedMinutes} phút học</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
          {day.title}
        </h1>

        {/* Objectives Checklist */}
        {day.objectives && day.objectives.length > 0 && (
          <div className="mt-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 p-4 sm:p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Mục tiêu bài học cần đạt</span>
            </h3>
            <ul className="space-y-2.5">
              {day.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-emerald-950 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
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
                size="lg"
                rightIcon={<Play className="w-4 h-4 fill-white" />}
                className="w-full sm:w-auto font-bold shadow-md shadow-emerald-700/20"
              >
                Bắt đầu bài đầu tiên
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Lesson Breakdown */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">
          Danh sách các bài học ({lessons.length} bài)
        </h2>

        <div className="space-y-3">
          {lessons.map((lesson, idx) => {
            const isDone = completedLessonIds.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border border-gray-100 bg-white hover:border-emerald-200 transition-all shadow-xs gap-3"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm sm:text-base font-bold text-gray-900">
                        {lesson.title}
                      </h3>
                      {lesson.isRequired && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          Bắt buộc
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {lesson.description}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-2 font-medium">
                      <span>{lesson.estimatedMinutes} phút</span>
                      <span>•</span>
                      <span>{lesson.blocks?.length || 0} khối nội dung</span>
                    </div>
                  </div>
                </div>

                <div className="self-end sm:self-center">
                  <Link href={`/lesson/${lesson.id}`}>
                    <Button
                      variant={isDone ? 'outline' : 'primary'}
                      size="sm"
                      className="text-xs whitespace-nowrap"
                    >
                      {isDone ? 'Học lại' : 'Vào bài'}
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
