'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useCases, useCaseById, useDeleteCase } from '@/hooks/useCases';
import { useAuthStore } from '@/store/auth';
import { 
  Plus, 
  Search, 
  Eye, 
  Briefcase,
  Calendar,
  User,
  Filter,
  Grid3x3,
  List,
  Scale,
  DollarSign,
  FileText,
  Edit,
  Trash2,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const statusColors: Record<string, string> = {
  open: 'bg-blue-100 text-blue-700 border-blue-200',
  in_progress: 'bg-amber-100 text-amber-700 border-amber-200',
  closed: 'bg-slate-100 text-slate-700 border-slate-200',
  on_hold: 'bg-orange-100 text-orange-700 border-orange-200',
  archived: 'bg-gray-100 text-gray-700 border-gray-200',
};

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-green-100 text-green-700 border-green-200',
};

const cardColors = [
  { bar: 'bg-blue-500', bg: 'from-blue-50/50 to-blue-100/30', border: 'border-blue-200/40' },
  { bar: 'bg-amber-500', bg: 'from-amber-50/50 to-amber-100/30', border: 'border-amber-200/40' },
  { bar: 'bg-green-500', bg: 'from-green-50/50 to-green-100/30', border: 'border-green-200/40' },
  { bar: 'bg-purple-500', bg: 'from-purple-50/50 to-purple-100/30', border: 'border-purple-200/40' },
  { bar: 'bg-pink-500', bg: 'from-pink-50/50 to-pink-100/30', border: 'border-pink-200/40' },
  { bar: 'bg-indigo-500', bg: 'from-indigo-50/50 to-indigo-100/30', border: 'border-indigo-200/40' },
  { bar: 'bg-rose-500', bg: 'from-rose-50/50 to-rose-100/30', border: 'border-rose-200/40' },
  { bar: 'bg-teal-500', bg: 'from-teal-50/50 to-teal-100/30', border: 'border-teal-200/40' },
  { bar: 'bg-cyan-500', bg: 'from-cyan-50/50 to-cyan-100/30', border: 'border-cyan-200/40' },
  { bar: 'bg-violet-500', bg: 'from-violet-50/50 to-violet-100/30', border: 'border-violet-200/40' },
];

