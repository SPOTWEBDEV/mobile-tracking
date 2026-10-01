'use client';

import Link from 'next/link';
import { Compass, Play } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#060b13]/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-white">GeoPulse</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-widest">
                LIVE
              </span>
            </div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Real-Time Geolocation
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <Link href="#home" className="hover:text-blue-400 transition-colors">Home</Link>
          <Link href="#child-tracking" className="hover:text-blue-400 transition-colors">Track Child</Link>
          <Link href="#device-tracking" className="hover:text-blue-400 transition-colors">Track Device</Link>
          <Link href="#features" className="hover:text-blue-400 transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</Link>
        </nav>

        {/* Launch Button */}
        <Link
          href="/tracker"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Launch Tracker</span>
        </Link>
      </div>
    </header>
  );
}