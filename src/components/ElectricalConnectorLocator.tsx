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
  Radio,
  Share2
} from 'lucide-react';

export const ElectricalConnectorLocator: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ElectricalComponentLocator>(ELECTRICAL_LOCATOR_DATA[0]);
  const [selectedSystem, setSelectedSystem] = useState<string>('All');
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'locator' | 'pinout' | 'schematics'>('locator');

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
      <div className="tech-panel p-6 bg-gradient-to-r from-[#17232e] via-[#1a1d20] to-[#251b18] border-cyan-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-toyota">Toyota EWD Electrical Wiring Diagram</span>
              <span className="badge-spec">Connector & Harness Locator</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Zap className="w-6 h-6 text-cyan-400" />
              Interactive Electronics Debugger & Connector Locator
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Locate every electronic module, relay, sensor, and harness connector on the 1991 4Runner with visual pinouts, Toyota wire color codes, and live voltage test specs.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-[#121417] p-1 rounded-lg border border-[#2c3238] flex flex-wrap">
            <button
              onClick={() => setActiveTab('locator')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'locator' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" /> Physical Vehicle Map
            </button>
            <button
              onClick={() => setActiveTab('pinout')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'pinout' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" /> Connector Pinout & Voltage
            </button>
            <button
              onClick={() => setActiveTab('schematics')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'schematics' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" /> Master Circuit Schematics
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
            className="w-full bg-[#0d0f12] border border-[#2b3440] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
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

      {activeTab === 'locator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Vehicle Schematic Map (2 Columns) */}
          <div className="lg:col-span-2 tech-panel p-6 bg-[#111418]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-gray-400 uppercase font-bold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                1991 4Runner LN130 Top-Down Electronic Component Map
              </span>
              <span className="badge-spec text-[11px]">Click Any Hotspot to Inspect</span>
            </div>

            {/* SVG Top-Down Interactive Vehicle Layout */}
            <div className="relative w-full h-[450px] bg-[#0c0e12] rounded-xl border border-[#232a34] overflow-hidden flex items-center justify-center p-2">
              <svg viewBox="0 0 700 450" className="w-full h-full">
                {/* Vehicle Outer Silhouette (Top Down 4Runner) */}
                <path
                  d="M 120 70 C 120 40 200 30 350 30 C 500 30 580 40 580 70 L 590 140 L 610 170 L 610 400 C 610 420 570 430 350 430 C 130 430 90 420 90 400 L 90 170 L 110 140 Z"
                  fill="#151920"
                  stroke="#2d3744"
                  strokeWidth="2.5"
                />

                {/* Windshield & Cabin Glass */}
                <polygon points="150,160 550,160 520,240 180,240" fill="#1b232e" stroke="#374353" strokeWidth="1.5" />
                <text x="350" y="205" textAnchor="middle" fill="#4b5869" fontSize="13" fontFamily="monospace" fontWeight="bold">
                  CABIN / PASSENGER COMPARTMENT
                </text>

                {/* Firewall Line */}
                <line x1="130" y1="150" x2="570" y2="150" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 3" />
                <text x="350" y="143" textAnchor="middle" fill="#ef4444" fontSize="10" fontFamily="monospace">
                  FIREWALL BOUNDARY
                </text>

                {/* Engine Bay Sub-Zones */}
                <rect x="140" y="50" width="160" height="90" fill="#131e28" stroke="#223344" strokeWidth="1" rx="6" />
                <text x="220" y="70" textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  DRIVER INNER FENDER
                </text>

                {/* 2L-T Engine Core Block */}
                <rect x="310" y="45" width="80" height="95" fill="#201a18" stroke="#ea580c" strokeWidth="1.5" rx="8" />
                <text x="350" y="85" textAnchor="middle" fill="#f97316" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  2L-T BLOCK
                </text>

                {/* Passenger Fender */}
                <rect x="400" y="50" width="160" height="90" fill="#15241f" stroke="#1c3e33" strokeWidth="1" rx="6" />
                <text x="480" y="70" textAnchor="middle" fill="#34d399" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  PASSENGER INNER FENDER
                </text>

                {/* Front Axle & Drivetrain Area */}
                <rect x="250" y="300" width="200" height="70" fill="#1c1622" stroke="#4c1d95" strokeWidth="1" rx="6" />
                <text x="350" y="340" textAnchor="middle" fill="#a78bfa" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  FRONT IFS AXLE & 4WD ADD
                </text>

                {/* Wheels Outline */}
                <rect x="70" y="70" width="30" height="60" fill="#111" stroke="#333" rx="4" />
                <rect x="600" y="70" width="30" height="60" fill="#111" stroke="#333" rx="4" />
                <rect x="70" y="330" width="30" height="60" fill="#111" stroke="#333" rx="4" />
                <rect x="600" y="330" width="30" height="60" fill="#111" stroke="#333" rx="4" />

                {/* Component Hotspots */}
                {ELECTRICAL_LOCATOR_DATA.map((item) => {
                  const isSelected = selectedItem.id === item.id;
                  const posX = (item.x / 100) * 700;
                  const posY = (item.y / 100) * 450;

                  return (
                    <g
                      key={item.id}
                      transform={`translate(${posX}, ${posY})`}
                      onClick={() => setSelectedItem(item)}
                      className="cursor-pointer group"
                    >
                      {/* Pulse Ring when selected */}
                      {isSelected && (
                        <circle r="22" fill="none" stroke="#22d3ee" strokeWidth="2.5" className="animate-ping opacity-75" />
                      )}
                      <circle
                        r={isSelected ? 16 : 12}
                        fill={isSelected ? '#06b6d4' : '#1f2937'}
                        stroke={isSelected ? '#ffffff' : '#6b7280'}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        className="transition-all hover:scale-125"
                      />
                      <text
                        y="4"
                        textAnchor="middle"
                        fill={isSelected ? '#000' : '#fff'}
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {item.shortCode.slice(0, 3)}
                      </text>

                      {/* Hover / Selected Label Badge */}
                      <rect
                        x="-45"
                        y="18"
                        width="90"
                        height="18"
                        fill="#0c0e12"
                        stroke={isSelected ? '#06b6d4' : '#374151'}
                        rx="4"
                        strokeWidth="1"
                      />
                      <text
                        y="30"
                        textAnchor="middle"
                        fill={isSelected ? '#22d3ee' : '#9ca3af'}
                        fontSize="8"
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

          {/* Component List & Details Inspector */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-gray-400 uppercase font-bold tracking-wider block">
              Filtered Electrical Parts ({filteredItems.length}):
            </span>

            <div className="max-h-[420px] overflow-y-auto space-y-1.5 pr-1">
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
      )}

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
          <HelpCircle className="w-4 h-4 text-amber-400" />
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
