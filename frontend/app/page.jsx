'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, Zap, TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import Navigation from '@/components/Navigation';

export default function Home() {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center mb-20">
            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-7xl font-bold mb-6 glow-text"
            >
              Your AI Clone
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">
                Helps You Choose
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Meet LifeTwin AI – Your digital twin that learns from you and helps predict the outcomes of life's biggest decisions.
            </motion.p>

            <motion.div variants={itemVariants} className="flex gap-4 justify-center">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-8 py-3 bg-neon-cyan text-dark-900 font-bold rounded-lg hover:shadow-neon transition-all"
                  >
                    Go to Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/register"
                    className="px-8 py-3 bg-neon-cyan text-dark-900 font-bold rounded-lg hover:shadow-neon transition-all"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/auth/login"
                    className="px-8 py-3 border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-dark-900 transition-all"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                icon: Brain,
                title: 'Digital Twin',
                description: 'Train your AI clone to think, speak, and decide like you',
              },
              {
                icon: Zap,
                title: 'Life Simulator',
                description: 'See potential futures before making big decisions',
              },
              {
                icon: TrendingUp,
                title: 'Smart Insights',
                description: 'Get personalized recommendations based on your profile',
              },
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants} className="glass p-6 rounded-xl">
                <feature.icon className="w-12 h-12 text-neon-cyan mb-4" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-neon-cyan border-opacity-20">
        <div className="max-w-6xl mx-auto">
          <motion.h2 className="text-4xl font-bold text-center mb-16 glow-text">
            How It Works
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: '1', title: 'Create Twin', desc: 'Sign up and start training your AI clone' },
              { num: '2', title: 'Train AI', desc: 'Share conversations and personality data' },
              { num: '3', title: 'Simulate', desc: 'Ask "what if?" and see future scenarios' },
              { num: '4', title: 'Decide', desc: 'Make better life choices with insights' },
            ].map((step, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {step.num}
                </div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="glass p-12 rounded-2xl max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-4">Ready to Meet Your AI Twin?</h3>
          <p className="text-gray-300 mb-8">Start making smarter life decisions today</p>
          <Link
            href={user ? '/dashboard' : '/auth/register'}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold rounded-lg hover:shadow-neon transition-all"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
