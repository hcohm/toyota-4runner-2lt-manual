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
  Share2,
  ZoomIn,
  Layers,
  Compass
} from 'lucide-react';

export const ElectricalConnectorLocator: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ElectricalComponentLocator>(ELECTRICAL_LOCATOR_DATA[0]);
  const [selectedSystem, setSelectedSystem] = useState<string>('All');
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'locator' | 'pinout' | 'schematics'>('locator');
  const [viewMode, setViewMode] = useState<'full-vehicle' | 'engine-bay'>('full-vehicle');

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
              <span className="badge-toyota">Toyota EWD Electrical Wiring Diagram</span>
              <span className="badge-spec">LN130 Scale Blueprint & Connector Locator</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Zap className="w-6 h-6 text-cyan-400" />
              1991 Toyota 4Runner Electronic Parts & Connector Locator
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              True-to-scale blueprint schematic of the 1991 4Runner (LN130). Click any pulse hotspot to inspect physical mounting location, connector terminal pinouts, and test voltages.
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
              <MapPin className="w-3.5 h-3.5" /> 4Runner Blueprint
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
              <Share2 className="w-3.5 h-3.5" /> Circuit Schematics
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
          {/* Blueprint Canvas (2 Columns) */}
          <div className="lg:col-span-2 tech-panel p-6 bg-[#0f1216]">
            {/* View Switcher Bar */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#252e3b]">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  {viewMode === 'full-vehicle'
                    ? '1991 Toyota 4Runner (LN130) Chassis & Cabin Blueprint'
                    : '2L-T Engine Bay Detailed Component Bay'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-[#171c24] p-1 rounded-lg border border-[#2c3644]">
                <button
                  onClick={() => setViewMode('full-vehicle')}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all flex items-center gap-1 ${
                    viewMode === 'full-vehicle' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-3 h-3" /> Full Vehicle View
                </button>
                <button
                  onClick={() => setViewMode('engine-bay')}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all flex items-center gap-1 ${
                    viewMode === 'engine-bay' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ZoomIn className="w-3 h-3" /> Zoom Engine Bay
                </button>
              </div>
            </div>

            {/* Scale SVG 4Runner Layout */}
            <div className="relative w-full h-[520px] bg-[#090b0e] rounded-xl border border-[#1f2732] overflow-hidden flex items-center justify-center p-2 shadow-inner">
              {/* Technical Blueprint Grid Lines */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #00ffff 1px, transparent 1px), linear-gradient(to bottom, #00ffff 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }}
              />

              {viewMode === 'full-vehicle' ? (
                /* ========================================================
                   FULL VEHICLE 1991 4RUNNER SCALE BLUEPRINT
                   ======================================================== */
                <svg viewBox="0 0 800 520" className="w-full h-full">
                  <defs>
                    <radialGradient id="hotspotGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
                    </radialGradient>
                    <filter id="glowEffect">
                      <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* 1. VEHICLE OUTER BODY SHELL (1991 LN130 4RUNNER) */}
                  {/* Front Bumper & Bull Bar */}
                  <rect x="260" y="20" width="280" height="24" rx="6" fill="#1c222b" stroke="#384556" strokeWidth="2" />
                  <rect x="330" y="14" width="140" height="12" rx="4" fill="#11151a" stroke="#4b5563" strokeWidth="1.5" />
                  <circle cx="285" cy="32" r="5" fill="#f59e0b" /> {/* Left Turn Signal */}
                  <circle cx="515" cy="32" r="5" fill="#f59e0b" /> {/* Right Turn Signal */}

                  {/* Hood & Front Fenders with Box Flare Contours */}
                  <path
                    d="M 260 44 L 230 110 L 230 170 L 220 200 L 220 460 C 220 480 260 495 400 495 C 540 495 580 480 580 460 L 580 200 L 570 170 L 570 110 L 540 44 Z"
                    fill="#12161d"
                    stroke="#0284c7"
                    strokeWidth="2"
                  />

                  {/* Characteristic LN130 Boxy Fender Flares (Front & Rear) */}
                  {/* Left Front Flare */}
                  <path d="M 230 80 Q 210 120 230 160" fill="none" stroke="#38bdf8" strokeWidth="3" />
                  {/* Right Front Flare */}
                  <path d="M 570 80 Q 590 120 570 160" fill="none" stroke="#38bdf8" strokeWidth="3" />
                  {/* Left Rear Flare */}
                  <path d="M 220 340 Q 200 390 220 440" fill="none" stroke="#38bdf8" strokeWidth="3" />
                  {/* Right Rear Flare */}
                  <path d="M 580 340 Q 600 390 580 440" fill="none" stroke="#38bdf8" strokeWidth="3" />

                  {/* 2. CHASSIS TIRES & WHEELS (31x10.50R15) */}
                  <rect x="180" y="85" width="45" height="85" rx="8" fill="#0b0d10" stroke="#475569" strokeWidth="2.5" />
                  <rect x="575" y="85" width="45" height="85" rx="8" fill="#0b0d10" stroke="#475569" strokeWidth="2.5" />
                  <rect x="175" y="360" width="45" height="85" rx="8" fill="#0b0d10" stroke="#475569" strokeWidth="2.5" />
                  <rect x="580" y="360" width="45" height="85" rx="8" fill="#0b0d10" stroke="#475569" strokeWidth="2.5" />

                  {/* 3. ENGINE BAY COMPARTMENT */}
                  <rect x="250" y="48" width="300" height="135" fill="#151b24" stroke="#2c394b" strokeWidth="1.5" rx="6" />

                  {/* Radiator Core & Shroud */}
                  <rect x="280" y="52" width="240" height="18" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1.5" rx="3" />
                  <text x="400" y="65" textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                    RADIATOR & FAN SHROUD
                  </text>

                  {/* Main Starting Battery (Driver Front) */}
                  <rect x="260" y="75" width="55" height="42" fill="#1f2937" stroke="#ef4444" strokeWidth="1.5" rx="4" />
                  <text x="287" y="100" textAnchor="middle" fill="#f87171" fontSize="8" fontFamily="monospace" fontWeight="bold">
                    BATTERY
                  </text>

                  {/* 2L-T Diesel Engine Block Center */}
                  <rect x="360" y="75" width="80" height="98" fill="#241b18" stroke="#f97316" strokeWidth="2" rx="6" />
                  <line x1="360" y1="99" x2="440" y2="99" stroke="#ea580c" strokeWidth="1" />
                  <line x1="360" y1="123" x2="440" y2="123" stroke="#ea580c" strokeWidth="1" />
                  <line x1="360" y1="147" x2="440" y2="147" stroke="#ea580c" strokeWidth="1" />
                  <text x="400" y="90" textAnchor="middle" fill="#ea580c" fontSize="8" fontFamily="monospace" fontWeight="bold">CYL #1</text>
                  <text x="400" y="114" textAnchor="middle" fill="#ea580c" fontSize="8" fontFamily="monospace" fontWeight="bold">CYL #2</text>
                  <text x="400" y="138" textAnchor="middle" fill="#ea580c" fontSize="8" fontFamily="monospace" fontWeight="bold">CYL #3</text>
                  <text x="400" y="162" textAnchor="middle" fill="#ea580c" fontSize="8" fontFamily="monospace" fontWeight="bold">CYL #4</text>

                  {/* Turbocharger (Passenger/Right side of Block) */}
                  <circle cx="460" cy="115" r="16" fill="#374151" stroke="#fbbf24" strokeWidth="1.5" />
                  <text x="460" y="119" textAnchor="middle" fill="#fef08a" fontSize="7" fontFamily="monospace" fontWeight="bold">
                    CT20
                  </text>

                  {/* Air Filter Canister (Passenger Front) */}
                  <circle cx="515" cy="98" r="22" fill="#1f2937" stroke="#6b7280" strokeWidth="1.5" />
                  <text x="515" y="102" textAnchor="middle" fill="#9ca3af" fontSize="7" fontFamily="monospace">
                    AIRBOX
                  </text>

                  {/* 4. FIREWALL BOUNDARY LINE */}
                  <line x1="230" y1="184" x2="570" y2="184" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6 4" />
                  <text x="400" y="180" textAnchor="middle" fill="#ef4444" fontSize="9" fontFamily="monospace" fontWeight="bold">
                    FIREWALL BULKHEAD
                  </text>

                  {/* 5. PASSENGER CABIN & DASHBOARD */}
                  <path
                    d="M 235 190 L 565 190 L 555 330 L 245 330 Z"
                    fill="#131922"
                    stroke="#334155"
                    strokeWidth="1.5"
                  />

                  {/* Dashboard Assembly */}
                  <rect x="245" y="192" width="310" height="28" fill="#1e293b" stroke="#475569" strokeWidth="1" rx="4" />
                  {/* Steering Wheel (Driver Left Side - RHD/LHD standard) */}
                  <circle cx="310" cy="225" r="18" fill="none" stroke="#94a3b8" strokeWidth="3" />
                  <circle cx="310" cy="225" r="6" fill="#475569" />
                  <text x="310" y="208" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="monospace">
                    CLUSTER
                  </text>

                  {/* Driver Kick Panel Area (Lower Left Pillar) */}
                  <rect x="240" y="222" width="45" height="55" fill="#1e2029" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 2" rx="4" />
                  <text x="262" y="252" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace" fontWeight="bold">
                    KICK
                  </text>
                  <text x="262" y="262" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace" fontWeight="bold">
                    PANEL
                  </text>

                  {/* Front Bucket Seats */}
                  <rect x="280" y="250" width="60" height="65" rx="8" fill="#1a222d" stroke="#3b4a5d" strokeWidth="1" />
                  <rect x="460" y="250" width="60" height="65" rx="8" fill="#1a222d" stroke="#3b4a5d" strokeWidth="1" />

                  {/* Center Console & 4WD Shifters */}
                  <rect x="375" y="228" width="50" height="95" fill="#171f28" stroke="#334155" strokeWidth="1" rx="4" />
                  <circle cx="392" cy="245" r="6" fill="#ea580c" /> {/* Transmission Lever */}
                  <circle cx="408" cy="260" r="5" fill="#10b981" /> {/* 4WD Transfer Lever */}

                  {/* 6. REAR CHASSIS & 4-LINK SOLID AXLE */}
                  <rect x="235" y="340" width="330" height="145" fill="#10141a" stroke="#252f3d" strokeWidth="1" rx="6" />
                  <line x1="210" y1="402" x2="590" y2="402" stroke="#64748b" strokeWidth="6" /> {/* Solid Rear Axle Tube */}
                  <circle cx="400" cy="402" r="22" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" /> {/* Rear 8.0" Differential */}
                  <text x="400" y="406" textAnchor="middle" fill="#e2e8f0" fontSize="8" fontFamily="monospace" fontWeight="bold">
                    8.0" DIFF
                  </text>

                  {/* Spare Tire Carrier / Rear Tailgate */}
                  <rect x="270" y="488" width="260" height="14" fill="#1e293b" stroke="#475569" rx="3" />
                  <text x="400" y="499" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                    POWER TAILGATE
                  </text>

                  {/* ========================================================
                      INTERACTIVE CLICKABLE PART HOTSPOTS
                      ======================================================== */}
                  {ELECTRICAL_LOCATOR_DATA.map((item) => {
                    const isSelected = selectedItem.id === item.id;
                    // Scale percentage to SVG 800x520 box
                    const posX = (item.x / 100) * 800;
                    const posY = (item.y / 100) * 520;

                    return (
                      <g
                        key={item.id}
                        transform={`translate(${posX}, ${posY})`}
                        onClick={() => setSelectedItem(item)}
                        className="cursor-pointer group"
                      >
                        {/* Outer Glow Ring */}
                        {isSelected && (
                          <circle r="22" fill="none" stroke="#22d3ee" strokeWidth="2.5" className="animate-ping opacity-80" />
                        )}
                        <circle
                          r={isSelected ? 16 : 11}
                          fill={isSelected ? '#06b6d4' : '#1e293b'}
                          stroke={isSelected ? '#ffffff' : '#38bdf8'}
                          strokeWidth={isSelected ? 2.5 : 1.5}
                          filter="url(#glowEffect)"
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

                        {/* Hover / Active Badge */}
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
              ) : (
                /* ========================================================
                   ZOOMED HIGH-DETAIL ENGINE BAY VIEW
                   ======================================================== */
                <svg viewBox="0 0 800 520" className="w-full h-full">
                  {/* Engine Bay Outer Wall */}
                  <rect x="80" y="40" width="640" height="440" rx="16" fill="#13171f" stroke="#3b4859" strokeWidth="3" />

                  {/* Front Radiator & Twin Electric / Viscous Fans */}
                  <rect x="160" y="55" width="480" height="35" rx="6" fill="#1e293b" stroke="#0284c7" strokeWidth="2" />
                  <text x="400" y="78" textAnchor="middle" fill="#38bdf8" fontSize="13" fontFamily="monospace" fontWeight="bold">
                    3-ROW RADIATOR & 450mm VISCOUS FAN
                  </text>

                  {/* Driver Side Apron (Left) */}
                  <rect x="95" y="105" width="190" height="360" rx="10" fill="#18202b" stroke="#2a394c" strokeWidth="1.5" />
                  <text x="190" y="125" textAnchor="middle" fill="#60a5fa" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    DRIVER INNER APRON
                  </text>

                  {/* Main Starting Battery */}
                  <rect x="110" y="140" width="160" height="90" rx="8" fill="#1f2937" stroke="#ef4444" strokeWidth="2" />
                  <circle cx="135" cy="165" r="10" fill="#ef4444" />
                  <text x="135" y="169" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">+</text>
                  <circle cx="245" cy="165" r="10" fill="#374151" />
                  <text x="245" y="169" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">-</text>
                  <text x="190" y="210" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    12V 80Ah BATTERY
                  </text>

                  {/* 2L-T Engine Core Block */}
                  <rect x="300" y="110" width="200" height="350" rx="12" fill="#251c19" stroke="#ea580c" strokeWidth="2.5" />
                  <text x="400" y="138" textAnchor="middle" fill="#fb923c" fontSize="13" fontFamily="monospace" fontWeight="bold">
                    2.4L 2L-T SOHC 8V
                  </text>

                  {/* 4 Injectors & Glow Plugs Line */}
                  <circle cx="340" cy="175" r="10" fill="#f97316" />
                  <text x="340" y="179" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">#1</text>
                  <circle cx="340" cy="245" r="10" fill="#f97316" />
                  <text x="340" y="249" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">#2</text>
                  <circle cx="340" cy="315" r="10" fill="#f97316" />
                  <text x="340" y="319" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">#3</text>
                  <circle cx="340" cy="385" r="10" fill="#f97316" />
                  <text x="340" y="389" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">#4</text>

                  {/* Glow Bus Bar Linking Plugs */}
                  <line x1="340" y1="175" x2="340" y2="385" stroke="#facc15" strokeWidth="4" />
                  <text x="365" y="280" fill="#fde047" fontSize="9" fontFamily="monospace" transform="rotate(90, 365, 280)">
                    GLOW BUS BAR
                  </text>

                  {/* Turbocharger Assembly */}
                  <rect x="440" y="220" width="50" height="110" rx="8" fill="#374151" stroke="#f59e0b" strokeWidth="2" />
                  <text x="465" y="280" textAnchor="middle" fill="#fde047" fontSize="11" fontFamily="monospace" fontWeight="bold" transform="rotate(90, 465, 280)">
                    CT20 TURBO
                  </text>

                  {/* Passenger Apron (Right) */}
                  <rect x="515" y="105" width="190" height="360" rx="10" fill="#16231e" stroke="#224238" strokeWidth="1.5" />
                  <text x="610" y="125" textAnchor="middle" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    PASSENGER APRON
                  </text>

                  {/* Zoom Engine Bay Interactive Hotspots */}
                  {ELECTRICAL_LOCATOR_DATA.filter(i => i.zone !== "Cabin (Driver Footwell)").map((item) => {
                    const isSelected = selectedItem.id === item.id;
                    // Adjusted coordinates for engine bay zoom view
                    let posX = 0;
                    let posY = 0;

                    if (item.id === 'main-fuse-box-engine') { posX = 190; posY = 265; }
                    else if (item.id === 'glow-relay-1') { posX = 190; posY = 340; }
                    else if (item.id === 'glow-relay-2') { posX = 190; posY = 415; }
                    else if (item.id === 'dropping-resistor') { posX = 370; posY = 205; }
                    else if (item.id === 'water-temp-glow-sensor') { posX = 370; posY = 150; }
                    else if (item.id === 'temp-gauge-sender') { posX = 320; posY = 210; }
                    else if (item.id === 'fuel-cut-solenoid') { posX = 320; posY = 430; }
                    else if (item.id === 'vsv-4wd-add') { posX = 610; posY = 350; }
                    else if (item.id === 'water-sedimenter-switch') { posX = 610; posY = 210; }
                    else if (item.id === 'alternator-connector') { posX = 465; posY = 410; }
                    else if (item.id === 'front-diff-add-switch') { posX = 400; posY = 490; }

                    if (posX === 0) return null;

                    return (
                      <g
                        key={item.id}
                        transform={`translate(${posX}, ${posY})`}
                        onClick={() => setSelectedItem(item)}
                        className="cursor-pointer group"
                      >
                        {isSelected && (
                          <circle r="26" fill="none" stroke="#22d3ee" strokeWidth="3" className="animate-ping opacity-80" />
                        )}
                        <circle
                          r={isSelected ? 18 : 13}
                          fill={isSelected ? '#06b6d4' : '#1e293b'}
                          stroke={isSelected ? '#ffffff' : '#38bdf8'}
                          strokeWidth={isSelected ? 3 : 2}
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

                        <rect
                          x="-50"
                          y="18"
                          width="100"
                          height="18"
                          fill="#090b0e"
                          stroke={isSelected ? '#06b6d4' : '#334155'}
                          strokeWidth="1"
                          rx="4"
                        />
                        <text
                          y="30"
                          textAnchor="middle"
                          fill={isSelected ? '#22d3ee' : '#cbd5e1'}
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {item.shortCode}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
          </div>

          {/* Component List & Selector (1 Column) */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-gray-400 uppercase font-bold tracking-wider block">
              Electronic Components ({filteredItems.length}):
            </span>

            <div className="max-h-[470px] overflow-y-auto space-y-2 pr-1">
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
