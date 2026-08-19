import React, { useState } from 'react';
import { SUPER_GLOW_PROBE_POINTS } from '../data/wiringVacuumData';
import type { SchematicProbePoint } from '../data/wiringVacuumData';
import { Zap, Gauge, Activity } from 'lucide-react';

export const SuperGlowLab: React.FC = () => {
  const [keyState, setKeyState] = useState<'off' | 'preglow' | 'afterglow' | 'cranking'>('preglow');
  const [selectedProbe, setSelectedProbe] = useState<SchematicProbePoint>(SUPER_GLOW_PROBE_POINTS[5]); // Default bus bar
  const [meterMode, setMeterMode] = useState<'voltage' | 'resistance'>('voltage');

  // Compute live simulated reading based on key state and probe point
  const getSimulatedReading = (probe: SchematicProbePoint) => {
    if (meterMode === 'resistance') {
      return probe.expectedResistance || "N/A (Active Circuit)";
    }

    if (keyState === 'off') {
      if (probe.id === 'battery-pos' || probe.id === 'fusible-link-glow') return "12.6 V";
      return "0.0 V";
    }

    if (keyState === 'preglow') {
      // 12V high power pre-glow
      if (probe.id === 'battery-pos' || probe.id === 'fusible-link-glow') return "12.2 V";
      if (probe.id === 'glow-relay-1-contact') return "11.8 V (Relay 1 ON)";
      if (probe.id === 'glow-relay-2-contact') return "0.0 V (Relay 2 Open)";
      if (probe.id === 'dropping-resistor') return "0.0 V";
      if (probe.id === 'glow-plugs-bus') return "11.6 V (12V Pre-Glow Active)";
      if (probe.id === 'coolant-temp-sensor') return "2.4 kΩ / 4.8 V";
      if (probe.id === 'glow-timer-ecu') return "Pin 3: 12V Trigger";
    }

    if (keyState === 'afterglow') {
      // 6V dropped voltage
      if (probe.id === 'battery-pos' || probe.id === 'fusible-link-glow') return "12.4 V";
      if (probe.id === 'glow-relay-1-contact') return "0.0 V (Relay 1 OFF)";
      if (probe.id === 'glow-relay-2-contact') return "12.2 V (Relay 2 ON)";
      if (probe.id === 'dropping-resistor') return "6.2 V (Stepped Down)";
      if (probe.id === 'glow-plugs-bus') return "6.2 V (After-Glow ~6V)";
      if (probe.id === 'coolant-temp-sensor') return "2.4 kΩ (Cold)";
      if (probe.id === 'glow-timer-ecu') return "Pin 4: 12V Hold";
    }

    if (keyState === 'cranking') {
      if (probe.id === 'battery-pos') return "10.4 V (Starter Drag)";
      if (probe.id === 'glow-plugs-bus') return "5.8 V (Crank Glow)";
      return "10.4 V";
    }

    return "0.0 V";
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="tech-panel p-6 bg-gradient-to-r from-[#211f18] via-[#1a1d20] to-[#171e28] border-amber-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-toyota">FSM Section ST-14</span>
              <span className="badge-spec">Super Glow II Dual-Relay System</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-500" />
              Super Glow II Interactive Electrical Multimeter Lab
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Probe terminal voltages and resistance across the 2-stage glow circuit (12V flash pre-heat &rarr; 6V dropping resistor after-glow).
            </p>
          </div>

          {/* Key State Controls */}
          <div className="bg-[#121417] p-1.5 rounded-lg border border-[#2c3238] flex flex-wrap gap-1">
            <button
              onClick={() => setKeyState('off')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                keyState === 'off' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Key OFF
            </button>
            <button
              onClick={() => setKeyState('preglow')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                keyState === 'preglow' ? 'bg-red-600 text-white shadow-lg animate-pulse' : 'text-gray-400 hover:text-white'
              }`}
            >
              Pre-Glow (0-6s)
            </button>
            <button
              onClick={() => setKeyState('afterglow')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                keyState === 'afterglow' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              After-Glow (6-180s)
            </button>
            <button
              onClick={() => setKeyState('cranking')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                keyState === 'cranking' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Cranking (START)
            </button>
          </div>
        </div>
      </div>

      {/* Main Lab Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schematic & Clickable Probe Canvas */}
        <div className="lg:col-span-2 tech-panel p-6 bg-[#121519]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-500" />
              Circuit Schematic & Probe Test Points
            </h3>
            <span className="text-xs text-gray-400 font-mono">Click any test point (●) to measure</span>
          </div>

          {/* SVG Circuit Schematic */}
          <div className="relative w-full h-[360px] bg-[#0c0e12] rounded-xl border border-[#272e38] overflow-hidden p-4">
            <svg viewBox="0 0 700 360" className="w-full h-full">
              {/* Power Rail Wire */}
              <line x1="80" y1="280" x2="160" y2="280" stroke="#ef4444" strokeWidth="4" />
              <line x1="160" y1="280" x2="160" y2="140" stroke="#ef4444" strokeWidth="4" />
              <line x1="160" y1="140" x2="300" y2="140" stroke="#ef4444" strokeWidth="4" />
              <line x1="160" y1="240" x2="300" y2="240" stroke="#ef4444" strokeWidth="4" />

              {/* Relay 1 to Glow Bus (Direct line) */}
              <line
                x1="350"
                y1="140"
                x2="560"
                y2="140"
                stroke={keyState === 'preglow' ? '#ef4444' : '#4b5563'}
                strokeWidth={keyState === 'preglow' ? 6 : 3}
              />
              <line
                x1="560"
                y1="140"
                x2="560"
                y2="190"
                stroke={keyState === 'preglow' ? '#ef4444' : '#4b5563'}
                strokeWidth={keyState === 'preglow' ? 6 : 3}
              />

              {/* Relay 2 through Dropping Resistor to Glow Bus */}
              <line
                x1="350"
                y1="240"
                x2="420"
                y2="240"
                stroke={keyState === 'afterglow' ? '#f59e0b' : '#4b5563'}
                strokeWidth={keyState === 'afterglow' ? 5 : 3}
              />
              {/* Dropping Resistor */}
              <rect x="420" y="225" width="50" height="30" fill="#374151" stroke="#f59e0b" strokeWidth="2" rx="4" />
              <text x="445" y="244" fill="#f59e0b" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">0.02Ω</text>
              <line
                x1="470"
                y1="240"
                x2="560"
                y2="240"
                stroke={keyState === 'afterglow' ? '#f59e0b' : '#4b5563'}
                strokeWidth={keyState === 'afterglow' ? 5 : 3}
              />
              <line
                x1="560"
                y1="240"
                x2="560"
                y2="190"
                stroke={keyState === 'afterglow' ? '#f59e0b' : '#4b5563'}
                strokeWidth={keyState === 'afterglow' ? 5 : 3}
              />

              {/* Glow Plug Bus Bar Line */}
              <line
                x1="560"
                y1="190"
                x2="650"
                y2="190"
                stroke={keyState === 'preglow' ? '#ef4444' : keyState === 'afterglow' ? '#f59e0b' : '#4b5563'}
                strokeWidth="5"
              />

              {/* 4 Glow Plugs */}
              {[580, 605, 630, 655].map((gx, idx) => (
                <g key={idx} transform={`translate(${gx}, 190)`}>
                  <line x1="0" y1="0" x2="0" y2="40" stroke="#9ca3af" strokeWidth="3" />
                  <rect x="-6" y="40" width="12" height="35" fill="#1f2937" stroke="#dc2626" strokeWidth="1.5" rx="2" />
                  <line x1="0" y1="75" x2="0" y2="95" stroke="#4b5563" strokeWidth="2" />
                  <line x1="-10" y1="95" x2="10" y2="95" stroke="#4b5563" strokeWidth="2" />
                  <line x1="-6" y1="99" x2="6" y2="99" stroke="#4b5563" strokeWidth="2" />
                  <text x="0" y="115" fill="#9ca3af" fontSize="9" textAnchor="middle" fontFamily="monospace">#{idx + 1}</text>
                </g>
              ))}

              {/* Components Boxes */}
              {/* Battery */}
              <rect x="30" y="250" width="60" height="60" fill="#1e242d" stroke="#ef4444" strokeWidth="2" rx="6" />
              <text x="60" y="278" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">12V BATT</text>
              <text x="60" y="295" fill="#9ca3af" fontSize="8" fontFamily="monospace" textAnchor="middle">12.6V DC</text>

              {/* 80A Fusible Link */}
              <rect x="130" y="260" width="60" height="40" fill="#1e242d" stroke="#f59e0b" strokeWidth="2" rx="4" />
              <text x="160" y="284" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">80A LINK</text>

              {/* Relay 1 */}
              <rect x="290" y="115" width="70" height="50" fill="#1e242d" stroke="#ef4444" strokeWidth="2" rx="6" />
              <text x="325" y="138" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">RELAY #1</text>
              <text x="325" y="152" fill="#ef4444" fontSize="8" fontFamily="monospace" textAnchor="middle">12V Flash</text>

              {/* Relay 2 */}
              <rect x="290" y="215" width="70" height="50" fill="#1e242d" stroke="#f59e0b" strokeWidth="2" rx="6" />
              <text x="325" y="238" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">RELAY #2</text>
              <text x="325" y="252" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">~6V Step</text>

              {/* Timer ECU */}
              <rect x="180" y="30" width="100" height="50" fill="#1e242d" stroke="#3b82f6" strokeWidth="2" rx="6" />
              <text x="230" y="52" fill="#60a5fa" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">GLOW TIMER ECU</text>
              <text x="230" y="68" fill="#9ca3af" fontSize="8" fontFamily="monospace" textAnchor="middle">Kick Panel</text>
            </svg>

            {/* Clickable Probe Points Overlaid */}
            {SUPER_GLOW_PROBE_POINTS.map((probe) => {
              const isSelected = selectedProbe.id === probe.id;
              return (
                <button
                  key={probe.id}
                  onClick={() => setSelectedProbe(probe)}
                  style={{ left: `${probe.x}%`, top: `${probe.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all z-20 ${
                    isSelected
                      ? 'border-white bg-amber-500 text-black ring-4 ring-amber-500/70 scale-125'
                      : 'border-amber-400 bg-amber-950/80 text-amber-300 hover:scale-110 hover:bg-amber-800'
                  }`}
                  title={probe.name}
                >
                  <span className="text-[10px] font-mono font-bold">●</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Digital Multimeter Simulator Panel */}
        <div className="space-y-4">
          <div className="tech-panel p-5 bg-[#171a1f] border-amber-900/60 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#2d343f]">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-amber-500" />
                <span className="font-mono font-bold text-white text-sm">DIGITAL MULTIMETER</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setMeterMode('voltage')}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                    meterMode === 'voltage' ? 'bg-amber-600 text-white' : 'bg-[#121417] text-gray-400'
                  }`}
                >
                  V DC
                </button>
                <button
                  onClick={() => setMeterMode('resistance')}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                    meterMode === 'resistance' ? 'bg-amber-600 text-white' : 'bg-[#121417] text-gray-400'
                  }`}
                >
                  Ω (Ohms)
                </button>
              </div>
            </div>

            {/* LCD Display Screen */}
            <div className="mt-4 bg-[#0a0d0a] p-4 rounded-lg border-2 border-[#203a20] shadow-inner text-right">
              <div className="text-[11px] font-mono text-emerald-600 uppercase tracking-widest text-left">
                PROBE: {selectedProbe.name}
              </div>
              <div className="text-3xl font-mono font-bold text-emerald-400 tracking-wider mt-1 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]">
                {getSimulatedReading(selectedProbe)}
              </div>
              <div className="text-[10px] font-mono text-emerald-600/80 mt-1">
                KEY STATE: {keyState.toUpperCase()}
              </div>
            </div>

            {/* Probe Details & Troubleshooting */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="text-gray-300 font-bold">{selectedProbe.name}</div>
              <p className="text-gray-400 text-[11px] leading-relaxed">{selectedProbe.description}</p>
              <div className="p-2.5 rounded bg-[#101418] border border-[#28303a] text-[11px] text-amber-300">
                <strong>Diagnostic Tip:</strong> {selectedProbe.troubleshootingTip}
              </div>
            </div>
          </div>

          {/* Quick Spec Reference */}
          <div className="tech-card bg-[#14181e] text-xs font-mono space-y-2">
            <div className="text-gray-400 font-bold uppercase">Super Glow Factory Tolerances</div>
            <div className="flex justify-between py-1 border-b border-[#252c36]">
              <span className="text-gray-400">Glow Plug Single Resistance:</span>
              <span className="text-emerald-400 font-bold">0.65 – 0.85 Ω</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#252c36]">
              <span className="text-gray-400">Dropping Resistor Spec:</span>
              <span className="text-white font-bold">0.02 – 0.04 Ω</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Relay 1 Flash Duration:</span>
              <span className="text-amber-400 font-bold">2.0 – 6.0 sec</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
