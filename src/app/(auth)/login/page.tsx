'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 600);
  };

  const fillDemoStudent = () => {
    setEmail('student.demo@chinese-journey.edu.vn');
    setPassword('DemoStudent123!');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@chinese-journey.edu.vn');
    setPassword('AdminMasterSecret123!');
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
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
                Đăng nhập hệ thống
              </span>
            </div>
          </Link>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="mb-4 p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-100 text-xs">
          <div className="font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
            <span>⚡ Tài khoản thử nghiệm nhanh [DEMO]:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={fillDemoStudent}
              className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 text-emerald-800 font-medium hover:bg-emerald-100 transition-colors shadow-2xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Học viên Demo</span>
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 text-emerald-800 font-medium hover:bg-emerald-100 transition-colors shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <Card className="border-gray-200 shadow-md">
          <CardHeader>
            <CardTitle>Đăng nhập tài khoản</CardTitle>
            <CardDescription>
              Nhập email và mật khẩu để tiếp tục lộ trình học tập của bạn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
