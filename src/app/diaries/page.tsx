'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFollowUps, useTasks } from '@/hooks/useDiaries';
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar,
  Users,
  FileText,
  BookOpen,
  TrendingUp,
  ChevronRight,
  Filter,
  Star,
  Target,
  Zap,
  Book,
  X,
  Edit2,
  Trash2,
  Save
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

interface DiaryEntry {
  _id?: string;
  time: string;
  title: string;
  description: string;
  relatedCaseId?: string;
}

// Custom Diary Book Icon Component
const DiaryBookIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Book cover */}
    <path
      d="M12 8 L52 8 L52 56 L12 56 Z"
      fill="currentColor"
      opacity="0.9"
    />
    {/* Book spine shadow */}
    <path
      d="M12 8 L12 56 L8 56 L8 8 Z"
      fill="currentColor"
      opacity="0.6"
    />
    {/* Golden border top */}
    <path
      d="M14 10 L50 10 L50 12 L14 12 Z"
      fill="#FDB813"
      opacity="0.8"
    />
    {/* Golden border bottom */}
    <path
      d="M14 52 L50 52 L50 54 L14 54 Z"
      fill="#FDB813"
      opacity="0.8"
    />
    {/* Golden border left */}
    <path
      d="M14 10 L16 10 L16 54 L14 54 Z"
      fill="#FDB813"
      opacity="0.8"
    />
    {/* Golden border right */}
    <path
      d="M48 10 L50 10 L50 54 L48 54 Z"
      fill="#FDB813"
      opacity="0.8"
    />
    {/* Pages effect */}
    <path
      d="M52 10 L54 10 L54 54 L52 54 Z"
      fill="white"
      opacity="0.5"
    />
    <path
      d="M54 12 L55 12 L55 52 L54 52 Z"
      fill="white"
      opacity="0.3"
    />
    {/* Bookmark ribbon */}
    <path
      d="M30 8 L34 8 L34 40 L32 36 L30 40 Z"
      fill="#FDB813"
      opacity="0.9"
    />
    {/* Center ornament */}
    <circle cx="32" cy="32" r="6" fill="#FDB813" opacity="0.6" />
    <circle cx="32" cy="32" r="4" fill="currentColor" opacity="0.3" />
  </svg>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DiariesPage() {
  const { data: followUpsData } = useFollowUps('pending', '', 1, 10);
  const { data: tasksData } = useTasks('pending', 1, 10);
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'upcoming'>('all');
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState<DiaryEntry>({
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    title: '',
    description: '',
  });

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[priority] || colors.medium;
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') return <Zap className="w-3 h-3" />;
    if (priority === 'medium') return <Target className="w-3 h-3" />;
    return <Star className="w-3 h-3" />;
  };

  const handleAddEntry = () => {
    if (!newEntry.title || !newEntry.description) {
      alert('Please fill in all required fields');
      return;
    }
    const entry: DiaryEntry = {
      _id: Date.now().toString(),
      ...newEntry,
    };
    setEntries([...entries, entry]);
    setNewEntry({
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      title: '',
      description: '',
    });
    setIsAddingEntry(false);
  };

  const handleUpdateEntry = (id: string) => {
    const updatedEntries = entries.map(entry =>
      entry._id === id ? { ...entry, ...newEntry } : entry
    );
    setEntries(updatedEntries);
    setEditingEntryId(null);
    setNewEntry({
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      title: '',
      description: '',
    });
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setEntries(entries.filter(entry => entry._id !== id));
    }
  };

  const handleEditEntry = (entry: DiaryEntry) => {
    setEditingEntryId(entry._id || null);
    setNewEntry({
      time: entry.time,
      title: entry.title,
      description: entry.description,
      relatedCaseId: entry.relatedCaseId,
    });
    setIsAddingEntry(true);
  };

  const entriesPerPage = 3;
  const totalPages = Math.max(1, Math.ceil(entries.length / entriesPerPage));
  const currentEntries = entries.slice(
    currentPage * entriesPerPage,
    (currentPage + 1) * entriesPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const stats = [
    { 
      label: 'Pending Follow-ups', 
      value: followUpsData?.pagination?.total || 0,
      icon: AlertCircle,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'from-amber-50 to-orange-50',
      iconColor: 'text-amber-600'
    },
    { 
      label: 'Active Tasks', 
      value: tasksData?.pagination?.total || 0,
      icon: CheckCircle2,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50',
      iconColor: 'text-blue-600'
    },
    { 
      label: 'Completed Today', 
      value: 12,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      iconColor: 'text-green-600'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent mb-2">
              Diaries & Tasks
            </h1>
            <p className="text-slate-600 text-lg">
              Manage your follow-ups, tasks, and daily activities efficiently
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/diaries/follow-ups/new">
              <Button 
                variant="outline" 
                className="gap-2 border-2 border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Follow-up
              </Button>
            </Link>
            <Link href="/diaries/tasks/new">
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30">
                <Plus className="w-4 h-4" /> Task
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <Card className={`relative overflow-hidden border-2 border-slate-200 hover:border-slate-300 transition-all hover:shadow-xl`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-50`} />
                <CardContent className="p-6 relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                      <p className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</p>
                    </div>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Follow-ups */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 border-slate-200 shadow-xl h-full flex flex-col">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b-2 border-amber-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-900 text-xl">Pending Follow-ups</CardTitle>
                      <CardDescription className="text-amber-700">
                        {followUpsData?.pagination?.total || 0} items require attention
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-6 overflow-y-auto max-h-[500px]">
                {followUpsData?.data && followUpsData.data.length > 0 ? (
                  <div className="space-y-3">
                    {followUpsData.data.slice(0, 5).map((followUp: any, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group relative p-4 rounded-xl bg-white border-2 border-slate-200 hover:border-amber-300 hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-orange-500 rounded-l-xl" />
                        <div className="pl-3">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                              {followUp.title}
                            </h3>
                            <Badge className={`${getPriorityColor(followUp.priority)} border flex items-center gap-1`}>
                              {getPriorityIcon(followUp.priority)}
                              {followUp.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                            {followUp.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1 text-slate-500">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(followUp.dueDate)}</span>
                            </div>
                            {followUp.case && (
                              <div className="flex items-center gap-1 text-blue-600">
                                <FileText className="w-3 h-3" />
                                <span>{followUp.case.caseNumber}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-4">
                      <AlertCircle className="w-10 h-10 text-amber-500" />
                    </div>
                    <p className="text-slate-500 font-medium mb-2">No pending follow-ups</p>
                    <p className="text-sm text-slate-400">You're all caught up!</p>
                  </div>
                )}
                <Link href="/diaries/follow-ups">
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-2 border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 font-semibold"
                  >
                    View All Follow-ups
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tasks */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 border-slate-200 shadow-xl h-full flex flex-col">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-900 text-xl">Assigned Tasks</CardTitle>
                      <CardDescription className="text-blue-700">
                        {tasksData?.pagination?.total || 0} pending assignments
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-6 overflow-y-auto max-h-[500px]">
                {tasksData?.data && tasksData.data.length > 0 ? (
                  <div className="space-y-3">
                    {tasksData.data.slice(0, 5).map((task: any, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group relative p-4 rounded-xl bg-white border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-indigo-500 rounded-l-xl" />
                        <div className="pl-3">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                              {task.title}
                            </h3>
                            <Badge className={`${getPriorityColor(task.priority)} border flex items-center gap-1`}>
                              {getPriorityIcon(task.priority)}
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                            {task.description}
                          </p>
                          {task.subtasks && task.subtasks.length > 0 && (
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                                <span>Progress</span>
                                <span className="font-semibold">
                                  {task.subtasks.filter((st: any) => st.status === 'completed').length} / {task.subtasks.length}
                                </span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
                                  style={{ 
                                    width: `${(task.subtasks.filter((st: any) => st.status === 'completed').length / task.subtasks.length) * 100}%` 
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-10 h-10 text-blue-500" />
                    </div>
                    <p className="text-slate-500 font-medium mb-2">No pending tasks</p>
                    <p className="text-sm text-slate-400">Start by creating a new task</p>
                  </div>
                )}
                <Link href="/diaries/tasks">
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 font-semibold"
                  >
                    View All Tasks
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Access Cards */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-slate-600" />
            Quick Access
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="group cursor-pointer"
              onClick={() => setIsDiaryOpen(true)}
            >
              <Card className="border-2 border-slate-200 hover:border-purple-300 hover:shadow-xl transition-all h-full bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-700 to-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ring-2 ring-amber-500/30">
                      <DiaryBookIcon className="w-8 h-8 text-red-50" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all ml-auto" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1 text-lg">Daily Diary</h3>
                  <p className="text-sm text-slate-600">
                    Record daily activities and notes
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <Link href="/diaries/case-notes">
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                className="group"
              >
                <Card className="border-2 border-slate-200 hover:border-green-300 hover:shadow-xl transition-all cursor-pointer h-full bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all ml-auto" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1 text-lg">Case Notes</h3>
                    <p className="text-sm text-slate-600">
                      Add case-specific observations
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>

            <Link href="/diaries/meetings">
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                className="group"
              >
                <Card className="border-2 border-slate-200 hover:border-cyan-300 hover:shadow-xl transition-all cursor-pointer h-full bg-gradient-to-br from-cyan-50 to-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all ml-auto" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1 text-lg">Meetings</h3>
                    <p className="text-sm text-slate-600">
                      Track client meetings
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Daily Diary Book Modal */}
        <AnimatePresence>
          {isDiaryOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsDiaryOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.6, type: "spring" }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-4xl w-full"
              >
                <div className="bg-white rounded-2xl shadow-2xl border-4 border-purple-200 overflow-hidden">
                  {/* Book Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white">
                      <Book className="w-6 h-6" />
                      <div>
                        <h3 className="font-bold text-lg">Daily Diary</h3>
                        <div className="flex items-center gap-2">
                          <Input
                            type="date"
                            value={selectedDate.toISOString().split('T')[0]}
                            onChange={(e) => {
                              setSelectedDate(new Date(e.target.value));
                              setCurrentPage(0);
                            }}
                            className="text-xs h-7 bg-white/20 border-white/30 text-white max-w-[140px]"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsAddingEntry(true)}
                            className="h-7 text-white hover:bg-white/20"
                          >
                            <Plus className="w-4 h-4 mr-1" /> Add Entry
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsDiaryOpen(false)}
                      className="text-white hover:bg-white/20"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Book Pages */}
                  <div className="min-h-[500px] max-h-[600px] overflow-y-auto bg-gradient-to-br from-amber-50 to-orange-50 p-8">
                    {entries.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                        <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                          <FileText className="w-12 h-12 text-purple-500" />
                        </div>
                        <p className="text-slate-500 font-medium mb-2 text-lg">No entries yet</p>
                        <p className="text-sm text-slate-400 mb-4">Start writing your daily activities</p>
                        <Button
                          onClick={() => setIsAddingEntry(true)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          <Plus className="w-4 h-4 mr-2" /> Add First Entry
                        </Button>
                      </div>
                    ) : (
                      <motion.div
                        key={currentPage}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-6"
                      >
                        {currentEntries.map((entry, idx) => (
                          <div
                            key={entry._id}
                            className="bg-white/80 backdrop-blur border-l-4 border-purple-500 rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-purple-600" />
                                <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                                  {entry.time}
                                </Badge>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleEditEntry(entry)}
                                >
                                  <Edit2 className="w-4 h-4 text-blue-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleDeleteEntry(entry._id!)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{entry.title}</h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap font-serif">
                              {entry.description}
                            </p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Page Navigation */}
                  {entries.length > 0 && (
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 flex items-center justify-between border-t-2 border-purple-200">
                      <Button
                        variant="outline"
                        onClick={prevPage}
                        disabled={currentPage === 0}
                        className="gap-2"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        Previous
                      </Button>
                      <div className="text-sm font-medium text-slate-700">
                        Page {currentPage + 1} of {totalPages}
                      </div>
                      <Button
                        variant="outline"
                        onClick={nextPage}
                        disabled={currentPage === totalPages - 1}
                        className="gap-2"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add/Edit Entry Modal */}
        <AnimatePresence>
          {isAddingEntry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
              onClick={() => {
                setIsAddingEntry(false);
                setEditingEntryId(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-purple-600" />
                    {editingEntryId ? 'Edit Entry' : 'New Entry'}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsAddingEntry(false);
                      setEditingEntryId(null);
                    }}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Time
                    </label>
                    <Input
                      type="time"
                      value={newEntry.time}
                      onChange={(e) => setNewEntry({ ...newEntry, time: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g., Met client Sharma (Cheque bounce)"
                      value={newEntry.title}
                      onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      placeholder="Detailed notes about this activity..."
                      rows={6}
                      value={newEntry.description}
                      onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    {editingEntryId ? (
                      <Button
                        onClick={() => {
                          handleUpdateEntry(editingEntryId);
                          setIsAddingEntry(false);
                        }}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <Save className="w-4 h-4 mr-2" /> Update Entry
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          handleAddEntry();
                        }}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <Save className="w-4 h-4 mr-2" /> Save Entry
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingEntry(false);
                        setEditingEntryId(null);
                        setNewEntry({
                          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                          title: '',
                          description: '',
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
