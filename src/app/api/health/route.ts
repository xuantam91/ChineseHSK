import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'chinese-learning-journey-api',
    environment: process.env.NODE_ENV || 'development',
    version: '0.1.0',
    timezone: 'Asia/Ho_Chi_Minh',
  });
}
