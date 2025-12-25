'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useUpcomingHearings, useHearingCalendar, useCreateHearing, useDeleteHearing } from '@/hooks/useHearings';
import { useCases } from '@/hooks/useCases';
import { useAuthStore } from '@/store/auth';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock,
  MapPin,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Scale,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HearingsPage() {
  const { user } = useAuthStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');

  const { data: upcomingHearings } = useUpcomingHearings(30);
  const { data: calendarData } = useHearingCalendar(
    currentDate.getMonth() + 1,
    currentDate.getFullYear()
  );
  const { data: casesData } = useCases(1, 100);
  const createHearingMutation = useCreateHearing();
  const deleteHearingMutation = useDeleteHearing();

  const [formData, setFormData] = useState({
    caseId: '',
    hearingDate: '',
    hearingTime: '',
    judge: '',
    courtroom: '',
    status: 'scheduled',
    description: '',
    reminderMethod: 'both',
  });

  const canManage = user?.role === 'OWNER' || user?.role === 'ADMIN' || user?.role === 'ADVOCATE';

  const handleCreateHearing = (e: React.FormEvent) => {
    e.preventDefault();
    createHearingMutation.mutate(formData, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setFormData({
          caseId: '',
          hearingDate: '',
          hearingTime: '',
          judge: '',
          courtroom: '',
          status: 'scheduled',
          description: '',
          reminderMethod: 'both',
        });
      },
    });
  };

  const handleDeleteHearing = (hearingId: string) => {
    deleteHearingMutation.mutate(hearingId);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getHearingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return calendarData?.[dateStr] || [];
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
    completed: 'bg-green-100 text-green-700 border-green-200',
    postponed: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Hearings</h1>
            <p className="text-slate-600 mt-1">
              {upcomingHearings?.length || 0} upcoming hearings
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              onClick={() => setViewMode('calendar')}
              className="gap-2"
            >
              <CalendarIcon className="h-4 w-4" /> Calendar
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              className="gap-2"
            >
              <Briefcase className="h-4 w-4" /> List
            </Button>
            {canManage && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-slate-900 hover:bg-slate-800">
                    <Plus className="h-4 w-4" /> Schedule Hearing
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Schedule New Hearing</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateHearing} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="caseId">Case *</Label>
                        <select
                          id="caseId"
                          required
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={formData.caseId}
                          onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
                        >
                          <option value="">Select a case</option>
                          {casesData?.data?.map((caseItem: any) => (
                            <option key={caseItem._id} value={caseItem._id}>
                              {caseItem.caseNumber} - {caseItem.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hearingDate">Date *</Label>
                        <Input
                          id="hearingDate"
                          type="date"
                          required
                          value={formData.hearingDate}
                          onChange={(e) => setFormData({ ...formData, hearingDate: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hearingTime">Time *</Label>
                        <Input
                          id="hearingTime"
                          type="time"
                          required
                          value={formData.hearingTime}
                          onChange={(e) => setFormData({ ...formData, hearingTime: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="judge">Judge</Label>
                        <Input
                          id="judge"
                          placeholder="Honorable..."
                          value={formData.judge}
                          onChange={(e) => setFormData({ ...formData, judge: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="courtroom">Courtroom</Label>
                        <Input
                          id="courtroom"
                          placeholder="Room number"
                          value={formData.courtroom}
                          onChange={(e) => setFormData({ ...formData, courtroom: e.target.value })}
                        />
                      </div>

                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                          id="description"
                          rows={3}
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          placeholder="Hearing description or notes..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>

                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="reminderMethod">Reminder Method</Label>
                        <select
                          id="reminderMethod"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={formData.reminderMethod}
                          onChange={(e) => setFormData({ ...formData, reminderMethod: e.target.value })}
                        >
                          <option value="both">Email & SMS</option>
                          <option value="email">Email Only</option>
                          <option value="sms">SMS Only</option>
                          <option value="none">No Reminder</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createHearingMutation.isPending}
                      >
                        {createHearingMutation.isPending ? 'Scheduling...' : 'Schedule Hearing'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </motion.div>

        {viewMode === 'calendar' ? (
          /* Calendar View */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Calendar Header */}
            <Card className="max-w-5xl mx-auto">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" onClick={previousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="text-lg">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1.5">
                  {/* Day Headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-slate-600 py-1.5">
                      {day}
                    </div>
                  ))}

                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square max-h-20" />
                  ))}

                  {/* Calendar Days */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const date = new Date(year, month, day);
                    const hearings = getHearingsForDate(date);
                    const isToday = 
                      date.getDate() === new Date().getDate() &&
                      date.getMonth() === new Date().getMonth() &&
                      date.getFullYear() === new Date().getFullYear();

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(date)}
                        className={`
                          aspect-square max-h-20 p-1.5 rounded-md border text-left transition-all text-xs
                          ${isToday ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200 hover:border-slate-400'}
                          ${hearings.length > 0 ? 'bg-gradient-to-br from-purple-50 to-blue-50' : 'bg-white'}
                          hover:shadow-md
                        `}
                      >
                        <div className="text-xs font-semibold text-slate-900">{day}</div>
                        {hearings.length > 0 && (
                          <div className="mt-0.5 space-y-0.5">
                            {hearings.slice(0, 1).map((hearing: any, idx: number) => (
                              <div
                                key={idx}
                                className="text-[9px] bg-purple-600 text-white px-0.5 py-0.5 rounded truncate"
                              >
                                {hearing.hearingTime}
                              </div>
                            ))}
                            {hearings.length > 1 && (
                              <div className="text-[9px] text-purple-600 font-medium">
                                +{hearings.length - 1}
                              </div>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Selected Date Details */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-purple-600" />
                    Hearings on {formatDate(selectedDate)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getHearingsForDate(selectedDate).length > 0 ? (
                    <div className="space-y-3">
                      {getHearingsForDate(selectedDate).map((hearing: any) => (
                        <div
                          key={hearing._id}
                          className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="bg-white">
                                  {hearing.caseId?.caseNumber}
                                </Badge>
                                <Badge variant="outline" className={statusColors[hearing.status]}>
                                  {hearing.status}
                                </Badge>
                              </div>
                              <h4 className="font-semibold text-slate-900 mb-2">
                                {hearing.caseId?.title}
                              </h4>
                              <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5 text-purple-600" />
                                  {hearing.hearingTime}
                                </div>
                                {hearing.judge && (
                                  <div className="flex items-center gap-1">
                                    <Scale className="h-3.5 w-3.5 text-purple-600" />
                                    {hearing.judge}
                                  </div>
                                )}
                                {hearing.courtroom && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5 text-purple-600" />
                                    {hearing.courtroom}
                                  </div>
                                )}
                              </div>
                            </div>
                            {canManage && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogTitle>Delete Hearing</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this hearing?
                                  </AlertDialogDescription>
                                  <div className="flex gap-2 justify-end">
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleDeleteHearing(hearing._id);
                                      }}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </div>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-slate-500 py-8">No hearings scheduled for this date</p>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        ) : (
          /* List View */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Hearings (Next 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingHearings && upcomingHearings.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingHearings.map((hearing: any) => (
                      <div
                        key={hearing._id}
                        className="p-4 rounded-lg bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="bg-white">
                                {hearing.caseId?.caseNumber}
                              </Badge>
                              <Badge variant="outline" className={statusColors[hearing.status]}>
                                {hearing.status}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-slate-900 mb-2">
                              {hearing.caseId?.title}
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-3.5 w-3.5 text-slate-500" />
                                {formatDate(hearing.hearingDate)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-slate-500" />
                                {hearing.hearingTime}
                              </div>
                              {hearing.judge && (
                                <div className="flex items-center gap-1">
                                  <Scale className="h-3.5 w-3.5 text-slate-500" />
                                  {hearing.judge}
                                </div>
                              )}
                              {hearing.courtroom && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                                  {hearing.courtroom}
                                </div>
                              )}
                            </div>
                          </div>
                          {canManage && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogTitle>Delete Hearing</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this hearing?
                                </AlertDialogDescription>
                                <div className="flex gap-2 justify-end">
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleDeleteHearing(hearing._id);
                                    }}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </div>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-500 py-12">No upcoming hearings scheduled</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
