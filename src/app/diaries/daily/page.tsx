'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Plus,
  Clock,
  FileText,
  Save,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Book,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface DiaryEntry {
  _id?: string;
  time: string;
  title: string;
  description: string;
  relatedCaseId?: string;
}

export default function DailyDiaryPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState<DiaryEntry>({
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    title: '',
    description: '',
  });

  // Fetch diary entries for selected date
  useEffect(() => {
    // TODO: Fetch from API
    // For now, using mock data
    setEntries([]);
  }, [selectedDate]);

  const handleAddEntry = () => {
    if (!newEntry.title || !newEntry.description) {
      alert('Please fill in all required fields');
      return;
    }

    // TODO: API call to save entry
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
    // TODO: API call to update entry
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
      // TODO: API call to delete entry
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 p-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-pink-500 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/diaries">
              <Button variant="outline" size="icon" className="bg-white/80 backdrop-blur">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                <BookOpen className="w-10 h-10 text-purple-600" />
                Daily Diary
              </h1>
              <p className="text-slate-600">Record daily activities and notes</p>
            </div>
          </div>
        </div>

        {/* Date Selector & Controls */}
        <div className="flex items-center gap-4 justify-between bg-white/80 backdrop-blur border-2 border-purple-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-4">
            <Calendar className="w-6 h-6 text-purple-600" />
            <Input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => {
                setSelectedDate(new Date(e.target.value));
                setCurrentPage(0);
              }}
              className="max-w-xs"
            />
            <span className="text-lg font-semibold text-slate-900">
              {formatDate(selectedDate)}
            </span>
          </div>
          <Button
            onClick={() => setIsAddingEntry(true)}
            className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
          >
            <Plus className="w-4 h-4" /> New Entry
          </Button>
        </div>

        {/* Add/Edit Entry Modal */}
        <AnimatePresence>
          {isAddingEntry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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

        {/* Diary Book */}
        <div className="flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!isBookOpen ? (
              // Closed Book
              <motion.div
                key="closed-book"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.5 }}
                className="relative cursor-pointer group"
                onClick={() => setIsBookOpen(true)}
              >
                <div className="relative w-80 h-96 bg-gradient-to-br from-purple-800 via-purple-700 to-pink-700 rounded-r-xl shadow-2xl transform transition-transform group-hover:scale-105">
                  {/* Book spine */}
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-purple-900 to-purple-800 rounded-l-xl border-r-2 border-purple-600" />
                  
                  {/* Book cover design */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                    <BookOpen className="w-24 h-24 text-white/90 mb-4" />
                    <h2 className="text-3xl font-bold text-white text-center mb-2">
                      Daily Diary
                    </h2>
                    <p className="text-white/80 text-center text-sm">
                      {formatDate(selectedDate)}
                    </p>
                    <div className="mt-8 px-6 py-2 bg-white/20 backdrop-blur rounded-lg border border-white/30">
                      <p className="text-white text-sm font-medium">Click to Open</p>
                    </div>
                  </div>

                  {/* Book pages effect */}
                  <div className="absolute right-0 top-2 bottom-2 w-2 bg-white/30 rounded-r-lg" />
                  <div className="absolute right-0.5 top-3 bottom-3 w-1.5 bg-white/20 rounded-r-lg" />
                </div>
              </motion.div>
            ) : (
              // Open Book
              <motion.div
                key="open-book"
                initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl shadow-2xl border-4 border-purple-200 overflow-hidden">
                  {/* Book Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white">
                      <Book className="w-6 h-6" />
                      <div>
                        <h3 className="font-bold text-lg">Daily Diary</h3>
                        <p className="text-sm text-white/80">{formatDate(selectedDate)}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsBookOpen(false)}
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
                        <ChevronLeft className="w-4 h-4" />
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
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
