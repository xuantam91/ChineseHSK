'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
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

        <Card className="border-gray-200 shadow-md">
          <CardHeader>
            <CardTitle>Quên mật khẩu?</CardTitle>
            <CardDescription>
              Nhập email đã đăng ký. Chúng tôi sẽ gửi liên kết đặt lại mật khẩu an toàn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center py-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1">
                  Đã gửi email khôi phục!
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto mb-4">
                  Vui lòng kiểm tra hộp thư đến của <span className="font-semibold text-gray-800">{email}</span> để làm theo hướng dẫn.
                </p>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Quay lại đăng nhập
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Email tài khoản
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

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  className="w-full mt-2"
                >
                  Gửi liên kết khôi phục
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="justify-center text-xs text-gray-500">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 font-bold text-gray-600 hover:text-emerald-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại trang đăng nhập</span>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
