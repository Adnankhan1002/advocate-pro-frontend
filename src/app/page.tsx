'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Scale, 
  Briefcase, 
  Users, 
  Calendar, 
  FileText, 
  Clock,
  ArrowRight,
  Shield,
  Bell,
  Folder
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const features = [
  {
    icon: Briefcase,
    title: 'Case Management',
    description: 'Organize and track all your legal cases in one place',
    href: '/cases',
  },
  {
    icon: Users,
    title: 'Client Management',
    description: 'Maintain comprehensive client profiles and relationships',
    href: '/clients',
  },
  {
    icon: Calendar,
    title: 'Hearing Schedule',
    description: 'Never miss a court date with our calendar system',
    href: '/hearings',
  },
  {
    icon: FileText,
    title: 'Document Storage',
    description: 'Securely store and manage all case documents',
    href: '/documents',
  },
  {
    icon: Clock,
    title: 'Multiple Diaries',
    description: 'Track tasks, meetings, expenses, and important dates',
    href: '/diaries',
  },
  {
    icon: Shield,
    title: 'Secure & Compliant',
    description: 'Bank-grade security for your sensitive legal data',
    href: '/dashboard',
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-20 sm:py-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2">
              <Scale className="h-10 w-10 text-slate-900 dark:text-slate-100" />
              <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                Advocate Pro
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="mb-6 text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl"
            >
              Complete Legal Practice Management
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="mb-10 text-xl text-slate-600 dark:text-slate-400"
            >
              Streamline your legal practice with our comprehensive case management system.
              Manage cases, clients, hearings, and documents all in one place.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col gap-4 sm:flex-row sm:justify-center"
            >
              <Button asChild size="lg" className="gap-2 text-base">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 text-base">
                <Link href="/cases">
                  View Cases
                </Link>
              </Button>
            </motion.div>

            {/* Hero Image */}
            <motion.div 
              variants={itemVariants}
              className="mt-16 flex justify-center"
            >
              <div className="relative">
                <Image 
                  src="/images/clients-office.jpg" 
                  alt="Legal Practice Management" 
                  width={600} 
                  height={450}
                  className="object-cover rounded-3xl shadow-2xl"
                  priority
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-slate-900/20 to-transparent" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">
                Everything You Need
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                Powerful features designed specifically for legal professionals
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div key={index} variants={itemVariants}>
                    <Link href={feature.href}>
                      <Card className="group h-full transition-all hover:shadow-lg hover:border-slate-400 dark:hover:border-slate-600 cursor-pointer">
                        <CardHeader>
                          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-900 dark:group-hover:bg-slate-700 transition-colors">
                            <Icon className="h-6 w-6 text-slate-900 dark:text-slate-100 group-hover:text-white" />
                          </div>
                          <CardTitle className="text-xl">{feature.title}</CardTitle>
                          <CardDescription className="text-base">
                            {feature.description}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.h2 
              variants={itemVariants}
              className="mb-6 text-3xl font-bold text-white sm:text-4xl"
            >
              Ready to get started?
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="mb-10 text-lg text-slate-300"
            >
              Access your dashboard and start managing your legal practice more efficiently today.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Button asChild size="lg" variant="secondary" className="gap-2 text-base">
                <Link href="/dashboard">
                  <Folder className="h-4 w-4" />
                  Open Dashboard
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
