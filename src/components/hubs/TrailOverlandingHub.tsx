import React, { useState } from 'react';
import { OverlandingDrivetrainLab } from '../OverlandingDrivetrainLab';
import { TrailRescueLogbook } from '../TrailRescueLogbook';
import { DrivetrainHub } from '../DrivetrainHub';
import { Compass, ShieldAlert, Wrench } from 'lucide-react';

export const TrailOverlandingHub: React.FC = () => {
  const [subTab, setSubTab] = useState<'drivetrain-math' | 'trail-rescue' | '4wd-lube'>('drivetrain-math');

  return (
    <div className="space-y-6">
      {/* Sub-navigation bar */}
      <div className="flex items-center gap-2 p-1.5 bg-[#12151b] rounded-xl border border-[#26303d] overflow-x-auto">
        <button
          onClick={() => setSubTab('drivetrain-math')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'drivetrain-math'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#1b222d]'
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-400" /> Drivetrain, Gearing & Tire Physics
        </button>
        <button
          onClick={() => setSubTab('trail-rescue')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'trail-rescue'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#1b222d]'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" /> Glovebox Trail Rescue & Shim Logbook
        </button>
        <button
          onClick={() => setSubTab('4wd-lube')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === '4wd-lube'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#1b222d]'
          }`}
        >
          <Wrench className="w-4 h-4" /> 4WD Drivetrain & 8-Zerk Greasing
        </button>
      </div>

      {/* Sub-view Rendering */}
      {subTab === 'drivetrain-math' && <OverlandingDrivetrainLab />}
      {subTab === 'trail-rescue' && <TrailRescueLogbook />}
      {subTab === '4wd-lube' && <DrivetrainHub />}
    </div>
  );
};
