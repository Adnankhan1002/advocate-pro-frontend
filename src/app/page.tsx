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
  Folder,
  Check
} from 'lucide-react';
import { PricingCard } from '@/components/PricingCard';

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
  },
};

const pricingPlans = [
  {
    name: 'Basic',
    price: 29,
    period: 'month',
    description: 'Perfect for solo practitioners',
    features: [
      'Up to 50 cases',
      'Basic case management',
      'Client database',
      '5GB document storage',
      'Email support',
      'Mobile app access',
    ],
  },
  {
    name: 'Professional',
    price: 79,
    period: 'month',
    description: 'Ideal for growing law firms',
    features: [
      'Unlimited cases',
      'Advanced case management',
      'Unlimited clients',
      '50GB document storage',
      'Priority support',
      'Multiple diary types',
      'Court hearing tracker',
      'Document templates',
      'Team collaboration (5 users)',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 199,
    period: 'month',
    description: 'For large law firms',
    features: [
      'Everything in Professional',
      'Unlimited team members',
      '500GB document storage',
      '24/7 premium support',
      'Custom integrations',
      'Advanced analytics',
      'API access',
      'Dedicated account manager',
    ],
  },
];

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
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-12 sm:py-16 md:py-20 lg:py-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div variants={itemVariants} className="mb-4 sm:mb-6 inline-flex items-center gap-1.5 sm:gap-2">
              <Scale className="h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 text-slate-900 dark:text-slate-100" />
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
                Advocate Pro
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight"
            >
              Complete Legal Practice Management
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="mb-6 sm:mb-8 md:mb-10 text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-400 px-2 sm:px-0"
            >
              Streamline your legal practice with our comprehensive case management system.
              Manage cases, clients, hearings, and documents all in one place.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:justify-center px-2 sm:px-0"
            >
              <Button asChild size="lg" className="gap-2 text-sm sm:text-base w-full sm:w-auto">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 text-sm sm:text-base w-full sm:w-auto">
                <Link href="/cases">
                  View Cases
                </Link>
              </Button>
            </motion.div>

            {/* Hero Image */}
            <motion.div 
              variants={itemVariants}
              className="mt-8 sm:mt-12 md:mt-16 flex justify-center"
            >
              <Image 
                src="/images/justice-adv.png" 
                alt="Legal Professional with Lady Justice" 
                width={400} 
                height={350}
                className="object-contain mix-blend-multiply w-[250px] h-auto sm:w-[300px] md:w-[350px] lg:w-[400px]"
                priority
                style={{ backgroundColor: 'transparent' }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-8 sm:mb-12 md:mb-16 text-center">
              <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
                Everything You Need
              </h2>
              <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 px-2 sm:px-0">
                Powerful features designed specifically for legal professionals
              </p>
            </motion.div>

            <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div 
                    key={index} 
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.3 }
                    }}
                    animate={{
                      x: [0, 30, 30, 0, 0],
                      y: [0, 0, 30, 30, 0],
                      transition: {
                        duration: 6,
                        repeat: Infinity,
                        delay: index * 0.6,
                        ease: "easeInOut",
                        times: [0, 0.25, 0.5, 0.75, 1]
                      }
                    }}
                  >
                    <Link href={feature.href}>
                      <Card className="group h-full transition-all hover:shadow-lg hover:border-slate-400 dark:hover:border-slate-600 cursor-pointer overflow-hidden relative">
                        <CardHeader className="relative z-10">
                          <motion.div 
                            className="mb-3 sm:mb-4 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-900 dark:group-hover:bg-slate-700 transition-colors"
                            animate={{
                              scale: [1, 1.2, 1.2, 1, 1],
                              rotate: [0, 0, 90, 180, 0],
                            }}
                            transition={{
                              duration: 6,
                              repeat: Infinity,
                              delay: index * 0.6,
                              ease: "easeInOut"
                            }}
                          >
                            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-slate-900 dark:text-slate-100 group-hover:text-white" />
                          </motion.div>
                          <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                          <CardDescription className="text-sm sm:text-base">
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

      {/* Pricing Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white via-slate-50 to-violet-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-8 sm:mb-12 md:mb-16 text-center">
              <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
                Simple, Transparent Pricing
              </h2>
              <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 px-2 sm:px-0">
                Choose the perfect plan for your law practice. All plans include a 14-day free trial.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto"
            >
              {pricingPlans.map((plan) => (
                <PricingCard
                  key={plan.name}
                  name={plan.name}
                  price={plan.price}
                  period={plan.period}
                  description={plan.description}
                  features={plan.features}
                  highlighted={plan.highlighted}
                  onSubscribe={() => console.log(`Subscribing to ${plan.name}`)}
                />
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12 text-center">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Need a custom plan for your firm?
              </p>
              <Button asChild variant="outline" size="lg">
                <Link href="/pricing">
                  View All Plans & FAQ
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-slate-900 dark:bg-slate-950">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.h2 
              variants={itemVariants}
              className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl font-bold text-white"
            >
              Ready to get started?
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="mb-6 sm:mb-8 md:mb-10 text-sm sm:text-base md:text-lg text-slate-300 px-2 sm:px-0"
            >
              Access your dashboard and start managing your legal practice more efficiently today.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Button asChild size="lg" variant="secondary" className="gap-2 text-sm sm:text-base w-full sm:w-auto">
                <Link href="/dashboard">
                  <Folder className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