export default function CasesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: casesData } = useCases(page, 12, statusFilter, typeFilter, search);
  const { data: selectedCase, isLoading: isCaseLoading } = useCaseById(selectedCaseId || '');
  const deleteCaseMutation = useDeleteCase();

  const canEdit = user?.role === 'OWNER' || user?.role === 'ADMIN' || user?.role === 'ADVOCATE';
  const canDelete = user?.role === 'OWNER' || user?.role === 'ADMIN';

  const handleViewCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setIsDialogOpen(true);
  };

  const handleEditCase = (caseId: string) => {
    setIsDialogOpen(false);
    router.push(`/cases/${caseId}`);
  };

  const handleDeleteCase = (caseId: string) => {
    deleteCaseMutation.mutate(caseId, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setSelectedCaseId(null);
      },
    });
  };

  const caseTypes = [
    'civil',
    'criminal',
    'family',
    'corporate',
    'property',
    'labor',
    'tax',
    'intellectual_property',
  ];
  const caseStatuses = ['open', 'in_progress', 'closed', 'on_hold', 'archived'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-[1600px] mx-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">Cases</h1>
              <p className="text-lg text-slate-600 mt-1">
                {casesData?.pagination?.total || 0} total cases
              </p>
            </div>
            <Link href="/cases/new">
              <Button className="gap-2 bg-slate-900 hover:bg-slate-800 text-white h-11 px-6">
                <Plus className="h-5 w-5" /> New Case
              </Button>
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-slate-500 via-blue-900 to-violet-200 px-1 py-6 rounded-2xl shadow-lg">
              <p className="text-xl lg:text-2xl font-serif italic text-white text-center max-w-3xl leading-relaxed">
                "When case management becomes effortless, advocacy evolves—and the future changes forever."
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search by case number, title, or client name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-12 h-12 bg-white border-slate-200 shadow-sm"
              />
            </div>
            <Button
              variant="outline"
              className="h-12 px-4"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? (
                <List className="h-5 w-5" />
              ) : (
                <Grid3x3 className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Filter Pills */}
          <Card className="border-0 shadow-sm relative overflow-hidden">
            <CardContent className="p-4 space-y-4">
              {/* Decorative Image */}
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block">
                <Image 
                  src="/images/cases.png" 
                  alt="Cases" 
                  width={250} 
                  height={250}
                  className="object-contain rounded-3xl"
                />
              </div>
              {/* Status Filters */}
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="h-4 w-4 text-slate-600" />
                  <p className="text-xs font-semibold text-slate-700 uppercase">Status</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={statusFilter === '' ? 'default' : 'outline'}
                    onClick={() => {
                      setStatusFilter('');
                      setPage(1);
                    }}
                    className="rounded-full"
                  >
                    All
                  </Button>
                  {caseStatuses.map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={statusFilter === status ? 'default' : 'outline'}
                      onClick={() => {
                        setStatusFilter(status);
                        setPage(1);
                      }}
                      className="capitalize rounded-full"
                    >
                      {status.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Type Filters */}
              <div className="relative z-10">
                <p className="text-xs font-semibold text-slate-700 uppercase mb-2">Type</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={typeFilter === '' ? 'default' : 'outline'}
                    onClick={() => {
                      setTypeFilter('');
                      setPage(1);
                    }}
                    className="rounded-full"
                  >
                    All
                  </Button>
                  {caseTypes.map((type) => (
                    <Button
                      key={type}
                      size="sm"
                      variant={typeFilter === type ? 'default' : 'outline'}
                      onClick={() => {
                        setTypeFilter(type);
                        setPage(1);
                      }}
                      className="capitalize rounded-full"
                    >
                      {type.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cases Grid/List */}
        {casesData?.data && casesData.data.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {casesData.data.map((caseItem: any, index: number) => {
              const colorScheme = cardColors[index % cardColors.length];
              return (
              <motion.div key={caseItem._id} variants={itemVariants}>
                <Card 
                  className={`group relative border ${colorScheme.border} shadow-md hover:shadow-xl transition-all duration-300 h-full cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br ${colorScheme.bg} to-white`}
                  onClick={() => handleViewCase(caseItem._id)}
                >
                  {/* Status indicator bar */}
                  <div
                    className={`h-1.5 ${colorScheme.bar} rounded-t-2xl`}
                  />

                  <CardContent className="p-3 space-y-2">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <div className="p-1 bg-indigo-100 rounded-lg">
                            <Briefcase className="h-3 w-3 text-indigo-600" />
                          </div>
                          <span className="text-xs font-bold text-indigo-600">
                            {caseItem.caseNumber}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-slate-900 line-clamp-2">
                          {caseItem.title}
                        </h3>
                      </div>
                      <button className="p-1.5 rounded-full bg-slate-100 hover:bg-indigo-100 transition-colors shrink-0">
                        <Eye className="h-3.5 w-3.5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                      </button>
                    </div>

                      {/* Client Information */}
                      {caseItem.clientId && (
                        <div className="space-y-1.5 p-2.5 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
                          <div className="flex items-center gap-1.5">
                            <div className="p-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full">
                              <User className="h-2.5 w-2.5 text-white" />
                            </div>
                            <span className="text-xs font-bold text-slate-900">
                              {caseItem.clientId.firstName} {caseItem.clientId.lastName}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-600 space-y-0.5 pl-0.5">
                            {caseItem.clientId._id && (
                              <div>ID: <span className="font-mono">{caseItem.clientId._id.slice(-8)}</span></div>
                            )}
                            {caseItem.clientId.phone && (
                              <div>📞 {caseItem.clientId.phone}</div>
                            )}
                            {caseItem.clientId.address?.city && (
                              <div>📍 {caseItem.clientId.address.city}{caseItem.clientId.address.state ? `, ${caseItem.clientId.address.state}` : ''}</div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Description */}
                      {caseItem.description && (
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-tight">
                          {caseItem.description}
                        </p>
                      )}

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-1">
                        <Badge
                          variant="outline"
                          className={`${statusColors[caseItem.status] || 'bg-slate-100 text-slate-700'} border-0 font-medium px-2 py-0 rounded-full text-[10px]`}
                        >
                          {caseItem.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="capitalize border-0 bg-indigo-100 text-indigo-700 font-medium px-2 py-0 rounded-full text-[10px]">
                          {caseItem.caseType.replace('_', ' ')}
                        </Badge>
                        {caseItem.priority && (
                          <Badge
                            variant="outline"
                            className={`${priorityColors[caseItem.priority] || ''} border-0 font-medium px-2 py-0 rounded-full text-[10px]`}
                          >
                            {caseItem.priority}
                          </Badge>
                        )}
                      </div>

                      {/* Date */}
                      {caseItem.filingDate && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-indigo-600" />
                          <span className="text-[10px] text-slate-600">Filed: <span className="font-medium">{formatDate(caseItem.filingDate)}</span></span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No cases found</h3>
              <p className="text-slate-600 mb-6">
                {search || statusFilter || typeFilter
                  ? 'Try adjusting your filters'
                  : 'Get started by creating your first case'}
              </p>
              <Link href="/cases/new">
                <Button className="gap-2 bg-slate-900 hover:bg-slate-800">
                  <Plus className="h-5 w-5" /> Create First Case
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {casesData?.pagination && casesData.pagination.pages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-3"
          >
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="h-10"
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(casesData.pagination.pages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? 'default' : 'outline'}
                    onClick={() => setPage(pageNum)}
                    className="h-10 w-10 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              disabled={page === casesData.pagination.pages}
              onClick={() => setPage(page + 1)}
              className="h-10"
            >
              Next
            </Button>
          </motion.div>
        )}

        {/* Case View Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            {isCaseLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center animate-pulse">
                  <Briefcase className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-600">Loading case details...</p>
              </div>
            ) : selectedCase ? (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between pr-8">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium mb-2">
                        <Briefcase className="h-3.5 w-3.5" />
                        {selectedCase.caseNumber}
                      </div>
                      <DialogTitle className="text-2xl font-bold text-slate-900">{selectedCase.title}</DialogTitle>
                    </div>
                    <div className="flex gap-2">
                      {canEdit && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditCase(selectedCase._id)}
                          className="gap-2 h-9 border-slate-300 hover:bg-slate-100"
                        >
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </Button>
                      )}
                      {canDelete && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="gap-2 h-9 border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogTitle>Delete Case</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this case? This action cannot be undone.
                            </AlertDialogDescription>
                            <div className="flex gap-2 justify-end">
                              <AlertDialogCancel disabled={deleteCaseMutation.isPending}>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteCase(selectedCase._id);
                                }}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={deleteCaseMutation.isPending}
                              >
                                {deleteCaseMutation.isPending ? 'Deleting...' : 'Delete'}
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4 mt-2 max-h-[calc(85vh-120px)] overflow-y-auto pr-2">
                  {/* Status & Priority */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={`${statusColors[selectedCase.status]} border text-xs`}>
                      {selectedCase.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className="capitalize text-xs border-slate-300">
                      {selectedCase.caseType.replace('_', ' ')}
                    </Badge>
                    {selectedCase.priority && (
                      <Badge variant="outline" className={`${priorityColors[selectedCase.priority]} border text-xs`}>
                        {selectedCase.priority} priority
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  {selectedCase.description && (
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <p className="text-sm text-slate-700 leading-relaxed">{selectedCase.description}</p>
                    </div>
                  )}

                  {/* Client Information */}
                  {selectedCase.clientId && (
                    <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <Label className="text-slate-900 font-semibold text-sm">Client Information</Label>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {selectedCase.clientId.firstName} {selectedCase.clientId.lastName}
                          </p>
                          {selectedCase.clientId._id && (
                            <p className="text-xs text-slate-500 font-mono mt-0.5">
                              ID: {selectedCase.clientId._id}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedCase.clientId.phone && (
                            <div>
                              <Label className="text-xs text-slate-600">Phone</Label>
                              <p className="text-sm text-slate-900">{selectedCase.clientId.phone}</p>
                            </div>
                          )}
                          {selectedCase.clientId.email && (
                            <div>
                              <Label className="text-xs text-slate-600">Email</Label>
                              <p className="text-sm text-slate-900 truncate">{selectedCase.clientId.email}</p>
                            </div>
                          )}
                        </div>
                        {selectedCase.clientId.address && (selectedCase.clientId.address.street || selectedCase.clientId.address.city) && (
                          <div>
                            <Label className="text-xs text-slate-600">Address</Label>
                            <p className="text-sm text-slate-900">
                              {selectedCase.clientId.address.street && `${selectedCase.clientId.address.street}, `}
                              {selectedCase.clientId.address.city}
                              {selectedCase.clientId.address.state && `, ${selectedCase.clientId.address.state}`}
                              {selectedCase.clientId.address.zipCode && ` - ${selectedCase.clientId.address.zipCode}`}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Court & Parties */}
                  {(selectedCase.court || selectedCase.judge || selectedCase.oppositeParty) && (
                    <div className="bg-gradient-to-br from-purple-50 to-slate-50 rounded-lg p-4 border border-purple-100">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-purple-100 rounded-lg">
                          <Scale className="h-4 w-4 text-purple-600" />
                        </div>
                        <Label className="text-slate-900 font-semibold text-sm">Court & Parties</Label>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedCase.court?.name && (
                          <div>
                            <Label className="text-xs text-slate-600">Court</Label>
                            <p className="text-sm text-slate-900">{selectedCase.court.name}</p>
                          </div>
                        )}
                        {selectedCase.court?.location && (
                          <div>
                            <Label className="text-xs text-slate-600">Location</Label>
                            <p className="text-sm text-slate-900">{selectedCase.court.location}</p>
                          </div>
                        )}
                        {selectedCase.judge && (
                          <div className="col-span-2">
                            <Label className="text-xs text-slate-600">Judge</Label>
                            <p className="text-sm text-slate-900">{selectedCase.judge}</p>
                          </div>
                        )}
                        {selectedCase.oppositeParty && (
                          <div>
                            <Label className="text-xs text-slate-600">Opposite Party</Label>
                            <p className="text-sm text-slate-900">{selectedCase.oppositeParty}</p>
                          </div>
                        )}
                        {selectedCase.oppositeAdvocate && (
                          <div>
                            <Label className="text-xs text-slate-600">Their Advocate</Label>
                            <p className="text-sm text-slate-900">{selectedCase.oppositeAdvocate}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Dates & Budget */}
                  <div className="bg-gradient-to-br from-green-50 to-slate-50 rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-green-100 rounded-lg">
                        <Calendar className="h-4 w-4 text-green-600" />
                      </div>
                      <Label className="text-slate-900 font-semibold text-sm">Timeline & Budget</Label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedCase.filingDate && (
                        <div>
                          <Label className="text-xs text-slate-600">Filed</Label>
                          <p className="text-sm text-slate-900">{formatDate(selectedCase.filingDate)}</p>
                        </div>
                      )}
                      {selectedCase.nextHearingDate && (
                        <div>
                          <Label className="text-xs text-slate-600">Next Hearing</Label>
                          <p className="text-sm text-slate-900 font-medium">{formatDate(selectedCase.nextHearingDate)}</p>
                        </div>
                      )}
                      {selectedCase.budget && (
                        <div className="col-span-2">
                          <Label className="text-xs text-slate-600">Budget</Label>
                          <p className="text-sm text-slate-900 font-medium flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            {selectedCase.budget.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Notes */}
                  {selectedCase.notes && (
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-amber-100 rounded-lg">
                          <FileText className="h-4 w-4 text-amber-600" />
                        </div>
                        <Label className="text-slate-900 font-semibold text-sm">Notes</Label>
                      </div>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{selectedCase.notes}</p>
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
