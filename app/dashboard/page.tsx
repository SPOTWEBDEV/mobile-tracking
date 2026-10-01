'use client';

import { useState } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import PulseMap from '@/components/PulseMap';
import { 
  Smartphone, Activity, Navigation, ShieldCheck, 
  MapPin, Clock, Battery, Download, Layers, Users 
} from 'lucide-react';

export default function DashboardPage() {
  const [activeDevice, setActiveDevice] = useState({ id: '1', name: "Alex's Phone (Child)" });
  const [sosActive, setSosActive] = useState(false);
  const [selectedTile, setSelectedTile] = useState<'dark' | 'street' | 'satellite'>('dark');
  const [telemetry, setTelemetry] = useState({
    lat: 0,
    lng: 0,
    accuracy: 0,
    speed: 0,
    altitude: null as number | null,
    timestamp: 'Waiting...',
  });

  const devices = [
    { id: '1', name: "Alex's Phone (Child)", type: 'Child Device', battery: '98%', status: 'Online • Moving' },
    { id: '2', name: 'Primary Phone', type: 'Personal Device', battery: '84%', status: 'Online • Stationary' },
    { id: '3', name: 'Samsung Tab S9', type: 'Tablet GPS', battery: '62%', status: 'Offline 5m ago' },
  ];

  return (
    <div className="h-screen flex flex-col bg-[#030712] overflow-hidden">
      {/* Top Navbar */}
      <DashboardNavbar 
        activeDeviceName={activeDevice.name} 
        onSosTrigger={() => setSosActive(!sosActive)} 
        sosActive={sosActive} 
      />

      {/* Dashboard Body Grid */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        
        {/* Left Telemetry & Device Sidebar Drawer */}
        <aside className="w-full lg:w-96 bg-[#060b13] border-r border-slate-800/80 p-5 flex flex-col justify-between overflow-y-auto z-10 shadow-2xl">
          <div className="space-y-6">
            
            {/* Device Switcher Section */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" /> Monitored Targets
              </div>
              <div className="space-y-2">
                {devices.map((dev) => (
                  <button
                    key={dev.id}
                    onClick={() => setActiveDevice(dev)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      activeDevice.id === dev.id
                        ? 'bg-blue-600/10 border-blue-500/50 text-white'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone className={`w-5 h-5 ${activeDevice.id === dev.id ? 'text-blue-400' : 'text-slate-500'}`} />
                      <div>
                        <div className="text-xs font-bold text-white">{dev.name}</div>
                        <div className="text-[10px] text-slate-400">{dev.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-semibold text-emerald-400 block">{dev.status}</span>
                      <span className="text-[9px] text-slate-500">{dev.battery}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Telemetry Panel */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-400" /> Real-Time Telemetry
              </div>

              <div className="space-y-3 font-mono">
                {/* Coordinates */}
                <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-sans font-bold">Latitude / Longitude</div>
                  <div className="text-sm font-bold text-white mt-1">
                    {telemetry.lat !== 0 ? `${telemetry.lat.toFixed(6)}, ${telemetry.lng.toFixed(6)}` : '0.000000, 0.000000'}
                  </div>
                </div>

                {/* Speed & Accuracy */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 font-sans font-bold">Speed</div>
                    <div className="text-base font-bold text-blue-400 mt-1">{telemetry.speed} km/h</div>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 font-sans font-bold">GPS Accuracy</div>
                    <div className="text-base font-bold text-emerald-400 mt-1">
                      {telemetry.accuracy ? `±${telemetry.accuracy}m` : '--'}
                    </div>
                  </div>
                </div>

                {/* Last Update Time */}
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-sans font-bold">Last Signal:</span>
                  <span className="text-slate-200 font-bold">{telemetry.timestamp}</span>
                </div>
              </div>
            </div>

            {/* Map Layer Selector */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" /> Map Styles
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['dark', 'street', 'satellite'] as const).map((tile) => (
                  <button
                    key={tile}
                    onClick={() => setSelectedTile(tile)}
                    className={`py-2 text-center text-xs font-bold rounded-lg border capitalize transition-all ${
                      selectedTile === tile
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {tile}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 text-center">
            GeoPulse Workspace • Private Client-Side GPS Session
          </div>
        </aside>

        {/* Main Leaflet Map Workspace Canvas */}
        <main className="flex-1 h-full relative">
          <PulseMap 
            onTelemetryUpdate={(data) => setTelemetry(data)} 
            selectedTile={selectedTile} 
          />
        </main>

      </div>
    </div>
  );
}