'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    firstName: '',
    lastName: '',
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

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      toast.success('Registration successful!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
        <h1 className="text-3xl font-bold mb-2 text-center glow-text">Create Account</h1>
        <p className="text-gray-400 text-center mb-8">Join LifeTwin AI today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-dark-700 border border-neon-cyan border-opacity-30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-dark-700 border border-neon-cyan border-opacity-30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan"
            />
          </div>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-dark-700 border border-neon-cyan border-opacity-30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan"
          />

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
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-dark-700 border border-neon-cyan border-opacity-30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-dark-700 border border-neon-cyan border-opacity-30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-neon-cyan text-dark-900 font-bold rounded hover:shadow-neon transition-all disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-neon-cyan hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
