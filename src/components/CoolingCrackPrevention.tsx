import React, { useState } from 'react';
import { Flame, ShieldAlert, CheckCircle2, AlertTriangle, Thermometer, Wind, RefreshCw, Gauge } from 'lucide-react';

export const CoolingCrackPrevention: React.FC = () => {
  const [boostPsi, setBoostPsi] = useState<number>(8.5);
  const [egtCelsius, setEgtCelsius] = useState<number>(580);
  const [coolantTempC, setCoolantTempC] = useState<number>(88);

  // Compute thermal stress risk score
  const isHighEgt = egtCelsius > 650;
  const isCriticalEgt = egtCelsius > 720;
  const isOverheating = coolantTempC > 96;
  const isCriticalCoolant = coolantTempC > 105;

  let riskLevel: 'SAFE' | 'ELEVATED' | 'CRITICAL' = 'SAFE';
  if (isCriticalEgt || isCriticalCoolant) {
    riskLevel = 'CRITICAL';
  } else if (isHighEgt || isOverheating || boostPsi > 11) {
    riskLevel = 'ELEVATED';
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="tech-panel p-6 bg-gradient-to-r from-[#291717] via-[#1a1d20] to-[#1f1515] border-red-900/60 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge-toyota">2L-T / 2L-TE Critical Vulnerability</span>
          <span className="badge-spec">Thermal Fatigue & Crack Prevention</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Flame className="w-6 h-6 text-red-500" />
          Cylinder Head Anti-Crack Hub & Cooling Overhaul
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Root cause engineering breakdown of 2L-T head failure: Pre-combustion chamber localized thermal gradient, steam pocket formation, and high EGT fatigue.
        </p>
      </div>

      {/* Interactive Live Thermal Risk Simulator */}
      <div className="tech-panel p-6 bg-[#13161a]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Gauge className="w-5 h-5 text-amber-500" />
            2L-T Thermal Stress & Head Crack Risk Meter
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
              riskLevel === 'SAFE'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : riskLevel === 'ELEVATED'
                ? 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse'
                : 'bg-red-950 text-red-400 border border-red-800 animate-bounce'
            }`}
          >
            RISK STATUS: {riskLevel}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Slider 1: Boost Pressure */}
          <div className="tech-card bg-[#181d24]">
            <div className="flex justify-between items-center text-xs font-mono text-gray-400 font-bold mb-2">
              <span>TURBO BOOST (CT20)</span>
              <span className="text-blue-400 font-bold text-sm">{boostPsi.toFixed(1)} PSI</span>
            </div>
            <input
              type="range"
              min="4"
              max="16"
              step="0.5"
              value={boostPsi}
              onChange={(e) => setBoostPsi(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
              <span>Factory (7.1-10.2 psi)</span>
              <span className="text-red-400">&gt; 12 psi Danger</span>
            </div>
          </div>

          {/* Slider 2: Pre-Turbo EGT */}
          <div className="tech-card bg-[#181d24]">
            <div className="flex justify-between items-center text-xs font-mono text-gray-400 font-bold mb-2">
              <span>EXHAUST GAS TEMP (EGT)</span>
              <span className={`font-bold text-sm ${isCriticalEgt ? 'text-red-400' : isHighEgt ? 'text-amber-400' : 'text-emerald-400'}`}>
                {egtCelsius} °C ({Math.round((egtCelsius * 9) / 5 + 32)} °F)
              </span>
            </div>
            <input
              type="range"
              min="350"
              max="800"
              step="10"
              value={egtCelsius}
              onChange={(e) => setEgtCelsius(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
              <span>Safe &lt; 650°C</span>
              <span className="text-red-400">&gt; 720°C Crack Point</span>
            </div>
          </div>

          {/* Slider 3: Coolant Temperature */}
          <div className="tech-card bg-[#181d24]">
            <div className="flex justify-between items-center text-xs font-mono text-gray-400 font-bold mb-2">
              <span>COOLANT TEMP (HEAD)</span>
              <span className={`font-bold text-sm ${isCriticalCoolant ? 'text-red-400' : isOverheating ? 'text-amber-400' : 'text-emerald-400'}`}>
                {coolantTempC} °C ({Math.round((coolantTempC * 9) / 5 + 32)} °F)
              </span>
            </div>
            <input
              type="range"
              min="75"
              max="120"
              step="1"
              value={coolantTempC}
              onChange={(e) => setCoolantTempC(parseInt(e.target.value))}
              className="w-full accent-red-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
              <span>Normal (82-90°C)</span>
              <span className="text-red-400">&gt; 100°C Boiling</span>
            </div>
          </div>
        </div>

        {/* Dynamic Risk Assessment Output */}
        <div className="mt-4 p-4 rounded-lg bg-[#191e25] border border-[#2b333e] text-xs leading-relaxed">
          {riskLevel === 'SAFE' && (
            <div className="text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>
                <strong>Optimal Operating Parameters:</strong> EGTs remain below the thermal fatigue threshold (650°C), and coolant temperature is maintained within normal 82–92°C range. Minimal risk of pre-cup bridge cracking.
              </span>
            </div>
          )}
          {riskLevel === 'ELEVATED' && (
            <div className="text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>
                <strong>Caution - Elevated Thermal Stress:</strong> Elevated EGT or coolant temperature is inducing thermal expansion differentials between the cast iron deck and the ceramic pre-chambers. Downshift or reduce throttle under load.
              </span>
            </div>
          )}
          {riskLevel === 'CRITICAL' && (
            <div className="text-red-300 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span>
                <strong>CRITICAL DANGER OF CRACKING HEAD:</strong> Temperatures exceed 720°C pre-turbo or 105°C coolant. Instant localized boiling around #3 and #4 pre-cups will cause cast iron micro-fractures across the valve bridge.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* The 4 Root Causes Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="tech-panel p-6 bg-[#161a1f]">
          <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            1. Pre-Combustion Swirl Chamber Design
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed mb-2">
            The 2L-T uses Indirect Injection (IDI). Fuel is sprayed into a small ceramic-lined swirl pre-chamber in the cylinder head. While this makes the engine quiet and smooth, 100% of initial flame heat is concentrated inside this tiny cup.
          </p>
          <p className="text-xs text-gray-300 leading-relaxed">
            The bridge of cast iron between the pre-chamber mouth and the intake/exhaust valve seats experiences massive localized thermal gradients, reaching 300°C higher than surrounding deck areas.
          </p>
        </div>

        <div className="tech-panel p-6 bg-[#161a1f]">
          <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-blue-500" />
            2. Steam Pocket Air Locking
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed mb-2">
            The 4Runner LN130 body places the radiator cap nearly level with the top of the cylinder head and rear heater core lines. Any micro-leak allows coolant to boil into steam in the rear of the head (Cylinder #3 and #4).
          </p>
          <p className="text-xs text-gray-300 leading-relaxed">
            Steam cannot conduct heat like liquid coolant. The cylinder head casting goes into instantaneous dry hotspotting, expanding until the bridge cracks into the water jacket.
          </p>
        </div>

        <div className="tech-panel p-6 bg-[#161a1f]">
          <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Wind className="w-5 h-5 text-amber-500" />
            3. Viscous Fan Clutch Silicone Fluid Breakdown
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed mb-2">
            The engine-driven mechanical fan relies on 10,000 cSt silicone fluid inside a bimetallic shear clutch. Over 10-15 years, this silicone fluid leaks or loses viscosity.
          </p>
          <p className="text-xs text-gray-300 leading-relaxed">
            When climbing hills under boost, the slipping fan clutch moves less than 40% of required air CFM through the radiator, causing sudden temperature spikes at the crest of the hill.
          </p>
        </div>

        <div className="tech-panel p-6 bg-[#161a1f]">
          <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-emerald-500" />
            4. Restrictive 2.0" OEM Exhaust Downpipe
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed mb-2">
            The factory exhaust downpipe right off the CT20 turbo is narrow and restrictive, backing up extreme exhaust backpressure and trapping scorching hot exhaust gases right in the turbine housing.
          </p>
          <p className="text-xs text-gray-300 leading-relaxed">
            Installing a 2.5" or 3.0" mandrel-bent downpipe drops pre-turbo EGTs by a massive 120°C to 150°C during sustained highway cruising.
          </p>
        </div>
      </div>

      {/* Essential 2L-T Longevity Upgrades List */}
      <div className="tech-panel p-6 bg-[#181c24] border-blue-900/40">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-blue-400" />
          The Bulletproofing Protocol: Top 5 Mandatory Upgrades for 2L-T
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 bg-[#111418] rounded-lg border border-[#2b333e]">
            <div className="font-bold text-emerald-400 mb-1">1. Digital EGT Gauge</div>
            Tap a K-Type thermocouple probe directly into the cast iron exhaust manifold PRE-TURBO. Never exceed 650°C sustained.
          </div>
          <div className="p-3 bg-[#111418] rounded-lg border border-[#2b333e]">
            <div className="font-bold text-emerald-400 mb-1">2. 3-Row Aluminum Radiator</div>
            Replace 30-year-old brass radiator with a high-efficiency 42mm dual/triple core aluminum radiator.
          </div>
          <div className="p-3 bg-[#111418] rounded-lg border border-[#2b333e]">
            <div className="font-bold text-emerald-400 mb-1">3. Fan Clutch 10,000 cSt Refill</div>
            Drain and refill Aisin fan clutch with genuine Toyota silicone fluid (Toyota Part # 08816-03001) for 100% lockup when hot.
          </div>
          <div className="p-3 bg-[#111418] rounded-lg border border-[#2b333e]">
            <div className="font-bold text-emerald-400 mb-1">4. 82°C OEM Thermostat</div>
            Ensure thermostat has the jiggle-pin air bleed hole positioned strictly at the 12 o'clock top position during installation.
          </div>
          <div className="p-3 bg-[#111418] rounded-lg border border-[#2b333e]">
            <div className="font-bold text-emerald-400 mb-1">5. Front-Mount Intercooler</div>
            Cools intake charge from 110°C to 40°C, significantly reducing in-cylinder combustion temperatures and increasing density.
          </div>
          <div className="p-3 bg-[#111418] rounded-lg border border-[#2b333e]">
            <div className="font-bold text-emerald-400 mb-1">6. 0.9 Bar Radiator Cap</div>
            Replace cap every 2 years (16401-54750) to preserve cooling system boiling point elevation under pressure.
          </div>
        </div>
      </div>
    </div>
  );
};
