import React, { useState, useEffect } from 'react';
import {
  Truck,
  Wrench,
  Gauge,
  RotateCw,
  Zap,
  Flame,
  Compass,
  Stethoscope,
  BookOpen,
  GitBranch,
  Droplet,
  Search,
  Moon,
  Sun,
  Layers,
  Menu,
  X,
  MapPin
} from 'lucide-react';

import { VehicleOverview } from './components/VehicleOverview';
import { HeadTorqueSimulator } from './components/HeadTorqueSimulator';
import { ValveShimCalculator } from './components/ValveShimCalculator';
import { TimingBeltVisualizer } from './components/TimingBeltVisualizer';
import { SuperGlowLab } from './components/SuperGlowLab';
import { CoolingCrackPrevention } from './components/CoolingCrackPrevention';
import { DrivetrainHub } from './components/DrivetrainHub';
import { DiagnosticWizard } from './components/DiagnosticWizard';
import { TorqueFinder } from './components/TorqueFinder';
import { ProcedureRunner } from './components/ProcedureRunner';
import { VacuumWiringTracer } from './components/VacuumWiringTracer';
import { FluidsMaintenance } from './components/FluidsMaintenance';
import { QuickSearchModal } from './components/QuickSearchModal';
import { ElectricalConnectorLocator } from './components/ElectricalConnectorLocator';

type TabId =
  | 'overview'
  | 'head-torque'
  | 'valve-shim'
  | 'timing-belt'
  | 'super-glow'
  | 'connector-locator'
  | 'cooling-crack'
  | 'drivetrain'
  | 'diagnostics'
  | 'torque-finder'
  | 'procedures'
  | 'vacuum-wiring'
  | 'fluids';

