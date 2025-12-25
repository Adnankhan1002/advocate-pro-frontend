 'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Plus,
  Calendar,
  Clock,
  Save,
  Trash2,
  Edit2,
  ChevronLeft,
  MapPin,
  Phone,
  Video,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface Meeting {
  _id?: string;
  clientId: string;
  clientName: string;
  caseId?: string;
  caseNumber?: string;
  meetingDateTime: Date;
  agenda: string;
  notes?: string;
  followUpRequired: boolean;
  mode?: 'office' | 'phone' | 'video_call' | 'court_meeting';
  status?: 'scheduled' | 'completed' | 'cancelled';
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isAddingMeeting, setIsAddingMeeting] = useState(false);
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({
    clientName: '',
    agenda: '',
    notes: '',
    followUpRequired: false,
    mode: 'office',
    meetingDateTime: new Date(),
    status: 'scheduled',
  });

  // Fetch meetings
  useEffect(() => {
    // TODO: Fetch from API based on selectedDate
    // For now, using mock data
    setMeetings([]);
  }, [selectedDate]);

  const handleSaveMeeting = () => {
    if (!newMeeting.clientName || !newMeeting.agenda || !newMeeting.meetingDateTime) {
      alert('Please fill in all required fields');
      return;
    }

    // TODO: API call to save meeting
    const meeting: Meeting = {
      _id: Date.now().toString(),
      clientId: 'mock-client-id',
      clientName: newMeeting.clientName!,
      agenda: newMeeting.agenda!,
      notes: newMeeting.notes,
      followUpRequired: newMeeting.followUpRequired || false,
      mode: newMeeting.mode || 'office',
      meetingDateTime: newMeeting.meetingDateTime!,
      status: newMeeting.status || 'scheduled',
    };

    if (editingMeetingId) {
      setMeetings(meetings.map((m) => (m._id === editingMeetingId ? meeting : m)));
    } else {
      setMeetings([...meetings, meeting]);
    }

    setNewMeeting({
      clientName: '',
      agenda: '',
      notes: '',
      followUpRequired: false,
      mode: 'office',
      meetingDateTime: new Date(),
      status: 'scheduled',
    });
    setIsAddingMeeting(false);
    setEditingMeetingId(null);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeetingId(meeting._id || null);
    setNewMeeting({
      clientName: meeting.clientName,
      agenda: meeting.agenda,
      notes: meeting.notes,
      followUpRequired: meeting.followUpRequired,
      mode: meeting.mode,
      meetingDateTime: meeting.meetingDateTime,
      status: meeting.status,
    });
    setIsAddingMeeting(true);
  };

  const handleDeleteMeeting = (id: string) => {
    if (confirm('Are you sure you want to delete this meeting?')) {
      // TODO: API call to delete meeting
      setMeetings(meetings.filter((meeting) => meeting._id !== id));
    }
  };

  const getModeIcon = (mode?: string) => {
    switch (mode) {
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'video_call':
        return <Video className="w-4 h-4" />;
      case 'court_meeting':
        return <Users className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getModeColor = (mode?: string) => {
    switch (mode) {
      case 'phone':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'video_call':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'court_meeting':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const filteredMeetings = meetings.filter((meeting) => {
    const meetingDate = new Date(meeting.meetingDateTime);
    return (
      meetingDate.getDate() === selectedDate.getDate() &&
      meetingDate.getMonth() === selectedDate.getMonth() &&
      meetingDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/diaries">
              <Button variant="outline" size="icon">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Meetings
              </h1>
              <p className="text-slate-600">Schedule and track client meetings</p>
            </div>
          </div>
          <Button
            onClick={() => setIsAddingMeeting(true)}
            className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
          >
            <Plus className="w-4 h-4" /> Schedule Meeting
          </Button>
        </div>

        {/* Date Picker */}
        <Card className="border-2 border-cyan-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Calendar className="w-6 h-6 text-cyan-600" />
              <Input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="max-w-xs"
              />
              <span className="text-lg font-semibold text-slate-900">
                {formatDate(selectedDate)}
              </span>
              <Badge variant="outline" className="ml-auto">
                {filteredMeetings.length} meeting{filteredMeetings.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Meeting Form */}
        {isAddingMeeting && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-cyan-200 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingMeetingId ? 'Edit Meeting' : 'New Meeting'}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Client name"
                    value={newMeeting.clientName}
                    onChange={(e) => setNewMeeting({ ...newMeeting, clientName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Meeting Mode
                  </label>
                  <select
                    className="w-full border border-slate-300 rounded-md p-2"
                    value={newMeeting.mode}
                    onChange={(e) =>
                      setNewMeeting({
                        ...newMeeting,
                        mode: e.target.value as Meeting['mode'],
                      })
                    }
                  >
                    <option value="office">Office</option>
                    <option value="phone">Phone</option>
                    <option value="video_call">Video Call</option>
                    <option value="court_meeting">Court Meeting</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date & Time <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="datetime-local"
                    value={
                      newMeeting.meetingDateTime
                        ? new Date(newMeeting.meetingDateTime).toISOString().slice(0, 16)
                        : ''
                    }
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, meetingDateTime: new Date(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    className="w-full border border-slate-300 rounded-md p-2"
                    value={newMeeting.status}
                    onChange={(e) =>
                      setNewMeeting({
                        ...newMeeting,
                        status: e.target.value as Meeting['status'],
                      })
                    }
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Agenda <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Meeting purpose or agenda"
                  value={newMeeting.agenda}
                  onChange={(e) => setNewMeeting({ ...newMeeting, agenda: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                <Textarea
                  placeholder="Discussion points, decisions, or follow-up items..."
                  rows={4}
                  value={newMeeting.notes}
                  onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="followUp"
                  checked={newMeeting.followUpRequired}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, followUpRequired: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="followUp" className="text-sm text-slate-700">
                  Follow-up required
                </label>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveMeeting}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" /> {editingMeetingId ? 'Update' : 'Save'} Meeting
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingMeeting(false);
                    setEditingMeetingId(null);
                    setNewMeeting({
                      clientName: '',
                      agenda: '',
                      notes: '',
                      followUpRequired: false,
                      mode: 'office',
                      meetingDateTime: new Date(),
                      status: 'scheduled',
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Meetings List */}
        <div className="space-y-4">
          {filteredMeetings.length === 0 ? (
            <Card className="border-2 border-slate-200">
              <CardContent className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-cyan-500" />
                </div>
                <p className="text-slate-500 font-medium mb-2">No meetings scheduled</p>
                <p className="text-sm text-slate-400">
                  Click "Schedule Meeting" to add a new meeting
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredMeetings.map((meeting, idx) => (
              <motion.div
                key={meeting._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="border-2 border-slate-200 hover:border-cyan-300 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-slate-900 text-lg">
                            {meeting.clientName}
                          </h3>
                          {meeting.followUpRequired && (
                            <Badge variant="outline" className="text-amber-700 border-amber-300">
                              Follow-up Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-slate-600 mb-3">{meeting.agenda}</p>
                        {meeting.notes && (
                          <p className="text-sm text-slate-500 mb-3 whitespace-pre-wrap">
                            {meeting.notes}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-slate-600">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(meeting.meetingDateTime).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })}
                            </span>
                          </div>
                          <Badge className={`${getModeColor(meeting.mode)} border flex items-center gap-1`}>
                            {getModeIcon(meeting.mode)}
                            {meeting.mode?.replace('_', ' ')}
                          </Badge>
                          {meeting.status === 'completed' && (
                            <Badge className="bg-green-100 text-green-700 border-green-200 border flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditMeeting(meeting)}
                        >
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMeeting(meeting._id!)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
