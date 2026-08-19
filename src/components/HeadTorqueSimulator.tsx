import React, { useState } from 'react';
import { GASKET_THICKNESS_SELECTOR } from '../data/engineSpecs';
import { CheckCircle2, RotateCcw, ArrowRight, Gauge, Wrench, AlertTriangle } from 'lucide-react';

// 18-bolt 2L-T layout sequence (Center outward criss-cross order)
// Cylinders 1 to 4 arranged Front (left) to Rear (right)
// Top row (Intake side), Bottom row (Exhaust side)
interface BoltPosition {
  id: number;
  seqTighten: number; // tightening order 1..18
  seqLoosen: number;  // loosening order 1..18 (reverse)
  row: 'intake' | 'exhaust';
  col: number; // 1 to 9
  x: number; // percentage in diagram
  y: number;
  label: string;
}

const BOLTS_18: BoltPosition[] = [
  // Top Row (Intake Side - 9 bolts)
  { id: 1, seqTighten: 17, seqLoosen: 2, row: 'intake', col: 1, x: 10, y: 28, label: "Front Int #1" },
  { id: 2, seqTighten: 11, seqLoosen: 8, row: 'intake', col: 2, x: 20, y: 28, label: "Int #2" },
  { id: 3, seqTighten: 9,  seqLoosen: 10, row: 'intake', col: 3, x: 30, y: 28, label: "Int #3" },
  { id: 4, seqTighten: 3,  seqLoosen: 16, row: 'intake', col: 4, x: 40, y: 28, label: "Int #4" },
  { id: 5, seqTighten: 1,  seqLoosen: 18, row: 'intake', col: 5, x: 50, y: 28, label: "CENTER Int #5" },
  { id: 6, seqTighten: 6,  seqLoosen: 13, row: 'intake', col: 6, x: 60, y: 28, label: "Int #6" },
  { id: 7, seqTighten: 8,  seqLoosen: 11, row: 'intake', col: 7, x: 70, y: 28, label: "Int #7" },
  { id: 8, seqTighten: 14, seqLoosen: 5,  row: 'intake', col: 8, x: 80, y: 28, label: "Int #8" },
  { id: 9, seqTighten: 16, seqLoosen: 3,  row: 'intake', col: 9, x: 90, y: 28, label: "Rear Int #9" },

  // Bottom Row (Exhaust Side - 9 bolts)
  { id: 10, seqTighten: 18, seqLoosen: 1,  row: 'exhaust', col: 1, x: 10, y: 72, label: "Front Exh #10" },
  { id: 11, seqTighten: 12, seqLoosen: 7,  row: 'exhaust', col: 2, x: 20, y: 72, label: "Exh #11" },
  { id: 12, seqTighten: 10, seqLoosen: 9,  row: 'exhaust', col: 3, x: 30, y: 72, label: "Exh #12" },
  { id: 13, seqTighten: 4,  seqLoosen: 15, row: 'exhaust', col: 4, x: 40, y: 72, label: "Exh #13" },
  { id: 14, seqTighten: 2,  seqLoosen: 17, row: 'exhaust', col: 5, x: 50, y: 72, label: "CENTER Exh #14" },
  { id: 15, seqTighten: 5,  seqLoosen: 14, row: 'exhaust', col: 6, x: 60, y: 72, label: "Exh #15" },
  { id: 16, seqTighten: 7,  seqLoosen: 12, row: 'exhaust', col: 7, x: 70, y: 72, label: "Exh #16" },
  { id: 17, seqTighten: 13, seqLoosen: 6,  row: 'exhaust', col: 8, x: 80, y: 72, label: "Exh #17" },
  { id: 18, seqTighten: 15, seqLoosen: 4,  row: 'exhaust', col: 9, x: 90, y: 72, label: "Rear Exh #18" },
];

