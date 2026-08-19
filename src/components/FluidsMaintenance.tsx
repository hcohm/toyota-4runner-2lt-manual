import React, { useState } from 'react';
import { FLUID_SPECIFICATIONS } from '../data/fluidSpecs';
import type { FluidCapacity } from '../data/fluidSpecs';
import { Droplet, Calendar, ShieldAlert } from 'lucide-react';

export const FluidsMaintenance: React.FC = () => {
  const [unitMode, setUnitMode] = useState<'liters' | 'quarts' | 'gallons'>('liters');

  const intervals = [
    { label: "5,000 km (3,000 mi)", name: "5k", desc: "Engine oil (6.7L 15W-40) & OEM dual-stage oil filter (90915-30002). Clean air filter." },
    { label: "10,000 km (6,000 mi)", name: "10k", desc: "8-point chassis zerk lubrication (propeller shafts, double-cardan, idler arm). Rotate tires." },
    { label: "20,000 km (12,000 mi)", name: "20k", desc: "Replace fuel filter (23303-64010), drain water sedimenter float switch, inspect drive belts." },
    { label: "40,000 km (25,000 mi)", name: "40k", desc: "Drain & refill Manual Trans (GL-4), Transfer case, Front IFS Diff (GL-5), Rear Diff (GL-5/LSD). Flush Coolant (10.5L) & Brake fluid (DOT 4). Inspect valve lash (cold)." },
    { label: "100,000 km (60,000 mi)", name: "100k", desc: "Timing belt (13568-59065), tensioner idler pulley & spring, water pump, front crank/cam oil seals." },
  ];

  const getCapacityText = (f: FluidCapacity) => {
    if (unitMode === 'liters') return `${f.capacityLiters} L`;
    if (unitMode === 'quarts') return `${f.capacityQuarts} US Qts`;
    return `${(f.capacityLiters * 0.264172).toFixed(2)} US Gal`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="tech-panel p-6 bg-gradient-to-r from-[#172421] via-[#1a1d20] to-[#152028] border-emerald-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-toyota">Factory Capacities & Schedule</span>
              <span className="badge-green">Lubrication & Service Manual</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Droplet className="w-6 h-6 text-emerald-400" />
              Fluids, Capacities & Periodic Maintenance Schedule
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Exact volume specifications, fluid grades (GL-4 vs GL-5, Toyota Red LLC, Dexron ATF), and 5k to 100k km maintenance schedules.
            </p>
          </div>

          <div className="bg-[#121417] p-1 rounded-lg border border-[#2c3238] flex items-center gap-1">
            <span className="text-[11px] font-mono text-gray-500 px-2 uppercase font-bold">Unit:</span>
            <button
              onClick={() => setUnitMode('liters')}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                unitMode === 'liters' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Liters (L)
            </button>
            <button
              onClick={() => setUnitMode('quarts')}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                unitMode === 'quarts' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Quarts (Qts)
            </button>
            <button
              onClick={() => setUnitMode('gallons')}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                unitMode === 'gallons' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Gallons
            </button>
          </div>
        </div>
      </div>

      {/* Fluids & Capacities Table */}
      <div className="tech-panel p-6 bg-[#13161a]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Droplet className="w-5 h-5 text-emerald-400" />
            Master Fluid Specifications & Capacities
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#2d343e] text-gray-400">
                <th className="py-2.5 px-3">SYSTEM / RESERVOIR</th>
                <th className="py-2.5 px-3">CAPACITY</th>
                <th className="py-2.5 px-3">RECOMMENDED FLUID SPEC</th>
                <th className="py-2.5 px-3">SERVICE INTERVAL</th>
                <th className="py-2.5 px-3">TECHNICAL NOTES & WARNINGS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222831] text-gray-300">
              {FLUID_SPECIFICATIONS.map((f, idx) => (
                <tr key={idx} className="hover:bg-[#1c222b]">
                  <td className="py-3 px-3 font-bold text-white">
                    {f.system}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-base font-bold text-emerald-400">
                      {getCapacityText(f)}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-white font-bold">{f.fluidType}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{f.recommendedSpec}</div>
                  </td>
                  <td className="py-3 px-3 text-amber-300">
                    {f.serviceInterval}
                  </td>
                  <td className="py-3 px-3 max-w-[340px]">
                    <div className="text-gray-300 text-[11px] leading-relaxed">{f.notes}</div>
                    {f.criticalWarning && (
                      <div className="mt-1 text-red-400 text-[11px] flex items-start gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span>{f.criticalWarning}</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Periodic Maintenance Interval Cards */}
      <div className="tech-panel p-6 bg-[#13161a]">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          Toyota 2L-T Periodic Maintenance Schedule
        </h3>

        <div className="space-y-3">
          {intervals.map((inv, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[#2b3440] bg-[#171c24] hover:bg-[#1c232d] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/50 flex flex-col items-center justify-center font-mono font-bold text-blue-400 flex-shrink-0">
                  <span className="text-sm leading-none">{inv.name}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-mono">{inv.label}</h4>
                  <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">{inv.desc}</p>
                </div>
              </div>
              <span className="badge-spec self-start sm:self-center font-mono text-[11px]">
                Factory FSM Schedule
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
