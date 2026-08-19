import React, { useState } from 'react';
import { VehicleOverview } from '../VehicleOverview';
import { MasterManualHub } from '../MasterManualHub';
import { TorqueFinder } from '../TorqueFinder';
import { FluidsMaintenance } from '../FluidsMaintenance';
import { Truck, FileText, Gauge, Droplet } from 'lucide-react';

export const OverviewFsmHub: React.FC = () => {
  const [subTab, setSubTab] = useState<'overview' | 'fsm' | 'torque' | 'fluids'>('overview');

  return (
    <div className="space-y-6">
      {/* Sub-navigation bar */}
      <div className="flex items-center gap-2 p-1.5 bg-[#12151b] rounded-xl border border-[#26303d] overflow-x-auto">
        <button
          onClick={() => setSubTab('overview')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'overview'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#1b222d]'
          }`}
        >
          <Truck className="w-4 h-4" /> Specs & VIN Decoder
        </button>
        <button
          onClick={() => setSubTab('fsm')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'fsm'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#1b222d]'
          }`}
        >
          <FileText className="w-4 h-4" /> Master FSM Overhaul Manual (Ch 1-5)
        </button>
        <button
          onClick={() => setSubTab('torque')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'torque'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#1b222d]'
          }`}
        >
          <Gauge className="w-4 h-4" /> Fastener Torque Database
        </button>
        <button
          onClick={() => setSubTab('fluids')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'fluids'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#1b222d]'
          }`}
        >
          <Droplet className="w-4 h-4" /> Fluids & Capacities
        </button>
      </div>

      {/* Sub-view Rendering */}
      {subTab === 'overview' && <VehicleOverview />}
      {subTab === 'fsm' && <MasterManualHub />}
      {subTab === 'torque' && <TorqueFinder />}
      {subTab === 'fluids' && <FluidsMaintenance />}
    </div>
  );
};
