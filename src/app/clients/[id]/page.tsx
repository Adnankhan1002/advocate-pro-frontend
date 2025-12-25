'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCreateClient, useUpdateClient, useClientById } from '@/hooks/useClients';
import { useCasesByClient } from '@/hooks/useCases';
import { ArrowLeft, Briefcase, Calendar, Scale, Edit, Save, X } from 'lucide-react';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ClientForm() {
  const router = useRouter();
  const params = useParams();
  const clientId = params?.id as string;
  const isEditing = !!clientId && clientId !== 'new';
  const [isEditMode, setIsEditMode] = useState(!isEditing); // Edit mode for new, view mode for existing

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
    },
    dateOfBirth: '',
    aadharNumber: '',
    panNumber: '',
    category: 'individual' as 'individual' | 'corporate' | 'organization',
    notes: '',
    totalAmount: 0,
    amountPaid: 0,
    amountRemaining: 0,
  });

  const { data: existingClient } = useClientById(isEditing ? clientId : '');
  const { data: clientCases } = useCasesByClient(isEditing ? clientId : '');
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();

  useEffect(() => {
    if (isEditing && existingClient) {
      setFormData(existingClient);
    }
  }, [existingClient, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { 
          ...(prev[parent as keyof typeof formData] as Record<string, any>), 
          [child]: value 
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateMutation.mutate(
        { ...formData, clientId },
        {
          onSuccess: () => {
            setIsEditMode(false);
          },
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => router.push('/clients'),
      });
    }
  };

  return (
    <div className="min-h-screen p-6 lg:pl-80">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/clients">
              <Button variant="outline" size="icon">
                <ArrowLeft size={18} />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {isEditing ? (isEditMode ? 'Edit Client' : 'View Client') : 'New Client'}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                {isEditing ? (isEditMode ? 'Update client information' : 'Client details and information') : 'Add a new client to your database'}
              </p>
            </div>
          </div>
          {isEditing && (
            <Button
              variant={isEditMode ? "outline" : "default"}
              onClick={() => setIsEditMode(!isEditMode)}
              className="gap-2"
            >
              {isEditMode ? (
                <>
                  <X size={16} /> Cancel Edit
                </>
              ) : (
                <>
                  <Edit size={16} /> Edit Client
                </>
              )}
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* View Mode Overlay Message */}
          {isEditing && !isEditMode && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
              <div className="text-blue-600">ℹ️</div>
              <p className="text-sm text-blue-900">
                <strong>View Mode:</strong> Click the "Edit Client" button above to make changes
              </p>
            </div>
          )}
          
          <fieldset disabled={isEditing && !isEditMode} className={isEditing && !isEditMode ? 'opacity-75' : ''}>
          {/* Basic Information */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Client personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    First Name *
                  </label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                    className="mt-2 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Last Name *
                  </label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                    className="mt-2 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="individual">Individual</option>
                  <option value="corporate">Corporate</option>
                  <option value="organization">Organization</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email *
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  className="mt-2 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Phone *
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91-9876543210"
                    required
                    className="mt-2 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Alternate Phone
                  </label>
                  <Input
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleChange}
                    placeholder="+91-8765432109"
                    className="mt-2 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Street
                </label>
                <Input
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                  className="mt-2 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    City
                  </label>
                  <Input
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    placeholder="New York"
                    className="mt-2 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    State
                  </label>
                  <Input
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    placeholder="NY"
                    className="mt-2 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Zip Code
                  </label>
                  <Input
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    placeholder="10001"
                    className="mt-2 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Country
                  </label>
                  <Input
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    placeholder="India"
                    className="mt-2 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Identification */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Identification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Aadhar Number
                  </label>
                  <Input
                    name="aadharNumber"
                    value={formData.aadharNumber}
                    onChange={handleChange}
                    placeholder="1234-5678-9012"
                    className="mt-2 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    PAN Number
                  </label>
                  <Input
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                    placeholder="ABCDE1234F"
                    className="mt-2 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Date of Birth
                </label>
                <Input
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="mt-2 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
              <CardDescription>Track payments and balances</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Total Amount (₹)
                  </label>
                  <Input
                    name="totalAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.totalAmount}
                    onChange={(e) => {
                      const total = parseFloat(e.target.value) || 0;
                      const paid = formData.amountPaid;
                      setFormData({ 
                        ...formData, 
                        totalAmount: total,
                        amountRemaining: Math.max(0, total - paid)
                      });
                    }}
                    placeholder="0.00"
                    className="mt-2 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Amount Paid (₹)
                  </label>
                  <Input
                    name="amountPaid"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amountPaid}
                    onChange={(e) => {
                      const paid = parseFloat(e.target.value) || 0;
                      const total = formData.totalAmount;
                      setFormData({ 
                        ...formData, 
                        amountPaid: paid,
                        amountRemaining: Math.max(0, total - paid)
                      });
                    }}
                    placeholder="0.00"
                    className="mt-2 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Amount Remaining (₹)
                  </label>
                  <Input
                    name="amountRemaining"
                    type="number"
                    value={formData.amountRemaining}
                    disabled
                    className="mt-2 bg-slate-100 dark:bg-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  💡 Amount Remaining is auto-calculated: Total Amount - Amount Paid
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional information about this client..."
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </CardContent>
          </Card>

          {/* Actions */}
          {(!isEditing || isEditMode) && (
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900"
              >
                <Save size={16} />
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Client')}
              </Button>
              {isEditing && (
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => {
                    setIsEditMode(false);
                    setFormData(existingClient);
                  }}
                >
                  Cancel
                </Button>
              )}
              {!isEditing && (
                <Link href="/clients" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              )}
            </div>
          )}
          </fieldset>
        </form>

        {/* Associated Cases Section - Only show when editing */}
        {isEditing && (
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-slate-600" />
                    Associated Cases
                  </CardTitle>
                  <CardDescription>
                    Cases linked to this client ({clientCases?.length || 0})
                  </CardDescription>
                </div>
                <Link href={`/cases/new?clientId=${clientId}`}>
                  <Button size="sm" className="gap-2">
                    + New Case
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {clientCases && clientCases.length > 0 ? (
                <div className="space-y-3">
                  {clientCases.map((caseItem: any) => (
                    <Link key={caseItem._id} href={`/cases/${caseItem._id}`}>
                      <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-800 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="bg-white dark:bg-slate-900">
                                {caseItem.caseNumber}
                              </Badge>
                              <Badge 
                                variant="outline"
                                className={
                                  caseItem.status === 'open' 
                                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                    : caseItem.status === 'in_progress'
                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                    : caseItem.status === 'closed'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-slate-50 text-slate-700 border-slate-200'
                                }
                              >
                                {caseItem.status}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                              {caseItem.title}
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <div className="flex items-center gap-1.5">
                                <Scale className="h-3.5 w-3.5" />
                                <span className="capitalize">{caseItem.caseType?.replace('_', ' ')}</span>
                              </div>
                              {caseItem.nextHearingDate && (
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>{new Date(caseItem.nextHearingDate).toLocaleDateString()}</span>
                                </div>
                              )}
                              {caseItem.court?.name && (
                                <div className="col-span-2 flex items-center gap-1.5 text-xs">
                                  <span className="text-slate-500">Court:</span>
                                  <span>{caseItem.court.name}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No cases associated with this client yet</p>
                  <Link href={`/cases/new?clientId=${clientId}`}>
                    <Button variant="outline" size="sm" className="mt-3">
                      Create First Case
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
