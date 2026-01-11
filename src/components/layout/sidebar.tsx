'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store/ui';
import { useAuthStore } from '@/store/auth';
import { motion, Variants } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  FileText,
  Book,
  CreditCard,
  FileEdit,
  Scale,
  BookOpen,
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Cases', href: '/cases', icon: Briefcase },
  { label: 'Clients', href: '/clients', icon: Users },
  { label: 'Hearings', href: '/hearings', icon: Calendar },
  { label: 'Documents', href: '/documents', icon: FileText },
  { label: 'Diaries', href: '/diaries', icon: Book },
  { label: 'Constitution Articles', href: '/articles', icon: BookOpen },
  { label: 'Subscription', href: '/subscription', icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, tenant } = useAuthStore();

  const sidebarVariants: Variants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    closed: {
      x: -280,
      opacity: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  return (
    <>
      {/* Sidebar backdrop on mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial={sidebarOpen ? 'open' : 'closed'}
        animate={sidebarOpen ? 'open' : 'closed'}
        className="fixed left-0 top-0 z-40 h-screen w-72 bg-slate-900 border-r border-slate-800 flex flex-col overflow-hidden lg:relative lg:z-0"
      >
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 border-b border-slate-800"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Advocate Pro</h1>
              {tenant && (
                <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[180px]">
                  {tenant.name}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-lg shadow-slate-900/50'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-amber-400' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-400 rounded-r-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* User Profile Section */}
        {user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 border-t border-slate-800"
          >
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/50">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 flex items-center justify-center text-white font-semibold border border-slate-700">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-slate-400 truncate">{user.role}</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.aside>
    </>
  );
}
