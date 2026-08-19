import React, { useState } from 'react';
import { CheckCircle2, RotateCw, ShieldAlert } from 'lucide-react';

export const TimingBeltVisualizer: React.FC = () => {
  const [rotationDegrees, setRotationDegrees] = useState<number>(0);

  const handleRotate = () => {
    setRotationDegrees((prev) => (prev + 90) % 720);
  };

  const isTDCAligned = rotationDegrees === 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="tech-panel p-6 bg-gradient-to-r from-[#17202b] via-[#1a1d20] to-[#251b18] border-amber-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-toyota">FSM Section EM-18</span>
              <span className="badge-spec">Interference Engine Timing Drive</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <RotateCw className="w-6 h-6 text-amber-500" />
              Timing Belt Alignment & Tensioner Master Guide
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              SOHC 8-Valve Diesel Timing Geartrain: Crank (12:00), Bosch VE Injection Pump (12:00), Camshaft (3:00).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRotate}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-md"
            >
              <RotateCw className="w-4 h-4" /> Rotate Crank (+90°)
            </button>
            <button
              onClick={() => setRotationDegrees(0)}
              className="px-3 py-2 bg-[#21262d] hover:bg-[#2c3238] text-gray-300 font-mono text-xs rounded-lg transition-all border border-[#333a42]"
            >
              Reset to 0° TDC
            </button>
          </div>
        </div>
      </div>

      {/* Main Diagram Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Interactive Timing Gear Canvas */}
        <div className="lg:col-span-2 tech-panel p-6 bg-[#111317]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400 uppercase">Crankshaft Position:</span>
              <span className="font-mono font-bold text-white text-sm">{rotationDegrees}° / 720°</span>
            </div>
            {isTDCAligned ? (
              <span className="badge-green flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ALL 3 MARKS ALIGNED AT TDC #1
              </span>
            ) : (
              <span className="badge-spec flex items-center gap-1">
                Rotating (Crank 720° = Cam 360°)
              </span>
            )}
          </div>

          {/* SVG Schematic */}
          <div className="relative w-full h-[400px] bg-[#0c0e11] rounded-xl border border-[#232931] flex items-center justify-center p-4">
            <svg viewBox="0 0 500 400" className="w-full h-full max-w-[500px]">
              <defs>
                <radialGradient id="gearGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#374151" />
                  <stop offset="100%" stopColor="#1f2937" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Timing Belt Path Line */}
              <path
                d="M 250 80 C 130 80 130 200 130 240 C 130 350 250 350 250 350 C 330 350 380 290 380 220 C 380 140 370 80 250 80 Z"
                fill="none"
                stroke="#4b5563"
                strokeWidth="18"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 250 80 C 130 80 130 200 130 240 C 130 350 250 350 250 350 C 330 350 380 290 380 220 C 380 140 370 80 250 80 Z"
                fill="none"
                stroke="#111827"
                strokeWidth="14"
                strokeDasharray="6 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* 1. CAMSHAFT SPROCKET (TOP CENTER) */}
              <g transform={`translate(250, 80) rotate(${rotationDegrees / 2})`}>
                <circle r="52" fill="url(#gearGrad)" stroke="#6b7280" strokeWidth="3" />
                <circle r="16" fill="#111827" stroke="#9ca3af" strokeWidth="2" />
                {/* Spokes */}
                <line x1="-45" y1="0" x2="45" y2="0" stroke="#4b5563" strokeWidth="4" />
                <line x1="0" y1="-45" x2="0" y2="45" stroke="#4b5563" strokeWidth="4" />
                {/* 3 O'CLOCK TIMING MARK (Points right at 0°) */}
                <circle cx="48" cy="0" r="5" fill="#ef4444" filter="url(#glow)" />
                <line x1="48" y1="-8" x2="48" y2="8" stroke="#ffffff" strokeWidth="2" />
              </g>
              {/* Static Cam Alignment Pointer Notch at 3:00 on Head */}
              <polygon points="312,80 322,74 322,86" fill="#ef4444" />
              <text x="330" y="84" fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="bold">
                CAM NOTCH (3:00)
              </text>

              {/* 2. INJECTION PUMP SPROCKET (LEFT) */}
              <g transform={`translate(150, 220) rotate(${rotationDegrees / 2})`}>
                <circle r="44" fill="url(#gearGrad)" stroke="#6b7280" strokeWidth="3" />
                <circle r="14" fill="#111827" stroke="#9ca3af" strokeWidth="2" />
                {/* Spokes */}
                <line x1="-38" y1="0" x2="38" y2="0" stroke="#4b5563" strokeWidth="3" />
                <line x1="0" y1="-38" x2="0" y2="38" stroke="#4b5563" strokeWidth="3" />
                {/* 12 O'CLOCK TIMING MARK */}
                <circle cx="0" cy="-40" r="5" fill="#3b82f6" filter="url(#glow)" />
              </g>
              {/* Static Inj Pump Pointer at 12:00 */}
              <polygon points="150,166 144,156 156,156" fill="#3b82f6" />
              <text x="70" y="160" fill="#3b82f6" fontSize="11" fontFamily="monospace" fontWeight="bold">
                INJ PUMP (12:00)
              </text>

              {/* 3. CRANKSHAFT SPROCKET (BOTTOM CENTER) */}
              <g transform={`translate(250, 320) rotate(${rotationDegrees})`}>
                <circle r="32" fill="url(#gearGrad)" stroke="#9ca3af" strokeWidth="3" />
                <circle r="12" fill="#111827" stroke="#f59e0b" strokeWidth="3" />
                {/* 12 O'CLOCK CRANK TIMING NOTCH */}
                <circle cx="0" cy="-28" r="4.5" fill="#f59e0b" filter="url(#glow)" />
              </g>
              {/* Static Crank 0° TDC Pointer */}
              <polygon points="250,282 244,272 256,272" fill="#f59e0b" />
              <text x="265" y="278" fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="bold">
                CRANK 0° TDC (12:00)
              </text>

              {/* 4. TENSIONER IDLER PULLEY & SPRING (RIGHT) */}
              <g transform="translate(345, 230)">
                <circle r="26" fill="#374151" stroke="#10b981" strokeWidth="2.5" />
                <circle r="8" fill="#111827" />
                {/* Spring representation */}
                <path d="M 0 26 Q 15 45 0 65 Q 15 85 0 100" fill="none" stroke="#10b981" strokeWidth="2.5" />
              </g>
              <text x="380" y="235" fill="#10b981" fontSize="11" fontFamily="monospace" fontWeight="bold">
                TENSIONER (43 Nm)
              </text>
            </svg>
          </div>
        </div>

        {/* Technical Specs & Critical Warnings Card */}
        <div className="space-y-4">
          <div className="tech-card border-red-900/60 bg-[#1c1618]">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-2">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              CRITICAL: INTERFERENCE ENGINE
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              The 2L-T diesel has flat-top pistons and vertical zero-clearance valves. If the timing belt snaps or jumps more than 2 teeth, valves will strike pistons, bending valves and destroying lifter guides.
            </p>
          </div>

          <div className="tech-card bg-[#181c22]">
            <span className="text-xs font-mono text-gray-400 font-bold uppercase">Torque Checkpoints</span>
            <div className="mt-3 space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-[#2a303a]">
                <span className="text-gray-400">Crank Pulley Bolt:</span>
                <span className="text-amber-400 font-bold">167 Nm (123 ft-lb)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#2a303a]">
                <span className="text-gray-400">Cam Sprocket Bolt:</span>
                <span className="text-white font-bold">98 Nm (72 ft-lb)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#2a303a]">
                <span className="text-gray-400">Tensioner Pivot Bolt:</span>
                <span className="text-emerald-400 font-bold">43 Nm (32 ft-lb)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Water Pump (7x Bolts):</span>
                <span className="text-white font-bold">19 Nm (14 ft-lb)</span>
              </div>
            </div>
          </div>

          <div className="tech-card bg-[#181c22]">
            <span className="text-xs font-mono text-gray-400 font-bold uppercase">Tensioner Spring Spec</span>
            <div className="mt-2 text-xs text-gray-300 space-y-1">
              <div>• <strong className="text-white">Free Length:</strong> 54.5 mm (Limit: 55.5 mm)</div>
              <div>• <strong className="text-white">Installed Tension:</strong> 9.8 – 11.8 kg (21.6 – 26.0 lbs)</div>
              <div className="text-gray-400 text-[11px] mt-2 italic">
                Never use a pry bar to tighten the tensioner idler; let the spring apply factory calibrated tension, then torque pivot bolt to 43 Nm.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
