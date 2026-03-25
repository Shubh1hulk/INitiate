'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData);
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await login({
        email: 'demo@lifetwin.ai',
        password: 'DemoPass123!',
      });
      toast.success('Demo login successful!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Demo account not available. Please register first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 flex items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-8 rounded-2xl"
      >
        <h1 className="text-3xl font-bold mb-2 text-center glow-text">Welcome Back</h1>
        <p className="text-gray-400 text-center mb-8">Sign in to your LifeTwin account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-dark-700 border border-neon-cyan border-opacity-30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-dark-700 border border-neon-cyan border-opacity-30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-neon-cyan text-dark-900 font-bold rounded hover:shadow-neon transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-dark-800 text-gray-400">or try demo</span>
          </div>
        </div>

        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full py-2 border border-neon-purple text-neon-purple rounded hover:bg-neon-purple hover:text-white transition-all disabled:opacity-50"
        >
          Try Demo Account
        </button>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-neon-cyan hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
