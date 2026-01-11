'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PricingCard } from '@/components/PricingCard';
import { Button } from '@/components/ui/button';

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

export default function SubscriptionPage() {
  const handleSubscribe = (planName: string) => {
    console.log(`Subscribing to ${planName} plan`);
    // Add your subscription logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Subscription Section */}
      <section className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 lg:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-12 md:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4 px-2">
              Choose Your Subscription Plan
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-4 sm:mb-6 px-4">
              Select the perfect plan for your law practice. All plans include a 14-day free trial with no credit card required.
            </p>
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-violet-100 dark:bg-violet-900/30 rounded-full text-violet-700 dark:text-violet-300 text-xs sm:text-sm font-medium mx-4">
              <span className="w-2 h-2 bg-violet-600 rounded-full animate-pulse"></span>
              <span className="hidden sm:inline">Special offer: Get 2 months free on annual plans</span>
              <span className="sm:hidden">2 months free on annual plans</span>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto mb-12 sm:mb-16"
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
                currency="₹"
              />
            ))}
          </motion.div>

          {/* Additional Info */}
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
              <div className="text-center p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700">
                <div className="text-2xl sm:text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">14 Days</div>
                <div className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Free trial period</div>
              </div>
              <div className="text-center p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700">
                <div className="text-2xl sm:text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">24/7</div>
                <div className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Customer support</div>
              </div>
              <div className="text-center p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700">
                <div className="text-2xl sm:text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">Cancel</div>
                <div className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Anytime, no questions</div>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div variants={itemVariants} className="mt-12 sm:mt-16 md:mt-20 text-center px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4">
              Have questions about our plans?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">
              Our team is here to help you choose the right plan for your firm.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Contact Sales
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View FAQ
              </Button>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div variants={itemVariants} className="mt-12 sm:mt-16 text-center px-4">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500 mb-3 sm:mb-4">Trusted by law firms worldwide</p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-8 items-center opacity-60 text-xs sm:text-sm">
              <div className="text-slate-400 dark:text-slate-600 font-semibold">Bank-grade Security</div>
              <div className="text-slate-400 dark:text-slate-600 hidden sm:inline">•</div>
              <div className="text-slate-400 dark:text-slate-600 font-semibold">GDPR Compliant</div>
              <div className="text-slate-400 dark:text-slate-600 hidden sm:inline">•</div>
              <div className="text-slate-400 dark:text-slate-600 font-semibold">ISO 27001 Certified</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-900 py-6 sm:py-8">
        <div className="container mx-auto px-4 text-center text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
          <p>&copy; 2026 Advocate Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
