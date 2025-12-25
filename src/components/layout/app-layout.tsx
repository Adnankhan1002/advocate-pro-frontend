'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { getToken, getStoredUser } from '@/lib/auth';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { useCurrentUser } from '@/hooks/useAuth';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, setUser, setToken, setLoading, isLoading } = useAuthStore();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  
  const publicPages = ['/login', '/register'];
  const isPublicPage = publicPages.includes(pathname);

  // Only fetch current user on protected pages when token exists
  const { data: currentUser } = useCurrentUser(!isPublicPage && !!token);

  useEffect(() => {
    // Prevent multiple auth checks
    if (hasCheckedAuth) return;

    const storedToken = getToken();
    const storedUser = getStoredUser();

    // Skip auth check on public pages
    if (isPublicPage) {
      setLoading(false);
      setHasCheckedAuth(true);
      return;
    }

    if (!storedToken) {
      router.push('/login');
      setLoading(false);
      setHasCheckedAuth(true);
      return;
    }

    setToken(storedToken);
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
    setHasCheckedAuth(true);
  }, [pathname, isPublicPage]);

  useEffect(() => {
    if (currentUser && !user) {
      setUser(currentUser);
    }
  }, [currentUser, user, setUser]);

  if (isLoading && !isPublicPage) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Public pages (login, register) don't need sidebar or navbar
  if (isPublicPage) {
    return (
      <main className="w-full min-h-screen">
        {children}
      </main>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {token && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        {token && <Navbar />}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
