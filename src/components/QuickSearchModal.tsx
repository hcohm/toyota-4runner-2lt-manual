import React, { useState, useEffect } from 'react';
import { TORQUE_SPECIFICATIONS } from '../data/torqueSpecs';
import { PROCEDURES_DATA } from '../data/proceduresData';
import { FLUID_SPECIFICATIONS } from '../data/fluidSpecs';
import { ELECTRICAL_LOCATOR_DATA } from '../data/electricalConnectorsData';
import { MASTER_MANUAL_CHAPTERS } from '../data/masterManualData';
import { FUEL_CIRCUIT_COMPONENTS } from '../data/fuelSystemData';
import { Search, X, Gauge, Wrench, Droplet, Zap, FileText, Fuel } from 'lucide-react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string, itemRef?: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase();

  const matchedManualSections = MASTER_MANUAL_CHAPTERS.flatMap((chap) =>
    chap.subsections.map((sub) => ({
      chapterTitle: chap.title,
      chapterNumber: chap.chapterNumber,
      ...sub
    }))
  )
    .filter(
      (sub) =>
        sub.title.toLowerCase().includes(q) ||
        sub.summary.toLowerCase().includes(q) ||
        sub.specifications.some((s) => s.item.toLowerCase().includes(q) || s.standard.toLowerCase().includes(q))
    )
    .slice(0, 3);

  const matchedFuelComponents = FUEL_CIRCUIT_COMPONENTS.filter(
    (fc) =>
      fc.name.toLowerCase().includes(q) ||
      fc.shortCode.toLowerCase().includes(q) ||
      fc.function.toLowerCase().includes(q)
  ).slice(0, 2);

  const matchedConnectors = ELECTRICAL_LOCATOR_DATA.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.shortCode.toLowerCase().includes(q) ||
      c.physicalLocation.toLowerCase().includes(q) ||
      c.pins.some((p) => p.wireColor.toLowerCase().includes(q) || p.wireColorFull.toLowerCase().includes(q))
  ).slice(0, 2);

  const matchedTorques = TORQUE_SPECIFICATIONS.filter(
    (t) =>
      t.fastener.toLowerCase().includes(q) ||
      (t.stageNote && t.stageNote.toLowerCase().includes(q))
  ).slice(0, 2);

  const matchedProcedures = PROCEDURES_DATA.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.overview.toLowerCase().includes(q) ||
      p.consumables.some((c) => c.toLowerCase().includes(q))
  ).slice(0, 2);

  const matchedFluids = FLUID_SPECIFICATIONS.filter(
    (f) =>
      f.system.toLowerCase().includes(q) ||
      f.fluidType.toLowerCase().includes(q) ||
      f.notes.toLowerCase().includes(q)
  ).slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 pt-20">
      <div className="bg-[#15191f] border border-[#2d3642] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#2b333e] flex items-center gap-3">
          <Search className="w-5 h-5 text-red-500 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 2L-T overhaul tolerances, torques, connectors, fuel lines, procedures... (e.g. 'ring gap', 'glow timer', 'tailgate')"
            className="w-full bg-transparent text-white text-sm focus:outline-none font-mono"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#202732] text-gray-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs font-mono">
          {/* Master Manual Results */}
          {matchedManualSections.length > 0 && (
            <div>
              <span className="text-red-400 uppercase font-bold text-[10px] tracking-wider block mb-2 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Master FSM & Haynes Chapters
              </span>
              <div className="space-y-1.5">
                {matchedManualSections.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onNavigateTab('master-manual');
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-lg bg-[#221617] hover:bg-[#2c1b1c] border border-red-900/50 flex items-center justify-between text-gray-200 group"
                  >
                    <div>
                      <span className="font-bold text-white group-hover:text-red-300 block">{m.title}</span>
                      <span className="text-[10px] text-gray-400 font-sans">Chapter {m.chapterNumber}: {m.chapterTitle}</span>
                    </div>
                    <span className="badge-spec">{m.specifications.length} Specs</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fuel System Results */}
          {matchedFuelComponents.length > 0 && (
            <div>
              <span className="text-amber-400 uppercase font-bold text-[10px] tracking-wider block mb-2 flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5" /> Mechanical Fuel System Circuit
              </span>
              <div className="space-y-1.5">
                {matchedFuelComponents.map((fc) => (
                  <button
                    key={fc.id}
                    onClick={() => {
                      onNavigateTab('fuel-system');
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-lg bg-[#211a14] hover:bg-[#2b2219] border border-amber-900/50 flex items-center justify-between text-gray-200 group"
                  >
                    <div>
                      <span className="font-bold text-white group-hover:text-amber-300 block">{fc.name}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{fc.zone}</span>
                    </div>
                    <span className="badge-spec">{fc.shortCode}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Connector & Part Locator Results */}
          {matchedConnectors.length > 0 && (
            <div>
              <span className="text-cyan-400 uppercase font-bold text-[10px] tracking-wider block mb-2 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Electronic Connectors & Sensors
              </span>
              <div className="space-y-1.5">
                {matchedConnectors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onNavigateTab('connector-locator');
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-lg bg-[#14222c] hover:bg-[#1a2d3b] border border-cyan-800/40 flex items-center justify-between text-gray-200 group"
                  >
                    <span className="font-bold text-white group-hover:text-cyan-300">{c.name}</span>
                    <span className="badge-spec">{c.zone}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Torque Results */}
          {matchedTorques.length > 0 && (
            <div>
              <span className="text-gray-400 uppercase font-bold text-[10px] tracking-wider block mb-2 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-amber-500" /> Fastener Torque Specs
              </span>
              <div className="space-y-1.5">
                {matchedTorques.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onNavigateTab('torque-finder');
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-lg bg-[#1a2028] hover:bg-[#222b37] border border-[#28323e] flex items-center justify-between text-gray-200 group"
                  >
                    <span className="font-bold text-white group-hover:text-red-400">{t.fastener}</span>
                    <span className="text-emerald-400 font-bold">{t.nm} Nm ({t.ftlb} ft-lb)</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Procedure Results */}
          {matchedProcedures.length > 0 && (
            <div>
              <span className="text-gray-400 uppercase font-bold text-[10px] tracking-wider block mb-2 flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5 text-red-500" /> Workshop Procedures & Guides
              </span>
              <div className="space-y-1.5">
                {matchedProcedures.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onNavigateTab('procedures', p.id);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-lg bg-[#1a2028] hover:bg-[#222b37] border border-[#28323e] flex items-center justify-between text-gray-200 group"
                  >
                    <span className="font-bold text-white group-hover:text-red-400">{p.title}</span>
                    <span className="badge-spec">{p.estimatedTime}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fluid Results */}
          {matchedFluids.length > 0 && (
            <div>
              <span className="text-gray-400 uppercase font-bold text-[10px] tracking-wider block mb-2 flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-emerald-400" /> Fluids & Capacities
              </span>
              <div className="space-y-1.5">
                {matchedFluids.map((f, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onNavigateTab('fluids');
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-lg bg-[#1a2028] hover:bg-[#222b37] border border-[#28323e] flex items-center justify-between text-gray-200 group"
                  >
                    <span className="font-bold text-white group-hover:text-red-400">{f.system}</span>
                    <span className="text-emerald-400 font-bold">{f.capacityLiters} L ({f.fluidType})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedManualSections.length === 0 &&
            matchedFuelComponents.length === 0 &&
            matchedConnectors.length === 0 &&
            matchedTorques.length === 0 &&
            matchedProcedures.length === 0 &&
            matchedFluids.length === 0 && (
              <div className="py-8 text-center text-gray-500 font-mono text-xs">
                No matching manual entries found for "{query}". Try searching "piston ring", "tailgate", "glow timer", "fuel cut", or "oil".
              </div>
            )}
        </div>

        {/* Footer Shortcut */}
        <div className="p-3 bg-[#111417] border-t border-[#27303c] text-[11px] font-mono text-gray-500 flex items-center justify-between">
          <span>Toyota 2L-T FSM & EWD Interactive Engine</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
