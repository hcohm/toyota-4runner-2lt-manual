import React, { useState } from 'react';
import {
  FUEL_CIRCUIT_COMPONENTS,
  FUEL_SERVICE_GUIDES
} from '../data/fuelSystemData';
import type { FuelComponent, FuelServiceGuide } from '../data/fuelSystemData';
import {
  Droplet,
  Search,
  Sliders,
  ShieldAlert,
  Sparkles,
  Camera,
  Activity,
  Layers,
  Clock,
  Compass
} from 'lucide-react';

export const FuelSystemHub: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<FuelComponent>(FUEL_CIRCUIT_COMPONENTS[0]);
  const [activeTab, setActiveTab] = useState<'schematic' | 'photos' | 'air-ingress' | 'guides'>('schematic');
  const [selectedGuide, setSelectedGuide] = useState<FuelServiceGuide>(FUEL_SERVICE_GUIDES[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Air Ingress Diagnostic Lab States
  const [simulatedCavitation, setSimulatedCavitation] = useState<boolean>(false);
  const [vacuumMmHg, setVacuumMmHg] = useState<number>(85); // Normal = 60-120 mmHg

  const filteredComponents = FUEL_CIRCUIT_COMPONENTS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.function.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.failureSymptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="tech-panel p-6 bg-gradient-to-r from-[#221c17] via-[#1a1d20] to-[#182329] border-amber-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-toyota">FSM Section FU-01 / RM520E</span>
              <span className="badge-spec flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> 100% Mechanical Suction Circuit
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Droplet className="w-6 h-6 text-amber-400" />
              2L-T Mechanical Diesel Fuel Circuit & Suction Line Master Hub
            </h2>
            <p className="text-sm text-gray-400 mt-1 max-w-3xl leading-relaxed">
              Complete diagnostic, disassembly, and servicing suite for the entire fuel line from the 65L rear tank to the Bosch VE injection pump and injectors. <strong className="text-amber-300">Important:</strong> This system has no electric in-tank pump; fuel is drawn 100% by suction vacuum.
            </p>
          </div>

          {/* Navigation View Switcher */}
          <div className="bg-[#121417] p-1 rounded-lg border border-[#2c3238] flex flex-wrap">
            <button
              onClick={() => setActiveTab('schematic')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'schematic' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" /> Flow Schematic
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'photos' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" /> Photographic Reference
            </button>
            <button
              onClick={() => setActiveTab('air-ingress')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'air-ingress' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Air Ingress Lab
            </button>
            <button
              onClick={() => setActiveTab('guides')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'guides' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" /> Service Guides ({FUEL_SERVICE_GUIDES.length})
            </button>
          </div>
        </div>
      </div>

      {/* Critical Architecture Callout */}
      <div className="tech-card border-amber-900/60 bg-[#1c1815] text-xs">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white uppercase font-mono tracking-wide">
              HOW THE 2L-T MECHANICAL FUEL SYSTEM WORKS (NO IN-TANK PUMP):
            </span>
            <p className="text-gray-300 leading-relaxed">
              Unlike modern common-rail diesels, the 1991 4Runner 2L-T tank contains <strong className="text-white">only a passive pickup pipe with a brass mesh strainer</strong>. The internal rotary vane pump inside the Bosch VE injection pump creates continuous suction vacuum (up to -120 mmHg) to pull diesel across 4 meters of chassis line. Because the entire line is under <strong className="text-amber-300">negative pressure</strong>, any loose clamp or cracked hose will <strong className="text-red-400">suck air bubbles in</strong> without leaking fuel out!
            </p>
          </div>
        </div>
      </div>

      {/* TAB 1: FLOW SCHEMATIC VIEW */}
      {activeTab === 'schematic' && (
        <div className="space-y-4">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search fuel circuit parts (e.g. 'strainer', 'sedimenter', 'banjo', 'LDA', 'primer')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111418] border border-[#27303d] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Step-by-Step Flow Path (2 Columns) */}
            <div className="lg:col-span-2 tech-panel p-6 bg-[#111418] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#262f3c]">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-amber-400" />
                  2L-T Complete Fuel Flow Path & Pressure Circuit
                </span>
                <span className="badge-spec text-[11px]">Showing {filteredComponents.length} Stages</span>
              </div>

              {/* Interactive Flow Sequence Cards */}
              <div className="space-y-3">
                {filteredComponents.map((comp, idx) => {
                  const isSelected = selectedComponent.id === comp.id;
                  return (
                    <div
                      key={comp.id}
                      onClick={() => setSelectedComponent(comp)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-[#241c16] ring-1 ring-amber-500/50 shadow-lg'
                          : 'border-[#262f3a] bg-[#14181f] hover:border-gray-500'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-[#0e1115] border border-[#2b3542] text-amber-400 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="text-sm font-bold text-white flex items-center gap-2">
                              {comp.name}
                              <span className="badge-spec text-[10px] font-mono">{comp.shortCode}</span>
                            </div>
                            <div className="text-[11px] text-gray-400 font-mono mt-0.5">{comp.zone}</div>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold self-start sm:self-auto ${
                            comp.pressureState.includes('Negative')
                              ? 'bg-blue-950 text-blue-300 border border-blue-800'
                              : comp.pressureState.includes('Extreme')
                              ? 'bg-red-950 text-red-300 border border-red-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {comp.pressureState}
                        </span>
                      </div>

                      <p className="text-xs text-gray-300 mt-2 leading-relaxed pl-10">
                        {comp.function}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Component Details & Servicing Card (1 Column) */}
            <div className="space-y-4">
              <div className="tech-panel p-5 bg-[#14181f] border-amber-900/40 space-y-4">
                <div className="pb-3 border-b border-[#28323f]">
                  <span className="badge-spec font-mono text-[10px]">{selectedComponent.shortCode}</span>
                  <h3 className="text-lg font-bold text-white mt-1">{selectedComponent.name}</h3>
                  <span className="text-xs text-amber-400 font-mono block mt-0.5">{selectedComponent.zone}</span>
                </div>

                {/* Photo Thumbnail */}
                <div className="relative rounded-lg overflow-hidden border border-[#293444] h-36">
                  <img
                    src={selectedComponent.photoUrl}
                    alt={selectedComponent.photoTitle}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[10px] font-mono text-gray-200">{selectedComponent.photoTitle}</span>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 bg-[#0e1115] rounded-lg border border-[#252f3d]">
                    <span className="text-gray-400 uppercase text-[10px] block font-bold">Key Specifications:</span>
                    <span className="text-emerald-400 font-bold">{selectedComponent.keySpecs}</span>
                  </div>
                  <div className="p-2.5 bg-[#0e1115] rounded-lg border border-[#252f3d]">
                    <span className="text-gray-400 uppercase text-[10px] block font-bold">Service Interval:</span>
                    <span className="text-white">{selectedComponent.serviceInterval}</span>
                  </div>
                </div>

                {/* Failure Symptoms */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-red-400 font-bold uppercase font-mono text-[10px] flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Failure Symptoms & Warnings
                  </span>
                  <ul className="space-y-1 text-gray-300 text-[11px] list-disc pl-4">
                    {selectedComponent.failureSymptoms.map((sym, i) => (
                      <li key={i}>{sym}</li>
                    ))}
                  </ul>
                </div>

                {/* Disassembly Guide List */}
                <div className="space-y-1.5 text-xs pt-2 border-t border-[#26303d]">
                  <span className="text-amber-300 font-bold uppercase font-mono text-[10px] flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" /> Disassembly & Overhaul Steps
                  </span>
                  <div className="space-y-1 text-gray-300 text-[11px] font-mono">
                    {selectedComponent.disassemblyGuide.map((step, i) => (
                      <div key={i} className="py-1 border-b border-[#212732] last:border-none">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PHOTOGRAPHIC REFERENCE VIEW */}
      {activeTab === 'photos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Photo 1: Fuel Filter & Primer Bracket */}
          <div className="tech-panel p-5 bg-[#12151a] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#26303f]">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                Diesel Fuel Filter, Primer Head & Water Sedimenter
              </span>
              <span className="badge-spec text-[10px]">OEM: 23303-64010</span>
            </div>

            <div className="rounded-xl overflow-hidden border border-[#273241] h-64 relative">
              <img
                src="./reference/fuel_filter_primer.jpg"
                alt="Fuel Filter Assembly"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="text-xs text-gray-300 space-y-1.5">
              <p>
                <strong className="text-white">Location:</strong> Passenger side inner fender wall behind the starting battery and power steering reservoir.
              </p>
              <p>
                <strong className="text-white">Features:</strong> Push-button manual primer pump with internal flapper check valves, 10mm air bleed screw, and bottom clear plastic sedimenter bowl with 2-pin water detection float switch.
              </p>
            </div>
          </div>

          {/* Photo 2: Fuel Tank Sender & Brass Mesh Sock Strainer */}
          <div className="tech-panel p-5 bg-[#12151a] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#26303f]">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                Fuel Tank Sender Flange & Brass Sock Strainer
              </span>
              <span className="badge-spec text-[10px]">65L Diesel Tank</span>
            </div>

            <div className="rounded-xl overflow-hidden border border-[#273241] h-64 relative">
              <img
                src="./reference/fuel_tank_pickup.jpg"
                alt="Fuel Tank Pickup Assembly"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="text-xs text-gray-300 space-y-1.5">
              <p>
                <strong className="text-white">Location:</strong> Top surface of 65L fuel tank beneath rear cargo floor (accessible by dropping tank).
              </p>
              <p>
                <strong className="text-white">Features:</strong> 8mm suction pickup pipe with fine brass mesh sock strainer, 6mm return line, float level potentiometer, and 5-bolt sealing flange.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AIR INGRESS & CAVITATION LAB */}
      {activeTab === 'air-ingress' && (
        <div className="tech-panel p-6 bg-[#111419] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#252e3b]">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Air Ingress & Suction Vacuum Diagnostic Simulator
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Simulate suction vacuum resistance and clear-line bubble detection to identify microscopic suction leaks.
              </p>
            </div>

            <button
              onClick={() => setSimulatedCavitation(!simulatedCavitation)}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                simulatedCavitation
                  ? 'bg-red-600 text-white shadow-lg animate-pulse'
                  : 'bg-[#1e2530] text-gray-300 hover:text-white border border-[#2d3744]'
              }`}
            >
              {simulatedCavitation ? 'Stop Air Ingress Simulation' : 'Simulate Air Ingress (Cavitation)'}
            </button>
          </div>

          {/* Simulated Clear Diagnostic Line View */}
          <div className="p-6 bg-[#0a0c0f] rounded-xl border border-[#222b37] space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400 font-bold uppercase">Clear Vinyl Test Line (Filter &rarr; VE Pump Inlet):</span>
              <span className={simulatedCavitation ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                {simulatedCavitation ? '⚠️ AERATED FUEL (CHAMPAGNE BUBBLES)' : '✅ SOLID GREEN DIESEL STREAM'}
              </span>
            </div>

            {/* Photorealistic Clear Vinyl Fuel Hose Animation */}
            <div className="relative h-16 bg-[#0c130f] rounded-2xl border-2 border-[#2b4438] overflow-hidden flex items-center px-4 shadow-2xl relative">
              {/* Braided clear PVC reinforcement pattern */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, #34d399 1px, transparent 1px)`,
                  backgroundSize: '12px 12px'
                }}
              />

              {/* Glowing Diesel Fluid Base */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#064e3b]/80 via-[#047857]/60 to-[#064e3b]/80" />

              {simulatedCavitation ? (
                <div className="relative w-full h-full flex items-center overflow-hidden">
                  {/* High velocity fluid turbulence streaks */}
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.15)_50%,transparent_100%)] animate-pulse" />

                  {/* Multitude of micro and macro cavitation bubbles */}
                  {[...Array(24)].map((_, i) => {
                    const size = 3 + ((i * 7) % 8);
                    const speed = 0.8 + ((i * 3) % 10) * 0.1;
                    const topPos = 20 + ((i * 13) % 60);
                    return (
                      <span
                        key={i}
                        className="absolute rounded-full bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.8)] border border-cyan-200"
                        style={{
                          width: `${size}px`,
                          height: `${size}px`,
                          top: `${topPos}%`,
                          left: `${(i * 4.2) % 100}%`,
                          animation: `bounce ${speed}s infinite alternate ease-in-out`
                        }}
                      />
                    );
                  })}
                  <div className="absolute right-4 text-[10px] font-mono font-bold text-red-300 bg-red-950/80 px-2 py-0.5 rounded border border-red-800 backdrop-blur-sm shadow">
                    CAVITATION FOAM ACTIVE
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono font-bold text-emerald-200">
                      Solid Laminar Diesel Stream (0.0% Aeration)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    Normal Suction Flow
                  </span>
                </div>
              )}
            </div>

            {/* Suction Vacuum Slider */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">Suction Line Vacuum:</span>
                <span
                  className={`font-bold ${
                    vacuumMmHg > 180 ? 'text-red-400' : vacuumMmHg > 140 ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {vacuumMmHg} mmHg (Normal: 60 – 140 mmHg)
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="300"
                value={vacuumMmHg}
                onChange={(e) => setVacuumMmHg(parseInt(e.target.value))}
                className="w-full h-2 bg-[#1b222c] rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-500">
                <span>40 mmHg (Low Drag)</span>
                <span>150 mmHg (Limit)</span>
                <span>300 mmHg (Clogged Strainer / Cavitation)</span>
              </div>
            </div>
          </div>

          {/* Step-by-Step Isolation Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#14181f] rounded-xl border border-[#252f3d] space-y-1.5">
              <span className="font-bold text-amber-400 font-mono uppercase text-[11px] block">
                1. Test at Filter Outlet
              </span>
              <p className="text-gray-300 leading-relaxed text-[11px]">
                Install clear hose directly on the injection pump fuel inlet. If bubbles appear, fuel is aerated before entering pump.
              </p>
            </div>
            <div className="p-4 bg-[#14181f] rounded-xl border border-[#252f3d] space-y-1.5">
              <span className="font-bold text-cyan-400 font-mono uppercase text-[11px] block">
                2. Test at Filter Inlet
              </span>
              <p className="text-gray-300 leading-relaxed text-[11px]">
                Move clear hose between chassis hardline and filter inlet. If bubbles disappear, the leak is inside the primer head or filter O-ring!
              </p>
            </div>
            <div className="p-4 bg-[#14181f] rounded-xl border border-[#252f3d] space-y-1.5">
              <span className="font-bold text-emerald-400 font-mono uppercase text-[11px] block">
                3. Pressurize Chassis Line
              </span>
              <p className="text-gray-300 leading-relaxed text-[11px]">
                Apply 1.0 bar low air pressure to tank filler neck with rag. Look for wet diesel weeping along rusted chassis rail seams.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SERVICE GUIDES */}
      {activeTab === 'guides' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Guide Selector List */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-gray-400 uppercase font-bold tracking-wider block mb-1">
              Select Workshop Service Guide:
            </span>
            {FUEL_SERVICE_GUIDES.map((g) => {
              const isSelected = selectedGuide.id === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGuide(g)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs ${
                    isSelected
                      ? 'border-amber-500 bg-[#241c16] text-white ring-1 ring-amber-500/50 shadow-md'
                      : 'border-[#262f3a] bg-[#14181e] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="font-bold text-sm text-white mb-1">{g.title}</div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400">
                    <span className="badge-spec">{g.difficulty}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> {g.estimatedTime}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Guide Instructions Card (2 Columns) */}
          <div className="lg:col-span-2 tech-panel p-6 bg-[#13161a] space-y-4">
            <div className="pb-3 border-b border-[#28323f]">
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-toyota">{selectedGuide.difficulty}</span>
                <span className="badge-spec font-mono">{selectedGuide.estimatedTime}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{selectedGuide.title}</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{selectedGuide.overview}</p>
            </div>

            {/* Tools & Consumables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#181d24] rounded-lg border border-[#2b3542]">
                <span className="text-gray-400 uppercase font-bold text-[10px] block mb-1">Tools Required:</span>
                <ul className="text-gray-300 space-y-0.5 list-disc pl-4 text-[11px]">
                  {selectedGuide.toolsNeeded.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-[#181d24] rounded-lg border border-[#2b3542]">
                <span className="text-gray-400 uppercase font-bold text-[10px] block mb-1">Consumables Needed:</span>
                <ul className="text-emerald-400 space-y-0.5 list-disc pl-4 text-[11px]">
                  {selectedGuide.consumables.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Numbered Step Instructions */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono text-gray-400 uppercase font-bold tracking-wider block">
                Step-by-Step Procedure Instructions:
              </span>

              {selectedGuide.steps.map((s) => (
                <div key={s.stepNumber} className="p-4 bg-[#181d24] rounded-xl border border-[#2b3542] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-mono text-xs flex items-center justify-center font-bold">
                        {s.stepNumber}
                      </span>
                      {s.title}
                    </span>
                    {s.torque && <span className="badge-spec font-mono text-[10px]">{s.torque}</span>}
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed pl-7">{s.instruction}</p>

                  {s.warning && (
                    <div className="ml-7 p-2.5 bg-[#241718] rounded-lg border border-red-900/60 text-[11px] text-red-300 flex items-start gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>{s.warning}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
