'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCaseDocuments, useDeleteDocument, useUploadDocument } from '@/hooks/useDocuments';
import { 
  Plus, 
  Search, 
  Trash2, 
  Download, 
  FileText,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Building,
  Calendar,
  User,
  File,
  Eye,
  Folder,
  FolderOpen,
  Upload,
  X,
} from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const documentVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
};

export default function DocumentsPage() {
  const [search, setSearch] = useState('');
  const [expandedCases, setExpandedCases] = useState<Set<string>>(new Set());
  const [uploadingCaseId, setUploadingCaseId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDocType, setUploadDocType] = useState('Other');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: caseDocumentsData, isLoading } = useCaseDocuments();
  const deleteDocumentMutation = useDeleteDocument();
  const uploadDocumentMutation = useUploadDocument();

  const toggleCase = (caseId: string) => {
    setExpandedCases(prev => {
      const newSet = new Set(prev);
      if (newSet.has(caseId)) {
        newSet.delete(caseId);
      } else {
        newSet.add(caseId);
      }
      return newSet;
    });
  };

  const handleDeleteDocument = async (documentId: string, documentTitle: string) => {
    try {
      await deleteDocumentMutation.mutateAsync(documentId);
      toast.success(`Document "${documentTitle}" deleted successfully`);
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const handleDownloadDocument = async (documentId: string, documentTitle: string) => {
    try {
      // Download logic here
      toast.success(`Downloading ${documentTitle}...`);
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  const openUploadDialog = (caseId: string) => {
    setUploadingCaseId(caseId);
    setSelectedFile(null);
    setUploadTitle('');
    setUploadDocType('Other');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!uploadTitle) {
        setUploadTitle(file.name);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadingCaseId) {
      toast.error('Please select a file');
      return;
    }

    try {
      await uploadDocumentMutation.mutateAsync({
        file: selectedFile,
        caseId: uploadingCaseId,
        title: uploadTitle,
        documentType: uploadDocType,
      });
      toast.success('Document uploaded successfully!');
      setUploadingCaseId(null);
      setSelectedFile(null);
      setUploadTitle('');
    } catch (error) {
      toast.error('Failed to upload document');
    }
  };

  const filteredCases = caseDocumentsData?.data?.filter((caseItem: any) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      caseItem.caseNumber?.toLowerCase().includes(searchLower) ||
      caseItem.title?.toLowerCase().includes(searchLower) ||
      caseItem.clientId?.firstName?.toLowerCase().includes(searchLower) ||
      caseItem.clientId?.lastName?.toLowerCase().includes(searchLower)
    );
  }) || [];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDocumentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Bail Application': 'bg-blue-100 text-blue-700 border-blue-200',
      'Legal Notice': 'bg-amber-100 text-amber-700 border-amber-200',
      'Petition': 'bg-purple-100 text-purple-700 border-purple-200',
      'Affidavit': 'bg-green-100 text-green-700 border-green-200',
      'Contract': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
                Case Documents
              </h1>
              <p className="text-slate-600 mt-2">
                Documents organized by case with client information
              </p>
            </div>
            <Link href="/documents/generate">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 h-8 px-2 text-xs sm:h-10 sm:px-4 sm:text-sm">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Generate Document</span>
                <span className="sm:hidden">Generate</span>
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Search by case number, title, or client name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 py-6 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Cases List */}
        {filteredCases.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <File className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Cases Found</h3>
            <p className="text-slate-500">
              {search ? 'Try adjusting your search query' : 'Start by creating a case and generating documents'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
          >
            {filteredCases.map((caseItem: any) => {
              const isExpanded = expandedCases.has(caseItem._id);
              const client = caseItem.clientId;
              const documents = caseItem.documents || [];

              return (
                <motion.div key={caseItem._id} variants={itemVariants}>
                  <div className="relative group h-full">
                    {/* Compact Square Folder Design */}
                    <div 
                      className="cursor-pointer h-full"
                      onClick={() => toggleCase(caseItem._id)}
                    >
                      {/* Folder Structure */}
                      <div className="relative h-full flex flex-col">
                        {/* Folder Tab (Top flap) */}
                        <div className="relative z-10">
                          <div className={`h-6 w-20 rounded-t-md transition-all duration-300 border-2 border-b-0 ${
                            isExpanded 
                              ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 border-amber-600' 
                              : 'bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 border-amber-500'
                          }`}>
                            <div className="flex items-center justify-center h-full px-1">
                              <span className="text-[9px] font-bold text-amber-900 truncate uppercase tracking-wide">
                                {caseItem.caseType}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Main Folder Body - Square Shape */}
                        <div className={`relative -mt-1 rounded-lg rounded-tl-none transition-all duration-300 border-2 overflow-hidden shadow-lg flex-1 flex flex-col ${
                          isExpanded 
                            ? 'bg-gradient-to-br from-yellow-300 via-amber-300 to-yellow-400 border-amber-600' 
                            : 'bg-gradient-to-br from-yellow-200 via-amber-200 to-yellow-300 border-amber-500'
                        }`} style={{ minHeight: '200px' }}>
                          {/* Document Previews Sticking Out (when folder has docs and not expanded) */}
                          {!isExpanded && documents.length > 0 && (
                            <div className="absolute top-0 right-1 -mt-1 flex gap-0.5">
                              {documents.slice(0, 2).map((doc: any, idx: number) => {
                                const colors = [
                                  'from-red-400 to-red-500',
                                  'from-blue-400 to-blue-500',
                                ];
                                return (
                                  <div
                                    key={doc._id}
                                    className={`w-8 h-12 rounded-sm bg-gradient-to-br ${colors[idx]} border border-white shadow-md`}
                                    style={{
                                      transform: `rotate(${idx * -5}deg) translateY(${idx * 1}px)`,
                                      zIndex: 2 - idx
                                    }}
                                  >
                                    <div className="p-0.5 flex flex-col items-center justify-center h-full">
                                      <FileText className="w-3 h-3 text-white" />
                                      <div className="w-full h-[2px] bg-white/30 rounded mt-0.5"></div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Folder Content Area */}
                          <div className="p-2.5 relative z-20 bg-gradient-to-b from-transparent to-yellow-50/40 flex-1 flex flex-col">
                            <div className="flex-1 flex flex-col">
                              {/* Folder Icon */}
                              <div className="flex justify-center mb-2">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-md transition-all border-2 border-white ${
                                  isExpanded 
                                    ? 'bg-gradient-to-br from-amber-500 to-yellow-600' 
                                    : 'bg-gradient-to-br from-amber-400 to-yellow-500'
                                }`}>
                                  {isExpanded ? (
                                    <FolderOpen className="w-6 h-6 text-white drop-shadow" />
                                  ) : (
                                    <Folder className="w-6 h-6 text-white drop-shadow" />
                                  )}
                                </div>
                              </div>

                              {/* Case Info - Compact */}
                              <div className="text-center mb-2">
                                <h3 className="text-sm font-bold text-amber-950 mb-0.5 truncate">
                                  {caseItem.caseNumber}
                                </h3>
                                <p className="text-[10px] text-amber-900 font-medium line-clamp-2 mb-1.5">
                                  {caseItem.title}
                                </p>
                                <Badge 
                                  variant="outline" 
                                  className={`text-[9px] font-bold shadow-sm px-1.5 py-0 ${
                                    documents.length > 0 
                                      ? 'bg-green-100 text-green-800 border-green-400' 
                                      : 'bg-white/60 text-amber-700 border-amber-300'
                                  }`}
                                >
                                  <FileText className="w-2 h-2 mr-0.5" />
                                  {documents.length}
                                </Badge>
                              </div>

                              {/* Client Info - Compact */}
                              {client && (
                                <div className="bg-white/70 backdrop-blur-sm p-1.5 rounded-md border border-amber-200 shadow-sm mt-auto">
                                  <div className="flex items-center gap-1 mb-0.5">
                                    <User className="w-2.5 h-2.5 text-amber-700" />
                                    <span className="text-[9px] font-bold text-amber-950">Client</span>
                                  </div>
                                  <p className="text-[10px] text-amber-900 font-semibold truncate">
                                    {client.firstName} {client.lastName}
                                  </p>
                                  {client.phoneNumber && (
                                    <p className="text-[9px] text-amber-700 truncate">
                                      {client.phoneNumber}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Expand/Collapse Button */}
                            <div className="flex justify-center mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="bg-white/60 hover:bg-white/90 border border-amber-300 rounded-md shadow-sm h-6 w-full transition-all p-0"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5 text-amber-800" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5 text-amber-800" />
                                )}
                              </Button>
                            </div>
                          </div>

                          {/* Folder Bottom Shadow */}
                          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-b from-transparent to-amber-900/20"></div>
                        </div>
                      </div>
                    </div>

                    {/* Documents List (Expandable) - Modal Style */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          variants={documentVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                          onClick={() => toggleCase(caseItem._id)}
                        >
                          <div 
                            className="bg-white rounded-2xl border-4 border-amber-400 shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="bg-gradient-to-r from-amber-400 to-yellow-500 p-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                  <FolderOpen className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-white text-lg">{caseItem.caseNumber}</h3>
                                  <p className="text-xs text-amber-900">{caseItem.title}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="bg-white/20 hover:bg-white/30 text-white rounded-lg"
                                onClick={() => toggleCase(caseItem._id)}
                              >
                                <ChevronUp className="w-5 h-5" />
                              </Button>
                            </div>

                            <div className="overflow-y-auto max-h-[calc(85vh-80px)]">
                              {documents.length === 0 ? (
                                <div className="p-10 text-center bg-gradient-to-br from-amber-50 to-yellow-50">
                                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-200 to-yellow-300 flex items-center justify-center shadow-lg border-4 border-white">
                                    <Folder className="w-12 h-12 text-amber-700" />
                                  </div>
                                  <p className="text-amber-900 mb-2 font-bold text-lg">Empty Folder</p>
                                  <p className="text-sm text-amber-700 mb-4">No documents in this folder yet</p>
                                  <Button 
                                    onClick={() => openUploadDialog(caseItem._id)}
                                    className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white shadow-lg border-2 border-amber-600"
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Document
                                  </Button>
                                </div>
                              ) : (
                                <div className="p-6 bg-gradient-to-br from-white to-amber-50/30">
                                  <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-amber-200">
                                    <h4 className="text-base font-bold text-amber-900 flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-md">
                                        <FileText className="w-4 h-4 text-white" />
                                      </div>
                                      {documents.length} {documents.length === 1 ? 'file' : 'files'} in folder
                                    </h4>
                                    <Button 
                                      onClick={() => openUploadDialog(caseItem._id)}
                                      variant="outline" 
                                      size="sm" 
                                      className="border-2 border-amber-400 text-amber-700 hover:bg-amber-50 font-semibold shadow-sm"
                                    >
                                      <Plus className="w-3 h-3 mr-1" />
                                      Add File
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {documents.map((doc: any, idx: number) => {
                                      const docColors = [
                                        'from-red-400 to-red-500',
                                        'from-blue-400 to-blue-500',
                                        'from-green-400 to-green-500',
                                        'from-purple-400 to-purple-500',
                                        'from-orange-400 to-orange-500',
                                        'from-pink-400 to-pink-500',
                                      ];
                                      const colorClass = docColors[idx % docColors.length];
                                      
                                      return (
                                        <motion.div
                                          key={doc._id}
                                          initial={{ opacity: 0, scale: 0.9 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ delay: idx * 0.05 }}
                                          className="group"
                                        >
                                          <div className="relative bg-white rounded-xl border-3 border-slate-200 shadow-lg hover:shadow-xl hover:border-amber-300 transition-all duration-300 overflow-hidden">
                                            <div className={`h-24 bg-gradient-to-br ${colorClass} flex items-center justify-center relative overflow-hidden`}>
                                              <FileText className="w-12 h-12 text-white drop-shadow-lg" />
                                              {doc.generatedByAI && (
                                                <div className="absolute top-1 right-1 bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-md border border-white">
                                                  ✨ AI
                                                </div>
                                              )}
                                            </div>
                                            
                                            <div className="p-3">
                                              <h5 className="font-bold text-slate-900 mb-1 line-clamp-2 text-sm group-hover:text-blue-700 transition-colors">
                                                {doc.title}
                                              </h5>
                                              <Badge
                                                variant="outline"
                                                className={`${getDocumentTypeColor(doc.documentType)} mb-2 text-[10px] font-semibold`}
                                              >
                                                {doc.documentType}
                                              </Badge>
                                              
                                              <div className="space-y-1 text-[10px] text-slate-600 mb-3">
                                                <div className="flex items-center gap-1">
                                                  <Calendar className="w-2.5 h-2.5 text-slate-400" />
                                                  <span>{formatDate(doc.createdAt)}</span>
                                                </div>
                                                {doc.createdBy && (
                                                  <div className="flex items-center gap-1">
                                                    <User className="w-2.5 h-2.5 text-slate-400" />
                                                    <span className="truncate">{doc.createdBy.firstName}</span>
                                                  </div>
                                                )}
                                              </div>

                                              <div className="flex items-center gap-1 pt-2 border-t border-slate-200">
                                                <Link href={`/documents/${doc._id}`} className="flex-1">
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-semibold h-7"
                                                  >
                                                    <Eye className="w-3 h-3 mr-1" />
                                                    View
                                                  </Button>
                                                </Link>
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  className="border-green-200 text-green-700 hover:bg-green-50 px-2 h-7"
                                                  onClick={() => handleDownloadDocument(doc._id, doc.title)}
                                                  title="Download"
                                                >
                                                  <Download className="w-3 h-3" />
                                                </Button>
                                                <AlertDialog>
                                                  <AlertDialogTrigger asChild>
                                                    <Button
                                                      variant="outline"
                                                      size="sm"
                                                      className="border-red-200 text-red-700 hover:bg-red-50 px-2 h-7"
                                                      title="Delete"
                                                    >
                                                      <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                  </AlertDialogTrigger>
                                                  <AlertDialogContent>
                                                    <AlertDialogTitle>Delete Document</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                      Are you sure you want to delete "{doc.title}"? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                    <div className="flex justify-end gap-3">
                                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                      <AlertDialogAction
                                                        onClick={() => handleDeleteDocument(doc._id, doc.title)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                      >
                                                        Delete
                                                      </AlertDialogAction>
                                                    </div>
                                                  </AlertDialogContent>
                                                </AlertDialog>
                                              </div>
                                            </div>
                                          </div>
                                        </motion.div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadingCaseId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setUploadingCaseId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">Upload Document</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUploadingCaseId(null)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* File Upload Area */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Select File
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all"
                  >
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div className="text-left">
                          <p className="text-sm font-semibold text-slate-900">{selectedFile.name}</p>
                          <p className="text-xs text-slate-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                        <p className="text-sm font-semibold text-slate-700">Click to select file</p>
                        <p className="text-xs text-slate-500 mt-1">
                          PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Document Title */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Document Title
                  </label>
                  <Input
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="Enter document title"
                    className="w-full"
                  />
                </div>

                {/* Document Type */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Document Type
                  </label>
                  <select
                    value={uploadDocType}
                    onChange={(e) => setUploadDocType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Other">Other</option>
                    <option value="Contract">Contract</option>
                    <option value="Affidavit">Affidavit</option>
                    <option value="bail_application">Bail Application</option>
                    <option value="legal_notice">Legal Notice</option>
                    <option value="petition">Petition</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setUploadingCaseId(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploadDocumentMutation.isPending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {uploadDocumentMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
