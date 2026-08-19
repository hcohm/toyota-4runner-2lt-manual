import React, { useState, useEffect } from 'react';
import {
  Truck,
  Wrench,
  Fuel,
  Zap,
  Stethoscope,
  Compass,
  Search,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';

import { OverviewFsmHub } from './components/hubs/OverviewFsmHub';
import { EngineHub } from './components/hubs/EngineHub';
import { FuelSystemHub } from './components/FuelSystemHub';
import { ElectricalHub } from './components/hubs/ElectricalHub';
import { DiagnosticsHub } from './components/hubs/DiagnosticsHub';
import { TrailOverlandingHub } from './components/hubs/TrailOverlandingHub';
import { QuickSearchModal } from './components/QuickSearchModal';

type HubId =
  | 'overview-fsm'
  | 'engine'
  | 'fuel'
  | 'electrical'
  | 'diagnostics'
  | 'trail';

interface HubNavItem {
  id: HubId;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description: string;
}

const HUB_NAV_ITEMS: HubNavItem[] = [
  {
    id: 'overview-fsm',
    label: 'Overview & Master FSM Manual',
    shortLabel: 'Overview & FSM',
    icon: Truck,
    badge: 'Ch 1-5 Blueprint',
    description: 'Vehicle specs, VIN decoder, machine shop tolerances & torque database.'
  },
  {
    id: 'engine',
    label: 'Engine & Powertrain Hub',
    shortLabel: 'Engine & Head',
    icon: Wrench,
    badge: '18-Bolt & Lash',
    description: '18-bolt torque sequencer, valve lash calculator & timing belt alignment.'
  },
  {
    id: 'fuel',
    label: 'Mechanical Fuel & Suction Circuit',
    shortLabel: 'Fuel Circuit',
    icon: Fuel,
    badge: 'Suction Lab',
    description: '100% mechanical fuel lines, air ingress cavitation lab & bleeding.'
  },
  {
    id: 'electrical',
    label: 'Electrical & Circuit Sandbox',
    shortLabel: 'Electrical & Wire',
    icon: Zap,
    badge: 'Live Circuit',
    description: 'Photo connector locator, live ignition/relay sandbox & Super Glow II.'
  },
  {
    id: 'diagnostics',
    label: 'Diagnostics & Workshop Procedures',
    shortLabel: 'Diagnostics',
    icon: Stethoscope,
    badge: '7 Trees & Guides',
    description: 'Interactive 7-tree diagnostic decision wizard & 12 factory workshop procedures.'
  },
  {
    id: 'trail',
    label: 'Trail Rescue & Overlanding Hub',
    shortLabel: 'Trail Rescue',
    icon: Compass,
    badge: 'Glovebox Log',
    description: 'Drivetrain & tire physics, emergency field hacks & shim logbook.'
  }
];

export function App() {
  const [activeHub, setActiveHub] = useState<HubId>('overview-fsm');
  const [targetProcedureId, setTargetProcedureId] = useState<string | undefined>(undefined);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [garageMode, setGarageMode] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (tabId: string, itemRef?: string) => {
    if (tabId === 'master-manual' || tabId === 'torque-finder' || tabId === 'fluids') {
      setActiveHub('overview-fsm');
    } else if (tabId === 'head-torque' || tabId === 'valve-shim' || tabId === 'timing-belt' || tabId === 'cooling-crack') {
      setActiveHub('engine');
    } else if (tabId === 'fuel-system') {
      setActiveHub('fuel');
    } else if (tabId === 'connector-locator' || tabId === 'super-glow' || tabId === 'vacuum-wiring') {
      setActiveHub('electrical');
    } else if (tabId === 'diagnostics' || tabId === 'procedures') {
      setActiveHub('diagnostics');
      if (itemRef) setTargetProcedureId(itemRef);
    } else if (tabId === 'drivetrain') {
      setActiveHub('trail');
    } else {
      setActiveHub(tabId as HubId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen bg-[#0d0f12] text-gray-100 flex flex-col font-sans ${garageMode ? 'garage-mode' : ''}`}>
      {/* Top Universal App Header */}
      <header className="sticky top-0 z-40 bg-[#14171c]/95 backdrop-blur-md border-b border-[#252c36] shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Model Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveHub('overview-fsm')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-lg border border-red-500/40">
              <span className="font-mono font-black text-sm">2L-T</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white text-base tracking-tight">TOYOTA 4RUNNER / SURF</span>
                <span className="badge-toyota text-[10px] py-0 px-1.5 hidden sm:inline-flex">1991 LN130</span>
              </div>
              <div className="text-[11px] font-mono text-gray-400">
                2.4L Turbo-Diesel Master Workshop & Engineering Suite
              </div>
            </div>
          </div>

          {/* Quick Search & Tools Right Bar */}
          <div className="flex items-center gap-2">
            {/* Search Trigger Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 bg-[#1b2028] hover:bg-[#242b36] border border-[#2e3744] text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-mono transition-all shadow-inner"
            >
              <Search className="w-4 h-4 text-red-500" />
              <span className="hidden md:inline">Quick Search...</span>
              <kbd className="hidden sm:inline-block bg-[#0e1115] px-1.5 py-0.5 rounded text-[10px] text-gray-400 border border-[#2b333e]">
                ⌘K
              </kbd>
            </button>

            {/* Garage High-Contrast Mode Toggle */}
            <button
              onClick={() => setGarageMode(!garageMode)}
              className={`p-2 rounded-lg border text-xs font-mono transition-all flex items-center gap-1.5 ${
                garageMode
                  ? 'bg-amber-600 border-amber-500 text-white shadow-md'
                  : 'bg-[#1b2028] hover:bg-[#242b36] border-[#2e3744] text-gray-400 hover:text-white'
              }`}
              title="Toggle High-Contrast Workshop Mode"
            >
              {garageMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="hidden lg:inline">{garageMode ? 'Garage Mode ON' : 'Garage Mode'}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#1b2028] border border-[#2e3744] text-gray-300 lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Quick Ticker Sub-Header */}
        <div className="bg-[#101317] border-t border-[#1e232b] px-4 py-1.5 text-[11px] font-mono text-gray-400 overflow-x-auto flex items-center justify-between gap-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 flex-shrink-0">
            <span><strong className="text-gray-300">Architecture:</strong> 6 Master Hubs</span>
            <span><strong className="text-gray-300">Fuel System:</strong> 100% Mechanical Suction (No in-tank pump)</span>
            <span><strong className="text-gray-300">Head Torque:</strong> 78 Nm + 90° + 90°</span>
            <span><strong className="text-gray-300">Max Safe EGT:</strong> &lt; 650°C</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>FSM RM520E / RM582E Verified</span>
          </div>
        </div>
      </header>

      {/* Main App Body with Sidebar & Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* Left Desktop Sidebar Navigation (6 Master Hubs) */}
        <aside
          className={`lg:w-64 flex-shrink-0 space-y-1 ${
            mobileMenuOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="tech-panel p-3 bg-[#13161a] sticky top-28 space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-gray-500 px-3 py-1 block">
              6 Master Workshop Hubs
            </span>

            {HUB_NAV_ITEMS.map((hub) => {
              const Icon = hub.icon;
              const isActive = activeHub === hub.id;
              return (
                <button
                  key={hub.id}
                  onClick={() => {
                    setActiveHub(hub.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-red-600 border-red-500 text-white font-bold shadow-lg shadow-red-950/60'
                      : 'border-[#222b37] bg-[#14181f] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-red-500'}`} />
                      <span className="font-bold text-sm text-white">{hub.shortLabel}</span>
                    </div>
                    {hub.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#1b222d] text-gray-300'
                        }`}
                      >
                        {hub.badge}
                      </span>
                    )}
                  </div>
                  <p className={`text-[10px] line-clamp-1 font-sans ${isActive ? 'text-white/90' : 'text-gray-400'}`}>
                    {hub.description}
                  </p>
                </button>
              );
            })}

            {/* Helper callout */}
            <div className="mt-4 p-3 rounded-lg bg-[#181d24] border border-[#27303c] text-[11px] text-gray-400 leading-relaxed font-sans">
              <strong className="text-cyan-400 font-mono block mb-1">UNCLUTTERED HUBS:</strong>
              Every hub features dedicated sub-tabs for deep tools, 3D simulations, audio spectrum analysis, and workshop procedures.
            </div>
          </div>
        </aside>

        {/* Center Main Dynamic Content View */}
        <main className="flex-1 min-w-0">
          {activeHub === 'overview-fsm' && <OverviewFsmHub />}
          {activeHub === 'engine' && <EngineHub />}
          {activeHub === 'fuel' && <FuelSystemHub />}
          {activeHub === 'electrical' && <ElectricalHub />}
          {activeHub === 'diagnostics' && (
            <DiagnosticsHub initialProcedureId={targetProcedureId} />
          )}
          {activeHub === 'trail' && <TrailOverlandingHub />}
        </main>
      </div>

      {/* Quick Search Palette Modal */}
      <QuickSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigateTab={handleNavigate}
      />

      {/* Global Footer */}
      <footer className="mt-auto bg-[#0b0d10] border-t border-[#1f242c] py-6 px-4 text-center text-xs font-mono text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            1991 Toyota 4Runner / Hilux Surf (LN130 Chassis / 2L-T 2.4L Turbo Diesel) Interactive Engineering Suite
          </div>
          <div className="flex items-center gap-3">
            <span>Toyota FSM Specifications</span>
            <span>•</span>
            <span className="text-red-500">Offline Workshop Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
