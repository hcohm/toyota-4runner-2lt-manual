import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Flame,
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface TireOption {
  label: string;
  diameterInches: number;
}

const TIRE_OPTIONS: TireOption[] = [
  { label: '225/75R15 (Stock 28.3")', diameterInches: 28.3 },
  { label: '31 x 10.50 R15 (30.8")', diameterInches: 30.8 },
  { label: '32 x 11.50 R15 (31.8")', diameterInches: 31.8 },
  { label: '33 x 12.50 R15 (32.8")', diameterInches: 32.8 },
  { label: '35 x 12.50 R15 (34.8")', diameterInches: 34.8 }
];

const DIFF_RATIOS = [
  { ratio: 4.10, label: '4.10:1 (Factory Standard)' },
  { ratio: 4.30, label: '4.30:1 (Factory Option)' },
  { ratio: 4.56, label: '4.56:1 (Factory V6/Auto)' },
  { ratio: 4.88, label: '4.88:1 (Factory 31" Pack)' },
  { ratio: 5.29, label: '5.29:1 (Aftermarket Big Tire)' }
];

const TRANSMISSIONS = [
  { id: 'r150f', name: 'R150F 5-Speed Manual', firstGear: 3.83, fifthGear: 0.838 },
  { id: 'w56', name: 'W56 5-Speed Manual', firstGear: 3.954, fifthGear: 0.850 },
  { id: 'a340h', name: 'A340H 4-Speed Automatic', firstGear: 2.804, fifthGear: 0.705 }
];

