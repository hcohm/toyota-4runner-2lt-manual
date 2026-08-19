import React, { useState } from 'react';
import { CHASSIS_GREASE_ZERK_MAP } from '../data/fluidSpecs';
import type { GreasingPoint } from '../data/fluidSpecs';
import { ShieldAlert, AlertTriangle, Layers, Droplets, Compass } from 'lucide-react';

export const DrivetrainHub: React.FC = () => {
  const [selectedZerk, setSelectedZerk] = useState<GreasingPoint>(CHASSIS_GREASE_ZERK_MAP[0]);
  const [transType, setTransType] = useState<'manual' | 'auto'>('manual');
  const [hubType, setHubType] = useState<'add' | 'aisin'>('add');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="tech-panel p-6 bg-gradient-to-r from-[#17222c] via-[#1a1d20] to-[#15231e] border-blue-900/50">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge-toyota">LN130 4WD Driveline Architecture</span>
          <span className="badge-blue">IFS Front 7.5" + Solid Rear 8.0"</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Compass className="w-6 h-6 text-blue-500" />
          Drivetrain, 4WD Systems & 8-Point Chassis Lubrication
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Complete guide for W56 / R150F / R151F manual gearboxes, A340H automatics, transfer case fluid compatibility, ADD vacuum front axle, and driveshaft service.
        </p>
      </div>

      {/* Yellow Metal GL-4 vs GL-5 Warning Alert */}
      <div className="tech-card border-amber-900/60 bg-[#251d14] p-5">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          CRITICAL: MANUAL TRANSMISSION GL-4 ONLY (SYNCHRONIZER PROTECTION)
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          Standard API GL-5 gear oils contain aggressive sulfur-phosphorus Extreme Pressure (EP) additives designed for hypoid differential gears. In manual transmissions (W56, R150F, R151F), these chemicals thermally react with and corrode the soft brass synchronizer rings, causing hard shifting and gear crunching. <strong>Always use dedicated API GL-4 gear oil (e.g. Redline MT-90 or OEM Toyota GL-4 75W-90)</strong>.
        </p>
      </div>

      {/* Transmission & Transfer Case Configuration Matrix */}
      <div className="tech-panel p-6 bg-[#13161a]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-base font-bold text-white uppercase font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            Transmission & Transfer Case Specification Matrix
          </h3>
          <div className="bg-[#121417] p-1 rounded-lg border border-[#2c3238] flex">
            <button
              onClick={() => setTransType('manual')}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                transType === 'manual' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              5-Speed Manual (R150F / W56)
            </button>
            <button
              onClick={() => setTransType('auto')}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                transType === 'auto' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              4-Speed Automatic (A340H / A343F)
            </button>
          </div>
        </div>

        {transType === 'manual' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="tech-card bg-[#181d24]">
              <div className="text-xs font-mono font-bold text-blue-400 uppercase">Manual Gearbox (R150F / R151F / W56)</div>
              <div className="mt-2 space-y-1.5 text-xs">
                <div>• <strong className="text-white">Capacity:</strong> 3.0 Liters (3.2 US Qts)</div>
                <div>• <strong className="text-white">Fluid Grade:</strong> SAE 75W-90 API GL-4</div>
                <div>• <strong className="text-white">Fill / Drain Plug:</strong> 24mm Hex Bolt (Torque: 37 Nm / 27 ft-lb)</div>
                <div>• <strong className="text-white">Level Check:</strong> Fluid level even with bottom edge of fill port</div>
              </div>
            </div>

            <div className="tech-card bg-[#181d24]">
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase">Transfer Case (VF2A / Top-Shift Manual)</div>
              <div className="mt-2 space-y-1.5 text-xs">
                <div>• <strong className="text-white">Capacity:</strong> 1.4 Liters (1.5 US Qts)</div>
                <div>• <strong className="text-white">Fluid Grade:</strong> SAE 75W-90 API GL-4 or GL-5</div>
                <div>• <strong className="text-white">Ratios:</strong> High (1.000:1) | Low (2.566:1)</div>
                <div>• <strong className="text-white">Operation:</strong> 2H &rarr; 4H (Shift on fly &lt;80km/h with ADD) &rarr; N &rarr; 4L (Stop vehicle)</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="tech-card bg-[#181d24]">
              <div className="text-xs font-mono font-bold text-amber-400 uppercase">Automatic Transmission (A340H / A343F)</div>
              <div className="mt-2 space-y-1.5 text-xs">
                <div>• <strong className="text-white">Service Drain & Fill:</strong> 4.5 Liters (4.8 US Qts)</div>
                <div>• <strong className="text-white">Total Overhaul Capacity:</strong> 10.2 Liters</div>
                <div>• <strong className="text-white">Fluid Grade:</strong> Dexron II / Dexron III ATF</div>
                <div>• <strong className="text-white">Dipstick Check:</strong> Engine IDLING in PARK at hot operating temp (75°C)</div>
              </div>
            </div>

            <div className="tech-card bg-[#181d24]">
              <div className="text-xs font-mono font-bold text-amber-400 uppercase">Integrated Hydraulic Transfer Case (A340H)</div>
              <div className="mt-2 space-y-1.5 text-xs">
                <div>• <strong className="text-white">Fluid Type:</strong> Dexron III ATF (Shares/interconnects with transmission ATF)</div>
                <div>• <strong className="text-white">Note:</strong> Never put 75W-90 gear oil in an A340H transfer case!</div>
                <div>• <strong className="text-white">Center Diff Lock:</strong> Electronic push-button on 4WD lever</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4WD Front Axle Hubs: ADD vs Aisin Manual */}
      <div className="tech-panel p-6 bg-[#13161a]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-base font-bold text-white uppercase font-mono">
            Front Axle 4WD System Selection (ADD vs Aisin Manual Hubs)
          </h3>
          <div className="bg-[#121417] p-1 rounded-lg border border-[#2c3238] flex">
            <button
              onClick={() => setHubType('add')}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                hubType === 'add' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              ADD Vacuum Actuator (Stock)
            </button>
            <button
              onClick={() => setHubType('aisin')}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                hubType === 'aisin' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Aisin Manual Locking Hubs
            </button>
          </div>
        </div>

        {hubType === 'add' ? (
          <div className="p-4 bg-[#181d24] rounded-lg border border-[#2d343e] text-xs text-gray-300 space-y-2">
            <div className="font-bold text-amber-400 text-sm">Automatic Disconnecting Differential (ADD)</div>
            <p>
              Uses two vacuum switching valves (VSVs - Blue for 4WD engage, Brown for 2WD disengage) mounted on the right inner fender. When shifting into 4H, the transfer case switch energizes the Blue VSV, applying manifold vacuum to the differential actuator diaphragm to lock the left axle shaft.
            </p>
            <div className="p-3 bg-[#111417] rounded border border-[#232931] text-[11px] font-mono text-gray-400">
              <strong className="text-amber-300">Common ADD Failure:</strong> If the 4WD dash light flashes and front wheels do not pull, check cracked rubber vacuum hoses below the battery tray or check VSV solenoid resistance (38–45 Ω).
            </div>
          </div>
        ) : (
          <div className="p-4 bg-[#181d24] rounded-lg border border-[#2d343e] text-xs text-gray-300 space-y-2">
            <div className="font-bold text-emerald-400 text-sm">Aisin Manual Locking Hub Conversion</div>
            <p>
              The premier off-road reliability upgrade. Replaces the full-time locked wheel drive flanges with mechanical dial hubs. In FREE mode, the front CV axles and differential remain completely stationary, saving fuel, eliminating CV boot wear, and reducing steering vibration.
            </p>
            <div className="p-3 bg-[#111417] rounded border border-[#232931] text-[11px] font-mono text-gray-400">
              <strong className="text-emerald-300">Lubrication Rule:</strong> Use only a very thin wipe of wheel bearing grease on the sliding pawl gear. Thick packed grease will lock the spring in cold sub-zero weather.
            </div>
          </div>
        )}
      </div>

      {/* 8-Point Chassis Greasing Diagram & Map */}
      <div className="tech-panel p-6 bg-[#13161a]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white uppercase font-mono flex items-center gap-2">
            <Droplets className="w-5 h-5 text-emerald-400" />
            8-Point Chassis & Driveshaft Greasing Diagram (Every 10,000 km)
          </h3>
          <span className="text-xs text-gray-400 font-mono">NLGI No. 2 Lithium / Moly Grease</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Zerk List Selector */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {CHASSIS_GREASE_ZERK_MAP.map((z) => (
              <button
                key={z.id}
                onClick={() => setSelectedZerk(z)}
                className={`w-full text-left p-3 rounded-lg border transition-all text-xs font-mono ${
                  selectedZerk.id === z.id
                    ? 'border-emerald-500 bg-[#16271e] text-white shadow-md'
                    : 'border-[#282f38] bg-[#171b20] text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400">Zerk #{z.id}: {z.component}</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">{z.location}</div>
              </button>
            ))}
          </div>

          {/* Selected Zerk Detail Card */}
          <div className="lg:col-span-2 tech-card bg-[#181d24] border-emerald-900/40 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#2a313b]">
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase">ZERK POINT #{selectedZerk.id}</span>
                  <h4 className="text-lg font-bold text-white">{selectedZerk.component}</h4>
                </div>
                <span className="badge-spec">{selectedZerk.location}</span>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <span className="font-mono text-gray-400 uppercase font-bold block mb-1">Recommended Grease:</span>
                  <span className="text-white font-mono bg-[#111417] px-2.5 py-1 rounded border border-[#29323c]">
                    {selectedZerk.greaseType}
                  </span>
                </div>

                <div>
                  <span className="font-mono text-gray-400 uppercase font-bold block mb-1">Application Spec:</span>
                  <span className="text-emerald-300 font-bold">{selectedZerk.shots}</span>
                </div>

                <div>
                  <span className="font-mono text-gray-400 uppercase font-bold block mb-1">Service Notes:</span>
                  <p className="text-gray-300 leading-relaxed">{selectedZerk.notes}</p>
                </div>
              </div>
            </div>

            {/* Slip Yoke Hydraulic Lock Alert */}
            {(selectedZerk.id === 2 || selectedZerk.id === 5) && (
              <div className="mt-4 p-3 rounded bg-red-950/70 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>
                  <strong>HYDRAULIC LOCK WARNING:</strong> Never pump more than 1–2 shots of grease into slip yokes. Excess grease prevents the driveshaft from compressing when hitting bumps, transmitting high impact force into the transfer case rear bearing and cracking the extension housing!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