interface NavItem {
  id: TabId;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'Engine' | 'Electrical' | 'Chassis & 4WD' | 'Diagnostics' | 'Reference';
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: '1991 4Runner Specs & Decoder', shortLabel: 'Overview', icon: Truck, category: 'Reference' },
  { id: 'connector-locator', label: 'Electronics & Connector Locator', shortLabel: 'Part Locator', icon: MapPin, category: 'Electrical', badge: 'Map & Pinouts' },
  { id: 'head-torque', label: '18-Bolt Head Torque Sequencer', shortLabel: 'Head Torque', icon: Wrench, category: 'Engine', badge: 'Interactive' },
  { id: 'valve-shim', label: 'Valve Lash Shim Calculator', shortLabel: 'Valve Shims', icon: Layers, category: 'Engine', badge: 'Calculator' },
  { id: 'timing-belt', label: 'Timing Belt & Gear Alignment', shortLabel: 'Timing Belt', icon: RotateCw, category: 'Engine' },
  { id: 'cooling-crack', label: 'Cooling & Head Anti-Crack Hub', shortLabel: 'Cooling & Crack', icon: Flame, category: 'Engine', badge: 'Critical' },
  { id: 'super-glow', label: 'Super Glow II Multimeter Lab', shortLabel: 'Super Glow', icon: Zap, category: 'Electrical', badge: 'Simulator' },
  { id: 'vacuum-wiring', label: 'Vacuum Lines & Wiring Tracer', shortLabel: 'Vacuum / Wire', icon: GitBranch, category: 'Electrical' },
  { id: 'drivetrain', label: '4WD Drivetrain & 8-Zerk Lube', shortLabel: '4WD Drivetrain', icon: Compass, category: 'Chassis & 4WD' },
  { id: 'diagnostics', label: 'Interactive Diagnostic Wizard', shortLabel: 'Diagnostics', icon: Stethoscope, category: 'Diagnostics', badge: 'Wizard' },
  { id: 'procedures', label: 'Step-by-Step Workshop Runner', shortLabel: 'Procedures', icon: BookOpen, category: 'Reference', badge: 'Checklists' },
  { id: 'torque-finder', label: 'Master Fastener & Torque Finder', shortLabel: 'Torque DB', icon: Gauge, category: 'Reference' },
  { id: 'fluids', label: 'Fluids & Maintenance Schedule', shortLabel: 'Fluids / Svc', icon: Droplet, category: 'Reference' },
];

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
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
    setActiveTab(tabId as TabId);
    if (tabId === 'procedures' && itemRef) {
      setTargetProcedureId(itemRef);
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen bg-[#0d0f12] text-gray-100 flex flex-col font-sans ${garageMode ? 'garage-mode' : ''}`}>
      {/* Top Universal App Header */}
      <header className="sticky top-0 z-40 bg-[#14171c]/95 backdrop-blur-md border-b border-[#252c36] shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Model Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-lg border border-red-500/40">
              <span className="font-mono font-black text-sm">2L-T</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white text-base tracking-tight">TOYOTA 4RUNNER / SURF</span>
                <span className="badge-toyota text-[10px] py-0 px-1.5 hidden sm:inline-flex">1991 LN130</span>
              </div>
              <div className="text-[11px] font-mono text-gray-400">
                2.4L Turbo-Diesel Interactive Repair Manual
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
            <span><strong className="text-gray-300">Head Torque:</strong> 78 Nm + 90° + 90°</span>
            <span><strong className="text-gray-300">Valve Lash (Cold):</strong> In 0.25mm / Ex 0.45mm</span>
            <span><strong className="text-gray-300">Oil Capacity:</strong> 6.7 L (15W-40 CF-4)</span>
            <span><strong className="text-gray-300">Max Safe EGT:</strong> &lt; 650°C</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>FSM RM520E / RM582E / EWD Verified</span>
          </div>
        </div>
      </header>

      {/* Main App Body with Sidebar & Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* Left Desktop Sidebar Navigation */}
        <aside
          className={`lg:w-64 flex-shrink-0 space-y-1 ${
            mobileMenuOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="tech-panel p-3 bg-[#13161a] sticky top-28 space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-gray-500 px-3 py-1 block">
              Workshop Modules
            </span>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-mono flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-red-600 text-white font-bold shadow-md shadow-red-950/50'
                      : 'text-gray-400 hover:text-white hover:bg-[#1c222b]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span>{item.shortLabel}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#212730] text-gray-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Quick Helper Alert in Sidebar */}
            <div className="mt-4 p-3 rounded-lg bg-[#181d24] border border-[#27303c] text-[11px] text-gray-400 leading-relaxed font-sans">
              <strong className="text-cyan-400 font-mono block mb-1">PART LOCATOR:</strong>
              Can't find a sensor or relay? Click <strong className="text-white">Part Locator</strong> to view exact vehicle positions, wire color stripes, and test voltages.
            </div>
          </div>
        </aside>

        {/* Center Main Dynamic Content View */}
        <main className="flex-1 min-w-0">
          {activeTab === 'overview' && <VehicleOverview />}
          {activeTab === 'connector-locator' && <ElectricalConnectorLocator />}
          {activeTab === 'head-torque' && <HeadTorqueSimulator />}
          {activeTab === 'valve-shim' && <ValveShimCalculator />}
          {activeTab === 'timing-belt' && <TimingBeltVisualizer />}
          {activeTab === 'cooling-crack' && <CoolingCrackPrevention />}
          {activeTab === 'super-glow' && <SuperGlowLab />}
          {activeTab === 'vacuum-wiring' && <VacuumWiringTracer />}
          {activeTab === 'drivetrain' && <DrivetrainHub />}
          {activeTab === 'diagnostics' && (
            <DiagnosticWizard
              onSelectProcedure={(procId) => {
                setTargetProcedureId(procId);
                setActiveTab('procedures');
              }}
            />
          )}
          {activeTab === 'procedures' && (
            <ProcedureRunner initialProcedureId={targetProcedureId} />
          )}
          {activeTab === 'torque-finder' && <TorqueFinder />}
          {activeTab === 'fluids' && <FluidsMaintenance />}
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
            1991 Toyota 4Runner / Hilux Surf (LN130 Chassis / 2L-T 2.4L Turbo Diesel) Interactive Repair Suite
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
