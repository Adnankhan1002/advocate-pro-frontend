'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUpcomingHearings } from '@/hooks/useHearings';
import { useCaseStats } from '@/hooks/useCases';
import { useClientStats } from '@/hooks/useClients';
import { 
  Calendar, 
  Briefcase, 
  Users, 
  Clock, 
  ArrowRight, 
  TrendingUp,
  FileText,
  AlertCircle,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { CaseStatusChart } from '@/components/charts/CaseStatusChart';
import { MonthlyActivityChart } from '@/components/charts/MonthlyActivityChart';
import { TaskProgressChart } from '@/components/charts/TaskProgressChart';
import { CaseTypeChart } from '@/components/charts/CaseTypeChart';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    },
  },
};

const cardHoverVariants = {
  initial: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -4,
    transition: { 
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
};

const slideInVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  })
};

export default function DashboardPage() {
  const { data: upcomingHearings } = useUpcomingHearings(7);
  const { data: caseStats } = useCaseStats();
  const { data: clientStats } = useClientStats();

  const statCards = [
    {
      label: 'Total Cases',
      value: caseStats?.totalCases || 0,
      change: '+12%',
      trend: 'up',
      icon: Briefcase,
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Active Cases',
      value: caseStats?.byStatus?.in_progress || 0,
      change: '+8%',
      trend: 'up',
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      label: 'Total Clients',
      value: clientStats?.totalClients || 0,
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Upcoming Hearings',
      value: caseStats?.upcomingHearings || 0,
      change: '7 days',
      trend: 'neutral',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-[1600px] mx-auto p-2 sm:p-4 md:p-6 lg:p-8 space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-0.5 sm:space-y-1 md:space-y-2"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600">
            Welcome back. Here's your practice overview.
          </p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6"
        >
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover="hover"
                initial="initial"
              >
                <motion.div variants={cardHoverVariants}>
                  <Card className="relative overflow-hidden border-0 shadow-md shadow-slate-200/50 hover:shadow-lg hover:shadow-slate-300/50 transition-shadow duration-300 group">
                    <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
                      {/* Animated gradient background decoration */}
                      <motion.div 
                        className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16`}
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 90, 0],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      <div className="relative space-y-2 sm:space-y-3 md:space-y-4">
                        {/* Icon with pulse animation */}
                        <motion.div 
                          className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                          whileHover={{ 
                            scale: 1.1,
                            rotate: [0, -10, 10, -10, 0],
                            transition: { duration: 0.5 }
                          }}
                        >
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                        </motion.div>
                        
                        {/* Stats */}
                        <div>
                          <p className="text-[10px] sm:text-xs md:text-sm font-medium text-slate-600 mb-0.5 sm:mb-1">
                            {stat.label}
                          </p>
                          <div className="flex items-end justify-between gap-2">
                            <motion.h3 
                              className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900"
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ 
                                delay: 0.2 + index * 0.1,
                                duration: 0.5,
                                ease: [0.25, 0.46, 0.45, 0.94]
                              }}
                            >
                              {stat.value}
                            </motion.h3>
                            {stat.trend === 'up' && (
                              <motion.span 
                                className="flex items-center gap-1 text-xs sm:text-sm font-medium text-emerald-600"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                              >
                                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                                {stat.change}
                              </motion.span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {/* Upcoming Hearings - Takes 2 columns */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-md shadow-slate-200/50 h-full overflow-hidden">
              <CardHeader className="border-b border-slate-100 p-2.5 sm:p-4 md:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-sm sm:text-base md:text-lg truncate">Upcoming Hearings</CardTitle>
                    <CardDescription className="text-[10px] sm:text-xs md:text-sm">Next 7 days</CardDescription>
                  </div>
                  <Link href="/hearings" className="flex-shrink-0">
                    <Button variant="ghost" size="sm" className="gap-2 text-xs sm:text-sm">
                      <span className="hidden sm:inline">View All</span>
                      <span className="sm:hidden">All</span>
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-2 sm:p-3 md:p-4 lg:p-6">
                {upcomingHearings && upcomingHearings.length > 0 ? (
                  <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                    {upcomingHearings.slice(0, 5).map((hearing: any, idx: number) => (
                      <motion.div
                        key={idx}
                        custom={idx}
                        variants={slideInVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ scale: 1.01, x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link href={`/cases/${hearing.caseId?.id}`}>
                          <div className="group p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-slate-50 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-200 transition-all duration-200 cursor-pointer">
                            <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3">
                              {/* Date Badge */}
                              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-md sm:rounded-lg bg-white border border-slate-200 flex flex-col items-center justify-center">
                                <span className="text-[10px] sm:text-xs font-medium text-slate-600">
                                  {new Date(hearing.hearingDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                                </span>
                                <span className="text-base sm:text-lg font-bold text-slate-900">
                                  {new Date(hearing.hearingDate).getDate()}
                                </span>
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <h4 className="font-semibold text-sm sm:text-base text-slate-900 group-hover:text-slate-900 truncate">
                                    {hearing.caseId?.caseNumber}
                                  </h4>
                                  <Badge variant="secondary" className="text-[10px] sm:text-xs flex-shrink-0">
                                    {hearing.status}
                                  </Badge>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-600 mb-1.5 sm:mb-2 line-clamp-1">
                                  {hearing.caseId?.title}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {hearing.hearingTime}
                                  </span>
                                  <span className="flex items-center gap-1 truncate">
                                    ⚖️ <span className="truncate">{hearing.judge}</span>
                                  </span>
                                </div>
                              </div>

                              {/* Arrow */}
                              <motion.div
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 group-hover:text-slate-900 transition-all flex-shrink-0" />
                              </motion.div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    className="text-center py-8 sm:py-12"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div 
                      className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-slate-100 flex items-center justify-center"
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400" />
                    </motion.div>
                    <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">No upcoming hearings scheduled</p>
                    <Link href="/hearings/new">
                      <Button className="text-xs sm:text-sm h-9 sm:h-10" variant="outline">
                        Schedule Hearing
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats & Actions */}
          <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6">
            {/* Today's Summary */}
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="border-0 shadow-md shadow-slate-200/50 overflow-hidden">
                <CardHeader className="pb-2 sm:pb-3 p-2.5 sm:p-4 md:p-6">
                  <CardTitle className="text-sm sm:text-base md:text-lg">Today's Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 sm:space-y-2 md:space-y-3 p-2.5 sm:p-4 md:p-6 pt-0">
                  <motion.div 
                    className="flex items-center justify-between p-2 sm:p-2.5 md:p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-50/50 border border-emerald-100"
                    whileHover={{ scale: 1.02, x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0 flex-1">
                      <motion.div 
                        className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-md sm:rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0"
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                      </motion.div>
                      <div className="min-w-0">
                        <span className="text-[11px] sm:text-xs md:text-sm font-medium text-slate-900 block truncate">Tasks Done</span>
                        <span className="text-[9px] sm:text-[10px] md:text-xs text-emerald-600">Great progress!</span>
                      </div>
                    </div>
                    <span className="text-base sm:text-lg md:text-xl font-bold text-emerald-600 flex-shrink-0">8/12</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-between p-2 sm:p-2.5 md:p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-50/50 border border-blue-100"
                    whileHover={{ scale: 1.02, x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0 flex-1">
                      <motion.div 
                        className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-md sm:rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0"
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                      </motion.div>
                      <div className="min-w-0">
                        <span className="text-[11px] sm:text-xs md:text-sm font-medium text-slate-900 block truncate">Drafts</span>
                        <span className="text-[9px] sm:text-[10px] md:text-xs text-blue-600">In progress</span>
                      </div>
                    </div>
                    <span className="text-base sm:text-lg md:text-xl font-bold text-blue-600 flex-shrink-0">4</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-50 to-amber-50/50 border border-amber-100"
                    whileHover={{ scale: 1.02, x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <motion.div 
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0"
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        animate={{ 
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </motion.div>
                      <div className="min-w-0">
                        <span className="text-xs sm:text-sm font-medium text-slate-900 block truncate">Alerts</span>
                        <span className="text-[10px] sm:text-xs text-amber-600">Need attention</span>
                      </div>
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-amber-600 flex-shrink-0">2</span>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="border-0 shadow-md shadow-slate-200/50 overflow-hidden">
                <CardHeader className="pb-2 sm:pb-3 p-2.5 sm:p-4 md:p-6">
                  <CardTitle className="text-sm sm:text-base md:text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 sm:space-y-2 p-2.5 sm:p-4 md:p-6 pt-0">
                  <Link href="/clients/new">
                    <motion.div
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button className="w-full justify-start gap-1.5 sm:gap-2 md:gap-3 bg-slate-900 hover:bg-slate-800 text-white h-9 sm:h-10 md:h-11 text-[11px] sm:text-xs md:text-sm">
                        <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                        Add New Client
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/cases/new">
                    <motion.div
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="outline" className="w-full justify-start gap-1.5 sm:gap-2 md:gap-3 h-9 sm:h-10 md:h-11 text-[11px] sm:text-xs md:text-sm">
                        <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                        Create Case
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/hearings/new">
                    <motion.div
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="outline" className="w-full justify-start gap-1.5 sm:gap-2 md:gap-3 h-9 sm:h-10 md:h-11 text-[11px] sm:text-xs md:text-sm">
                        <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                        Schedule Hearing
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/documents">
                    <motion.div
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="outline" className="w-full justify-start gap-1.5 sm:gap-2 md:gap-3 h-9 sm:h-10 md:h-11 text-[11px] sm:text-xs md:text-sm">
                        <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                        Upload Document
                      </Button>
                    </motion.div>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Analytics Charts Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6"
        >
          <motion.h2 
            className="text-base sm:text-xl md:text-2xl font-bold text-slate-900"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Analytics
          </motion.h2>
          
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            <motion.div 
              variants={itemVariants}
              whileHover="hover"
              initial="initial"
            >
              <motion.div variants={cardHoverVariants}>
                <MonthlyActivityChart />
              </motion.div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover="hover"
              initial="initial"
            >
              <motion.div variants={cardHoverVariants}>
                <CaseStatusChart data={caseStats?.byStatus || {}} />
              </motion.div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover="hover"
              initial="initial"
            >
              <motion.div variants={cardHoverVariants}>
                <TaskProgressChart 
                  tasksDone={8}
                  tasksTotal={12}
                  drafts={4}
                  alerts={2}
                />
              </motion.div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover="hover"
              initial="initial"
            >
              <motion.div variants={cardHoverVariants}>
                <CaseTypeChart />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
