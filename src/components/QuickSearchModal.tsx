import React, { useState, useEffect } from 'react';
import { TORQUE_SPECIFICATIONS } from '../data/torqueSpecs';
import { PROCEDURES_DATA } from '../data/proceduresData';
import { FLUID_SPECIFICATIONS } from '../data/fluidSpecs';
import { Search, X, Gauge, Wrench, Droplet } from 'lucide-react';

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

  const matchedTorques = TORQUE_SPECIFICATIONS.filter(
    (t) =>
      t.fastener.toLowerCase().includes(q) ||
      (t.stageNote && t.stageNote.toLowerCase().includes(q))
  ).slice(0, 4);

  const matchedProcedures = PROCEDURES_DATA.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.overview.toLowerCase().includes(q) ||
      p.consumables.some((c) => c.toLowerCase().includes(q))
  ).slice(0, 3);

  const matchedFluids = FLUID_SPECIFICATIONS.filter(
    (f) =>
      f.system.toLowerCase().includes(q) ||
      f.fluidType.toLowerCase().includes(q) ||
      f.notes.toLowerCase().includes(q)
  ).slice(0, 3);

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
            placeholder="Search any 2L-T torque spec, procedure, fluid capacity, SST tool... (e.g. 'head torque', 'glow', '75w-90')"
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
          {/* Torque Results */}
          {matchedTorques.length > 0 && (
            <div>
              <span className="text-gray-400 uppercase font-bold text-[10px] tracking-wider block mb-2">
                Fastener Torque Specs
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
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span className="font-bold text-white group-hover:text-red-400">{t.fastener}</span>
                    </div>
                    <span className="text-emerald-400 font-bold">{t.nm} Nm ({t.ftlb} ft-lb)</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Procedure Results */}
          {matchedProcedures.length > 0 && (
            <div>
              <span className="text-gray-400 uppercase font-bold text-[10px] tracking-wider block mb-2">
                Workshop Procedures & Guides
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
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="font-bold text-white group-hover:text-red-400">{p.title}</span>
                    </div>
                    <span className="badge-spec">{p.estimatedTime}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fluid Results */}
          {matchedFluids.length > 0 && (
            <div>
              <span className="text-gray-400 uppercase font-bold text-[10px] tracking-wider block mb-2">
                Fluids & Capacities
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
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="font-bold text-white group-hover:text-red-400">{f.system}</span>
                    </div>
                    <span className="text-emerald-400 font-bold">{f.capacityLiters} L ({f.fluidType})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedTorques.length === 0 &&
            matchedProcedures.length === 0 &&
            matchedFluids.length === 0 && (
              <div className="py-8 text-center text-gray-500 font-mono text-xs">
                No matching manual entries found for "{query}". Try searching "torque", "head", "glow", or "oil".
              </div>
            )}
        </div>

        {/* Footer Shortcut */}
        <div className="p-3 bg-[#111417] border-t border-[#27303c] text-[11px] font-mono text-gray-500 flex items-center justify-between">
          <span>Toyota 2L-T FSM Interactive Engine</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
