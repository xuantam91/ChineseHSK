'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  Play,
  Mic,
  Award,
  BookOpen,
  Volume2,
  FolderGit2,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Dialog } from '@/components/ui/Dialog';
import { PinyinChart } from '@/components/lesson/PinyinChart';
import { TTSVoiceSelector } from '@/components/common/TTSVoiceSelector';
import { speakChinese } from '@/lib/tts';
import {
  getStoredUserProfile,
  saveUserProfile,
  getCompletedLessonIds,
  isDemoAccount,
  DEMO_MAX_LESSONS,
} from '@/lib/student-store';
import { DEMO_USER_PROFILE } from '@/lib/mock-data';
import { getFormattedTodayVi } from '@/lib/timezone';
import { HSKLevel } from '@/types';
import { HSK1_LESSONS, HSK2_LESSONS, HSK3_LESSONS, HSKLesson } from '@/lib/curriculum/hsk1-3-data';
import { HSK4_LESSONS, HSK5_LESSONS, HSK6_LESSONS } from '@/lib/curriculum/hsk4-9-data';

const HSK_LEVEL_LIST: { id: HSKLevel; label: string; desc: string }[] = [
  { id: 'HSK1', label: 'HSK 1', desc: '20 bài • Nhập môn' },
  { id: 'HSK2', label: 'HSK 2', desc: '20 bài • Sơ cấp' },
  { id: 'HSK3', label: 'HSK 3', desc: '20 bài • Đời sống' },
  { id: 'HSK4', label: 'HSK 4', desc: '20 bài • Công sở' },
  { id: 'HSK5', label: 'HSK 5', desc: '20 bài • Báo chí' },
  { id: 'HSK6', label: 'HSK 6', desc: '20 bài • Cao cấp' },
];

function getLessonsByLevel(level: HSKLevel): HSKLesson[] {
  switch (level) {
    case 'HSK1':
      return HSK1_LESSONS;
    case 'HSK2':
      return HSK2_LESSONS;
    case 'HSK3':
      return HSK3_LESSONS;
    case 'HSK4':
      return HSK4_LESSONS;
    case 'HSK5':
      return HSK5_LESSONS;
    case 'HSK6':
      return HSK6_LESSONS;
    default:
      return HSK1_LESSONS;
  }
}

