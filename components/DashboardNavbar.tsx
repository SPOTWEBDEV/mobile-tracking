'use client';

import Link from 'next/link';
import { Compass, ShieldAlert, Radio, Battery, Smartphone, ArrowLeft } from 'lucide-react';

interface NavbarProps {
  activeDeviceName: string;
  onSosTrigger: () => void;
  sosActive: boolean;
}

export default function DashboardNavbar({ activeDeviceName, onSosTrigger, sosActive }: NavbarProps) {
  return (
    <header className="h-16 bg-[#060b13] border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between z-30 relative">
      {/* Brand & Return Link */}
      <div className="flex items-center gap-4">
        <Link 
          href="/" 
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Workspace
        </Link>
        <div className="h-4 w-px bg-slate-800" />
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-white tracking-tight">GeoPulse</span>
            <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
              WORKSPACE
            </span>
          </div>
        </div>
      </div>

      {/* Active Target Info */}
      <div className="hidden md:flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
        <Smartphone className="w-4 h-4 text-blue-400" />
        <div className="text-xs">
          <span className="text-slate-400">Tracking Target: </span>
          <span className="font-bold text-white">{activeDeviceName}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          98% Battery
        </div>
      </div>

      {/* SOS Emergency Trigger */}
      <button
        onClick={onSosTrigger}
        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${
          sosActive 
            ? 'bg-red-600 hover:bg-red-500 text-white animate-bounce shadow-red-600/40' 
            : 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white'
        }`}
      >
        <ShieldAlert className="w-4 h-4" />
        <span>{sosActive ? 'SOS BROADCASTING' : 'TRIGGER EMERGENCY SOS'}</span>
      </button>
    </header>
  );
}