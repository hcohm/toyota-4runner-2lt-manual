import React, { useState } from 'react';
import { SHIM_SIZES_TOYOTA } from '../data/engineSpecs';
import {
  Wrench,
  Save,
  RotateCcw,
  Download
} from 'lucide-react';

interface ValveData {
  id: string;
  cylinder: number;
  type: 'Intake' | 'Exhaust';
  measuredLash: string; // mm
  installedShim: string; // mm
}

const DEFAULT_VALVES: ValveData[] = [
  { id: 'c1-in', cylinder: 1, type: 'Intake', measuredLash: '0.18', installedShim: '2.85' },
  { id: 'c1-ex', cylinder: 1, type: 'Exhaust', measuredLash: '0.38', installedShim: '2.90' },
  { id: 'c2-in', cylinder: 2, type: 'Intake', measuredLash: '0.24', installedShim: '2.80' },
  { id: 'c2-ex', cylinder: 2, type: 'Exhaust', measuredLash: '0.46', installedShim: '2.95' },
  { id: 'c3-in', cylinder: 3, type: 'Intake', measuredLash: '0.26', installedShim: '2.80' },
  { id: 'c3-ex', cylinder: 3, type: 'Exhaust', measuredLash: '0.42', installedShim: '2.85' },
  { id: 'c4-in', cylinder: 4, type: 'Intake', measuredLash: '0.32', installedShim: '2.90' },
  { id: 'c4-ex', cylinder: 4, type: 'Exhaust', measuredLash: '0.44', installedShim: '2.85' }
];

