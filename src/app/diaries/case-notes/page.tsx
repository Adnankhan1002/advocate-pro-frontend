'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Plus,
  Search,
  Tag,
  Save,
  Trash2,
  Edit2,
  ChevronLeft,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface CaseNote {
  _id?: string;
  caseId: string;
  caseNumber: string;
  caseTitle: string;
  noteTitle: string;
  note: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default function CaseNotesPage() {
  const [notes, setNotes] = useState<CaseNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<CaseNote[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newNote, setNewNote] = useState<Partial<CaseNote>>({
    noteTitle: '',
    note: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  // Fetch case notes
  useEffect(() => {
    // TODO: Fetch from API
    // For now, using mock data
    setNotes([]);
    setFilteredNotes([]);
  }, []);

  // Filter notes based on search and tags
  useEffect(() => {
    let filtered = notes;

    if (searchQuery) {
      filtered = filtered.filter(
        (note) =>
          note.noteTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.caseNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((note) =>
        selectedTags.every((tag) => note.tags.includes(tag))
      );
    }

    setFilteredNotes(filtered);
  }, [notes, searchQuery, selectedTags]);

  const handleAddTag = () => {
    if (tagInput && !newNote.tags?.includes(tagInput)) {
      setNewNote({
        ...newNote,
        tags: [...(newNote.tags || []), tagInput],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewNote({
      ...newNote,
      tags: newNote.tags?.filter((t) => t !== tag) || [],
    });
  };

  const handleSaveNote = () => {
    if (!newNote.noteTitle || !newNote.note) {
      alert('Please fill in all required fields');
      return;
    }

    // TODO: API call to save note
    const note: CaseNote = {
      _id: Date.now().toString(),
      caseId: 'mock-case-id',
      caseNumber: 'CASE/2025/001',
      caseTitle: 'Mock Case',
      noteTitle: newNote.noteTitle,
      note: newNote.note,
      tags: newNote.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (editingNoteId) {
      setNotes(notes.map((n) => (n._id === editingNoteId ? note : n)));
    } else {
      setNotes([note, ...notes]);
    }

    setNewNote({ noteTitle: '', note: '', tags: [] });
    setIsAddingNote(false);
    setEditingNoteId(null);
  };

  const handleEditNote = (note: CaseNote) => {
    setEditingNoteId(note._id || null);
    setNewNote({
      noteTitle: note.noteTitle,
      note: note.note,
      tags: note.tags,
    });
    setIsAddingNote(true);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      // TODO: API call to delete note
      setNotes(notes.filter((note) => note._id !== id));
    }
  };

  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags)));

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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent">
                Case Notes
              </h1>
              <p className="text-slate-600">Private legal strategy and case observations</p>
            </div>
          </div>
          <Button
            onClick={() => setIsAddingNote(true)}
            className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Plus className="w-4 h-4" /> Add Note
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search notes by title, content, or case number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => {
                  if (selectedTags.includes(tag)) {
                    setSelectedTags(selectedTags.filter((t) => t !== tag));
                  } else {
                    setSelectedTags([...selectedTags, tag]);
                  }
                }}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Add/Edit Note Form */}
        {isAddingNote && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-green-200 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingNoteId ? 'Edit Note' : 'New Note'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Note Title <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g., Judge is strict on delays – avoid adjournment"
                  value={newNote.noteTitle}
                  onChange={(e) => setNewNote({ ...newNote, noteTitle: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Note Content <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Detailed private notes about strategy, observations, or thinking..."
                  rows={6}
                  value={newNote.note}
                  onChange={(e) => setNewNote({ ...newNote, note: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add tag (e.g., strategy, cross-exam)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button onClick={handleAddTag} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {newNote.tags?.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveNote}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Save className="w-4 h-4 mr-2" /> {editingNoteId ? 'Update' : 'Save'} Note
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingNote(false);
                    setEditingNoteId(null);
                    setNewNote({ noteTitle: '', note: '', tags: [] });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Notes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-green-500" />
              </div>
              <p className="text-slate-500 font-medium mb-2">
                {searchQuery || selectedTags.length > 0 ? 'No notes found' : 'No case notes yet'}
              </p>
              <p className="text-sm text-slate-400">
                {searchQuery || selectedTags.length > 0
                  ? 'Try adjusting your search or filters'
                  : 'Click "Add Note" to start recording private case observations'}
              </p>
            </div>
          ) : (
            filteredNotes.map((note, idx) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="border-2 border-slate-200 hover:border-green-300 hover:shadow-lg transition-all h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{note.noteTitle}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Badge variant="outline" className="text-xs">
                            {note.caseNumber}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            {note.updatedAt && formatDate(note.updatedAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditNote(note)}>
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(note._id!)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-3 whitespace-pre-wrap">
                      {note.note}
                    </p>
                    {note.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {note.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
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