export const OverlandingDrivetrainLab: React.FC = () => {
  const [selectedTire, setSelectedTire] = useState<TireOption>(TIRE_OPTIONS[1]); // 31"
  const [selectedDiffRatio, setSelectedDiffRatio] = useState<number>(4.10);
  const [selectedTransmission, setSelectedTransmission] = useState(TRANSMISSIONS[0]);
  const [liftInches, setLiftInches] = useState<number>(2.0); // 2 inch lift

  const stockDiameter = 28.3;
  const transferLowRatio = 2.566; // Toyota VF1A / RF1A transfer case low range

  // Cruise RPM Math at 100 km/h (62.14 mph)
  const speedMph = 62.14;
  const overallOverdriveRatio = selectedTransmission.fifthGear * selectedDiffRatio;
  const cruiseRpm100 = Math.round(
    (speedMph * overallOverdriveRatio * 336) / selectedTire.diameterInches
  );

  // Crawl Ratio Math (1st Gear x Transfer Low x Diff Ratio)
  const crawlRatio = (
    selectedTransmission.firstGear *
    transferLowRatio *
    selectedDiffRatio
  ).toFixed(1);

  // Speedometer Error %
  const speedoErrorPercent = Math.round(
    ((selectedTire.diameterInches - stockDiameter) / stockDiameter) * 100
  );
  const indicatedSpeedAtTrue100 = Math.round(100 / (selectedTire.diameterInches / stockDiameter));

  // 2L-T Engine Thermal Stress Level
  const isLugging = cruiseRpm100 < 2250;
  const isOverRevving = cruiseRpm100 > 2850;
  const estimatedEgtDegC = isLugging
    ? 580 + (2250 - cruiseRpm100) * 0.4
    : isOverRevving
    ? 520 + (cruiseRpm100 - 2850) * 0.2
    : 480;

  // Suspension & LSPV Math
  const lspvDropBracketMm = Math.round(liftInches * 25.4);
  const cvAngleDeg = Math.round(8 + liftInches * 4.5);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="tech-panel p-6 bg-gradient-to-r from-[#17201c] via-[#121a1f] to-[#1a171d] border-emerald-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-toyota">Overlanding Engineering Suite</span>
              <span className="badge-spec flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" /> Drivetrain & Thermal Stress Physics
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Compass className="w-6 h-6 text-emerald-400" />
              Overlanding Drivetrain, Gearing & Tire Physics Lab
            </h2>
            <p className="text-sm text-gray-400 mt-1 max-w-3xl leading-relaxed">
              Calculate exact 4-Low crawl ratios, highway cruising RPM, speedometer correction, and 2L-T exhaust gas temperature (EGT) thermal loading for 31" to 35" tires and 4.10 to 5.29 axle re-gears.
            </p>
          </div>

          <div className="p-3 bg-[#11161d] rounded-xl border border-[#222c3b] text-xs font-mono text-center">
            <span className="text-gray-400 text-[10px] uppercase font-bold block">4-Low Crawl Ratio:</span>
            <span className="text-xl font-bold text-emerald-400">{crawlRatio} : 1</span>
          </div>
        </div>
      </div>

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Inputs & Selectors (1 Column) */}
        <div className="space-y-4">
          {/* Transmission Selector */}
          <div className="tech-panel p-4 bg-[#12161c] border-[#242e3c] space-y-2">
            <span className="text-[11px] font-mono text-gray-400 uppercase font-bold tracking-wider block">
              1. Select Gearbox:
            </span>
            <div className="space-y-1.5">
              {TRANSMISSIONS.map((trans) => (
                <button
                  key={trans.id}
                  onClick={() => setSelectedTransmission(trans)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs font-mono transition-all flex items-center justify-between ${
                    selectedTransmission.id === trans.id
                      ? 'bg-[#15271e] border-emerald-500 text-white ring-1 ring-emerald-500/50 shadow-md'
                      : 'bg-[#14181f] border-[#222b37] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <span className="font-bold">{trans.name}</span>
                  <span className="badge-spec text-[10px]">OD: {trans.fifthGear}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tire Size Selector */}
          <div className="tech-panel p-4 bg-[#12161c] border-[#242e3c] space-y-2">
            <span className="text-[11px] font-mono text-gray-400 uppercase font-bold tracking-wider block">
              2. Select Tire Dimensions:
            </span>
            <div className="space-y-1.5">
              {TIRE_OPTIONS.map((tire) => (
                <button
                  key={tire.label}
                  onClick={() => setSelectedTire(tire)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs font-mono transition-all flex items-center justify-between ${
                    selectedTire.label === tire.label
                      ? 'bg-[#15271e] border-emerald-500 text-white ring-1 ring-emerald-500/50 shadow-md'
                      : 'bg-[#14181f] border-[#222b37] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <span className="font-bold">{tire.label}</span>
                  <span className="badge-spec text-[10px]">{tire.diameterInches}" OD</span>
                </button>
              ))}
            </div>
          </div>

          {/* Differential Gear Ratio */}
          <div className="tech-panel p-4 bg-[#12161c] border-[#242e3c] space-y-2">
            <span className="text-[11px] font-mono text-gray-400 uppercase font-bold tracking-wider block">
              3. Axle Differential Ratio:
            </span>
            <div className="space-y-1.5">
              {DIFF_RATIOS.map((diff) => (
                <button
                  key={diff.ratio}
                  onClick={() => setSelectedDiffRatio(diff.ratio)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs font-mono transition-all flex items-center justify-between ${
                    selectedDiffRatio === diff.ratio
                      ? 'bg-[#15271e] border-emerald-500 text-white ring-1 ring-emerald-500/50 shadow-md'
                      : 'bg-[#14181f] border-[#222b37] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <span className="font-bold">{diff.label}</span>
                  <span className="badge-spec text-[10px]">{diff.ratio}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Lift Height Slider */}
          <div className="tech-panel p-4 bg-[#12161c] border-[#242e3c] space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-400 uppercase font-bold">Suspension Lift Height:</span>
              <span className="text-cyan-400 font-bold">{liftInches}" ({lspvDropBracketMm} mm)</span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="0.5"
              value={liftInches}
              onChange={(e) => setLiftInches(parseFloat(e.target.value))}
              className="w-full h-2 bg-[#1b222d] rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-500">
              <span>0" (Stock)</span>
              <span>2.0" (Standard)</span>
              <span>4.0" (Extreme)</span>
            </div>
          </div>
        </div>

        {/* Right Dynamic Readouts & Thermal Graphs (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metric Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="tech-panel p-4 bg-[#13171f] border-[#252f3d] space-y-1 text-center">
              <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">100 km/h Cruise RPM (5th):</span>
              <div
                className={`text-2xl font-bold font-mono ${
                  isLugging ? 'text-amber-400' : isOverRevving ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {cruiseRpm100} RPM
              </div>
              <span className="text-[10px] font-mono text-gray-500">Target: 2,300 – 2,700 RPM</span>
            </div>

            <div className="tech-panel p-4 bg-[#13171f] border-[#252f3d] space-y-1 text-center">
              <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Speedometer Error:</span>
              <div className="text-2xl font-bold font-mono text-cyan-400">
                {speedoErrorPercent > 0 ? `+${speedoErrorPercent}%` : `${speedoErrorPercent}%`}
              </div>
              <span className="text-[10px] font-mono text-gray-500">
                Shows {indicatedSpeedAtTrue100} km/h at true 100
              </span>
            </div>

            <div className="tech-panel p-4 bg-[#13171f] border-[#252f3d] space-y-1 text-center">
              <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Estimated Cruise EGT:</span>
              <div
                className={`text-2xl font-bold font-mono ${
                  estimatedEgtDegC > 560 ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                ~{Math.round(estimatedEgtDegC)}°C
              </div>
              <span className="text-[10px] font-mono text-gray-500">Max Safe Limit: &lt; 650°C</span>
            </div>
          </div>

          {/* Thermal Engine Loading & Gearing Verdict */}
          <div className="tech-panel p-5 bg-[#12161c] border-[#242e3c] space-y-3">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              2L-T Diesel Thermal Loading & Gearing Diagnosis
            </span>

            {isLugging ? (
              <div className="p-3.5 bg-[#251a14] rounded-xl border border-amber-900/60 text-xs text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  ⚠️ Engine Lugging Risk (Gearing Too Tall for 33"+ Tires with 4.10)
                </div>
                <p className="text-[11px] leading-relaxed text-amber-300/90">
                  Cruising below 2,250 RPM forces the Bosch VE boost compensator to deliver high fuel volume while the water pump is spinning too slowly to evacuate combustion heat. This is the primary driver of 2L-T cylinder head cracking on highway inclines. <strong className="text-white">Recommendation:</strong> Re-gear axles to 4.56 or 4.88:1.
                </p>
              </div>
            ) : isOverRevving ? (
              <div className="p-3.5 bg-[#251517] rounded-xl border border-red-900/60 text-xs text-red-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  ⚠️ High RPM Cruise (High Fuel Consumption)
                </div>
                <p className="text-[11px] leading-relaxed text-red-300/90">
                  Cruising above 2,850 RPM increases valvetrain wear and fuel burn. Ideal for dedicated rock crawling, but noisy on long road trips.
                </p>
              </div>
            ) : (
              <div className="p-3.5 bg-[#13241b] rounded-xl border border-emerald-900/60 text-xs text-emerald-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ✅ Optimal 2L-T Powerband Match (2,300 – 2,700 RPM Sweet Spot)
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-300/90">
                  The engine stays right in the peak torque plateau (2,400 RPM) where the CT20 turbo is fully spooled and the water pump flows maximum coolant volume through the cylinder head.
                </p>
              </div>
            )}
          </div>

          {/* Suspension Lift Geometry Requirements */}
          <div className="tech-panel p-5 bg-[#12161c] border-[#242e3c] space-y-3">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              IFS Suspension & LSPV Geometry Modifications Needed
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#161a22] rounded-xl border border-[#263140] space-y-1">
                <span className="text-gray-400 uppercase text-[10px] block font-bold">LSPV Brake Shackle Drop:</span>
                <span className="text-emerald-400 font-bold">{lspvDropBracketMm} mm Drop Required</span>
                <p className="text-[10px] text-gray-400 font-sans">
                  Drop axle sensor bracket by exact lift height to prevent unladen rear wheel lockup.
                </p>
              </div>

              <div className="p-3 bg-[#161a22] rounded-xl border border-[#263140] space-y-1">
                <span className="text-gray-400 uppercase text-[10px] block font-bold">Front CV Axle Angle:</span>
                <span className={cvAngleDeg > 18 ? 'text-amber-400 font-bold' : 'text-cyan-400 font-bold'}>
                  ~{cvAngleDeg}° ({cvAngleDeg > 18 ? 'High Angle - Fit Diff Drop' : 'Safe Operating Angle'})
                </span>
                <p className="text-[10px] text-gray-400 font-sans">
                  Install 25mm front differential drop spacers if lift exceeds 2.0 inches.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
