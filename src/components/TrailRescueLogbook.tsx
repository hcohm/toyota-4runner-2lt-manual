import React, { useState } from 'react';
import {
  ShieldAlert,
  Sparkles,
  Layers,
  Clock,
  Download,
  Save,
  Plus,
  Trash2
} from 'lucide-react';

interface EmergencyHack {
  id: string;
  title: string;
  category: 'Electrical' | 'Cooling' | 'Fuel' | 'Starting';
  estimatedTime: string;
  itemsNeeded: string[];
  instructions: string[];
  warningAlert: string;
}

const EMERGENCY_HACKS: EmergencyHack[] = [
  {
    id: 'glow-plug-pushbutton-bypass',
    title: 'Emergency Glow Plug Pushbutton Bypass Wiring (Dead Timer ECU)',
    category: 'Electrical',
    estimatedTime: '15 Minutes',
    itemsNeeded: [
      '2 Meters of 16-Gauge Automotive Wire',
      'Momentary Pushbutton Switch (or two bare wire ends)',
      '1x 1/4" Ring Terminal & In-Line 10A Fuse'
    ],
    instructions: [
      '1. Locate Glow Relay No. 1 on the driver side inner fender apron (the round metal cylinder relay closest to the 80A fusible link box).',
      '2. Unplug the 2-pin trigger harness on Relay 1 (small Black-Red / B-R wire).',
      '3. Run a new wire from the positive (+) battery terminal through your momentary switch inside the cabin.',
      '4. Connect the switch output wire to the positive coil trigger terminal of Relay 1.',
      '5. How to start cold: Press and hold the pushbutton for exactly 4 to 5 seconds (never more than 7 seconds!), release button, and turn key to crank engine.'
    ],
    warningAlert: 'CRITICAL: Never hold pushbutton longer than 6 seconds. 6V ceramic glow plugs will melt/shatter inside the pre-chambers if exposed to continuous 12V!'
  },
  {
    id: 'heater-core-burst-loop',
    title: 'Burst Heater Core Trail Loop Bypass (Stop Coolant Loss)',
    category: 'Cooling',
    estimatedTime: '10 Minutes',
    itemsNeeded: [
      '1/2" or 5/8" Hose Joiner (or 15mm Copper Pipe Stub / Spark Plug Socket)',
      '2x Hose Clamps',
      'Flathead Screwdriver'
    ],
    instructions: [
      '1. Locate the two 5/8" rubber heater hoses penetrating the firewall on the passenger side.',
      '2. Loosen hose clamps and pull both hoses off the copper heater core nipples on the firewall.',
      '3. Insert a 5/8" metal joiner pipe or clean 1/2" socket between the two rubber hoses to loop the engine cylinder head coolant outlet directly back into the lower radiator return pipe.',
      '4. Tighten hose clamps securely.',
      '5. Refill radiator with clean water/coolant and purge air before driving.'
    ],
    warningAlert: 'You will have zero cabin heating or windshield defogging, but your engine will maintain full cooling circulation without dumping coolant into the cabin carpets.'
  },
  {
    id: 'starter-solenoid-screwdriver-jump',
    title: 'Starter Solenoid Direct Jump (Ignition Switch / Relay Failure)',
    category: 'Starting',
    estimatedTime: '5 Minutes',
    itemsNeeded: [
      'Insulated Flathead Screwdriver with Plastic Handle',
      'Work Gloves & Safety Glasses'
    ],
    instructions: [
      '1. CRITICAL SAFETY CHECK: Ensure manual transmission is in NEUTRAL (or Automatic in PARK) and parking brake is pulled tight.',
      '2. Turn vehicle ignition key to the ON position (so Fuel Cut Solenoid is energized with 12V).',
      '3. Locate the starter motor on the lower passenger side of the engine block.',
      '4. Identify the thick B+ battery cable stud (12V continuous) and the small spade/blade trigger terminal (Terminal 50).',
      '5. Bridge the thick B+ battery terminal to the small spade trigger terminal with the metal shank of your insulated screwdriver.',
      '6. Starter motor will crank instantly and engine will start. Immediately remove screwdriver once running.'
    ],
    warningAlert: 'DANGER: Always verify gearbox is in NEUTRAL! Jumping a vehicle in gear will cause the truck to lurch forward and run you over.'
  }
];

