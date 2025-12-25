'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCase } from '@/hooks/useCases';
import { useClients } from '@/hooks/useClients';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function NewCasePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientIdFromUrl = searchParams.get('clientId');
  const createCaseMutation = useCreateCase();
  const { data: clientsData } = useClients(1, 100, 'active');

  const [formData, setFormData] = useState({
    clientId: clientIdFromUrl || '',
    caseNumber: '',
    title: '',
    description: '',
    caseType: 'civil',
    status: 'open',
    court: {
      name: '',
      location: '',
      jurisdiction: '',
    },
    judge: '',
    oppositeParty: '',
    oppositeAdvocate: '',
    filingDate: '',
    nextHearingDate: '',
    budget: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    notes: '',
  });

  // Update clientId when URL param changes
  useEffect(() => {
    if (clientIdFromUrl) {
      setFormData(prev => ({ ...prev, clientId: clientIdFromUrl }));
    }
  }, [clientIdFromUrl]);

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

  const caseStatuses = ['open', 'in_progress', 'closed', 'on_hold'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: any = {
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

    createCaseMutation.mutate(payload, {
      onSuccess: () => {
        router.push('/cases');
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Link href="/cases">
            <Button variant="outline" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">New Case</h1>
            <p className="text-slate-600 mt-1">Create a new case record</p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
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
                      placeholder="e.g., CIV/2024/001"
                      value={formData.caseNumber}
                      onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientId" className="flex items-center gap-2">
                      Client * 
                      <span className="text-xs text-red-600 font-normal">(Required)</span>
                    </Label>
                    <select
                      id="clientId"
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-blue-500"
                      value={formData.clientId}
                      onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    >
                      <option value="">-- Select a client --</option>
                      {clientsData?.data?.map((client: any) => (
                        <option key={client._id} value={client._id}>
                          {client.firstName} {client.lastName} - {client.phone}
                        </option>
                      ))}
                    </select>
                    {!formData.clientId && (
                      <p className="text-xs text-amber-600 flex items-center gap-1">
                        ⚠️ Please select a client to create a case
                      </p>
                    )}
                    <p className="text-xs text-slate-500">
                      Don't see the client? <Link href="/clients/new" className="text-blue-600 hover:underline">Create a new client</Link>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Case Title *</Label>
                  <Input
                    id="title"
                    required
                    placeholder="Brief title of the case"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of the case"
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
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
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
                      placeholder="e.g., High Court"
                      value={formData.court.name}
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
                      placeholder="e.g., Delhi"
                      value={formData.court.location}
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
                      placeholder="e.g., Civil"
                      value={formData.court.jurisdiction}
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
                      placeholder="Honorable..."
                      value={formData.judge}
                      onChange={(e) => setFormData({ ...formData, judge: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="oppositeParty">Opposite Party</Label>
                    <Input
                      id="oppositeParty"
                      placeholder="Defendant name"
                      value={formData.oppositeParty}
                      onChange={(e) => setFormData({ ...formData, oppositeParty: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="oppositeAdvocate">Opposite Party's Advocate</Label>
                  <Input
                    id="oppositeAdvocate"
                    placeholder="Advocate name"
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
                      placeholder="Amount in currency"
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
                  placeholder="Any additional notes or observations"
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Link href="/cases">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={createCaseMutation.isPending}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {createCaseMutation.isPending ? 'Creating...' : 'Create Case'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
