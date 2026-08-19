import React, { useState } from 'react';
import { ElectricalConnectorLocator } from '../ElectricalConnectorLocator';
import { LiveCircuitSandbox } from '../LiveCircuitSandbox';
import { SuperGlowLab } from '../SuperGlowLab';
import { VacuumWiringTracer } from '../VacuumWiringTracer';
import { MapPin, Zap, GitBranch } from 'lucide-react';

export const ElectricalHub: React.FC = () => {
  const [subTab, setSubTab] = useState<'locator' | 'sandbox' | 'superglow' | 'tracer'>('locator');

  return (
    <div className="space-y-6">
      {/* Sub-navigation bar */}
      <div className="flex items-center gap-2 p-1.5 bg-[#12151b] rounded-xl border border-[#26303d] overflow-x-auto">
        <button
          onClick={() => setSubTab('locator')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'locator'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#1b222d]'
          }`}
        >
          <MapPin className="w-4 h-4 text-cyan-400" /> Photo Connector & Part Locator
        </button>
        <button
          onClick={() => setSubTab('sandbox')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'sandbox'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#1b222d]'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" /> Live Circuit Sandbox & Fault Injector
        </button>
        <button
          onClick={() => setSubTab('superglow')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'superglow'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#1b222d]'
          }`}
        >
          <Zap className="w-4 h-4" /> Super Glow II Multimeter Lab
        </button>
        <button
          onClick={() => setSubTab('tracer')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'tracer'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#1b222d]'
          }`}
        >
          <GitBranch className="w-4 h-4" /> Vacuum Lines & Wiring Tracer
        </button>
      </div>

      {/* Sub-view Rendering */}
      {subTab === 'locator' && <ElectricalConnectorLocator />}
      {subTab === 'sandbox' && <LiveCircuitSandbox />}
      {subTab === 'superglow' && <SuperGlowLab />}
      {subTab === 'tracer' && <VacuumWiringTracer />}
    </div>
  );
};
