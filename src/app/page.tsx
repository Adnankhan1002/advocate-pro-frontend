'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [swapState, setSwapState] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSwapState((prev) => !prev);
    }, 3000); // Swap every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 lg:py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center max-w-7xl mx-auto"
          >
            {/* Text Content - Left Side */}
            <div className="text-left pr-2 sm:pr-4">
              <motion.div variants={itemVariants} className="mb-2 sm:mb-4 flex items-center gap-1 sm:gap-1.5">
                <Scale className="h-4 w-4 sm:h-7 sm:w-7 md:h-9 md:w-9 lg:h-10 lg:w-10 text-slate-900 dark:text-slate-100" />
                <span className="text-sm sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100">
                  Advocate Pro
                </span>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="mb-2 sm:mb-4 md:mb-6 text-base sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight"
              >
                Complete Legal Practice Management
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="mb-3 sm:mb-6 md:mb-8 lg:mb-10 text-xs sm:text-sm md:text-base lg:text-lg text-slate-600 dark:text-slate-400"
              >
                Streamline your legal practice with our comprehensive case management system.
                Manage cases, clients, hearings, and documents all in one place.
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="flex flex-col gap-2 sm:gap-3"
              >
                <Button asChild size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm md:text-base w-full sm:w-full lg:size-lg">
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm md:text-base w-full sm:w-full lg:size-lg">
                  <Link href="/cases">
                    View Cases
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Hero Image - Right Side */}
            <motion.div 
              variants={itemVariants}
              className="flex justify-end"
            >
              <Image 
                src="/images/justice-adv.png" 
                alt="Legal Professional with Lady Justice" 
                width={500} 
                height={450}
                className="object-contain mix-blend-multiply w-[180px] h-auto sm:w-[280px] md:w-[380px] lg:w-[500px]"
                priority
                style={{ backgroundColor: 'transparent' }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Video and Quote Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto"
          >
            {/* Quote Section */}
            <motion.div variants={itemVariants} className="order-2 lg:order-1 text-center lg:text-left px-4 sm:px-6 lg:px-8">
              <div className="mb-6">
                <span className="text-amber-400 text-6xl sm:text-7xl md:text-8xl font-serif leading-none">"</span>
              </div>
              <blockquote className="space-y-4 sm:space-y-6">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-white leading-relaxed">
                  Drowning in case files, missed deadlines, and endless paperwork? 
                  <span className="block mt-3 sm:mt-4 text-amber-400">
                    Modern legal practice shouldn't feel this chaotic.
                  </span>
                </p>
                <p className="text-base sm:text-lg text-slate-300">
                  Every advocate today battles the same frustrations: scattered documents, forgotten hearings, 
                  client management nightmares, and the constant pressure of staying organized while delivering justice.
                </p>
                <div className="pt-4 sm:pt-6 border-t border-slate-700">
                  <p className="text-amber-400 font-semibold text-sm sm:text-base">
                    It's time to break free from the stress.
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm mt-2">
                    Let technology handle the chaos, so you can focus on what matters most — winning cases.
                  </p>
                </div>
              </blockquote>
            </motion.div>

            {/* Video Section */}
            <motion.div 
              variants={itemVariants} 
              className="order-1 lg:order-2 px-6 sm:px-0"
            >
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-amber-400/20 hover:border-amber-400/40 transition-all duration-300 max-w-xs sm:max-w-none mx-auto">
                <video
                  className="w-full h-auto"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                >
                  <source src="/videos/adv.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none"></div>
              </div>
              <p className="text-center text-slate-400 text-xs sm:text-sm mt-3 sm:mt-4 italic">
                See how Advocate Pro transforms legal practice management
              </p>
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

            <div className="grid gap-2 sm:gap-4 md:gap-5 lg:gap-6 grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const isPaired = index % 2 === 0;
                const pairIndex = Math.floor(index / 2);
                
                // Calculate swap animation based on pair
                let xOffset = 0;
                if (index % 2 === 0) {
                  // Even index (left card in pair) - move right when swapped
                  xOffset = swapState ? 100 : 0;
                } else {
                  // Odd index (right card in pair) - move left when swapped
                  xOffset = swapState ? -100 : 0;
                }
                
                return (
                  <motion.div 
                    key={index} 
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.3 }
                    }}
                    animate={{
                      x: xOffset,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.4, 0, 0.2, 1], // power2.inOut equivalent
                    }}
                  >
                    <Link href={feature.href}>
                      <Card className="group h-full transition-all hover:shadow-lg hover:border-slate-400 dark:hover:border-slate-600 cursor-pointer overflow-hidden relative">
                        <CardHeader className="relative z-10 p-3 sm:p-4 md:p-6">
                          <div 
                            className="mb-2 sm:mb-3 inline-flex h-6 w-6 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-900 dark:group-hover:bg-slate-700 transition-colors"
                          >
                            <Icon className="h-3 w-3 sm:h-5 sm:w-5 md:h-6 md:w-6 text-slate-900 dark:text-slate-100 group-hover:text-white" />
                          </div>
                          <CardTitle className="text-xs sm:text-lg md:text-xl mb-1 sm:mb-2">{feature.title}</CardTitle>
                          <CardDescription className="text-[10px] sm:text-sm md:text-base leading-tight">
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