interface ShimRecord {
  cylinder: number;
  intakeThicknessMm: string;
  intakeLashMm: string;
  exhaustThicknessMm: string;
  exhaustLashMm: string;
}

interface ServiceLogEntry {
  id: string;
  date: string;
  odometerKm: string;
  serviceType: string;
  notes: string;
}

export const TrailRescueLogbook: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hacks' | 'logbook' | 'shims'>('hacks');
  const [selectedHack, setSelectedHack] = useState<EmergencyHack>(EMERGENCY_HACKS[0]);

  // Persistent Valve Shim Tracker
  const [shimRecords, setShimRecords] = useState<ShimRecord[]>(() => {
    const saved = localStorage.getItem('4runner_2lt_shims');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return [
      { cylinder: 1, intakeThicknessMm: '2.80', intakeLashMm: '0.25', exhaustThicknessMm: '2.95', exhaustLashMm: '0.45' },
      { cylinder: 2, intakeThicknessMm: '2.85', intakeLashMm: '0.24', exhaustThicknessMm: '2.90', exhaustLashMm: '0.44' },
      { cylinder: 3, intakeThicknessMm: '2.80', intakeLashMm: '0.26', exhaustThicknessMm: '2.95', exhaustLashMm: '0.46' },
      { cylinder: 4, intakeThicknessMm: '2.85', intakeLashMm: '0.25', exhaustThicknessMm: '3.00', exhaustLashMm: '0.45' }
    ];
  });

  // Persistent Service Logs
  const [serviceLogs, setServiceLogs] = useState<ServiceLogEntry[]>(() => {
    const saved = localStorage.getItem('4runner_2lt_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return [
      {
        id: '1',
        date: '2026-08-15',
        odometerKm: '248,500',
        serviceType: 'Oil & Filter + Fuel Filter',
        notes: 'Filled 6.7L 15W-40. Replaced Toyota 23303-64010 filter and drained sedimenter bowl.'
      },
      {
        id: '2',
        date: '2026-06-20',
        odometerKm: '245,000',
        serviceType: 'Timing Belt & Water Pump',
        notes: 'Installed new 130T belt, tensioner pulley (43 Nm), and Toyota Red 50/50 coolant.'
      }
    ];
  });

  // Form states for new log
  const [newDate, setNewDate] = useState<string>('');
  const [newOdo, setNewOdo] = useState<string>('');
  const [newType, setNewType] = useState<string>('Oil & Filter Change (15W-40)');
  const [newNotes, setNewNotes] = useState<string>('');

  const saveShims = () => {
    localStorage.setItem('4runner_2lt_shims', JSON.stringify(shimRecords));
  };

  const updateShimField = (
    cylinderIndex: number,
    field: keyof ShimRecord,
    val: string
  ) => {
    const updated = [...shimRecords];
    updated[cylinderIndex] = { ...updated[cylinderIndex], [field]: val };
    setShimRecords(updated);
    localStorage.setItem('4runner_2lt_shims', JSON.stringify(updated));
  };

  const addServiceLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate || !newOdo) return;
    const entry: ServiceLogEntry = {
      id: Date.now().toString(),
      date: newDate,
      odometerKm: newOdo,
      serviceType: newType,
      notes: newNotes
    };
    const updated = [entry, ...serviceLogs];
    setServiceLogs(updated);
    localStorage.setItem('4runner_2lt_logs', JSON.stringify(updated));
    setNewDate('');
    setNewOdo('');
    setNewNotes('');
  };

  const deleteLog = (id: string) => {
    const updated = serviceLogs.filter((l) => l.id !== id);
    setServiceLogs(updated);
    localStorage.setItem('4runner_2lt_logs', JSON.stringify(updated));
  };

  const exportDataJson = () => {
    const data = {
      vehicle: '1991 Toyota 4Runner / Hilux Surf 2L-T',
      exportedAt: new Date().toISOString(),
      shims: shimRecords,
      serviceLogs: serviceLogs
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `4runner_2lt_service_history_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="tech-panel p-6 bg-gradient-to-r from-[#201717] via-[#1a1c22] to-[#121c18] border-red-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-toyota">Offline Glovebox Companion</span>
              <span className="badge-spec flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-red-400" /> Trail Rescue & Maintenance Logbook
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-red-500" />
              Glovebox Trail Rescue & Digital Maintenance Log
            </h2>
            <p className="text-sm text-gray-400 mt-1 max-w-3xl leading-relaxed">
              Essential backcountry field bypass tricks for dead timer computers, burst heater cores, and solenoid jumps, plus a persistent maintenance logbook with valve shim thickness tracking.
            </p>
          </div>

          {/* View Switcher */}
          <div className="bg-[#12151a] p-1 rounded-lg border border-[#27303d] flex flex-wrap">
            <button
              onClick={() => setActiveTab('hacks')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                activeTab === 'hacks' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Emergency Hacks ({EMERGENCY_HACKS.length})
            </button>
            <button
              onClick={() => setActiveTab('shims')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                activeTab === 'shims' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Valve Shim Tracker (8 Valves)
            </button>
            <button
              onClick={() => setActiveTab('logbook')}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                activeTab === 'logbook' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Service Logbook ({serviceLogs.length})
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: EMERGENCY TRAIL HACKS */}
      {activeTab === 'hacks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Hacks Selector (1 Column) */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-gray-400 uppercase font-bold tracking-wider block mb-1">
              Select Field Rescue Protocol:
            </span>

            {EMERGENCY_HACKS.map((hack) => {
              const isSelected = selectedHack.id === hack.id;
              return (
                <button
                  key={hack.id}
                  onClick={() => setSelectedHack(hack)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs ${
                    isSelected
                      ? 'border-red-500 bg-[#221617] text-white ring-1 ring-red-500/50 shadow-md'
                      : 'border-[#262f3a] bg-[#14181e] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="font-bold text-sm text-white mb-1">{hack.title}</div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400">
                    <span className="badge-spec">{hack.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-red-400" /> {hack.estimatedTime}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Protocol Instructions (2 Columns) */}
          <div className="lg:col-span-2 tech-panel p-6 bg-[#13161a] space-y-4">
            <div className="pb-3 border-b border-[#28323f]">
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-toyota">{selectedHack.category}</span>
                <span className="badge-spec font-mono">{selectedHack.estimatedTime}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{selectedHack.title}</h3>
            </div>

            {/* Items Needed */}
            <div className="p-3 bg-[#181d24] rounded-lg border border-[#2b3542] text-xs font-mono">
              <span className="text-gray-400 uppercase font-bold text-[10px] block mb-1">Items / Tools Needed:</span>
              <ul className="text-gray-300 space-y-0.5 list-disc pl-4 text-[11px]">
                {selectedHack.itemsNeeded.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="space-y-2 text-xs font-mono">
              <span className="text-gray-400 uppercase font-bold text-[10px] block">Field Execution Steps:</span>
              {selectedHack.instructions.map((step, i) => (
                <div key={i} className="p-3 bg-[#181d24] rounded-lg border border-[#2b3542] text-gray-300 leading-relaxed font-sans">
                  {step}
                </div>
              ))}
            </div>

            {/* Critical Warning Alert */}
            <div className="p-3.5 bg-[#251517] rounded-xl border border-red-900/60 text-xs text-red-200 flex items-start gap-2 leading-relaxed">
              <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{selectedHack.warningAlert}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VALVE SHIM TRACKER */}
      {activeTab === 'shims' && (
        <div className="tech-panel p-6 bg-[#12151b] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#252e3b]">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                Installed Valve Shim Thickness Logbook (Cylinders 1 – 4)
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Record the physical shim thicknesses currently installed on your 2L-T valvetrain to streamline future lash adjustments.
              </p>
            </div>

            <button
              onClick={saveShims}
              className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-md self-start sm:self-auto"
            >
              <Save className="w-3.5 h-3.5" /> Save Shim Specs
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {shimRecords.map((rec, idx) => (
              <div key={rec.cylinder} className="p-4 bg-[#181d24] rounded-xl border border-[#2b3542] space-y-3">
                <div className="text-xs font-mono font-bold text-white uppercase flex items-center justify-between">
                  <span>Cylinder No. {rec.cylinder}</span>
                  <span className="badge-spec text-[9px]">2 Valves</span>
                </div>

                {/* Intake Valve */}
                <div className="space-y-1 text-xs font-mono">
                  <span className="text-cyan-400 font-bold text-[10px] block">INTAKE VALVE:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-gray-500 block">Shim (mm):</label>
                      <input
                        type="text"
                        value={rec.intakeThicknessMm}
                        onChange={(e) => updateShimField(idx, 'intakeThicknessMm', e.target.value)}
                        className="w-full bg-[#101317] border border-[#28323f] rounded px-2 py-1 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-500 block">Lash (mm):</label>
                      <input
                        type="text"
                        value={rec.intakeLashMm}
                        onChange={(e) => updateShimField(idx, 'intakeLashMm', e.target.value)}
                        className="w-full bg-[#101317] border border-[#28323f] rounded px-2 py-1 text-emerald-400 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Exhaust Valve */}
                <div className="space-y-1 text-xs font-mono pt-2 border-t border-[#222b37]">
                  <span className="text-amber-400 font-bold text-[10px] block">EXHAUST VALVE:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-gray-500 block">Shim (mm):</label>
                      <input
                        type="text"
                        value={rec.exhaustThicknessMm}
                        onChange={(e) => updateShimField(idx, 'exhaustThicknessMm', e.target.value)}
                        className="w-full bg-[#101317] border border-[#28323f] rounded px-2 py-1 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-500 block">Lash (mm):</label>
                      <input
                        type="text"
                        value={rec.exhaustLashMm}
                        onChange={(e) => updateShimField(idx, 'exhaustLashMm', e.target.value)}
                        className="w-full bg-[#101317] border border-[#28323f] rounded px-2 py-1 text-emerald-400 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SERVICE LOGBOOK */}
      {activeTab === 'logbook' && (
        <div className="space-y-6">
          {/* Add Entry Form */}
          <div className="tech-panel p-5 bg-[#12151a] border-[#252f3c] space-y-4">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-400" />
              Log New Service Record
            </span>

            <form onSubmit={addServiceLog} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <label className="text-gray-400 text-[10px] block mb-1">Service Date:</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-[#181d24] border border-[#2a3442] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 text-[10px] block mb-1">Odometer (km):</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 249,000"
                  value={newOdo}
                  onChange={(e) => setNewOdo(e.target.value)}
                  className="w-full bg-[#181d24] border border-[#2a3442] rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 text-[10px] block mb-1">Service Category:</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-[#181d24] border border-[#2a3442] rounded-lg px-3 py-2 text-white"
                >
                  <option>Oil & Filter Change (15W-40)</option>
                  <option>Diesel Fuel Filter (23303-64010)</option>
                  <option>Timing Belt & Water Pump</option>
                  <option>Valve Clearance Adjustment</option>
                  <option>Transmission & Transfer Oil</option>
                  <option>Diff Oil & 8-Zerk Greasing</option>
                  <option>Cooling System Flush (Toyota Red)</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="text-gray-400 text-[10px] block mb-1">Mechanic Notes / Parts Used:</label>
                <input
                  type="text"
                  placeholder="e.g. Torqued drain plug to 34 Nm with new crush washer. Greased driveshaft slip yokes."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-[#181d24] border border-[#2a3442] rounded-lg px-3 py-2 text-white font-sans"
                />
              </div>

              <div className="sm:col-span-3 flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={exportDataJson}
                  className="px-3 py-1.5 rounded-lg bg-[#181e26] border border-[#293442] text-xs font-mono text-gray-300 hover:text-white flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Export Service History (.JSON)
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add to Logbook
                </button>
              </div>
            </form>
          </div>

          {/* Timeline of Logs */}
          <div className="space-y-3">
            {serviceLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-[#13161c] rounded-xl border border-[#242e3b] flex items-start justify-between gap-4 text-xs font-mono"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{log.serviceType}</span>
                    <span className="badge-spec">{log.odometerKm} km</span>
                    <span className="text-gray-500">{log.date}</span>
                  </div>
                  <p className="text-gray-300 font-sans text-[11px] leading-relaxed">{log.notes}</p>
                </div>

                <button
                  onClick={() => deleteLog(log.id)}
                  className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
