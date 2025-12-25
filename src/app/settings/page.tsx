'use client';

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Bell, Shield, Users } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
  const { tenant, user } = useAuthStore();
  const [tenantData, setTenantData] = useState({
    name: tenant?.name || '',
    website: '',
    phone: '',
    address: '',
    timezone: 'UTC',
    logo: '',
  });

  const handleTenantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTenantData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen p-6 lg:pl-80">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage account and organization settings</p>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="organization" className="space-y-6">
            <TabsList className="bg-slate-100 dark:bg-slate-800 p-1">
              <TabsTrigger value="organization" className="gap-2">
                <Building2 size={18} /> Organization
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell size={18} /> Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield size={18} /> Security
              </TabsTrigger>
              <TabsTrigger value="team" className="gap-2">
                <Users size={18} /> Team
              </TabsTrigger>
            </TabsList>

            {/* Organization Tab */}
            <TabsContent value="organization" className="space-y-4">
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle>Organization Details</CardTitle>
                  <CardDescription>Manage your law firm information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Firm Name
                    </label>
                    <Input
                      name="name"
                      value={tenantData.name}
                      onChange={handleTenantChange}
                      className="mt-2 bg-slate-50 dark:bg-slate-800"
                      placeholder="Smith & Associates Law Firm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Website
                      </label>
                      <Input
                        name="website"
                        value={tenantData.website}
                        onChange={handleTenantChange}
                        type="url"
                        className="mt-2 bg-slate-50 dark:bg-slate-800"
                        placeholder="https://lawfirm.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Phone
                      </label>
                      <Input
                        name="phone"
                        value={tenantData.phone}
                        onChange={handleTenantChange}
                        type="tel"
                        className="mt-2 bg-slate-50 dark:bg-slate-800"
                        placeholder="+1-2125551200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Address
                    </label>
                    <Input
                      name="address"
                      value={tenantData.address}
                      onChange={handleTenantChange}
                      className="mt-2 bg-slate-50 dark:bg-slate-800"
                      placeholder="123 Law Street, New York, NY 10001"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Timezone
                    </label>
                    <select
                      name="timezone"
                      value={tenantData.timezone}
                      onChange={handleTenantChange}
                      className="w-full mt-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Asia/Kolkata">India Standard Time</option>
                    </select>
                  </div>

                  <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900">
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-4">
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Control how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Hearing Reminders', description: 'Get notified about upcoming hearings' },
                    { label: 'Follow-up Alerts', description: 'Alerts for pending follow-ups' },
                    { label: 'Case Updates', description: 'Updates when case status changes' },
                    { label: 'Task Assignments', description: 'When new tasks are assigned to you' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{item.label}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-4">
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage password and security options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      className="mt-2 bg-slate-50 dark:bg-slate-800"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      New Password
                    </label>
                    <Input
                      type="password"
                      className="mt-2 bg-slate-50 dark:bg-slate-800"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      className="mt-2 bg-slate-50 dark:bg-slate-800"
                      placeholder="••••••••"
                    />
                  </div>

                  <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900">
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="space-y-4">
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage users in your organization</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Manage team members, roles, and permissions.
                  </p>
                  <Button className="gap-2">
                    <Users size={18} /> Go to Team Management
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}
