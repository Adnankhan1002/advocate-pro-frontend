'use client';

import React, { useState } from 'react';
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
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function ClientsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('active');
  const { data: clientsData } = useClients(page, 12, status, search);
  const deleteClientMutation = useDeleteClient();
  const { user } = useAuthStore();

  // Check if user can delete clients (OWNER or ADMIN)
  const canDelete = user?.role === 'OWNER' || user?.role === 'ADMIN';
  
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
      <div className="max-w-[1600px] mx-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">Clients</h1>
            <p className="text-lg text-slate-600 mt-1">
              {clientsData?.pagination?.total || 0} total clients
            </p>
          </div>
          <Link href="/clients/new">
            <Button className="gap-2 bg-slate-900 hover:bg-slate-800 text-white h-11 px-6">
              <Plus className="h-5 w-5" /> Add Client
            </Button>
          </Link>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search clients by name, email, or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-12 h-12 bg-white border-slate-200 shadow-sm"
            />
          </div>

          {/* Status Filters */}
          <div className="flex gap-2">
            {['active', 'inactive', 'archived'].map((s) => (
              <Button
                key={s}
                size="sm"
                variant={status === s ? 'default' : 'outline'}
                onClick={() => {
                  setStatus(s);
                  setPage(1);
                }}
                className="capitalize rounded-full"
              >
                {s}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Clients Grid */}
        {clientsData?.data && clientsData.data.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {clientsData.data.map((client: any) => (
              <motion.div key={client._id} variants={itemVariants}>
                <Card className="group border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 h-full overflow-hidden">
                  {/* Status indicator bar */}
                  <div className={`h-1 ${
                    client.status === 'active' 
                      ? 'bg-emerald-500' 
                      : client.status === 'inactive'
                      ? 'bg-amber-500'
                      : 'bg-slate-400'
                  }`} />

                  <CardContent className="p-4 space-y-3">
                    {/* Header with Avatar */}
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {client.firstName?.charAt(0)}{client.lastName?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base text-slate-900 truncate group-hover:text-slate-700">
                          {client.firstName} {client.lastName}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          {client.category === 'individual' ? (
                            <><User className="h-3 w-3" /> Individual</>
                          ) : (
                            <><Building2 className="h-3 w-3" /> {client.category}</>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-1.5">
                      {client.email && (
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Mail className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Phone className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      {client.address?.city && (
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">
                            {client.address.city}, {client.address.state}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Financial Info */}
                    {(client.totalAmount > 0 || client.amountPaid > 0) && (
                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Total Amount:</span>
                          <span className="font-semibold text-slate-700">₹{client.totalAmount?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Amount Paid:</span>
                          <span className="font-semibold text-green-600">₹{client.amountPaid?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Remaining:</span>
                          <span className={`font-bold ${client.amountRemaining > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ₹{client.amountRemaining?.toLocaleString() || 0}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="pt-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-2 py-0.5 ${
                          client.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : client.status === 'inactive'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {client.status}
                      </Badge>
                    </div>

                    {/* Actions Footer */}
                    <div className="flex gap-2 pt-2">
                      <Link href={`/clients/${client._id}`} className="flex-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full h-8 text-xs"
                        >
                          <Eye className="h-3 w-3 mr-1" /> View
                        </Button>
                      </Link>
                      {canDelete && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
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
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <User className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No clients found</h3>
              <p className="text-slate-600 mb-6">
                {search || status !== 'active'
                  ? 'Try adjusting your filters'
                  : 'Get started by adding your first client'}
              </p>
              <Link href="/clients/new">
                <Button className="gap-2 bg-slate-900 hover:bg-slate-800">
                  <Plus className="h-5 w-5" /> Add First Client
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
              {Array.from({ length: Math.min(clientsData.pagination.pages, 5) }, (_, i) => {
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
              disabled={page === clientsData.pagination.pages}
              onClick={() => setPage(page + 1)}
              className="h-10"
            >
              Next
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
