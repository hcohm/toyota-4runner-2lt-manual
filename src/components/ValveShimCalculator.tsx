import React, { useState } from 'react';
import { SHIM_SIZES_TOYOTA } from '../data/engineSpecs';
import { Wrench, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

interface ValveData {
  id: string;
  cylinder: number;
  type: 'Intake' | 'Exhaust';
  measuredLash: string; // mm
  installedShim: string; // mm
}

const INITIAL_VALVES: ValveData[] = [
  { id: "c1-in", cylinder: 1, type: "Intake", measuredLash: "0.18", installedShim: "2.85" },
  { id: "c1-ex", cylinder: 1, type: "Exhaust", measuredLash: "0.38", installedShim: "2.90" },
  { id: "c2-in", cylinder: 2, type: "Intake", measuredLash: "0.24", installedShim: "2.80" },
  { id: "c2-ex", cylinder: 2, type: "Exhaust", measuredLash: "0.46", installedShim: "2.95" },
  { id: "c3-in", cylinder: 3, type: "Intake", measuredLash: "0.26", installedShim: "2.80" },
  { id: "c3-ex", cylinder: 3, type: "Exhaust", measuredLash: "0.42", installedShim: "2.85" },
  { id: "c4-in", cylinder: 4, type: "Intake", measuredLash: "0.32", installedShim: "2.90" },
  { id: "c4-ex", cylinder: 4, type: "Exhaust", measuredLash: "0.44", installedShim: "2.85" },
];

export const ValveShimCalculator: React.FC = () => {
  const [valves, setValves] = useState<ValveData[]>(INITIAL_VALVES);

  const handleUpdate = (id: string, field: 'measuredLash' | 'installedShim', value: string) => {
    setValves(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const calculateShim = (valve: ValveData) => {
    const lash = parseFloat(valve.measuredLash);
    const shim = parseFloat(valve.installedShim);
    if (isNaN(lash) || isNaN(shim)) return null;

    const isIntake = valve.type === 'Intake';
    const minSpec = isIntake ? 0.20 : 0.40;
    const maxSpec = isIntake ? 0.30 : 0.50;
    const target = isIntake ? 0.25 : 0.45;

    const inSpec = lash >= minSpec && lash <= maxSpec;
    const status = inSpec ? 'ok' : lash < minSpec ? 'tight' : 'loose';

    // Formula: N = T + (A - Target)
    const exactRequired = shim + (lash - target);

    // Find closest 0.05mm available shim in Toyota list
    let closestShim = SHIM_SIZES_TOYOTA[0];
    let minDiff = Math.abs(closestShim.size - exactRequired);

    for (const s of SHIM_SIZES_TOYOTA) {
      const diff = Math.abs(s.size - exactRequired);
      if (diff < minDiff) {
        minDiff = diff;
        closestShim = s;
      }
    }

    return {
      status,
      inSpec,
      exactRequired: exactRequired.toFixed(3),
      recommendedShim: closestShim,
      diffFromCurrent: (closestShim.size - shim).toFixed(2),
      minSpec,
      maxSpec,
      target
    };
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="tech-panel p-6 bg-gradient-to-r from-[#18202b] via-[#1a1d20] to-[#1c241e] border-emerald-900/50">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge-toyota">FSM Section EM-32</span>
          <span className="badge-green">Gen 2 Outer Shim-on-Bucket</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Wrench className="w-6 h-6 text-emerald-500" />
          2L-T Valve Clearance & Shim Calculator (Cold Spec)
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Automated Toyota formula engine ($N = T + [A - Target]$). Computes required outer adjusting shims and matches official Toyota part numbers (17 sizes: 2.50 mm to 3.30 mm).
        </p>
      </div>

      {/* Target Specs Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="tech-card border-blue-900/40 bg-[#16202c]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-blue-400">INTAKE VALVES (COLD)</span>
            <span className="badge-blue">Target: 0.25 mm</span>
          </div>
          <div className="text-lg font-bold text-white mt-1">0.20 – 0.30 mm (0.008 – 0.012 in)</div>
          <div className="text-xs text-gray-400 mt-1 font-mono">Formula: N = T + (A - 0.25 mm)</div>
        </div>

        <div className="tech-card border-amber-900/40 bg-[#262015]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400">EXHAUST VALVES (COLD)</span>
            <span className="badge-spec">Target: 0.45 mm</span>
          </div>
          <div className="text-lg font-bold text-white mt-1">0.40 – 0.50 mm (0.016 – 0.020 in)</div>
          <div className="text-xs text-gray-400 mt-1 font-mono">Formula: N = T + (A - 0.45 mm)</div>
        </div>
      </div>

      {/* Interactive 8-Valve Table */}
      <div className="tech-panel p-6 bg-[#13161a]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">8-Valve Bank Measurement Sheet</h3>
          <span className="text-xs text-gray-400 font-mono">Firing Order: 1 - 3 - 4 - 2</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#2d343e] text-gray-400">
                <th className="py-2.5 px-3">CYLINDER / VALVE</th>
                <th className="py-2.5 px-3">MEASURED LASH (A)</th>
                <th className="py-2.5 px-3">CURRENT SHIM (T)</th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3">RECOMMENDED REPLACEMENT SHIM</th>
                <th className="py-2.5 px-3">TOYOTA PART #</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222831] text-gray-300">
              {valves.map((v) => {
                const res = calculateShim(v);
                return (
                  <tr key={v.id} className="hover:bg-[#1c222b]">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">Cylinder #{v.cylinder}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            v.type === 'Intake'
                              ? 'bg-blue-950 text-blue-400 border border-blue-800/60'
                              : 'bg-amber-950 text-amber-400 border border-amber-800/60'
                          }`}
                        >
                          {v.type}
                        </span>
                      </div>
                    </td>

                    {/* Measured Lash Input */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          step="0.01"
                          min="0.05"
                          max="0.80"
                          value={v.measuredLash}
                          onChange={(e) => handleUpdate(v.id, 'measuredLash', e.target.value)}
                          className="w-20 bg-[#0e1013] border border-[#333a42] rounded px-2 py-1 text-white font-bold focus:border-emerald-500 focus:outline-none"
                        />
                        <span className="text-gray-500">mm</span>
                      </div>
                    </td>

                    {/* Current Installed Shim Input */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          step="0.05"
                          min="2.50"
                          max="3.30"
                          value={v.installedShim}
                          onChange={(e) => handleUpdate(v.id, 'installedShim', e.target.value)}
                          className="w-20 bg-[#0e1013] border border-[#333a42] rounded px-2 py-1 text-white font-bold focus:border-emerald-500 focus:outline-none"
                        />
                        <span className="text-gray-500">mm</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3">
                      {res?.status === 'ok' && (
                        <span className="badge-green flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3.5 h-3.5" /> IN SPEC
                        </span>
                      )}
                      {res?.status === 'tight' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-red-950 text-red-400 border border-red-800 gap-1 w-fit">
                          <AlertTriangle className="w-3.5 h-3.5" /> TIGHT (Burn Risk)
                        </span>
                      )}
                      {res?.status === 'loose' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-950 text-amber-400 border border-amber-800 gap-1 w-fit">
                          <AlertTriangle className="w-3.5 h-3.5" /> LOOSE (Noisy)
                        </span>
                      )}
                    </td>

                    {/* Recommended Shim Result */}
                    <td className="py-3 px-3">
                      {res ? (
                        res.inSpec ? (
                          <span className="text-gray-400">Keep current ({v.installedShim} mm)</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold text-sm">
                              {res.recommendedShim.size.toFixed(2)} mm
                            </span>
                            <span className="text-[11px] text-gray-400">
                              ({parseFloat(res.diffFromCurrent) > 0 ? `+${res.diffFromCurrent}` : res.diffFromCurrent} mm)
                            </span>
                          </div>
                        )
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>

                    {/* Toyota OEM Part Number */}
                    <td className="py-3 px-3 text-gray-300">
                      {res && !res.inSpec ? (
                        <span className="font-mono text-emerald-400 bg-[#15231c] px-2 py-0.5 rounded border border-emerald-800/50">
                          {res.recommendedShim.partNo}
                        </span>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SST Service Instructions */}
      <div className="tech-panel p-6 bg-[#181c22]">
        <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-400" />
          Shim-on-Bucket Replacement Technique (Without Cam Removal)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-300">
          <div className="p-3 bg-[#13161a] rounded-lg border border-[#2a313b]">
            <div className="font-bold text-blue-400 mb-1">1. Rotate Lobe Upward</div>
            Turn the crankshaft so the camshaft lobe of the valve being adjusted points vertically away from the bucket follower.
          </div>
          <div className="p-3 bg-[#13161a] rounded-lg border border-[#2a313b]">
            <div className="font-bold text-blue-400 mb-1">2. SST 09248-64011 Depress</div>
            Attach SST valve lifter depressor over camshaft. Tighten screw to press bucket down, then slide stopper wedge between cam and bucket rim.
          </div>
          <div className="p-3 bg-[#13161a] rounded-lg border border-[#2a313b]">
            <div className="font-bold text-blue-400 mb-1">3. Magnetic Extraction & Install</div>
            Use magnetic pick (SST 09248-73010) through bucket notch to pop old shim out. Insert new shim with stamped size facing DOWN into recess.
          </div>
        </div>
      </div>
    </div>
  );
};
