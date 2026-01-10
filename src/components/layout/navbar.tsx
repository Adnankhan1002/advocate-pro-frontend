'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resetApiClient } from '@/lib/api';
import { removeToken as removeAuthToken } from '@/lib/auth';

export function Navbar() {
  const router = useRouter();
  const { user, tenant, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [notificationCount] = React.useState(3); // Mock data

  const handleLogout = () => {
    logout();
    removeAuthToken();
    resetApiClient();
    router.push('/login');
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl"
    >
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6 gap-2">
        {/* Left: Menu + Search */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden flex-shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search cases, clients, documents..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Center: Logo (mobile only) */}
        <div className="lg:hidden flex-shrink-0">
          <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 whitespace-nowrap">Advocate Pro</h1>
        </div>

        {/* Right: Actions + User */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
          {/* Search icon for mobile */}
          <Button variant="ghost" size="icon" className="md:hidden flex-shrink-0">
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative flex-shrink-0">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center justify-center"
              >
                {notificationCount}
              </motion.span>
            )}
          </Button>

          {/* User Menu */}
          {user && (
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 sm:gap-2 md:gap-3 px-1.5 sm:px-2 md:px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="hidden sm:block text-right min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user.role}</p>
                </div>
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
                <ChevronDown className={`hidden sm:block h-4 w-4 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    
                    {/* Menu */}
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden"
                    >
                      {/* User info */}
                      <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <p className="font-semibold text-slate-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-slate-500 truncate">{user.email}</p>
                        <p className="text-xs text-slate-400 mt-1">{tenant?.name}</p>
                      </div>

                      {/* Menu items */}
                      <div className="p-2">
                        <button
                          onClick={() => {
                            router.push('/settings');
                            setUserMenuOpen(false);
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-700"
                        >
                          <Settings className="h-4 w-4" />
                          <span className="text-sm font-medium">Settings</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            router.push('/settings');
                            setUserMenuOpen(false);
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-700"
                        >
                          <User className="h-4 w-4" />
                          <span className="text-sm font-medium">Profile</span>
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="p-2 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
