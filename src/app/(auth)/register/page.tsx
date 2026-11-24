'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getStoredUserProfile, saveUserProfile } from '@/lib/student-store';
import { createClient } from '@/lib/supabase/client';

function isClientSupabaseEnabled(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(
    url &&
      !url.includes('your-project') &&
      process.env.NEXT_PUBLIC_USE_MOCK_SUPABASE !== 'true'
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    const normalizedEmail = email.trim().toLowerCase();
    const displayName = fullName.trim() || normalizedEmail.split('@')[0] || 'Học viên';
    const current = getStoredUserProfile();

    try {
      if (isClientSupabaseEnabled()) {
        const supabase = createClient();
        const origin =
          typeof window !== 'undefined' &&
          !window.location.hostname.includes('localhost') &&
          window.location.hostname !== '127.0.0.1'
            ? window.location.origin
            : process.env.NEXT_PUBLIC_APP_URL &&
              !process.env.NEXT_PUBLIC_APP_URL.includes('localhost')
            ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
            : 'https://hsk.globy.tech';

        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            emailRedirectTo: `${origin}/auth/callback`,
            data: {
              display_name: displayName,
            },
          },
        });

        if (error) {
          setErrorMsg(error.message);
          setIsLoading(false);
          return;
        }

        if (!data.session) {
          setSuccessMsg(
            'Đăng ký thành công! Vui lòng kiểm tra hộp thư email để xác nhận tài khoản rồi đăng nhập.'
          );
          setIsLoading(false);
          return;
        }

        const meRes = await fetch('/api/auth/me');
        const meJson = await meRes.json();
        const serverUser = meJson?.data?.user;
        const resolvedRole = serverUser?.role || 'student';

        saveUserProfile({
          ...current,
          id: serverUser?.id || data.user?.id || current.id,
          email: normalizedEmail,
          displayName: serverUser?.display_name || displayName,
          role: resolvedRole,
          isDemo: false,
        });

        setIsLoading(false);
        router.push(
          resolvedRole === 'admin' || resolvedRole === 'super_admin' ? '/admin' : '/onboarding'
        );
        return;
      }

      // Offline / Local Mac Mode
      const res = await fetch('/api/auth/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, display_name: displayName }),
      });
      const json = await res.json();
      const localUser = json?.data?.user;

      saveUserProfile({
        ...current,
        id: localUser?.id || `usr_${Date.now()}`,
        email: normalizedEmail,
        displayName,
        role: localUser?.role || 'student',
        isDemo: false,
      });

      setIsLoading(false);
      router.push(
        localUser?.role === 'admin' || localUser?.role === 'super_admin' ? '/admin' : '/onboarding'
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Đã có lỗi xảy ra khi đăng ký.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white font-bold text-2xl shadow-md shadow-emerald-700/20 group-hover:bg-emerald-700 transition-colors">
              <span className="font-chinese">汉</span>
            </div>
            <div className="text-left">
              <span className="text-xl font-extrabold text-gray-900 block leading-tight">
                Chinese Journey
              </span>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
                Đăng ký tài khoản mới
              </span>
            </div>
          </Link>
        </div>

        <Card className="border-gray-200 shadow-md">
          <CardHeader>
            <CardTitle>Tạo tài khoản học tập</CardTitle>
            <CardDescription>
              Bắt đầu lộ trình 12 tháng làm chủ tiếng Trung tự học từ số 0.
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

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Họ và tên
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

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
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
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
                Tiếp tục thiết lập lộ trình
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center text-xs text-gray-500">
            Đã có tài khoản?{' '}
            <Link href="/login" className="ml-1 font-bold text-emerald-700 hover:underline">
              Đăng nhập
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
