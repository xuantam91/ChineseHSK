import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as listUsers } from '@/app/api/admin/users/route';
import { PATCH as updateUserRole, DELETE as deleteUser } from '@/app/api/admin/users/[id]/route';
import { mockStore } from '@/lib/db/mock-store';

describe('Super Admin User & Role Management APIs', () => {
  beforeEach(() => {
    mockStore.reset();
  });

  it('GET /api/admin/users allows super_admin and rejects student with 403', async () => {
    const forbiddenReq = new NextRequest('http://localhost:3000/api/admin/users', {
      headers: { 'x-user-id': 'usr-student-01' },
    });
    const forbiddenRes = await listUsers(forbiddenReq);
    expect(forbiddenRes.status).toBe(403);

    const okReq = new NextRequest('http://localhost:3000/api/admin/users', {
      headers: { 'x-user-id': 'usr-superadmin-01' },
    });
    const okRes = await listUsers(okReq);
    expect(okRes.status).toBe(200);
    const json = await okRes.json();
    expect(json.success).toBe(true);
    expect(json.data.actor.can_manage_roles).toBe(true);
    expect(json.data.users.some((u: any) => u.email === 'xuantam91@gmail.com' && u.role === 'super_admin')).toBe(true);
  });

  it('PATCH /api/admin/users/[id] allows only super_admin to change other user roles', async () => {
    const adminReq = new NextRequest('http://localhost:3000/api/admin/users/usr-student-01', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'usr-admin-01',
      },
      body: JSON.stringify({ role: 'admin' }),
    });
    const adminRes = await updateUserRole(adminReq, {
      params: Promise.resolve({ id: 'usr-student-01' }),
    });
    expect(adminRes.status).toBe(403);

    const superReq = new NextRequest('http://localhost:3000/api/admin/users/usr-student-01', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'usr-superadmin-01',
      },
      body: JSON.stringify({ role: 'admin' }),
    });
    const superRes = await updateUserRole(superReq, {
      params: Promise.resolve({ id: 'usr-student-01' }),
    });
    expect(superRes.status).toBe(200);
    const json = await superRes.json();
    expect(json.data.role).toBe('admin');
  });

  it('DELETE /api/admin/users/[id] prevents deleting protected super admin and allows deleting other accounts', async () => {
    const selfDeleteReq = new NextRequest('http://localhost:3000/api/admin/users/usr-superadmin-01', {
      method: 'DELETE',
      headers: { 'x-user-id': 'usr-superadmin-01' },
    });
    const selfRes = await deleteUser(selfDeleteReq, {
      params: Promise.resolve({ id: 'usr-superadmin-01' }),
    });
    expect(selfRes.status).toBe(400);

    const deleteStudentReq = new NextRequest('http://localhost:3000/api/admin/users/usr-student-01', {
      method: 'DELETE',
      headers: { 'x-user-id': 'usr-superadmin-01' },
    });
    const deleteRes = await deleteUser(deleteStudentReq, {
      params: Promise.resolve({ id: 'usr-student-01' }),
    });
    expect(deleteRes.status).toBe(200);
    expect(mockStore.profiles.has('usr-student-01')).toBe(false);
  });
});