export const ValveShimCalculator: React.FC = () => {
  const [valves, setValves] = useState<ValveData[]>(() => {
    const saved = localStorage.getItem('4runner_2lt_valve_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return DEFAULT_VALVES;
  });

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleUpdate = (id: string, field: 'measuredLash' | 'installedShim', value: string) => {
    const updated = valves.map((v) => (v.id === id ? { ...v, [field]: value } : v));
    setValves(updated);
  };

  const saveToStorage = () => {
    localStorage.setItem('4runner_2lt_valve_data', JSON.stringify(valves));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const resetToDefaults = () => {
    setValves(DEFAULT_VALVES);
    localStorage.setItem('4runner_2lt_valve_data', JSON.stringify(DEFAULT_VALVES));
  };

  const exportShimReport = () => {
    const lines = [
      '1991 TOYOTA 4RUNNER / HILUX SURF 2L-T - 8-VALVE SHIM & CLEARANCE REPORT',
      `Generated: ${new Date().toLocaleDateString()}`,
      '------------------------------------------------------------------------',
      'Cylinder | Valve Type | Measured Lash | Installed Shim | Target Lash | Required Shim | OEM Part Number',
      '------------------------------------------------------------------------'
    ];

    valves.forEach((v) => {
      const calc = calculateShim(v);
      const reqSize = calc ? `${calc.recommendedShim.size.toFixed(2)} mm` : 'N/A';
      const partNo = calc ? calc.recommendedShim.partNo : 'N/A';
      const target = v.type === 'Intake' ? '0.25 mm' : '0.45 mm';
      lines.push(
        `Cyl ${v.cylinder}   | ${v.type.padEnd(10)} | ${v.measuredLash.padEnd(13)} mm | ${v.installedShim.padEnd(14)} mm | ${target.padEnd(11)} | ${reqSize.padEnd(13)} | ${partNo}`
      );
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `2LT_Valve_Shim_Report_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-toyota">FSM Section EM-32</span>
              <span className="badge-green">Gen 2 Outer Shim-on-Bucket</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Wrench className="w-6 h-6 text-emerald-500" />
              2L-T Valve Lash & Shim Calculator Suite (8 Valves)
            </h2>
            <p className="text-sm text-gray-400 mt-1 max-w-3xl leading-relaxed">
              Calculate exact replacement shim thicknesses matching Toyota's 17 OEM part numbers, and store your measured lash values in persistent vehicle memory.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={saveToStorage}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                savedSuccess
                  ? 'bg-emerald-600 text-white animate-bounce'
                  : 'bg-emerald-700 hover:bg-emerald-600 text-white'
              }`}
            >
              <Save className="w-4 h-4" /> {savedSuccess ? 'Saved to Memory!' : 'Save Shims to Memory'}
            </button>

            <button
              onClick={exportShimReport}
              className="px-3.5 py-2 rounded-lg bg-[#1b222c] hover:bg-[#252f3e] border border-[#2b3848] text-gray-200 hover:text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Export Report"
            >
              <Download className="w-4 h-4" /> Export Report (.TXT)
            </button>

            <button
              onClick={resetToDefaults}
              className="p-2 rounded-lg bg-[#1b222c] border border-[#2b3848] text-gray-400 hover:text-white"
              title="Reset to Factory Defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Valve Lash Rules Callout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="tech-panel p-4 bg-[#14181f] border-cyan-900/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-cyan-400 uppercase">INTAKE VALVES (COLD):</span>
            <span className="badge-spec">0.20 – 0.30 mm</span>
          </div>
          <p className="text-gray-300 text-[11px] font-sans leading-relaxed">
            Target: <strong className="text-white">0.25 mm</strong>. Check Cylinders 1 & 2 at TDC #1, Cylinders 3 & 4 at TDC #4.
          </p>
        </div>

        <div className="tech-panel p-4 bg-[#14181f] border-amber-900/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-400 uppercase">EXHAUST VALVES (COLD):</span>
            <span className="badge-spec">0.40 – 0.50 mm</span>
          </div>
          <p className="text-gray-300 text-[11px] font-sans leading-relaxed">
            Target: <strong className="text-white">0.45 mm</strong>. Loose exhaust lash causes valvetrain clatter; tight exhaust lash causes burnt valve seats!
          </p>
        </div>
      </div>

      {/* 8-Valve Interactive Calculation Grid (Cylinders 1 - 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((cylNum) => {
          const inValve = valves.find((v) => v.cylinder === cylNum && v.type === 'Intake')!;
          const exValve = valves.find((v) => v.cylinder === cylNum && v.type === 'Exhaust')!;
          const inCalc = calculateShim(inValve);
          const exCalc = calculateShim(exValve);

          return (
            <div key={cylNum} className="tech-panel p-5 bg-[#12161c] border-[#242e3c] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#242f3d]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-600" />
                  <h3 className="font-bold text-base text-white font-mono">CYLINDER NO. {cylNum}</h3>
                </div>
                <span className="badge-toyota text-[10px]">2 Valves / Cylinder</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                {/* Intake Valve Box */}
                <div
                  className={`p-3.5 rounded-xl border space-y-3 ${
                    inCalc?.inSpec
                      ? 'bg-[#14221b] border-emerald-500/50'
                      : 'bg-[#221617] border-red-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400 uppercase">INTAKE</span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                        inCalc?.inSpec
                          ? 'bg-emerald-950 text-emerald-300'
                          : 'bg-red-950 text-red-300 animate-pulse'
                      }`}
                    >
                      {inCalc?.inSpec ? 'IN SPEC' : inCalc?.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-0.5">Measured Lash (mm):</label>
                      <input
                        type="number"
                        step="0.01"
                        value={inValve.measuredLash}
                        onChange={(e) => handleUpdate(inValve.id, 'measuredLash', e.target.value)}
                        className="w-full bg-[#0d1014] border border-[#2b3543] rounded-lg px-2.5 py-1.5 text-white text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-0.5">Installed Shim (mm):</label>
                      <input
                        type="number"
                        step="0.05"
                        value={inValve.installedShim}
                        onChange={(e) => handleUpdate(inValve.id, 'installedShim', e.target.value)}
                        className="w-full bg-[#0d1014] border border-[#2b3543] rounded-lg px-2.5 py-1.5 text-white text-xs"
                      />
                    </div>
                  </div>

                  {inCalc && (
                    <div className="pt-2 border-t border-[#2a3442] space-y-1 text-[11px]">
                      <div className="flex justify-between text-gray-300">
                        <span>Required Shim:</span>
                        <strong className="text-emerald-400">{inCalc.recommendedShim.size.toFixed(2)} mm</strong>
                      </div>
                      <div className="flex justify-between text-gray-400 text-[10px]">
                        <span>Toyota OEM Part:</span>
                        <span className="text-cyan-300">{inCalc.recommendedShim.partNo}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Exhaust Valve Box */}
                <div
                  className={`p-3.5 rounded-xl border space-y-3 ${
                    exCalc?.inSpec
                      ? 'bg-[#14221b] border-emerald-500/50'
                      : 'bg-[#221617] border-red-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 uppercase">EXHAUST</span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                        exCalc?.inSpec
                          ? 'bg-emerald-950 text-emerald-300'
                          : 'bg-red-950 text-red-300 animate-pulse'
                      }`}
                    >
                      {exCalc?.inSpec ? 'IN SPEC' : exCalc?.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-0.5">Measured Lash (mm):</label>
                      <input
                        type="number"
                        step="0.01"
                        value={exValve.measuredLash}
                        onChange={(e) => handleUpdate(exValve.id, 'measuredLash', e.target.value)}
                        className="w-full bg-[#0d1014] border border-[#2b3543] rounded-lg px-2.5 py-1.5 text-white text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-0.5">Installed Shim (mm):</label>
                      <input
                        type="number"
                        step="0.05"
                        value={exValve.installedShim}
                        onChange={(e) => handleUpdate(exValve.id, 'installedShim', e.target.value)}
                        className="w-full bg-[#0d1014] border border-[#2b3543] rounded-lg px-2.5 py-1.5 text-white text-xs"
                      />
                    </div>
                  </div>

                  {exCalc && (
                    <div className="pt-2 border-t border-[#2a3442] space-y-1 text-[11px]">
                      <div className="flex justify-between text-gray-300">
                        <span>Required Shim:</span>
                        <strong className="text-emerald-400">{exCalc.recommendedShim.size.toFixed(2)} mm</strong>
                      </div>
                      <div className="flex justify-between text-gray-400 text-[10px]">
                        <span>Toyota OEM Part:</span>
                        <span className="text-cyan-300">{exCalc.recommendedShim.partNo}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
