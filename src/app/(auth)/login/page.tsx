'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Lock, Mail, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';
import { getStoredUserProfile, saveUserProfile } from '@/lib/student-store';
import { DEMO_USER_PROFILE } from '@/lib/mock-data';
import { createClient } from '@/lib/supabase/client';

function isClientSupabaseEnabled(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(
    url &&
      !url.includes('your-project') &&
      process.env.NEXT_PUBLIC_USE_MOCK_SUPABASE !== 'true'
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const normalizedEmail = email.trim().toLowerCase();
    const current = getStoredUserProfile();

    try {
      if (normalizedEmail === 'student.demo@chinese-journey.edu.vn') {
        await handleDemoQuickLogin();
        return;
      }

      if (isClientSupabaseEnabled()) {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (error) {
          const msg = error.message.toLowerCase();
          if (msg.includes('invalid login credentials')) {
            setErrorMsg('Email hoặc mật khẩu chưa đúng.');
          } else if (msg.includes('email not confirmed')) {
            setErrorMsg('Tài khoản chưa xác nhận email. Vui lòng kiểm tra hộp thư để xác nhận.');
          } else {
            setErrorMsg(error.message);
          }
          setIsLoading(false);
          return;
        }

        // Fetch verified role & profile from server
        const meRes = await fetch('/api/auth/me');
        const meJson = await meRes.json();
        const serverUser = meJson?.data?.user;
        const resolvedRole = serverUser?.role || 'student';

        saveUserProfile({
          ...current,
          id: serverUser?.id || data.user?.id || current.id,
          email: serverUser?.email || normalizedEmail,
          displayName:
            serverUser?.display_name ||
            data.user?.user_metadata?.display_name ||
            normalizedEmail.split('@')[0],
          role: resolvedRole,
          isDemo: false,
        });

        setIsLoading(false);
        router.push(
          resolvedRole === 'admin' || resolvedRole === 'super_admin' ? '/admin' : '/dashboard'
        );
        return;
      }

      // Offline / Local Mac Mode without Supabase
      const res = await fetch('/api/auth/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const json = await res.json();
      if (!json.success || !json.data?.user) {
        setErrorMsg(json?.error?.message || 'Không thể đăng nhập.');
        setIsLoading(false);
        return;
      }

      const localUser = json.data.user;
      saveUserProfile({
        ...current,
        id: localUser.id,
        email: localUser.email || normalizedEmail,
        displayName: localUser.display_name || normalizedEmail.split('@')[0],
        role: localUser.role,
        isDemo: false,
      });

      setIsLoading(false);
      router.push(
        localUser.role === 'admin' || localUser.role === 'super_admin' ? '/admin' : '/dashboard'
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Đã có lỗi xảy ra khi đăng nhập.');
      setIsLoading(false);
    }
  };

  const handleDemoQuickLogin = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      if (isClientSupabaseEnabled()) {
        const supabase = createClient();
        await supabase.auth.signOut().catch(() => {});
      } else {
        await fetch('/api/auth/me', { method: 'DELETE' }).catch(() => {});
      }

      const current = getStoredUserProfile();
      saveUserProfile({
        ...DEMO_USER_PROFILE,
        currentHskLevel: current.currentHskLevel || 'HSK1',
        isDemo: true,
      });
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-7">
          <Link href="/" className="inline-block">
            <img
              src="/assets/globy-chinese-logo.svg"
              alt="GLOBY Chinese – Học tiếng Trung thông minh"
              width={280}
              height={48}
              className="w-[255px] sm:w-[280px] h-auto mx-auto block"
            />
          </Link>
        </div>

        {/* Demo-only Fast Access */}
        <div className="mb-4 p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-100 text-xs flex items-center justify-between gap-3">
          <div>
            <div className="font-bold text-emerald-900">⚡ Trải nghiệm nhanh:</div>
            <div className="text-emerald-700/80 text-[11px]">Học thử 3 bài đầu mỗi cấp độ</div>
          </div>
          <button
            type="button"
            onClick={handleDemoQuickLogin}
            disabled={isLoading}
            className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-emerald-200 text-emerald-800 font-semibold hover:bg-emerald-100 transition-colors shadow-2xs cursor-pointer shrink-0 disabled:opacity-60"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Học viên Demo (3 bài đầu)</span>
          </button>
        </div>

        {/* Login Form Card */}
        <Card className="border-gray-200 shadow-md">
          <CardHeader>
            <CardTitle>Đăng nhập tài khoản</CardTitle>
            <CardDescription>
              Nhập email và mật khẩu để tiếp tục lộ trình học tập hoặc quản trị hệ thống.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ban@vidu.com"
                    className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700">
                    Mật khẩu
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-emerald-700 hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full mt-2"
              >
                Đăng nhập
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center text-xs text-gray-500">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="ml-1 font-bold text-emerald-700 hover:underline">
              Đăng ký ngay
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
