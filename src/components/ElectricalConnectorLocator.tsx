import React, { useState } from 'react';
import {
  ELECTRICAL_LOCATOR_DATA,
  TOYOTA_WIRE_COLOR_CODE_LEGEND
} from '../data/electricalConnectorsData';
import type { ElectricalComponentLocator } from '../data/electricalConnectorsData';
import {
  Zap,
  MapPin,
  Search,
  HelpCircle,
  Eye,
  Sliders,
  Share2,
  Camera,
  Layers,
  Compass,
  Sparkles
} from 'lucide-react';

export const ElectricalConnectorLocator: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ElectricalComponentLocator>(ELECTRICAL_LOCATOR_DATA[0]);
  const [selectedSystem, setSelectedSystem] = useState<string>('All');
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'photos' | 'blueprint' | 'pinout' | 'schematics'>('photos');

  const systems = ['All', 'Glow & Starting', 'Fuel & Turbo', '4WD & Driveline', 'Sensors & Gauges', 'Charging & Power'];
  const zones = ['All', 'Engine Bay (Driver Side)', 'Engine Bay (Passenger Side)', 'Engine / Block Mounted', 'Cabin (Driver Footwell)', 'Drivetrain & Undercarriage'];

  const filteredItems = ELECTRICAL_LOCATOR_DATA.filter((item) => {
    const matchesSystem = selectedSystem === 'All' || item.system === selectedSystem;
    const matchesZone = selectedZone === 'All' || item.zone === selectedZone;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.physicalLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pins.some(p => p.wireColor.toLowerCase().includes(searchQuery.toLowerCase()) || p.wireColorFull.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSystem && matchesZone && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="tech-panel p-6 bg-gradient-to-r from-[#14232c] via-[#1a1d20] to-[#251b18] border-cyan-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-toyota">Toyota EWD Wiring & Component Locator</span>
              <span className="badge-spec flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Real Workshop Photos & Blueprint
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Zap className="w-6 h-6 text-cyan-400" />
              1991 Toyota 4Runner Electronic Parts & Connector Locator
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Photographic references and scale blueprints for every connector, relay, sensor, and ECU on the LN130 2L-T. Click any callout pin to inspect pinouts and live voltages.
            </p>
          </div>

          {/* Navigation View Switcher */}
          <div className="bg-[#121417] p-1 rounded-lg border border-[#2c3238] flex flex-wrap">
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'photos' ? 'bg-cyan-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" /> Photographic Reference
            </button>
            <button
              onClick={() => setActiveTab('blueprint')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'blueprint' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" /> 4Runner Blueprint
            </button>
            <button
              onClick={() => setActiveTab('pinout')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'pinout' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" /> Pinout & Voltage Table
            </button>
            <button
              onClick={() => setActiveTab('schematics')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'schematics' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" /> Wire Schematics
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="tech-panel p-4 bg-[#14181e] space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search part name, location, or wire color (e.g. 'Glow Timer', 'Fuel Cut', 'B-W', 'THW', 'Alternator')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d0f12] border border-[#2b3440] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-gray-400 uppercase font-bold text-[10px]">System:</span>
            {systems.map((sys) => (
              <button
                key={sys}
                onClick={() => setSelectedSystem(sys)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedSystem === sys
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'bg-[#181e26] text-gray-400 hover:text-white border border-[#252f3d]'
                }`}
              >
                {sys}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 uppercase font-bold text-[10px]">Zone:</span>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-[#0e1115] border border-[#2b3440] rounded-lg px-2 py-1 text-white text-xs focus:outline-none"
            >
              {zones.map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Visual Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Image / Blueprint Visual Display */}
        <div className="lg:col-span-2 space-y-4">
          {activeTab === 'photos' && (
            <div className="tech-panel p-5 bg-[#0e1115]">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#252e3b]">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    {selectedItem.photoTitle}
                  </span>
                </div>
                <span className="badge-spec text-[11px] font-mono">
                  Active Part: {selectedItem.shortCode}
                </span>
              </div>

              {/* Realistic High-Res Reference Photo with Interactive Clickable Hotspot Callouts */}
              <div className="relative w-full h-[460px] bg-black rounded-xl overflow-hidden border border-[#26313f] shadow-2xl group">
                <img
                  src={selectedItem.photoUrl}
                  alt={selectedItem.photoTitle}
                  className="w-full h-full object-cover object-center filter contrast-105"
                />

                {/* Subtle vignette darkening */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                {/* Overlaid Interactive Hotspot Pin for the Selected Item */}
                <div
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center"
                  style={{
                    left: `${selectedItem.photoHotspotX}%`,
                    top: `${selectedItem.photoHotspotY}%`
                  }}
                >
                  {/* Outer Pulsing Glow */}
                  <span className="relative flex h-10 w-10 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-8 w-8 bg-cyan-500 border-2 border-white items-center justify-center text-black font-mono font-black text-xs shadow-lg">
                      <MapPin className="w-4 h-4 text-black" />
                    </span>
                  </span>

                  {/* Callout Label Tag */}
                  <div className="mt-1 px-3 py-1 bg-black/90 text-cyan-300 border border-cyan-500 rounded-lg text-xs font-mono font-bold shadow-2xl backdrop-blur-md whitespace-nowrap flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>{selectedItem.name}</span>
                    <span className="text-white bg-cyan-950 px-1 rounded text-[10px]">[{selectedItem.shortCode}]</span>
                  </div>
                </div>

                {/* Photo Caption Overlay at Bottom */}
                <div className="absolute bottom-3 left-3 right-3 p-3 bg-[#0d1014]/90 backdrop-blur-md rounded-lg border border-[#2b3644] text-xs font-mono flex items-center justify-between text-gray-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span>{selectedItem.physicalLocation}</span>
                  </div>
                  <span className="text-amber-400 font-bold hidden sm:inline-block">
                    {selectedItem.connectorShape}
                  </span>
                </div>
              </div>

              {/* Photo Switcher Gallery Thumbnails */}
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[
                  { id: 'engine_bay', title: 'Complete Engine Bay', url: './reference/engine_bay.jpg', defaultId: 'water-temp-glow-sensor' },
                  { id: 'glow_timer', title: 'Driver Kick Panel (ECU)', url: './reference/glow_timer_kick.jpg', defaultId: 'glow-timer-ecu' },
                  { id: 've_pump', title: 'Bosch VE Injection Pump', url: './reference/ve_fuel_cut.jpg', defaultId: 'fuel-cut-solenoid' },
                  { id: 'relays_fender', title: 'Glow Relays & Fusible Box', url: './reference/glow_relays_fender.jpg', defaultId: 'glow-relay-1' },
                ].map((thumb) => {
                  const isActive = selectedItem.photoUrl === thumb.url;
                  return (
                    <button
                      key={thumb.id}
                      onClick={() => {
                        const target = ELECTRICAL_LOCATOR_DATA.find(i => i.id === thumb.defaultId);
                        if (target) setSelectedItem(target);
                      }}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all group h-16 ${
                        isActive ? 'border-cyan-400 shadow-md ring-1 ring-cyan-400/50' : 'border-[#26313f] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={thumb.url} alt={thumb.title} className="w-full h-full object-cover object-center" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-1">
                        <span className="text-[10px] font-mono font-bold text-white text-center leading-tight">
                          {thumb.title}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'blueprint' && (
            <div className="tech-panel p-5 bg-[#0e1115]">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#252e3b]">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  1991 Toyota 4Runner (LN130) Top-Down Scale Blueprint
                </span>
                <span className="badge-spec text-[11px]">CAD Schematic</span>
              </div>

              {/* Blueprint Graphic */}
              <div className="relative w-full h-[480px] bg-[#090b0e] rounded-xl border border-[#1f2732] overflow-hidden flex items-center justify-center p-2 shadow-inner">
                <svg viewBox="0 0 800 520" className="w-full h-full">
                  <defs>
                    <radialGradient id="hotspotGlow2" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Body Outline */}
                  <rect x="260" y="20" width="280" height="24" rx="6" fill="#1c222b" stroke="#384556" strokeWidth="2" />
                  <path
                    d="M 260 44 L 230 110 L 230 170 L 220 200 L 220 460 C 220 480 260 495 400 495 C 540 495 580 480 580 460 L 580 200 L 570 170 L 570 110 L 540 44 Z"
                    fill="#12161d"
                    stroke="#0284c7"
                    strokeWidth="2"
                  />
                  {/* Fender Flares */}
                  <path d="M 230 80 Q 210 120 230 160" fill="none" stroke="#38bdf8" strokeWidth="3" />
                  <path d="M 570 80 Q 590 120 570 160" fill="none" stroke="#38bdf8" strokeWidth="3" />
                  <path d="M 220 340 Q 200 390 220 440" fill="none" stroke="#38bdf8" strokeWidth="3" />
                  <path d="M 580 340 Q 600 390 580 440" fill="none" stroke="#38bdf8" strokeWidth="3" />

                  {/* Wheels */}
                  <rect x="180" y="85" width="45" height="85" rx="8" fill="#0b0d10" stroke="#475569" strokeWidth="2.5" />
                  <rect x="575" y="85" width="45" height="85" rx="8" fill="#0b0d10" stroke="#475569" strokeWidth="2.5" />
                  <rect x="175" y="360" width="45" height="85" rx="8" fill="#0b0d10" stroke="#475569" strokeWidth="2.5" />
                  <rect x="580" y="360" width="45" height="85" rx="8" fill="#0b0d10" stroke="#475569" strokeWidth="2.5" />

                  {/* Radiator */}
                  <rect x="280" y="52" width="240" height="18" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1.5" rx="3" />
                  <text x="400" y="65" textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                    RADIATOR CORE
                  </text>

                  {/* Engine Block */}
                  <rect x="360" y="75" width="80" height="98" fill="#241b18" stroke="#f97316" strokeWidth="2" rx="6" />
                  <text x="400" y="128" textAnchor="middle" fill="#fb923c" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    2L-T
                  </text>

                  {/* Firewall */}
                  <line x1="230" y1="184" x2="570" y2="184" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6 4" />

                  {/* Interactive Hotspots */}
                  {ELECTRICAL_LOCATOR_DATA.map((item) => {
                    const isSelected = selectedItem.id === item.id;
                    const posX = (item.x / 100) * 800;
                    const posY = (item.y / 100) * 520;

                    return (
                      <g
                        key={item.id}
                        transform={`translate(${posX}, ${posY})`}
                        onClick={() => setSelectedItem(item)}
                        className="cursor-pointer group"
                      >
                        {isSelected && (
                          <circle r="22" fill="none" stroke="#22d3ee" strokeWidth="2.5" className="animate-ping opacity-80" />
                        )}
                        <circle
                          r={isSelected ? 16 : 11}
                          fill={isSelected ? '#06b6d4' : '#1e293b'}
                          stroke={isSelected ? '#ffffff' : '#38bdf8'}
                          strokeWidth={isSelected ? 2.5 : 1.5}
                          className="transition-all hover:scale-125"
                        />
                        <text
                          y="3.5"
                          textAnchor="middle"
                          fill={isSelected ? '#000' : '#fff'}
                          fontSize="8"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {item.shortCode.slice(0, 3)}
                        </text>
                        <rect
                          x="-42"
                          y="15"
                          width="84"
                          height="16"
                          fill="#090b0e"
                          stroke={isSelected ? '#06b6d4' : '#334155'}
                          strokeWidth="1"
                          rx="3"
                        />
                        <text
                          y="26"
                          textAnchor="middle"
                          fill={isSelected ? '#22d3ee' : '#94a3b8'}
                          fontSize="7.5"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {item.shortCode}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: Component Selector List */}
        <div className="space-y-3">
          <span className="text-xs font-mono text-gray-400 uppercase font-bold tracking-wider block">
            Select Electronic Component ({filteredItems.length}):
          </span>

          <div className="max-h-[550px] overflow-y-auto space-y-2 pr-1">
            {filteredItems.map((item) => {
              const isSelected = selectedItem.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                    isSelected
                      ? 'border-cyan-500 bg-[#14232c] text-white ring-1 ring-cyan-500/50 shadow-md'
                      : 'border-[#262f3a] bg-[#14181e] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{item.name}</span>
                    <span className="badge-spec text-[10px] font-mono">{item.shortCode}</span>
                  </div>
                  <div className="text-[11px] text-cyan-400 font-mono mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span>{item.zone}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Item Detailed Overview Card */}
      <div className="tech-panel p-6 bg-[#13161a] border-cyan-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#28323e]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-toyota">{selectedItem.system}</span>
              <span className="badge-spec font-mono">{selectedItem.connectorShape}</span>
              <span className="badge-blue font-mono">{selectedItem.zone}</span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              {selectedItem.name}
            </h3>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-gray-500 uppercase">Harness Identifier:</span>
            <div className="text-lg font-mono font-bold text-cyan-400">{selectedItem.shortCode}</div>
          </div>
        </div>

        {/* Physical Location & Visual Finder Guide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
          <div className="p-4 bg-[#181d24] rounded-xl border border-[#2b3542] space-y-2">
            <div className="font-bold text-white font-mono uppercase flex items-center gap-1.5 text-cyan-400">
              <MapPin className="w-4 h-4" /> Physical Location on Vehicle
            </div>
            <p className="text-gray-300 leading-relaxed">{selectedItem.physicalLocation}</p>
            <div className="pt-2 border-t border-[#29323f] text-gray-400">
              <strong className="text-white">How to Access:</strong> {selectedItem.accessTips}
            </div>
          </div>

          <div className="p-4 bg-[#181d24] rounded-xl border border-[#2b3542] space-y-2">
            <div className="font-bold text-white font-mono uppercase flex items-center gap-1.5 text-amber-400">
              <Eye className="w-4 h-4" /> Visual Appearance & Connector Style
            </div>
            <p className="text-gray-300 leading-relaxed">{selectedItem.visualIdentifier}</p>
            <div className="pt-2 border-t border-[#29323f]">
              <span className="text-gray-400">Connector Interface: </span>
              <strong className="text-emerald-400 font-mono">{selectedItem.connectorShape}</strong>
            </div>
          </div>
        </div>

        {/* Connector Pinout & Wire Color Table */}
        <div className="mt-6">
          <h4 className="text-sm font-bold text-white font-mono uppercase mb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Connector Pinout, Wire Color Codes & Multimeter Test Table
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#2d3642] text-gray-400">
                  <th className="py-2.5 px-3">PIN #</th>
                  <th className="py-2.5 px-3">LABEL & FUNCTION</th>
                  <th className="py-2.5 px-3">TOYOTA WIRE COLOR</th>
                  <th className="py-2.5 px-3">TEST CONDITION</th>
                  <th className="py-2.5 px-3">EXPECTED VOLTAGE / READING</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222831] text-gray-300">
                {selectedItem.pins.map((pin) => (
                  <tr key={pin.pinNumber} className="hover:bg-[#1a2028]">
                    <td className="py-3 px-3">
                      <span className="font-bold text-cyan-400 bg-[#12232b] px-2 py-0.5 rounded border border-cyan-800/50">
                        Pin #{pin.pinNumber}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{pin.label}</div>
                      <div className="text-[11px] text-gray-400">{pin.function}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-300 font-mono">{pin.wireColor}</span>
                        <span className="text-gray-400 text-[11px]">({pin.wireColorFull})</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-400">{pin.testCondition}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-emerald-400 font-mono">{pin.expectedVoltage}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Failure Symptoms Checklist */}
        <div className="mt-6 p-4 bg-[#201518] rounded-xl border border-red-900/50 text-xs">
          <div className="font-bold text-red-400 font-mono uppercase mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" /> Failure Symptoms When Damaged / Disconnected
          </div>
          <ul className="space-y-1 text-gray-300 list-disc pl-4">
            {selectedItem.failureSymptoms.map((sym, idx) => (
              <li key={idx}>{sym}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Toyota Wire Color Decoder Legend */}
      <div className="tech-panel p-6 bg-[#13161a]">
        <h4 className="text-sm font-bold text-white font-mono uppercase mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          Official Toyota Wire Color Code Matrix (FSM Standard)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs font-mono">
          {Object.entries(TOYOTA_WIRE_COLOR_CODE_LEGEND).map(([code, name]) => (
            <div key={code} className="p-2 bg-[#181d24] rounded-lg border border-[#27303c] flex items-center justify-between">
              <span className="font-bold text-amber-400">{code}:</span>
              <span className="text-gray-300 text-[11px]">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
