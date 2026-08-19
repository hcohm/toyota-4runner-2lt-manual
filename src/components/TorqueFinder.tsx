import React, { useState } from 'react';
import { TORQUE_SPECIFICATIONS } from '../data/torqueSpecs';
import type { TorqueItem } from '../data/torqueSpecs';
import { Search, Gauge, ShieldAlert, ArrowUpDown, Copy, Check } from 'lucide-react';

export const TorqueFinder: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [primaryUnit, setPrimaryUnit] = useState<'nm' | 'ftlb' | 'inlb' | 'kgfm'>('nm');
  const [customNm, setCustomNm] = useState<string>('78');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(TORQUE_SPECIFICATIONS.map(t => t.category)))];

  const filteredSpecs = TORQUE_SPECIFICATIONS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.fastener.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.stageNote && item.stageNote.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.warnings && item.warnings.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (item: TorqueItem) => {
    const text = `${item.fastener}: ${item.nm} Nm (${item.ftlb} ft-lb / ${item.kgfm} kgf-m)`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Custom calculator values
  const inputVal = parseFloat(customNm) || 0;
  const convertedFtlb = (inputVal * 0.737562).toFixed(1);
  const convertedInlb = (inputVal * 8.85075).toFixed(0);
  const convertedKgfm = (inputVal * 0.101972).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="tech-panel p-6 bg-gradient-to-r from-[#17202c] via-[#1a1d20] to-[#251b18] border-amber-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-toyota">Factory Service Manual RM520E</span>
              <span className="badge-spec">Master Fastener Database</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Gauge className="w-6 h-6 text-amber-500" />
              Torque Specification & Fastener Finder
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Searchable, categorized torque database with multi-stage angle notes, critical warnings, and live unit conversions.
            </p>
          </div>

          {/* Unit Switcher */}
          <div className="bg-[#121417] p-1.5 rounded-lg border border-[#2c3238] flex items-center gap-1">
            <span className="text-[11px] font-mono text-gray-500 px-2 uppercase font-bold">Display Unit:</span>
            <button
              onClick={() => setPrimaryUnit('nm')}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                primaryUnit === 'nm' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Nm
            </button>
            <button
              onClick={() => setPrimaryUnit('ftlb')}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                primaryUnit === 'ftlb' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Ft-lb
            </button>
            <button
              onClick={() => setPrimaryUnit('kgfm')}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                primaryUnit === 'kgfm' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              kgf-m
            </button>
          </div>
        </div>
      </div>

      {/* Live Custom Unit Converter Bar */}
      <div className="tech-panel p-4 bg-[#14181e] border-blue-900/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400">
          <ArrowUpDown className="w-4 h-4" />
          <span>INSTANT TORQUE CONVERTER:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={customNm}
              onChange={(e) => setCustomNm(e.target.value)}
              className="w-20 bg-[#0c0e11] border border-[#333a42] rounded px-2 py-1 text-white font-bold focus:border-blue-500 focus:outline-none"
            />
            <span className="text-gray-400 font-bold">Nm =</span>
          </div>
          <span className="bg-[#0c0e11] px-2.5 py-1 rounded border border-[#27303c] text-amber-400 font-bold">
            {convertedFtlb} ft-lb
          </span>
          <span className="bg-[#0c0e11] px-2.5 py-1 rounded border border-[#27303c] text-blue-400 font-bold">
            {convertedInlb} in-lb
          </span>
          <span className="bg-[#0c0e11] px-2.5 py-1 rounded border border-[#27303c] text-emerald-400 font-bold">
            {convertedKgfm} kgf-m
          </span>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search fastener name, e.g. 'cylinder head', 'crank pulley', 'glow plug', 'flange'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#15191f] border border-[#2e3743] rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-[#181d24] text-gray-400 hover:text-white border border-[#28313c]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div className="tech-panel p-6 bg-[#13161a]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono text-gray-400 uppercase">
            Showing {filteredSpecs.length} Specifications
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#2d343e] text-gray-400">
                <th className="py-2.5 px-3">FASTENER & SUBSYSTEM</th>
                <th className="py-2.5 px-3">PRIMARY SPEC</th>
                <th className="py-2.5 px-3">EQUIVALENT UNITS</th>
                <th className="py-2.5 px-3">TIGHTENING NOTES & WARNINGS</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222831] text-gray-300">
              {filteredSpecs.map((item) => (
                <tr key={item.id} className="hover:bg-[#1c222b] transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      {item.fastener}
                      {item.critical && (
                        <span className="badge-toyota text-[10px] py-0 px-1.5">CRITICAL</span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{item.category}</div>
                  </td>

                  {/* Primary Target Highlighted */}
                  <td className="py-3 px-3">
                    <div className="text-base font-bold text-emerald-400">
                      {primaryUnit === 'nm' && `${item.nm} Nm`}
                      {primaryUnit === 'ftlb' && `${item.ftlb} ft-lb`}
                      {primaryUnit === 'kgfm' && `${item.kgfm} kgf-m`}
                    </div>
                  </td>

                  {/* Equivalent Units */}
                  <td className="py-3 px-3 text-gray-400 space-y-0.5">
                    <div>{item.nm} Nm</div>
                    <div>{item.ftlb} ft-lb / {item.kgfm} kgf-m</div>
                    {item.inlb && <div className="text-blue-400">{item.inlb} in-lb</div>}
                  </td>

                  {/* Notes & Warnings */}
                  <td className="py-3 px-3 max-w-[320px]">
                    {item.stageNote && (
                      <div className="text-amber-300 font-medium mb-1">{item.stageNote}</div>
                    )}
                    {item.warnings && (
                      <div className="text-red-400 text-[11px] flex items-start gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span>{item.warnings}</span>
                      </div>
                    )}
                    {!item.stageNote && !item.warnings && (
                      <span className="text-gray-500">Standard torque application.</span>
                    )}
                  </td>

                  {/* Copy Button */}
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleCopy(item)}
                      className="p-1.5 rounded-lg bg-[#21262d] hover:bg-[#2c3238] text-gray-300 hover:text-white border border-[#333a42] transition-all"
                      title="Copy spec to clipboard"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
