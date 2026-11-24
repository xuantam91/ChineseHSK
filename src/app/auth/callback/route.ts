import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdminRole, SUPER_ADMIN_EMAIL } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

function sanitizeNextPath(rawNext: string | null): string | null {
  if (!rawNext || !rawNext.startsWith('/') || rawNext.startsWith('//')) {
    return null;
  }
  return rawNext;
}

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl;
  const code = searchParams.get('code');
  const nextPath = sanitizeNextPath(searchParams.get('next'));

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data?.user) {
      return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
    }

    const email = (data.user.email || '').toLowerCase();
    let role: string = email === SUPER_ADMIN_EMAIL ? 'super_admin' : 'student';

    try {
      const adminClient = createAdminClient();
      const { data: profile } = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      if (email === SUPER_ADMIN_EMAIL && profile?.role !== 'super_admin') {
        await adminClient.from('profiles').upsert({
          id: data.user.id,
          email,
          display_name:
            (data.user.user_metadata?.display_name as string) || email.split('@')[0],
          role: 'super_admin',
        });
        role = 'super_admin';
      } else if (profile?.role) {
        role = profile.role;
      }
    } catch {
      // Fallback safely when service key unavailable in mock mode
    }

    const destination = nextPath || (isAdminRole(role) ? '/admin' : '/dashboard');
    return NextResponse.redirect(`${origin}${destination}`);
  } catch {
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }
}