export const HeadTorqueSimulator: React.FC = () => {
  const [activeStage, setActiveStage] = useState<1 | 2 | 3>(1);
  const [torquedBolts, setTorquedBolts] = useState<number[]>([]);
  const [mode, setMode] = useState<'tighten' | 'loosen'>('tighten');
  const [protrusionInput, setProtrusionInput] = useState<string>("0.82");

  const currentSeq = mode === 'tighten' ? torquedBolts.length + 1 : torquedBolts.length + 1;
  const nextTargetBolt = BOLTS_18.find(b => 
    mode === 'tighten' ? b.seqTighten === currentSeq : b.seqLoosen === currentSeq
  );

  const handleBoltClick = (bolt: BoltPosition) => {
    const targetSeq = mode === 'tighten' ? bolt.seqTighten : bolt.seqLoosen;
    if (targetSeq === currentSeq) {
      setTorquedBolts([...torquedBolts, bolt.id]);
    }
  };

  const handleAutoTorqueNext = () => {
    if (nextTargetBolt) {
      setTorquedBolts([...torquedBolts, nextTargetBolt.id]);
    }
  };

  const handleCompleteAll = () => {
    const allIds = BOLTS_18.map(b => b.id);
    setTorquedBolts(allIds);
  };

  const handleReset = () => {
    setTorquedBolts([]);
  };

  // Gasket grade calculation
  const protrusionVal = parseFloat(protrusionInput) || 0;
  const matchedGrade = GASKET_THICKNESS_SELECTOR.find(
    g => protrusionVal >= g.protrusionMin && protrusionVal <= g.protrusionMax
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="tech-panel p-6 bg-gradient-to-r from-[#1b2028] via-[#1a1d20] to-[#251517] border-red-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-toyota">FSM RM520E Section EM-44</span>
              <span className="badge-spec">2L-T Cast Iron Head</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Wrench className="w-6 h-6 text-red-500" />
              18-Bolt Cylinder Head Torque Sequencer & Angle Tracker
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Precision 3-Stage criss-cross tightening protocol. Center-to-outer expansion prevents thermal warp and fire ring leakage.
            </p>
          </div>

          {/* Mode & Reset Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-[#121417] p-1 rounded-lg border border-[#2c3238] flex">
              <button
                onClick={() => { setMode('tighten'); handleReset(); }}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                  mode === 'tighten' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                Tightening Sequence
              </button>
              <button
                onClick={() => { setMode('loosen'); handleReset(); }}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                  mode === 'loosen' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                Loosening Sequence (Removal)
              </button>
            </div>

            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-[#21262d] hover:bg-[#2c3238] text-gray-300 hover:text-white transition-all border border-[#333a42]"
              title="Reset Pattern"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stage Selector Tabs */}
      {mode === 'tighten' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => { setActiveStage(1); handleReset(); }}
            className={`tech-card text-left transition-all relative overflow-hidden ${
              activeStage === 1 ? 'border-red-500 bg-[#251b1e] ring-1 ring-red-500' : 'opacity-75 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400 font-bold">STAGE 1: BASE TORQUE</span>
              <Gauge className={`w-4 h-4 ${activeStage === 1 ? 'text-red-400' : 'text-gray-500'}`} />
            </div>
            <div className="text-xl font-bold text-white mt-1">78 Nm (58 ft-lb)</div>
            <div className="text-xs text-gray-400 mt-1">Lightly oiled 12-point bolts in 18-step criss-cross pattern.</div>
          </button>

          <button
            onClick={() => { setActiveStage(2); handleReset(); }}
            className={`tech-card text-left transition-all relative overflow-hidden ${
              activeStage === 2 ? 'border-amber-500 bg-[#262115] ring-1 ring-amber-500' : 'opacity-75 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400 font-bold">STAGE 2: 1ST ANGLE TURN</span>
              <Gauge className={`w-4 h-4 ${activeStage === 2 ? 'text-amber-400' : 'text-gray-500'}`} />
            </div>
            <div className="text-xl font-bold text-amber-400 mt-1">+90° Rotation</div>
            <div className="text-xs text-gray-400 mt-1">Mark 12 o'clock paint line. Turn 90° to 3 o'clock position.</div>
          </button>

          <button
            onClick={() => { setActiveStage(3); handleReset(); }}
            className={`tech-card text-left transition-all relative overflow-hidden ${
              activeStage === 3 ? 'border-emerald-500 bg-[#16261d] ring-1 ring-emerald-500' : 'opacity-75 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400 font-bold">STAGE 3: FINAL YIELD ANGLE</span>
              <Gauge className={`w-4 h-4 ${activeStage === 3 ? 'text-emerald-400' : 'text-gray-500'}`} />
            </div>
            <div className="text-xl font-bold text-emerald-400 mt-1">+90° Final (Total 180°)</div>
            <div className="text-xs text-gray-400 mt-1">Turn paint mark from 3 o'clock to 6 o'clock position.</div>
          </button>
        </div>
      )}

      {/* Main Interactive Head Graphic */}
      <div className="tech-panel p-6 bg-[#13161a]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              {mode === 'tighten' ? `Tightening Stage ${activeStage}` : 'Loosening (Removal) Sequence'}
            </span>
            <div className="text-lg font-bold text-white flex items-center gap-2">
              Progress: {torquedBolts.length} / 18 Bolts Completed
              {torquedBolts.length === 18 && (
                <span className="badge-green flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> STAGE COMPLETE
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoTorqueNext}
              disabled={torquedBolts.length >= 18}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-mono font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-md"
            >
              Torque Next #{currentSeq} <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCompleteAll}
              className="px-3 py-2 bg-[#21262d] hover:bg-[#2c3238] text-gray-300 text-xs font-mono rounded-lg transition-all border border-[#333a42]"
            >
              Complete All
            </button>
          </div>
        </div>

        {/* Cylinder Head Diagram Canvas / SVG */}
        <div className="relative w-full bg-[#0d0f12] rounded-xl border border-[#252b33] p-4 overflow-x-auto">
          <div className="min-w-[700px] h-[340px] relative bg-gradient-to-b from-[#1b1f24] to-[#121518] rounded-lg border-2 border-[#38414d] shadow-inner p-4">
            
            {/* Front & Rear Direction Indicators */}
            <div className="absolute top-2 left-4 text-xs font-mono font-bold text-red-400 flex items-center gap-1">
              <span>◀ FRONT (Timing Belt)</span>
            </div>
            <div className="absolute top-2 right-4 text-xs font-mono font-bold text-gray-400">
              REAR (Transmission) ▶
            </div>

            <div className="absolute top-12 left-4 text-[11px] font-mono text-blue-400">
              ▲ INTAKE MANIFOLD SIDE (Glow Plugs)
            </div>
            <div className="absolute bottom-3 left-4 text-[11px] font-mono text-amber-400">
              ▼ EXHAUST MANIFOLD SIDE (CT20 Turbo)
            </div>

            {/* Cylinder indicators */}
            <div className="absolute top-1/2 -translate-y-1/2 left-[12%] text-center opacity-20 pointer-events-none">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center font-mono font-black text-2xl text-gray-300">CYL 1</div>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 left-[34%] text-center opacity-20 pointer-events-none">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center font-mono font-black text-2xl text-gray-300">CYL 2</div>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 left-[56%] text-center opacity-20 pointer-events-none">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center font-mono font-black text-2xl text-gray-300">CYL 3</div>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 left-[78%] text-center opacity-20 pointer-events-none">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center font-mono font-black text-2xl text-gray-300">CYL 4</div>
            </div>

            {/* Criss Cross Alignment Connecting Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Draw animated flow path for torqued sequence */}
              {torquedBolts.length > 1 && (
                <polyline
                  points={torquedBolts
                    .map(id => {
                      const b = BOLTS_18.find(x => x.id === id);
                      return b ? `${(b.x / 100) * 680 + 10}, ${(b.y / 100) * 320 + 10}` : '';
                    })
                    .filter(Boolean)
                    .join(' ')}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="opacity-60"
                />
              )}
            </svg>

            {/* 18 Bolt Hotspots */}
            {BOLTS_18.map((bolt) => {
              const targetSeq = mode === 'tighten' ? bolt.seqTighten : bolt.seqLoosen;
              const isTorqued = torquedBolts.includes(bolt.id);
              const isNext = targetSeq === currentSeq;

              let ringClass = "border-gray-600 bg-[#1e2329] text-gray-300";
              if (isTorqued) {
                ringClass = "border-emerald-500 bg-emerald-950/90 text-emerald-300 ring-2 ring-emerald-500/50";
              } else if (isNext) {
                ringClass = "border-red-500 bg-red-950 text-white ring-4 ring-red-500/80 animate-pulse scale-110";
              }

              return (
                <button
                  key={bolt.id}
                  onClick={() => handleBoltClick(bolt)}
                  style={{ left: `${bolt.x}%`, top: `${bolt.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full border-2 flex flex-col items-center justify-center font-mono font-bold transition-all z-10 ${ringClass}`}
                  title={`${bolt.label} - Step #${targetSeq}`}
                >
                  <span className="text-xs leading-none">#{targetSeq}</span>
                  <span className="text-[9px] opacity-70 font-normal leading-none mt-0.5">
                    {isTorqued ? '✓' : `B${bolt.id}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Step Instruction Bar */}
        <div className="mt-4 p-4 rounded-lg bg-[#1a1e24] border border-[#2d343e] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center font-mono font-bold text-red-400">
              {currentSeq <= 18 ? `#${currentSeq}` : '✓'}
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {currentSeq <= 18 && nextTargetBolt ? (
                  <>
                    Next Fastener: <span className="text-red-400">{nextTargetBolt.label}</span> (Bolt ID #{nextTargetBolt.id})
                  </>
                ) : (
                  <span className="text-emerald-400">All 18 bolts completed for this stage!</span>
                )}
              </div>
              <div className="text-xs text-gray-400">
                {mode === 'tighten' ? (
                  activeStage === 1
                    ? "Apply 78 Nm (58 ft-lb) using 14mm 12-point socket. Ensure smooth torque wrench click."
                    : activeStage === 2
                    ? "Rotate socket breaker bar +90° in single continuous motion."
                    : "Rotate socket breaker bar a final +90° (Total 180°)."
                ) : (
                  "Loosen 1/3 turn (90° - 120°) in exact outer-to-center reverse sequence."
                )}
              </div>
            </div>
          </div>

          <div className="text-xs font-mono text-gray-400 bg-[#121417] px-3 py-1.5 rounded-md border border-[#262b32]">
            Bolt Spec: M12 x 1.25 (12-Point)
          </div>
        </div>
      </div>

      {/* Piston Protrusion & Gasket Thickness Calculator */}
      <div className="tech-panel p-6 bg-[#161a1e]">
        <div className="flex items-center gap-2 mb-3">
          <Gauge className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-white">Piston Protrusion & Head Gasket Thickness Calculator</h3>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Because the 2L-T diesel has zero combustion volume in the head (flat deck with pre-chambers), piston protrusion directly governs compression ratio and valve-to-piston clearance. Measure highest piston at TDC using dial gauge SST 09275-54011.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Box */}
          <div className="tech-card bg-[#1a1f26]">
            <label className="block text-xs font-mono uppercase text-gray-400 font-bold mb-2">
              Measured Piston Protrusion (mm)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                min="0.50"
                max="1.20"
                value={protrusionInput}
                onChange={(e) => setProtrusionInput(e.target.value)}
                className="w-full bg-[#121417] border border-[#333a42] rounded-lg px-3 py-2 text-white font-mono text-lg focus:outline-none focus:border-red-500"
              />
              <span className="font-mono text-gray-400 font-bold">mm</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Factory Spec Range: 0.68 mm to 0.97 mm
            </div>
          </div>

          {/* Matched Gasket Result */}
          <div className="lg:col-span-2 tech-card bg-gradient-to-r from-[#1c222a] to-[#1e2733] border-blue-900/40">
            <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
              Recommended OEM Gasket Match
            </span>
            {matchedGrade ? (
              <div className="mt-2">
                <div className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-emerald-400">{matchedGrade.grade}</span>
                  <span className="badge-spec">{matchedGrade.installedThickness}</span>
                </div>
                <p className="text-xs text-gray-300 mt-1">{matchedGrade.description}</p>
              </div>
            ) : (
              <div className="mt-2 text-red-400 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>
                  Protrusion out of normal factory range! Check connecting rod straightness, deck resurfacing limits, or piston pin bushings.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Reference Grades Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#2d343e] text-gray-400">
                <th className="py-2 px-3">GASKET GRADE</th>
                <th className="py-2 px-3">PROTRUSION RANGE</th>
                <th className="py-2 px-3">NOTCH IDENTIFIER</th>
                <th className="py-2 px-3">COMPRESSED THICKNESS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222831] text-gray-300">
              {GASKET_THICKNESS_SELECTOR.map((g, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-[#20262f] ${
                    matchedGrade?.grade === g.grade ? 'bg-red-950/40 font-bold text-white' : ''
                  }`}
                >
                  <td className="py-2 px-3 text-red-400">{g.grade}</td>
                  <td className="py-2 px-3">{g.protrusionMin.toFixed(2)} – {g.protrusionMax.toFixed(2)} mm</td>
                  <td className="py-2 px-3">{idx === 0 ? "1 Notch (B)" : idx === 1 ? "2 Notches (D)" : "3 Notches (F)"}</td>
                  <td className="py-2 px-3">{g.installedThickness}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
