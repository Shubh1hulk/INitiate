'use client';

import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-neon-cyan border-opacity-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold glow-text">
            LifeTwin AI
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <Link href="/dashboard" className="hover:text-neon-cyan transition-colors">
                  Dashboard
                </Link>
                <Link href="/twin" className="hover:text-neon-cyan transition-colors">
                  Digital Twin
                </Link>
                <Link href="/simulator" className="hover:text-neon-cyan transition-colors">
                  Simulator
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-900 bg-opacity-30 hover:bg-red-600 rounded transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hover:text-neon-cyan transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/register" className="px-4 py-2 bg-neon-cyan text-dark-900 rounded font-bold">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-neon-cyan border-opacity-20">
            {user ? (
              <>
                <Link href="/dashboard" className="block py-2 hover:text-neon-cyan">
                  Dashboard
                </Link>
                <Link href="/twin" className="block py-2 hover:text-neon-cyan">
                  Digital Twin
                </Link>
                <Link href="/simulator" className="block py-2 hover:text-neon-cyan mb-4">
                  Simulator
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full px-4 py-2 bg-red-900 bg-opacity-30 hover:bg-red-600 rounded"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block py-2">
                  Sign In
                </Link>
                <Link href="/auth/register" className="block py-2 px-4 bg-neon-cyan text-dark-900 rounded font-bold">
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
