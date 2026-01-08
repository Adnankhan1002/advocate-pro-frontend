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
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
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
      <div className="max-w-[1600px] mx-auto p-6 lg:p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">
            Dashboard
          </h1>
          <p className="text-lg text-slate-600">
            Welcome back. Here's your practice overview.
          </p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="relative overflow-hidden border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
                  <CardContent className="p-6">
                    {/* Gradient background decoration */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300`} />
                    
                    <div className="relative space-y-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      
                      {/* Stats */}
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">
                          {stat.label}
                        </p>
                        <div className="flex items-end justify-between">
                          <h3 className="text-4xl font-bold text-slate-900">
                            {stat.value}
                          </h3>
                          {stat.trend === 'up' && (
                            <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                              <TrendingUp className="h-4 w-4" />
                              {stat.change}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Hearings - Takes 2 columns */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-lg shadow-slate-200/50 h-full">
              <CardHeader className="border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Upcoming Hearings</CardTitle>
                    <CardDescription>Next 7 days of court appearances</CardDescription>
                  </div>
                  <Link href="/hearings">
                    <Button variant="ghost" size="sm" className="gap-2">
                      View All
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {upcomingHearings && upcomingHearings.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingHearings.slice(0, 5).map((hearing: any, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Link href={`/cases/${hearing.caseId?.id}`}>
                          <div className="group p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-200 transition-all duration-200 cursor-pointer">
                            <div className="flex items-start gap-4">
                              {/* Date Badge */}
                              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center">
                                <span className="text-xs font-medium text-slate-600">
                                  {new Date(hearing.hearingDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                                </span>
                                <span className="text-lg font-bold text-slate-900">
                                  {new Date(hearing.hearingDate).getDate()}
                                </span>
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-slate-900 group-hover:text-slate-900">
                                    {hearing.caseId?.caseNumber}
                                  </h4>
                                  <Badge variant="secondary" className="text-xs">
                                    {hearing.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-600 mb-2 line-clamp-1">
                                  {hearing.caseId?.title}
                                </p>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {hearing.hearingTime}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    ⚖️ {hearing.judge}
                                  </span>
                                </div>
                              </div>

                              {/* Arrow */}
                              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all flex-shrink-0" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                      <Calendar className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500">No upcoming hearings scheduled</p>
                    <Link href="/hearings/new">
                      <Button className="mt-4" variant="outline">
                        Schedule Hearing
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats & Actions */}
          <div className="space-y-6">
            {/* Today's Summary */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg shadow-slate-200/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Today's Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-50/50 border border-emerald-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-900 block">Tasks Done</span>
                        <span className="text-xs text-emerald-600">Great progress!</span>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-emerald-600">8/12</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-50/50 border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-900 block">Drafts</span>
                        <span className="text-xs text-blue-600">In progress</span>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-blue-600">4</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-50 to-amber-50/50 border border-amber-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-900 block">Alerts</span>
                        <span className="text-xs text-amber-600">Need attention</span>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-amber-600">2</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg shadow-slate-200/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/clients/new">
                    <Button className="w-full justify-start gap-3 bg-slate-900 hover:bg-slate-800 text-white h-11">
                      <Plus className="h-4 w-4" />
                      Add New Client
                    </Button>
                  </Link>
                  <Link href="/cases/new">
                    <Button variant="outline" className="w-full justify-start gap-3 h-11">
                      <Plus className="h-4 w-4" />
                      Create Case
                    </Button>
                  </Link>
                  <Link href="/hearings/new">
                    <Button variant="outline" className="w-full justify-start gap-3 h-11">
                      <Plus className="h-4 w-4" />
                      Schedule Hearing
                    </Button>
                  </Link>
                  <Link href="/documents">
                    <Button variant="outline" className="w-full justify-start gap-3 h-11">
                      <FileText className="h-4 w-4" />
                      Upload Document
                    </Button>
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
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
          
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}>
              <MonthlyActivityChart />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <CaseStatusChart data={caseStats?.byStatus || {}} />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <TaskProgressChart 
                tasksDone={8}
                tasksTotal={12}
                drafts={4}
                alerts={2}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <CaseTypeChart />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
