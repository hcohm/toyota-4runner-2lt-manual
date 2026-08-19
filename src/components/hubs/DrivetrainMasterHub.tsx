import React, { useState } from 'react';
import { OverlandingDrivetrainLab } from '../OverlandingDrivetrainLab';
import { DrivetrainHub } from '../DrivetrainHub';
import { MasterManualHub } from '../MasterManualHub';
import { Compass, Wrench, FileText } from 'lucide-react';

export const DrivetrainMasterHub: React.FC = () => {
  const [subTab, setSubTab] = useState<'gearing-math' | '4wd-lube' | 'fsm-specs'>('gearing-math');

  return (
    <div className="space-y-6">
      {/* Sub-navigation bar */}
      <div className="flex items-center gap-2 p-1.5 bg-[#12151b] rounded-xl border border-[#26303d] overflow-x-auto">
        <button
          onClick={() => setSubTab('gearing-math')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'gearing-math'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#1b222d]'
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-400" /> Drivetrain, Gearing & Tire Physics
        </button>
        <button
          onClick={() => setSubTab('4wd-lube')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === '4wd-lube'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#1b222d]'
          }`}
        >
          <Wrench className="w-4 h-4 text-amber-400" /> 4WD Transfer Case & 8-Zerk Greasing
        </button>
        <button
          onClick={() => setSubTab('fsm-specs')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'fsm-specs'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#1b222d]'
          }`}
        >
          <FileText className="w-4 h-4 text-cyan-400" /> Drivetrain FSM Tolerances & Specs
        </button>
      </div>

      {/* Sub-view Rendering */}
      {subTab === 'gearing-math' && <OverlandingDrivetrainLab />}
      {subTab === '4wd-lube' && <DrivetrainHub />}
      {subTab === 'fsm-specs' && <MasterManualHub />}
    </div>
  );
};
