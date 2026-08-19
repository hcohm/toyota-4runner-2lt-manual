import React, { useState, useEffect } from 'react';
import {
  Zap,
  RotateCw,
  Key,
  ShieldAlert,
  Sparkles,
  Flame
} from 'lucide-react';

type KeyPosition = 'LOCK' | 'ACC' | 'ON' | 'START';

export const LiveCircuitSandbox: React.FC = () => {
  const [keyPosition, setKeyPosition] = useState<KeyPosition>('LOCK');
  const [glowTimerSeconds, setGlowTimerSeconds] = useState<number>(0);
  const [coolantTempDegC, setCoolantTempDegC] = useState<number>(20); // 20°C cold start

  // Simulated Wire Faults
  const [faults, setFaults] = useState<Record<string, boolean>>({
    'fuel-cut-wire': false,
    'glow-80a-link': false,
    'dropping-resistor': false,
    'coolant-sensor': false
  });

  // Relay & Component States
  const isIgnitionOn = keyPosition === 'ON' || keyPosition === 'START';
  const isStarterEngaged = keyPosition === 'START';

  // Glow Relay 1 Logic (Flash Heat 12V for 2 to 6 seconds based on temperature)
  const relay1Duration = coolantTempDegC < 0 ? 6 : coolantTempDegC < 30 ? 4 : 2;
  const isRelay1Active =
    isIgnitionOn &&
    glowTimerSeconds < relay1Duration &&
    !faults['glow-80a-link'] &&
    !faults['coolant-sensor'];

  // Glow Relay 2 Logic (Afterglow ~6V via Dropping Resistor for up to 120s or until engine hot)
  const isRelay2Active =
    isIgnitionOn &&
    !isRelay1Active &&
    glowTimerSeconds < 30 &&
    !faults['glow-80a-link'] &&
    !faults['dropping-resistor'];

  // Fuel Cut Solenoid State (12V switched on B-W wire)
  const isFuelCutEnergized = isIgnitionOn && !faults['fuel-cut-wire'];

  // Bus Bar Voltage Calculation
  const glowBusVoltage = isRelay1Active
    ? 11.8
    : isRelay2Active
    ? 6.2
    : 0.0;

  // Timer Tick Loop when Ignition is ON
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isIgnitionOn) {
      interval = setInterval(() => {
        setGlowTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setGlowTimerSeconds(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isIgnitionOn]);

  const toggleFault = (id: string) => {
    setFaults((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const resetAll = () => {
    setKeyPosition('LOCK');
    setGlowTimerSeconds(0);
    setFaults({
      'fuel-cut-wire': false,
      'glow-80a-link': false,
      'dropping-resistor': false,
      'coolant-sensor': false
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="tech-panel p-6 bg-gradient-to-r from-[#171e24] via-[#141b22] to-[#1a1c14] border-cyan-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-toyota">Live SPICE-Style Electrical Engine</span>
              <span className="badge-spec flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Interactive Key Switch & Relay Simulator
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Zap className="w-6 h-6 text-cyan-400" />
              Super Glow II & Fuel Cut Live Circuit Sandbox
            </h2>
            <p className="text-sm text-gray-400 mt-1 max-w-3xl leading-relaxed">
              Turn the virtual ignition key to simulate Relay 1 (12V flash heat), Dropping Resistor after-glow, Fuel Cut Solenoid opening, and inject wiring faults to test diagnostic logic.
            </p>
          </div>

          <button
            onClick={resetAll}
            className="px-4 py-2 rounded-lg bg-[#1b222c] hover:bg-[#252f3e] border border-[#2b3848] text-xs font-mono text-gray-300 hover:text-white flex items-center gap-2 transition-all self-start md:self-auto shadow-md"
          >
            <RotateCw className="w-4 h-4" /> Reset Circuit Sandbox
          </button>
        </div>
      </div>

      {/* Main Interactive Circuit Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Schematic Diagram (2 Columns) */}
        <div className="lg:col-span-2 tech-panel bg-[#0d1014] border-[#222b37] p-6 space-y-6">
          {/* Key Ignition Controller */}
          <div className="p-4 bg-[#14181f] rounded-2xl border border-[#263140] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-600/20 border border-amber-500/40 rounded-xl text-amber-400">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono text-gray-400 uppercase font-bold">Ignition Key Switch:</span>
                <div className="text-base font-bold text-white font-mono">{keyPosition} POSITION</div>
              </div>
            </div>

            {/* 4-Position Key Switch Buttons */}
            <div className="flex items-center gap-1.5 bg-[#0d1014] p-1.5 rounded-xl border border-[#232d3a]">
              {(['LOCK', 'ACC', 'ON', 'START'] as KeyPosition[]).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setKeyPosition(pos)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    keyPosition === pos
                      ? pos === 'START'
                        ? 'bg-red-600 text-white shadow-lg animate-pulse'
                        : 'bg-cyan-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Active Electrical Node Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            {/* Battery & Fusible Links */}
            <div className="p-4 bg-[#13171f] rounded-xl border border-[#252f3d] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-bold uppercase flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  12V Battery & 80A Fusible Link
                </span>
                <span className={faults['glow-80a-link'] ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {faults['glow-80a-link'] ? 'BLOWN LINK' : '12.6 VDC'}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                Feeds high-amperage battery current to Glow Relay 1 and Relay 2 contacts.
              </p>
            </div>

            {/* Bosch VE Fuel Cut Solenoid */}
            <div
              className={`p-4 rounded-xl border transition-all space-y-2 ${
                isFuelCutEnergized
                  ? 'bg-[#15231c] border-emerald-500/60 shadow-md'
                  : 'bg-[#1a1518] border-red-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase flex items-center gap-1.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isFuelCutEnergized ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'
                    }`}
                  />
                  24mm Fuel Cut Solenoid
                </span>
                <span className={isFuelCutEnergized ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {isFuelCutEnergized ? 'OPEN (12V ON)' : 'CLOSED (OFF)'}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                Plunger retracted by magnetic coil allowing diesel into distributor head.
              </p>
            </div>

            {/* Glow Relay No. 1 (12V Flash) */}
            <div
              className={`p-4 rounded-xl border transition-all space-y-2 ${
                isRelay1Active
                  ? 'bg-[#241c14] border-amber-500/80 shadow-lg'
                  : 'bg-[#13171f] border-[#252f3d]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase flex items-center gap-1.5">
                  <Flame className={`w-3.5 h-3.5 ${isRelay1Active ? 'text-amber-400 animate-bounce' : 'text-gray-500'}`} />
                  Glow Relay No. 1 (12V Flash)
                </span>
                <span className={isRelay1Active ? 'text-amber-400 font-bold' : 'text-gray-500'}>
                  {isRelay1Active ? 'ACTIVE (12V)' : 'DE-ENERGIZED'}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                Supplies initial 12V high-heat surge for {relay1Duration} seconds to bring glow plugs to 900°C.
              </p>
            </div>

            {/* Glow Relay No. 2 & Dropping Resistor */}
            <div
              className={`p-4 rounded-xl border transition-all space-y-2 ${
                isRelay2Active
                  ? 'bg-[#161d28] border-cyan-500/80 shadow-lg'
                  : 'bg-[#13171f] border-[#252f3d]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase flex items-center gap-1.5">
                  <Zap className={`w-3.5 h-3.5 ${isRelay2Active ? 'text-cyan-400 animate-pulse' : 'text-gray-500'}`} />
                  Glow Relay 2 & Resistor (6V)
                </span>
                <span className={isRelay2Active ? 'text-cyan-400 font-bold' : 'text-gray-500'}>
                  {isRelay2Active ? 'AFTERGLOW (6V)' : 'OFF'}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                Drops voltage through 0.02 Ω intake resistor to maintain ~6V afterglow without burning plugs.
              </p>
            </div>
          </div>

          {/* Live Multimeter Readout Bar */}
          <div className="p-4 bg-[#080b0e] rounded-xl border border-[#1f2733] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
            <div>
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Glow Plug Bus Bar Voltage:</span>
              <span className="text-2xl font-bold text-emerald-400">{glowBusVoltage.toFixed(1)} VDC</span>
            </div>

            <div>
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Timer Elapsed:</span>
              <span className="text-base font-bold text-white">{glowTimerSeconds} sec</span>
            </div>

            <div>
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Engine State:</span>
              <span
                className={`font-bold ${
                  isStarterEngaged && isFuelCutEnergized
                    ? 'text-emerald-400'
                    : isIgnitionOn
                    ? 'text-amber-400'
                    : 'text-gray-500'
                }`}
              >
                {isStarterEngaged && isFuelCutEnergized
                  ? 'CRANKING & RUNNING'
                  : isIgnitionOn
                  ? 'IGNITION ON (STANDBY)'
                  : 'STOPPED'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Fault Injector & Thermistor Control (1 Column) */}
        <div className="space-y-4">
          {/* Coolant Temperature Slider */}
          <div className="tech-panel p-4 bg-[#12161c] border-[#242e3c] space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-400 uppercase font-bold">Simulated Coolant Temp:</span>
              <span className="text-amber-400 font-bold">{coolantTempDegC}°C</span>
            </div>
            <input
              type="range"
              min="-20"
              max="90"
              value={coolantTempDegC}
              onChange={(e) => setCoolantTempDegC(parseInt(e.target.value))}
              className="w-full h-2 bg-[#1b222d] rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-500">
              <span>-20°C (6s Glow)</span>
              <span>20°C (4s)</span>
              <span>80°C Hot (2s)</span>
            </div>
          </div>

          {/* "Break-A-Wire" Fault Injector */}
          <div className="tech-panel p-5 bg-[#14181f] border-red-900/40 space-y-3">
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              "Break-A-Wire" Fault Injection
            </span>
            <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
              Click to cut/disconnect virtual harness wires and test real-time electrical failure symptoms:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => toggleFault('fuel-cut-wire')}
                className={`w-full text-left p-2.5 rounded-xl border text-xs font-mono transition-all flex items-center justify-between ${
                  faults['fuel-cut-wire']
                    ? 'bg-red-950/80 border-red-600 text-red-200'
                    : 'bg-[#181d24] border-[#263140] text-gray-300 hover:border-gray-500'
                }`}
              >
                <div>
                  <div className="font-bold">Cut B-W Wire to Fuel Cut Solenoid</div>
                  <div className="text-[10px] text-gray-400">Symptom: Cranks endlessly, zero fuel delivery</div>
                </div>
                <span className="badge-spec">{faults['fuel-cut-wire'] ? 'CUT' : 'OK'}</span>
              </button>

              <button
                onClick={() => toggleFault('glow-80a-link')}
                className={`w-full text-left p-2.5 rounded-xl border text-xs font-mono transition-all flex items-center justify-between ${
                  faults['glow-80a-link']
                    ? 'bg-red-950/80 border-red-600 text-red-200'
                    : 'bg-[#181d24] border-[#263140] text-gray-300 hover:border-gray-500'
                }`}
              >
                <div>
                  <div className="font-bold">Blow 80A GLOW Fusible Link</div>
                  <div className="text-[10px] text-gray-400">Symptom: 0V to bus bar, heavy white smoke on start</div>
                </div>
                <span className="badge-spec">{faults['glow-80a-link'] ? 'BLOWN' : 'OK'}</span>
              </button>

              <button
                onClick={() => toggleFault('dropping-resistor')}
                className={`w-full text-left p-2.5 rounded-xl border text-xs font-mono transition-all flex items-center justify-between ${
                  faults['dropping-resistor']
                    ? 'bg-red-950/80 border-red-600 text-red-200'
                    : 'bg-[#181d24] border-[#263140] text-gray-300 hover:border-gray-500'
                }`}
              >
                <div>
                  <div className="font-bold">Open Intake Dropping Resistor</div>
                  <div className="text-[10px] text-gray-400">Symptom: Relay 1 works, but zero 6V afterglow</div>
                </div>
                <span className="badge-spec">{faults['dropping-resistor'] ? 'OPEN' : 'OK'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
