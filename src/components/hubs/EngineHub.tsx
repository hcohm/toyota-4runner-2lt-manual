import React, { useState } from 'react';
import { Engine3DVisualizer } from '../Engine3DVisualizer';
import { HeadTorqueSimulator } from '../HeadTorqueSimulator';
import { ValveShimCalculator } from '../ValveShimCalculator';
import { TimingBeltVisualizer } from '../TimingBeltVisualizer';
import { CoolingCrackPrevention } from '../CoolingCrackPrevention';
import { Layers, Wrench, RotateCw, Flame } from 'lucide-react';

export const EngineHub: React.FC = () => {
  const [subTab, setSubTab] = useState<'3d' | 'torque' | 'valve' | 'timing' | 'cooling'>('3d');

  return (
    <div className="space-y-6">
      {/* Sub-navigation bar */}
      <div className="flex items-center gap-2 p-1.5 bg-[#12151b] rounded-xl border border-[#26303d] overflow-x-auto">
        <button
          onClick={() => setSubTab('3d')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === '3d'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#1b222d]'
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-400" /> 3D Digital Twin & Exploded Assembly
        </button>
        <button
          onClick={() => setSubTab('torque')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'torque'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#1b222d]'
          }`}
        >
          <Wrench className="w-4 h-4" /> 18-Bolt Head Torque Sequencer
        </button>
        <button
          onClick={() => setSubTab('valve')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'valve'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#1b222d]'
          }`}
        >
          <Layers className="w-4 h-4" /> Valve Lash Shim Calculator
        </button>
        <button
          onClick={() => setSubTab('timing')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'timing'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#1b222d]'
          }`}
        >
          <RotateCw className="w-4 h-4" /> Timing Belt & Gear Alignment
        </button>
        <button
          onClick={() => setSubTab('cooling')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'cooling'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#1b222d]'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-400" /> Cooling & Head Anti-Crack
        </button>
      </div>

      {/* Sub-view Rendering */}
      {subTab === '3d' && <Engine3DVisualizer />}
      {subTab === 'torque' && <HeadTorqueSimulator />}
      {subTab === 'valve' && <ValveShimCalculator />}
      {subTab === 'timing' && <TimingBeltVisualizer />}
      {subTab === 'cooling' && <CoolingCrackPrevention />}
    </div>
  );
};