export default function StudentDashboardPage() {
  const [profile, setProfile] = useState(DEMO_USER_PROFILE);
  const [todayText, setTodayText] = useState('');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isPinyinModalOpen, setIsPinyinModalOpen] = useState(false);

  useEffect(() => {
    const loadedProfile = getStoredUserProfile();
    setProfile(loadedProfile);
    setTodayText(getFormattedTodayVi(loadedProfile.timezone));
    setCompletedLessons(getCompletedLessonIds());
  }, []);

  const activeLevel: HSKLevel =
    profile.currentHskLevel && profile.currentHskLevel !== 'HSK7-9'
      ? profile.currentHskLevel
      : 'HSK1';

  const handleSelectLevel = (lvl: HSKLevel) => {
    const updated = { ...profile, currentHskLevel: lvl };
    setProfile(updated);
    saveUserProfile(updated);
  };

  const levelLessons = getLessonsByLevel(activeLevel);
  const isDemo = isDemoAccount(profile);
  const visibleLessons = isDemo
    ? levelLessons.slice(0, DEMO_MAX_LESSONS)
    : levelLessons;
  const completedInLevelCount = visibleLessons.filter((l) =>
    completedLessons.includes(l.id)
  ).length;
  const levelProgressPct =
    visibleLessons.length > 0
      ? Math.round((completedInLevelCount / visibleLessons.length) * 100)
      : 0;

  // Next uncompleted lesson in this level (or first lesson if all done)
  const nextLesson =
    visibleLessons.find((l) => !completedLessons.includes(l.id)) || visibleLessons[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Banner: Clean Greeting & Quick Stats */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white p-6 sm:p-7 rounded-2xl shadow-md shadow-emerald-900/10 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white/15 px-2.5 py-1 text-white text-xs font-semibold border border-white/20">
              <Calendar className="w-3.5 h-3.5 text-emerald-100" />
              <span>{todayText || 'Hôm nay'}</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-400 text-emerald-950 px-2.5 py-1 text-xs font-extrabold">
              Đang học: {activeLevel}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Xin chào, {profile.displayName}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Chọn cấp độ của bạn bên dưới và bấm <strong className="text-white">Vào học ngay</strong> để bắt đầu bài học hôm nay.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <div className="flex items-center gap-2.5 bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/25">
            <Flame className="w-5 h-5 text-amber-300 fill-amber-300" />
            <div>
              <div className="text-base font-bold text-white leading-none">
                {profile.streakCount} ngày
              </div>
              <div className="text-xs text-emerald-100 mt-1">Chuỗi học</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/25">
            <Award className="w-5 h-5 text-amber-300" />
            <div>
              <div className="text-base font-bold text-white leading-none">
                {completedLessons.length} bài
              </div>
              <div className="text-xs text-emerald-100 mt-1">Đã hoàn thành</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Level Switcher Bar (1-click to change level) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {HSK_LEVEL_LIST.map((lvl) => {
          const isSelected = activeLevel === lvl.id;
          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => handleSelectLevel(lvl.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-left transition-all shrink-0 ${
                isSelected
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-slate-50 font-semibold'
              }`}
            >
              <span className="text-sm">{lvl.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {lvl.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Next Lesson Hero + Step-by-step Lesson List */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1-Click Start Current Lesson Card with Vivid Cover Banner */}
          {nextLesson && (
            <Card className="border-2 border-emerald-600/80 bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="relative min-h-[190px] sm:min-h-[210px] bg-slate-900 text-white p-5 sm:p-6 flex flex-col justify-between overflow-hidden">
                <img
                  src={nextLesson.imageUrl || '/images/lessons/hsk1_lesson01_greeting.jpg'}
                  alt={nextLesson.title}
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-95 contrast-105 saturate-110"
                />
                {/* Directional gradient: readable text on left/bottom, crystal-clear illustration on right */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-emerald-950/65 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />
                <div
                  aria-hidden="true"
                  className="pointer-events-none select-none absolute right-3 bottom-2 text-6xl font-black text-white/20 tracking-widest drop-shadow"
                >
                  {nextLesson.coverCalligraphy || nextLesson.vocabulary?.[0]?.hanzi || '汉语'}
                </div>

                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm">
                    <Play className="w-3 h-3 fill-slate-950" />
                    <span>TRANG BÌA BÀI TIẾP THEO • {nextLesson.level} (BÀI {nextLesson.lessonNumber}/{levelLessons.length})</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs text-white font-bold bg-slate-950/60 backdrop-blur-xs border border-white/20 px-3 py-1 rounded-full shadow-2xs">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    {nextLesson.estimatedMinutes} phút
                  </span>
                </div>

                <div className="relative z-10 mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="max-w-xl">
                    <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-md">
                      {nextLesson.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-50 font-medium mt-1.5 leading-relaxed drop-shadow">
                      {nextLesson.subtitleVi} — {nextLesson.summaryVi}
                    </p>
                  </div>

                  <Link href={`/lesson/${nextLesson.id}`} className="shrink-0 w-full sm:w-auto">
                    <Button
                      variant="primary"
                      size="lg"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-6 shadow-md"
                    >
                      Vào học ngay
                    </Button>
                  </Link>
                </div>
              </div>

              <CardContent className="p-5 sm:p-6 space-y-4">
                {/* Quick Vocabulary Preview Pills (Click to listen!) */}
                {nextLesson.vocabulary && nextLesson.vocabulary.length > 0 && (
                  <div className="pt-3 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Từ vựng trong bài (Bấm vào từ để nghe thử):</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {nextLesson.vocabulary.slice(0, 6).map((v, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => speakChinese(v.hanzi)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-colors text-left"
                        >
                          <span className="font-chinese text-base font-extrabold text-slate-900">
                            {v.hanzi}
                          </span>
                          <span className="text-xs font-semibold text-emerald-700">
                            {v.pinyin}
                          </span>
                          <span className="text-xs text-slate-500">
                            ({v.meaningVi})
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step-by-Step Lesson Path for Selected Level */}
          <Card className="border-slate-200 bg-white rounded-2xl shadow-2xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                    Lộ trình bài học {activeLevel} ({isDemo ? `${visibleLessons.length}/${levelLessons.length} bài học thử` : `${levelLessons.length} bài`})
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isDemo
                      ? `Tài khoản Demo hiển thị và cho phép học thử ${DEMO_MAX_LESSONS} bài đầu tiên của mỗi cấp độ.`
                      : 'Học lần lượt từ Bài 1 hoặc chọn bất kỳ bài nào bạn muốn luyện tập.'}
                  </p>
                </div>
                <Link
                  href="/roadmap"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>Xem toàn bộ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </CardHeader>

            <CardContent className="divide-y divide-slate-100 p-0">
              {visibleLessons.map((lesson) => {
                const isDone = completedLessons.includes(lesson.id);
                const isCurrent = nextLesson?.id === lesson.id;

                return (
                  <div
                    key={lesson.id}
                    className={`p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                      isCurrent ? 'bg-emerald-50/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          isDone
                            ? 'bg-emerald-700 text-white'
                            : isCurrent
                            ? 'bg-amber-400 text-emerald-950 ring-2 ring-amber-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : lesson.lessonNumber}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/lesson/${lesson.id}`}
                            className="text-sm sm:text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors"
                          >
                            {lesson.title}
                          </Link>
                          {isCurrent && !isDone && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                              Đang học
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {lesson.subtitleVi} • {lesson.vocabulary.length} từ vựng • {lesson.estimatedMinutes} phút
                        </p>
                      </div>
                    </div>

                    <Link href={`/lesson/${lesson.id}`} className="self-end sm:self-center shrink-0">
                      <Button
                        variant={isDone ? 'outline' : 'primary'}
                        size="sm"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        className={
                          isDone
                            ? 'text-xs font-semibold border-slate-300 text-slate-700'
                            : 'text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white'
                        }
                      >
                        {isDone ? 'Ôn lại' : 'Vào học'}
                      </Button>
                    </Link>
                  </div>
                );
              })}

              {isDemo && levelLessons.length > DEMO_MAX_LESSONS && (
                <div className="p-5 sm:p-6 bg-amber-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                      🔒 Giới hạn Tài khoản Học thử (Demo: {DEMO_MAX_LESSONS}/{levelLessons.length} bài đầu)
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700">
                      Tài khoản Demo chỉ hiển thị và học thử {DEMO_MAX_LESSONS} bài đầu. Đăng ký hoặc kích hoạt tài khoản chính thức để mở khóa toàn bộ{' '}
                      <strong>{levelLessons.length} bài học</strong> của {activeLevel}.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Link href="/login" className="shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs font-bold border-emerald-600 text-emerald-800 hover:bg-emerald-50"
                      >
                        Đăng nhập
                      </Button>
                    </Link>
                    <Link href="/register" className="shrink-0">
                      <Button
                        variant="primary"
                        size="sm"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs px-4"
                      >
                        Đăng ký tài khoản
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Clean Progress & Essential Tools */}
        <div className="space-y-6">
          {/* Level Progress Card */}
          <Card className="border-slate-200 bg-white rounded-2xl shadow-2xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900">
                  Tiến độ {activeLevel}
                </CardTitle>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  {completedInLevelCount}/{levelLessons.length} bài ({levelProgressPct}%)
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <Progress value={levelProgressPct} max={100} size="sm" />

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800">
                  Giọng đọc tiếng Trung hiện tại:
                </div>
                <TTSVoiceSelector variant="dropdown" className="w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Essential Study Tools (Only 3 Clean Actions) */}
          <Card className="border-slate-200 bg-white rounded-2xl shadow-2xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">
                Công cụ hỗ trợ học nhanh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-4">
              <button
                type="button"
                onClick={() => setIsPinyinModalOpen(true)}
                className="w-full p-3.5 rounded-xl bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-200 transition-colors flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Bảng Ngữ Âm Pinyin</div>
                    <div className="text-xs text-slate-600">21 thanh mẫu, 36 vận mẫu & 4 thanh điệu</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-700 shrink-0" />
              </button>

              <Link
                href="/roadmap"
                className="w-full p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-emerald-700 flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Lộ trình HSK 1 – HSK 9</div>
                    <div className="text-xs text-slate-500">Toàn bộ giáo trình 12 tháng</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </Link>

              <Link
                href="/library"
                className="w-full p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-emerald-700 flex items-center justify-center shrink-0">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Thư viện Giáo trình & Audio</div>
                    <div className="text-xs text-slate-500">Sách PDF BLCUP, MP3 & Video</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pinyin Modal Dialog */}
      <Dialog
        isOpen={isPinyinModalOpen}
        onClose={() => setIsPinyinModalOpen(false)}
        title="Bảng Ngữ Âm Pinyin Tương Tác"
        className="max-w-4xl"
      >
        <div className="py-2">
          <PinyinChart defaultTab="initials" />
        </div>
      </Dialog>
    </div>
  );
}
