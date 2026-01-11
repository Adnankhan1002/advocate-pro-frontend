'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PricingCard } from '@/components/PricingCard';
import { Scale } from 'lucide-react';
import Link from 'next/link';

const pricingPlans = [
  {
    name: 'Basic',
    price: 599,
    period: 'month',
    description: 'Perfect for solo practitioners just getting started',
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
    price: 1499,
    period: 'month',
    description: 'Ideal for growing law firms with advanced needs',
    features: [
      'Unlimited cases',
      'Advanced case management',
      'Unlimited clients',
      '50GB document storage',
      'Priority email & phone support',
      'Multiple diary types',
      'Court hearing tracker',
      'Document templates',
      'Team collaboration (up to 5 users)',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 2499,
    period: 'month',
    description: 'Comprehensive solution for large law firms',
    features: [
      'Everything in Professional',
      'Unlimited team members',
      '500GB document storage',
      '24/7 premium support',
      'Custom integrations',
      'Advanced analytics & reports',
      'API access',
      'Dedicated account manager',
      'Custom training sessions',
      'White-label options',
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function PricingPage() {
  const handleSubscribe = (planName: string) => {
    console.log(`Subscribing to ${planName} plan`);
    // Add your subscription logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-violet-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-slate-900" />
            <span className="text-xl font-bold text-slate-900">Advocate Pro</span>
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Choose the perfect plan for your law practice. All plans include a 14-day free trial.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6 max-w-7xl mx-auto"
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
                onSubscribe={() => handleSubscribe(plan.name)}
              />
            ))}
          </motion.div>

          {/* FAQ Section */}
          <motion.div variants={itemVariants} className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Have questions?
            </h2>
            <p className="text-slate-600 mb-6">
              Our team is here to help you choose the right plan for your firm.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-6 py-3 bg-gradient-to-r from-slate-900 to-violet-600 text-white rounded-lg font-medium hover:from-slate-800 hover:to-violet-700 transition-all shadow-md hover:shadow-lg">
                Contact Sales
              </button>
              <button className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:border-violet-400 hover:text-slate-900 transition-all">
                View FAQ
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p>&copy; 2026 Advocate Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
