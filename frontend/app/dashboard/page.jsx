'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api';
import { Brain, Zap, MessageSquare, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    trainingDataPoints: 0,
    trainingPhase: 'incomplete',
    simulations: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, loading, router]);

  const fetchProfile = async () => {
    try {
      const response = await apiClient.getProfile();
      setProfile(response.data);
      setStats({
        trainingDataPoints: response.data.trainingDataPoints || 0,
        trainingPhase: response.data.trainingPhase || 'incomplete',
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700">
      <Navigation />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-bold glow-text mb-2">Welcome, {user.username}!</h1>
            <p className="text-gray-400">Your LifeTwin AI dashboard</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <Brain className="w-8 h-8 text-neon-cyan" />
                <span className="text-xs font-bold text-neon-purple">TRAINING</span>
              </div>
              <div className="text-3xl font-bold">{stats.trainingDataPoints}</div>
              <p className="text-gray-400 text-sm">Data Points</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-8 h-8 text-neon-purple" />
                <span className="text-xs font-bold text-neon-cyan capitalize">{stats.trainingPhase}</span>
              </div>
              <div className="text-3xl font-bold">Twin</div>
              <p className="text-gray-400 text-sm">Phase Level</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <MessageSquare className="w-8 h-8 text-neon-pink" />
              </div>
              <div className="text-3xl font-bold">∞</div>
              <p className="text-gray-400 text-sm">Conversations</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="w-8 h-8 text-neon-green" />
              </div>
              <div className="text-3xl font-bold">Ready</div>
              <p className="text-gray-400 text-sm">Simulator</p>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/twin" className="group glass p-8 rounded-xl hover:border-neon-cyan transition-all cursor-pointer">
                <Brain className="w-12 h-12 text-neon-cyan mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-2">Train Your Twin</h3>
                <p className="text-gray-400 text-sm">Add more data to make your digital twin smarter</p>
              </Link>

              <Link href="/simulator" className="group glass p-8 rounded-xl hover:border-neon-purple transition-all cursor-pointer">
                <Zap className="w-12 h-12 text-neon-purple mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-2">Run Simulation</h3>
                <p className="text-gray-400 text-sm">Ask "what if?" and see possible outcomes</p>
              </Link>

              <Link href="/chat" className="group glass p-8 rounded-xl hover:border-neon-pink transition-all cursor-pointer">
                <MessageSquare className="w-12 h-12 text-neon-pink mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-2">Chat with Twin</h3>
                <p className="text-gray-400 text-sm">Talk to your AI clone or future self</p>
              </Link>
            </div>
          </motion.div>

          {/* Training Progress */}
          {stats.trainingPhase === 'incomplete' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass p-8 rounded-xl border border-neon-cyan border-opacity-30"
            >
              <h3 className="text-xl font-bold mb-4">Start Your Training</h3>
              <p className="text-gray-400 mb-6">
                Train your AI twin to understand you better. Answer personality questions and chat with your twin to build a stronger profile.
              </p>
              <Link
                href="/twin"
                className="inline-block px-6 py-2 bg-neon-cyan text-dark-900 font-bold rounded hover:shadow-neon transition-all"
              >
                Begin Training
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
