import React from 'react';
import { ENGINE_SPECS_2LT } from '../data/engineSpecs';
import { MODEL_CODE_DECODER, AXLE_CODE_DECODER, VEHICLE_DIMENSIONS } from '../data/vehicleOverviewData';
import { Truck, Cpu, Wrench, Compass } from 'lucide-react';

export const VehicleOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="tech-panel p-6 bg-gradient-to-r from-[#20181b] via-[#1a1d20] to-[#162029] border-red-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-toyota">Toyota Motor Corporation</span>
              <span className="badge-spec">Model Year 1991 (LN130 Generation)</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Truck className="w-8 h-8 text-red-500" />
              1991 Toyota 4Runner / Hilux Surf 2L-T Workshop Manual
            </h1>
            <p className="text-sm text-gray-400 mt-2 max-w-3xl leading-relaxed">
              Factory service data, interactive calculators, circuit diagnostics, and overhaul procedures for the 2.4L SOHC 8-Valve Turbo-Diesel engine paired with the LN130 4WD coil-spring chassis.
            </p>
          </div>

          <div className="flex flex-col gap-2 font-mono text-xs text-gray-400 bg-[#121417] p-3 rounded-lg border border-[#2b333e]">
            <div><strong className="text-white">Chassis:</strong> LN130 4WD (IFS / 4-Link)</div>
            <div><strong className="text-white">Engine:</strong> 2L-T Gen 2 (2446cc SOHC TD)</div>
            <div><strong className="text-white">Turbo:</strong> Toyota CT20 (Water/Oil Cooled)</div>
            <div><strong className="text-white">FSM Ref:</strong> RM520E / RM582E / BR043E</div>
          </div>
        </div>
      </div>

      {/* Model Frame Plate & VIN Decoder */}
      <div className="tech-panel p-6 bg-[#13161a]">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-400" />
          Firewall Identification Plate & Model Code Decoder (e.g. LN130-GKMGT)
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Located on the aluminum plate stamped on the center engine bay firewall. Identifies exact transmission, transfer case, axle gear ratio, and trim package.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODEL_CODE_DECODER.map((item, idx) => (
            <div key={idx} className="tech-card bg-[#181d24] text-xs font-mono">
              <div className="flex items-center justify-between text-gray-400 font-bold mb-1">
                <span>{item.field}</span>
                <span className="text-amber-400">{item.example}</span>
              </div>
              <div className="text-white font-bold text-sm mt-1">{item.meaning}</div>
              <div className="text-[11px] text-gray-400 mt-2">{item.notes}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Axle Code & Differential Matrix */}
      <div className="tech-panel p-6 bg-[#13161a]">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-400" />
          Axle Code Decoder (Firewall Plate 'TRANS/AXLE' Line)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#2d343e] text-gray-400">
                <th className="py-2.5 px-3">AXLE CODE</th>
                <th className="py-2.5 px-3">REAR RING GEAR SIZE</th>
                <th className="py-2.5 px-3">FINAL DRIVE RATIO</th>
                <th className="py-2.5 px-3">DIFFERENTIAL TYPE & FLUID SPEC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222831] text-gray-300">
              {AXLE_CODE_DECODER.map((a, idx) => (
                <tr key={idx} className="hover:bg-[#1c222b]">
                  <td className="py-3 px-3 font-bold text-emerald-400">{a.code}</td>
                  <td className="py-3 px-3">{a.ringGear}</td>
                  <td className="py-3 px-3 font-bold text-white">{a.ratio}</td>
                  <td className="py-3 px-3">
                    <div>{a.diffType}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {a.diffType.includes('LSD')
                        ? 'Requires API GL-5 SAE 80W-90 with Limited Slip Friction Modifier'
                        : 'Standard API GL-5 SAE 75W-90 / 80W-90'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Engine Technical Specifications Tables */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Wrench className="w-5 h-5 text-red-500" />
          Toyota 2L-T Engine Technical Specifications (FSM RM520E)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ENGINE_SPECS_2LT.map((sec, idx) => (
            <div key={idx} className="tech-panel p-5 bg-[#14171c]">
              <h4 className="text-sm font-bold text-white font-mono uppercase pb-2 border-b border-[#2a303a] mb-3 text-red-400">
                {sec.category}
              </h4>
              <div className="space-y-2 text-xs font-mono">
                {sec.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="flex flex-col py-1.5 border-b border-[#20252e] last:border-none"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-gray-400">{item.label}:</span>
                      <span
                        className={`text-right font-bold ${
                          item.critical ? 'text-emerald-400' : 'text-white'
                        }`}
                      >
                        {item.value}
                      </span>
                    </div>
                    {item.notes && (
                      <span className="text-[11px] text-amber-400/90 mt-0.5">{item.notes}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicle Dimensions & Chassis Architecture */}
      <div className="tech-panel p-6 bg-[#13161a]">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Truck className="w-5 h-5 text-blue-400" />
          1991 4Runner / Hilux Surf (LN130) Dimensions & Chassis Specs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {VEHICLE_DIMENSIONS.map((dim, idx) => (
            <div
              key={idx}
              className="flex justify-between py-2 px-3 rounded bg-[#171b21] border border-[#262e38]"
            >
              <span className="text-gray-400 font-bold">{dim.item}:</span>
              <span className="text-white font-bold">{dim.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
