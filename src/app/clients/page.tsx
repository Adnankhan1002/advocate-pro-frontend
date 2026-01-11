'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useClients, useDeleteClient } from '@/hooks/useClients';
import { useAuthStore } from '@/store/auth';
import { 
  Plus, 
  Search, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin,
  User,
  Building2,
  ArrowRight,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

if (typeof window !== 'undefined') {
  gsap.registerPlugin(TextPlugin);
}

export default function ClientsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('active');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: clientsData } = useClients(page, 12, status, search);
  const deleteClientMutation = useDeleteClient();
  const { user } = useAuthStore();
  const quoteTextRef = useRef<HTMLParagraphElement>(null);

  // Check if user can delete clients (OWNER or ADMIN)
  const canDelete = user?.role === 'OWNER' || user?.role === 'ADMIN';
  
  // GSAP Typewriter + Running Text Animation
  useEffect(() => {
    if (!quoteTextRef.current) return;

    const message = '"Client handling, once a challenge for advocates, is now seamless—transforming how legal practice works."';
    const textEl = quoteTextRef.current;

    // Clear initial text
    textEl.textContent = '';

    // Typewriter Effect
    gsap.to(textEl, {
      duration: message.length * 0.05,
      text: message,
      ease: 'none',
      onComplete: () => {
        // After typing, start running text animation
        gsap.to(textEl, {
          x: '-120%',
          duration: 15,
          ease: 'linear',
          repeat: -1,
        });
      },
    });

    return () => {
      gsap.killTweensOf(textEl);
    };
  }, []);
  
  // Debug logging
  React.useEffect(() => {
    console.log('User role:', user?.role);
    console.log('Can delete:', canDelete);
  }, [user, canDelete]);

  const handleDelete = (clientId: string) => {
    console.log('Deleting client with ID:', clientId);
    console.log('User info:', { role: user?.role, id: user?.id });
    deleteClientMutation.mutate(clientId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-[1600px] mx-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <motion.h1 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Clients
            </motion.h1>
            <motion.p 
              className="text-sm sm:text-base md:text-lg text-slate-600 mt-0.5 sm:mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {clientsData?.pagination?.total || 0} total clients
            </motion.p>
          </div>
          <Link href="/clients/new">
            <Button className="gap-2 bg-slate-900 hover:bg-slate-800 text-white h-9 sm:h-10 md:h-11 px-4 sm:px-5 md:px-6 text-sm sm:text-base w-full sm:w-auto">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> Add Client
            </Button>
          </Link>
        </motion.div>

        {/* Quote Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <div className="bg-gradient-to-r from-slate-600 via-blue-900 to-violet-400 px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 rounded-2xl sm:rounded-3xl shadow-2xl shadow-purple-500/20 overflow-hidden">
            <p 
              ref={quoteTextRef}
              className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-serif italic text-white text-center max-w-3xl leading-relaxed inline-block whitespace-nowrap"
            >
            </p>
          </div>
        </motion.div>

        {/* Image */}
        

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {/* Filter Box */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                <Input
                  placeholder="Search clients by name, email, or phone..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 sm:pl-12 h-10 sm:h-12 bg-white border-slate-200 shadow-sm text-sm sm:text-base"
                />
              </div>

              {/* Status Filters */}
              <div className="flex gap-2 flex-wrap">
                {['active', 'inactive', 'archived'].map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={status === s ? 'default' : 'outline'}
                    onClick={() => {
                      setStatus(s);
                      setPage(1);
                    }}
                    className="capitalize rounded-full text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4"
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Clients Table */}
        {clientsData?.data && clientsData.data.length > 0 ? (
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider">Client</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider">Contact</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider">Address</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider">Financial</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-[10px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {clientsData.data.map((client: any, index: number) => (
                    <motion.tr 
                      key={client._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* Client Name & Avatar */}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm shrink-0">
                            {client.firstName?.charAt(0)}{client.lastName?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                              {client.firstName} {client.lastName}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500">
                              {client.category === 'individual' ? (
                                <><User className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> Individual</>
                              ) : (
                                <><Building2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> {client.category}</>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <div className="space-y-1">
                          {client.phone && (
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600">
                              <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-400" />
                              {client.phone}
                            </div>
                          )}
                          {client.email && (
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600 truncate max-w-[150px] sm:max-w-xs">
                              <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-400" />
                              <span className="truncate">{client.email}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Address */}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        {client.address?.city && (
                          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600">
                            <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-400" />
                            <span>{client.address.city}, {client.address.state}</span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <Badge 
                          variant="outline" 
                          className={`text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${
                            client.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : client.status === 'inactive'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {client.status}
                        </Badge>
                      </td>

                      {/* Financial */}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        {(client.totalAmount > 0 || client.amountPaid > 0) ? (
                          <div className="space-y-0.5 sm:space-y-1 text-[10px] sm:text-xs">
                            <div className="text-slate-600">
                              Total: <span className="font-semibold text-slate-900">₹{client.totalAmount?.toLocaleString() || 0}</span>
                            </div>
                            <div className="text-slate-600">
                              Remaining: <span className={`font-bold ${
                                client.amountRemaining > 0 ? 'text-red-600' : 'text-green-600'
                              }`}>₹{client.amountRemaining?.toLocaleString() || 0}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px] sm:text-xs">N/A</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedClient(client);
                              setIsDialogOpen(true);
                            }}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
                          {canDelete && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-white border-slate-200">
                                <AlertDialogTitle>Delete Client</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {client.firstName} {client.lastName}? This action cannot be undone.
                                </AlertDialogDescription>
                                <div className="flex gap-2 justify-end">
                                  <AlertDialogCancel className="bg-slate-200" disabled={deleteClientMutation.isPending}>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleDelete(client._id);
                                    }}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={deleteClientMutation.isPending}
                                  >
                                    {deleteClientMutation.isPending ? 'Deleting...' : 'Delete'}
                                  </AlertDialogAction>
                                </div>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-12 sm:py-16 px-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <User className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-slate-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">No clients found</h3>
              <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
                {search || status !== 'active'
                  ? 'Try adjusting your filters'
                  : 'Get started by adding your first client'}
              </p>
              <Link href="/clients/new">
                <Button className="gap-2 bg-slate-900 hover:bg-slate-800 text-sm sm:text-base">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> Add First Client
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {clientsData?.pagination && clientsData.pagination.pages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap px-2"
          >
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="h-8 sm:h-9 md:h-10 text-xs sm:text-sm px-3 sm:px-4"
            >
              Previous
            </Button>
            <div className="flex items-center gap-1 sm:gap-2">
              {Array.from({ length: Math.min(clientsData.pagination.pages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? 'default' : 'outline'}
                    onClick={() => setPage(pageNum)}
                    className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 p-0 text-xs sm:text-sm"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              disabled={page === clientsData.pagination.pages}
              onClick={() => setPage(page + 1)}
              className="h-8 sm:h-9 md:h-10 text-xs sm:text-sm px-3 sm:px-4"
            >
              Next
            </Button>
          </motion.div>
        )}

        {/* Client Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-xl md:max-w-2xl max-h-[85vh] overflow-y-auto">
            {selectedClient && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-base sm:text-lg md:text-xl">
                      {selectedClient.firstName?.charAt(0)}{selectedClient.lastName?.charAt(0)}
                    </div>
                    <div>
                      <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                        {selectedClient.firstName} {selectedClient.lastName}
                      </DialogTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {selectedClient.category === 'individual' ? (
                          <><User className="h-4 w-4 text-slate-500" /> <span className="text-sm text-slate-600">Individual</span></>
                        ) : (
                          <><Building2 className="h-4 w-4 text-slate-500" /> <span className="text-sm text-slate-600">{selectedClient.category}</span></>
                        )}
                        <Badge 
                          variant="outline" 
                          className={`ml-2 ${
                            selectedClient.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : selectedClient.status === 'inactive'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {selectedClient.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                  {/* Contact Information */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-indigo-600" />
                      Contact Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      {selectedClient.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-700">{selectedClient.email}</span>
                        </div>
                      )}
                      {selectedClient.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-700">{selectedClient.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address Information */}
                  {selectedClient.address && (
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                      <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        Address
                      </h3>
                      <div className="text-sm text-slate-700">
                        {selectedClient.address.street && <div>{selectedClient.address.street}</div>}
                        <div>
                          {selectedClient.address.city}{selectedClient.address.state && `, ${selectedClient.address.state}`}
                          {selectedClient.address.zipCode && ` - ${selectedClient.address.zipCode}`}
                        </div>
                        {selectedClient.address.country && <div>{selectedClient.address.country}</div>}
                      </div>
                    </div>
                  )}

                  {/* Financial Information */}
                  {(selectedClient.totalAmount > 0 || selectedClient.amountPaid > 0) && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                      <h3 className="font-semibold text-slate-900 mb-3">Financial Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 border-b border-green-100">
                          <span className="text-sm text-slate-600">Total Amount</span>
                          <span className="font-semibold text-slate-900">₹{selectedClient.totalAmount?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-green-100">
                          <span className="text-sm text-slate-600">Amount Paid</span>
                          <span className="font-semibold text-green-600">₹{selectedClient.amountPaid?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-slate-600">Remaining</span>
                          <span className={`font-bold text-lg ${
                            selectedClient.amountRemaining > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            ₹{selectedClient.amountRemaining?.toLocaleString() || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedClient.notes && (
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                      <h3 className="font-semibold text-slate-900 mb-2">Notes</h3>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedClient.notes}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
