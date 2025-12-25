'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useCaseById, useUpdateCase, useDeleteCase } from '@/hooks/useCases';
import { useClients } from '@/hooks/useClients';
import { useAuthStore } from '@/store/auth';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  Trash2, 
  Briefcase,
  User,
  Calendar,
  Scale,
  DollarSign,
  FileText,
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
import { formatDate } from '@/lib/utils';

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const caseId = params.id as string;

  const { data: caseData, isLoading } = useCaseById(caseId);
  const updateCaseMutation = useUpdateCase();
  const deleteCaseMutation = useDeleteCase();
  const { data: clientsData } = useClients(1, 100, 'active');

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  React.useEffect(() => {
    if (caseData) {
      setFormData({
        clientId: caseData.clientId?._id || caseData.clientId || '',
        caseNumber: caseData.caseNumber || '',
        title: caseData.title || '',
        description: caseData.description || '',
        caseType: caseData.caseType || 'civil',
        status: caseData.status || 'open',
        court: caseData.court || { name: '', location: '', jurisdiction: '' },
        judge: caseData.judge || '',
        oppositeParty: caseData.oppositeParty || '',
        oppositeAdvocate: caseData.oppositeAdvocate || '',
        filingDate: caseData.filingDate ? new Date(caseData.filingDate).toISOString().split('T')[0] : '',
        nextHearingDate: caseData.nextHearingDate ? new Date(caseData.nextHearingDate).toISOString().split('T')[0] : '',
        budget: caseData.budget || '',
        priority: caseData.priority || 'medium',
        notes: caseData.notes || '',
      });
    }
  }, [caseData]);

  const canEdit = user?.role === 'OWNER' || user?.role === 'ADMIN' || user?.role === 'ADVOCATE';
  const canDelete = user?.role === 'OWNER' || user?.role === 'ADMIN';

  const caseTypes = ['civil', 'criminal', 'family', 'corporate', 'property', 'labor', 'tax', 'intellectual_property'];
  const caseStatuses = ['open', 'in_progress', 'closed', 'on_hold', 'archived'];

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      caseId,
      clientId: formData.clientId,
      caseNumber: formData.caseNumber,
      title: formData.title,
      caseType: formData.caseType,
      status: formData.status,
      priority: formData.priority,
    };

    if (formData.description) payload.description = formData.description;
    if (formData.court.name) payload.court = formData.court;
    if (formData.judge) payload.judge = formData.judge;
    if (formData.oppositeParty) payload.oppositeParty = formData.oppositeParty;
    if (formData.oppositeAdvocate) payload.oppositeAdvocate = formData.oppositeAdvocate;
    if (formData.filingDate) payload.filingDate = formData.filingDate;
    if (formData.nextHearingDate) payload.nextHearingDate = formData.nextHearingDate;
    if (formData.budget) payload.budget = parseFloat(formData.budget);
    if (formData.notes) payload.notes = formData.notes;

    updateCaseMutation.mutate(payload, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleDelete = () => {
    deleteCaseMutation.mutate(caseId, {
      onSuccess: () => {
        router.push('/cases');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center animate-pulse">
            <Briefcase className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-slate-600">Loading case details...</p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-16">
            <Briefcase className="h-16 w-16 mx-auto mb-4 text-slate-400" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Case Not Found</h2>
            <p className="text-slate-600 mb-6">The case you're looking for doesn't exist.</p>
            <Link href="/cases">
              <Button>Back to Cases</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Link href="/cases">
              <Button variant="outline" size="icon" className="h-10 w-10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{caseData.caseNumber}</h1>
              <p className="text-slate-600 mt-1">{caseData.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && canEdit && (
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <Edit className="h-4 w-4" /> Edit
              </Button>
            )}
            {canDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="gap-2 border-red-200 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white border-slate-200">
                  <AlertDialogTitle>Delete Case</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this case? This action cannot be undone and will remove all associated data.
                  </AlertDialogDescription>
                  <div className="flex gap-2 justify-end">
                    <AlertDialogCancel disabled={deleteCaseMutation.isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete();
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
        </motion.div>

        {isEditing ? (
          /* Edit Mode */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="caseNumber">Case Number *</Label>
                      <Input
                        id="caseNumber"
                        required
                        value={formData.caseNumber}
                        onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientId">Client *</Label>
                      <select
                        id="clientId"
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.clientId}
                        onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                      >
                        {clientsData?.data?.map((client: any) => (
                          <option key={client._id} value={client._id}>
                            {client.firstName} {client.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Case Title *</Label>
                    <Input
                      id="title"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="caseType">Case Type *</Label>
                      <select
                        id="caseType"
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.caseType}
                        onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                      >
                        {caseTypes.map((type) => (
                          <option key={type} value={type} className="capitalize">
                            {type.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <select
                        id="status"
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        {caseStatuses.map((status) => (
                          <option key={status} value={status} className="capitalize">
                            {status.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <select
                        id="priority"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Court & Parties */}
              <Card>
                <CardHeader>
                  <CardTitle>Court & Parties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="courtName">Court Name</Label>
                      <Input
                        id="courtName"
                        value={formData.court?.name || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          court: { ...formData.court, name: e.target.value }
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="courtLocation">Court Location</Label>
                      <Input
                        id="courtLocation"
                        value={formData.court?.location || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          court: { ...formData.court, location: e.target.value }
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jurisdiction">Jurisdiction</Label>
                      <Input
                        id="jurisdiction"
                        value={formData.court?.jurisdiction || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          court: { ...formData.court, jurisdiction: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="judge">Judge Name</Label>
                      <Input
                        id="judge"
                        value={formData.judge}
                        onChange={(e) => setFormData({ ...formData, judge: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="oppositeParty">Opposite Party</Label>
                      <Input
                        id="oppositeParty"
                        value={formData.oppositeParty}
                        onChange={(e) => setFormData({ ...formData, oppositeParty: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="oppositeAdvocate">Opposite Party's Advocate</Label>
                    <Input
                      id="oppositeAdvocate"
                      value={formData.oppositeAdvocate}
                      onChange={(e) => setFormData({ ...formData, oppositeAdvocate: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Dates & Budget */}
              <Card>
                <CardHeader>
                  <CardTitle>Dates & Budget</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="filingDate">Filing Date</Label>
                      <Input
                        id="filingDate"
                        type="date"
                        value={formData.filingDate}
                        onChange={(e) => setFormData({ ...formData, filingDate: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nextHearingDate">Next Hearing Date</Label>
                      <Input
                        id="nextHearingDate"
                        type="date"
                        value={formData.nextHearingDate}
                        onChange={(e) => setFormData({ ...formData, nextHearingDate: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="gap-2"
                >
                  <X className="h-4 w-4" /> Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateCaseMutation.isPending}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {updateCaseMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* View Mode */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Status & Priority */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline" className={`${statusColors[caseData.status]} border px-3 py-1`}>
                    {caseData.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className="capitalize px-3 py-1">
                    {caseData.caseType.replace('_', ' ')}
                  </Badge>
                  {caseData.priority && (
                    <Badge variant="outline" className={`${priorityColors[caseData.priority]} border px-3 py-1`}>
                      {caseData.priority} priority
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {caseData.description && (
                  <div>
                    <Label className="text-slate-600">Description</Label>
                    <p className="mt-1 text-slate-900">{caseData.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Client Information */}
            {caseData.clientId && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-slate-600">Name</Label>
                      <p className="text-slate-900">
                        {caseData.clientId.firstName} {caseData.clientId.lastName}
                      </p>
                    </div>
                    {caseData.clientId.email && (
                      <div>
                        <Label className="text-slate-600">Email</Label>
                        <p className="text-slate-900">{caseData.clientId.email}</p>
                      </div>
                    )}
                    {caseData.clientId.phone && (
                      <div>
                        <Label className="text-slate-600">Phone</Label>
                        <p className="text-slate-900">{caseData.clientId.phone}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Court & Parties */}
            {(caseData.court || caseData.judge || caseData.oppositeParty) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    Court & Parties
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {caseData.court && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {caseData.court.name && (
                        <div>
                          <Label className="text-slate-600">Court Name</Label>
                          <p className="text-slate-900">{caseData.court.name}</p>
                        </div>
                      )}
                      {caseData.court.location && (
                        <div>
                          <Label className="text-slate-600">Location</Label>
                          <p className="text-slate-900">{caseData.court.location}</p>
                        </div>
                      )}
                      {caseData.court.jurisdiction && (
                        <div>
                          <Label className="text-slate-600">Jurisdiction</Label>
                          <p className="text-slate-900">{caseData.court.jurisdiction}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {caseData.judge && (
                    <div>
                      <Label className="text-slate-600">Judge</Label>
                      <p className="text-slate-900">{caseData.judge}</p>
                    </div>
                  )}
                  {caseData.oppositeParty && (
                    <div>
                      <Label className="text-slate-600">Opposite Party</Label>
                      <p className="text-slate-900">{caseData.oppositeParty}</p>
                    </div>
                  )}
                  {caseData.oppositeAdvocate && (
                    <div>
                      <Label className="text-slate-600">Opposite Advocate</Label>
                      <p className="text-slate-900">{caseData.oppositeAdvocate}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Dates & Budget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Dates & Budget
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {caseData.filingDate && (
                    <div>
                      <Label className="text-slate-600">Filing Date</Label>
                      <p className="text-slate-900">{formatDate(caseData.filingDate)}</p>
                    </div>
                  )}
                  {caseData.nextHearingDate && (
                    <div>
                      <Label className="text-slate-600">Next Hearing Date</Label>
                      <p className="text-slate-900">{formatDate(caseData.nextHearingDate)}</p>
                    </div>
                  )}
                </div>
                {caseData.budget && (
                  <div>
                    <Label className="text-slate-600">Budget</Label>
                    <p className="text-slate-900 flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {caseData.budget.toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Notes */}
            {caseData.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Additional Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-900 whitespace-pre-wrap">{caseData.notes}</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
