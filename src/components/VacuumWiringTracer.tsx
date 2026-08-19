import React, { useState } from 'react';
import { VACUUM_CIRCUIT_DATA } from '../data/wiringVacuumData';
import type { VacuumLineItem } from '../data/wiringVacuumData';
import { GitBranch, HelpCircle, ShieldAlert, Cpu } from 'lucide-react';

export const VacuumWiringTracer: React.FC = () => {
  const [selectedLine, setSelectedLine] = useState<VacuumLineItem>(VACUUM_CIRCUIT_DATA[0]);
  const [activeSystem, setActiveSystem] = useState<'vacuum' | 'fuelcut' | 'alternator'>('vacuum');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="tech-panel p-6 bg-gradient-to-r from-[#172421] via-[#1a1d20] to-[#1c1a29] border-emerald-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-toyota">FSM Section EM-58 / EC-12</span>
              <span className="badge-green">Pneumatic & Electrical Control</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <GitBranch className="w-6 h-6 text-emerald-400" />
              Vacuum Line Routing & Electrical Circuit Tracer
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Interactive color-coded schematics for 2L-T boost compensator, 4WD ADD vacuum switching valves (VSVs), and fuel cut solenoid.
            </p>
          </div>

          <div className="bg-[#121417] p-1 rounded-lg border border-[#2c3238] flex">
            <button
              onClick={() => setActiveSystem('vacuum')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                activeSystem === 'vacuum' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Vacuum Routing Map
            </button>
            <button
              onClick={() => setActiveSystem('fuelcut')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                activeSystem === 'fuelcut' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Fuel Cut Solenoid Circuit
            </button>
            <button
              onClick={() => setActiveSystem('alternator')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                activeSystem === 'alternator' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Alternator & Vane Pump
            </button>
          </div>
        </div>
      </div>

      {activeSystem === 'vacuum' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vacuum Lines Selector List */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-gray-400 uppercase font-bold tracking-wider block mb-1">
              Select Vacuum Circuit to Trace:
            </span>
            {VACUUM_CIRCUIT_DATA.map((line) => {
              const isSelected = selectedLine.id === line.id;
              return (
                <button
                  key={line.id}
                  onClick={() => setSelectedLine(line)}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                    isSelected
                      ? 'border-emerald-500 bg-[#16251e] text-white ring-1 ring-emerald-500/50 shadow-md'
                      : 'border-[#29323c] bg-[#161a20] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: line.color }}
                    />
                    <span className="font-bold text-sm">{line.name}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1 font-mono">
                    {line.source} &rarr; {line.destination}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Vacuum Interactive Detail & Diagram */}
          <div className="lg:col-span-2 space-y-4">
            <div className="tech-panel p-6 bg-[#13161a]">
              <div className="flex items-center justify-between pb-3 border-b border-[#2b333e]">
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedLine.color }}
                  />
                  <h3 className="text-lg font-bold text-white">{selectedLine.name}</h3>
                </div>
                <span className="badge-spec font-mono text-[11px]">2L-T Pneumatic Circuit</span>
              </div>

              {/* Routing Path Box */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-[#181d24] rounded-lg border border-[#2d3642]">
                  <span className="text-gray-400 font-bold block mb-1">SOURCE ORIGIN:</span>
                  <span className="text-emerald-400 font-bold">{selectedLine.source}</span>
                </div>
                <div className="p-3 bg-[#181d24] rounded-lg border border-[#2d3642]">
                  <span className="text-gray-400 font-bold block mb-1">DESTINATION COMPONENT:</span>
                  <span className="text-blue-400 font-bold">{selectedLine.destination}</span>
                </div>
              </div>

              {/* Functional Explanation */}
              <div className="mt-4 space-y-3 text-xs leading-relaxed">
                <div>
                  <strong className="text-gray-300 font-mono uppercase text-[11px] block mb-1">
                    System Function & Mechanics:
                  </strong>
                  <p className="text-gray-300 bg-[#171b21] p-3 rounded-lg border border-[#262e38]">
                    {selectedLine.functionDescription}
                  </p>
                </div>

                <div>
                  <strong className="text-amber-400 font-mono uppercase text-[11px] block mb-1">
                    Failure Symptoms & Diagnostics:
                  </strong>
                  <p className="text-amber-200 bg-[#251d14] p-3 rounded-lg border border-amber-900/60">
                    {selectedLine.failureSymptom}
                  </p>
                </div>
              </div>
            </div>

            {/* Vacuum Testing Guidelines */}
            <div className="tech-card bg-[#15191f] text-xs space-y-2">
              <div className="font-bold text-white font-mono uppercase flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                Workshop Vacuum System Testing Tips
              </div>
              <ul className="text-gray-400 space-y-1 pl-4 list-disc text-[11px]">
                <li>Standard engine vacuum generated by alternator vane pump: <strong className="text-white">500 – 600 mmHg (19.7 – 23.6 inHg)</strong> at idle.</li>
                <li>When testing ADD VSV solenoids, apply 12V direct battery voltage to pins: Solenoid should click and open airflow with <strong>38–45 Ω</strong> coil resistance.</li>
                <li>Always replace hardened 3.5mm vacuum lines with high-temperature silicone vacuum hose to prevent split-end leaks under the intake manifold.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeSystem === 'fuelcut' && (
        <div className="tech-panel p-6 bg-[#13161a] space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-red-500" />
            Bosch VE Fuel Cut Solenoid Circuit (12V Ignition Controlled)
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            The Fuel Cut Solenoid is located on the distributor head of the injection pump. When ignition key is turned to ON, 12V energizes an internal electromagnetic coil, pulling a spring-loaded rubber plunger up to allow diesel into the high-pressure pumping chamber.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 bg-[#181d24] rounded-lg border border-[#2c3440]">
              <span className="text-gray-400 block mb-1">Power Feed:</span>
              <div className="text-white font-bold">12V Switched from IGN 15A Fuse</div>
              <div className="text-gray-500 text-[11px] mt-1">Wire Color: Black with White Stripe (B-W)</div>
            </div>
            <div className="p-4 bg-[#181d24] rounded-lg border border-[#2c3440]">
              <span className="text-gray-400 block mb-1">Coil Resistance:</span>
              <div className="text-emerald-400 font-bold">9.5 – 11.5 Ω @ 20°C</div>
              <div className="text-gray-500 text-[11px] mt-1">Measure between top stud & pump body ground</div>
            </div>
            <div className="p-4 bg-[#181d24] rounded-lg border border-[#2c3440]">
              <span className="text-gray-400 block mb-1">Solenoid Hex Size & Torque:</span>
              <div className="text-amber-400 font-bold">24mm Hex / 20 Nm (15 ft-lb)</div>
              <div className="text-gray-500 text-[11px] mt-1">Replace internal Viton O-ring when servicing</div>
            </div>
          </div>

          <div className="p-4 bg-[#231618] rounded-lg border border-red-900/60 text-xs text-red-300 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Emergency Bypass Trick:</strong> If stranded off-road with an electrical harness failure preventing the solenoid from getting 12V, unscrew the 24mm solenoid, remove the internal spring and rubber tip plunger, and thread the solenoid body back in. The engine will run normally (shut down by using dashboard manual fuel lever or stalling in 4th gear).
            </div>
          </div>
        </div>
      )}

      {activeSystem === 'alternator' && (
        <div className="tech-panel p-6 bg-[#13161a] space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-500" />
            Alternator with Rear-Mounted Vacuum Vane Pump
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Because diesel engines have no throttle butterfly valve, they do not produce manifold intake vacuum. Toyota mounts an oil-lubricated rotary vane vacuum pump directly to the rear shaft of the 55A/60A alternator to supply vacuum for the brake booster, 4WD ADD actuator, and heater blend doors.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 bg-[#181d24] rounded-lg border border-[#2c3440]">
              <span className="text-gray-400 block mb-1">Alternator Output:</span>
              <div className="text-white font-bold">12V / 55A – 60A (Internal IC Regulator)</div>
              <div className="text-gray-500 text-[11px] mt-1">Charging voltage: 13.8 – 14.8 V at 2,000 RPM</div>
            </div>
            <div className="p-4 bg-[#181d24] rounded-lg border border-[#2c3440]">
              <span className="text-gray-400 block mb-1">Vacuum Pump Lubrication:</span>
              <div className="text-emerald-400 font-bold">Pressurized Engine Oil Feed & Drain</div>
              <div className="text-gray-500 text-[11px] mt-1">Fed via banjo line from engine block oil gallery</div>
            </div>
            <div className="p-4 bg-[#181d24] rounded-lg border border-[#2c3440]">
              <span className="text-gray-400 block mb-1">Vacuum Check Valve:</span>
              <div className="text-amber-400 font-bold">One-Way Ball Valve in Outlet Banjo</div>
              <div className="text-gray-500 text-[11px] mt-1">Prevents vacuum leakback on engine shutdown</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
