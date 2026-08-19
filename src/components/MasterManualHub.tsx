import React, { useState } from 'react';
import {
  MASTER_MANUAL_CHAPTERS
} from '../data/masterManualData';
import type { ManualChapter, ManualSubsection } from '../data/masterManualData';
import {
  BookOpen,
  Search,
  Wrench,
  Clock,
  Compass,
  Zap,
  Disc,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Printer,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Sparkles,
  Layers
} from 'lucide-react';

export const MasterManualHub: React.FC = () => {
  const [selectedChapter, setSelectedChapter] = useState<ManualChapter>(MASTER_MANUAL_CHAPTERS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedSubsections, setExpandedSubsections] = useState<Record<string, boolean>>({
    [MASTER_MANUAL_CHAPTERS[0].subsections[0].id]: true
  });
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const toggleSubsection = (id: string) => {
    setExpandedSubsections((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredChapters = MASTER_MANUAL_CHAPTERS.filter((chap) => {
    if (activeCategory !== 'all' && chap.category !== activeCategory) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      chap.title.toLowerCase().includes(q) ||
      chap.description.toLowerCase().includes(q) ||
      chap.subsections.some(
        (sub) =>
          sub.title.toLowerCase().includes(q) ||
          sub.summary.toLowerCase().includes(q) ||
          sub.specifications.some((spec) => spec.item.toLowerCase().includes(q) || spec.standard.toLowerCase().includes(q)) ||
          sub.proTips.some((tip) => tip.toLowerCase().includes(q))
      )
    );
  });

  const getChapterIcon = (name: string) => {
    switch (name) {
      case 'Clock':
        return <Clock className="w-5 h-5" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'Disc':
        return <Disc className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="tech-panel p-6 bg-gradient-to-r from-[#1f1614] via-[#161a22] to-[#121b1e] border-red-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-toyota">Toyota FSM & Haynes Depth Reference</span>
              <span className="badge-spec flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-red-400" /> Complete Rebuilding Blueprint
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-red-500" />
              1991 4Runner (2L-T) Master Workshop Overhaul Manual
            </h2>
            <p className="text-sm text-gray-400 mt-1 max-w-3xl leading-relaxed">
              Exhaustive factory service specifications, machine shop wear limits, overhaul clearances, Plastigage tolerances, torque tables, and master mechanic rebuild sequences.
            </p>
          </div>

          {/* Quick Print Button */}
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-[#1a212b] hover:bg-[#252f3e] border border-[#2d3847] text-xs font-mono text-gray-300 hover:text-white flex items-center gap-2 transition-all self-start md:self-auto"
          >
            <Printer className="w-4 h-4 text-gray-400" /> Print Workshop Cheatsheet
          </button>
        </div>
      </div>

      {/* Global Manual Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search all chapters, wear limits, clearances, torques, pro-tips (e.g. 'piston ring gap', 'main bearing', 'tailgate', 'synchro')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12151b] border border-[#26303d] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 bg-[#12151b] p-1 rounded-xl border border-[#26303d] overflow-x-auto">
          {['all', 'Maintenance', 'Engine', 'Drivetrain', 'Suspension & Brakes', 'Electrical'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-red-600 text-white font-bold shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Chapters' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Chapter Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Chapter Selector (1 Column) */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono text-gray-500 uppercase font-bold tracking-wider px-1 block">
            Manual Chapters ({filteredChapters.length})
          </span>

          {filteredChapters.map((chap) => {
            const isSelected = selectedChapter.id === chap.id;
            return (
              <button
                key={chap.id}
                onClick={() => setSelectedChapter(chap)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-red-500 bg-[#221617] text-white ring-1 ring-red-500/50 shadow-lg'
                    : 'border-[#232c37] bg-[#13161c] text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`p-1.5 rounded-lg ${isSelected ? 'bg-red-600 text-white' : 'bg-[#1b222c] text-gray-400'}`}>
                      {getChapterIcon(chap.iconName)}
                    </span>
                    <span className="font-mono text-xs font-bold">Chapter {chap.chapterNumber}</span>
                  </div>
                  <span className="badge-spec text-[9px]">{chap.category}</span>
                </div>
                <div className="text-xs font-bold text-white line-clamp-1">{chap.title}</div>
                <div className="text-[11px] text-gray-400 mt-1 line-clamp-2">{chap.description}</div>
              </button>
            );
          })}
        </div>

        {/* Right Chapter Content Area (3 Columns) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Chapter Header */}
          <div className="tech-panel p-6 bg-[#13171e] border-[#252f3d] space-y-2">
            <div className="flex items-center justify-between">
              <span className="badge-toyota">Chapter {selectedChapter.chapterNumber}</span>
              <span className="badge-spec font-mono">{selectedChapter.subsections.length} Detailed Sections</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{selectedChapter.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{selectedChapter.description}</p>
          </div>

          {/* Subsections Accordion List */}
          <div className="space-y-4">
            {selectedChapter.subsections.map((sub: ManualSubsection) => {
              const isExpanded = expandedSubsections[sub.id] ?? false;
              const isBookmarked = bookmarkedItems.includes(sub.id);

              return (
                <div
                  key={sub.id}
                  className="tech-panel bg-[#12151b] border-[#242e3b] overflow-hidden transition-all shadow-md"
                >
                  {/* Subsection Header Bar */}
                  <div
                    onClick={() => toggleSubsection(sub.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#181d24] transition-colors border-b border-[#1f2732]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#1a212b] border border-[#2b3644] text-red-400 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                        {sub.specifications.length}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          {sub.title}
                          {isBookmarked && <span className="text-amber-400 text-xs">★</span>}
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{sub.summary}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleBookmark(sub.id, e)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isBookmarked
                            ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                            : 'bg-[#181e26] border-[#293442] text-gray-400 hover:text-white'
                        }`}
                        title="Bookmark this section"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>

                      <div className="p-1 text-gray-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content Body */}
                  {isExpanded && (
                    <div className="p-5 space-y-6 bg-[#0f1217]">
                      {/* 1. Factory Clearance & Wear Limits Table */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-red-400" />
                            Factory Tolerances, Clearances & Wear Limits
                          </span>
                          <span className="text-[10px] font-mono text-gray-500">Standard vs Maximum Limit</span>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-[#222b37]">
                          <table className="w-full text-left text-xs font-mono">
                            <thead className="bg-[#171c24] text-gray-300 border-b border-[#222b37]">
                              <tr>
                                <th className="p-3">Inspection Item / Component</th>
                                <th className="p-3 text-emerald-400">Factory Standard Specification</th>
                                <th className="p-3 text-red-400">Maximum Wear Limit</th>
                                <th className="p-3 text-gray-400">Service Notes</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1e2530] text-gray-300">
                              {sub.specifications.map((spec, i) => (
                                <tr key={i} className="hover:bg-[#151921] transition-colors">
                                  <td className="p-3 font-bold text-white">{spec.item}</td>
                                  <td className="p-3 text-emerald-300">{spec.standard}</td>
                                  <td className="p-3 text-red-300 font-bold">{spec.wearLimit}</td>
                                  <td className="p-3 text-gray-400 text-[11px] font-sans">{spec.notes || '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* 2. Fastener Torque Specifications */}
                      {sub.torques.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Wrench className="w-3.5 h-3.5 text-amber-400" />
                            Key Fastener Torque Specifications
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {sub.torques.map((t, i) => (
                              <div key={i} className="p-3 bg-[#151a22] rounded-xl border border-[#263140] space-y-1">
                                <div className="text-xs font-bold text-white">{t.fastener}</div>
                                <div className="flex items-center gap-2 text-xs font-mono">
                                  <span className="text-red-400 font-bold">{t.nm} Nm</span>
                                  <span className="text-gray-500">|</span>
                                  <span className="text-gray-300">{t.ftlb} ft-lb</span>
                                </div>
                                {t.note && <div className="text-[10px] text-gray-400 font-sans mt-1">{t.note}</div>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3. Numbered Step-by-Step Procedures */}
                      {sub.steps.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            Step-by-Step Workshop Overhaul Protocol
                          </span>

                          <div className="space-y-2 text-xs font-mono">
                            {sub.steps.map((step, i) => (
                              <div key={i} className="p-3 bg-[#14181f] rounded-lg border border-[#212a36] text-gray-300 leading-relaxed font-sans">
                                {step}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 4. Master Mechanic Pro-Tips */}
                      {sub.proTips.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                            Veteran Mechanic Master Pro-Tips & Pitfalls
                          </span>

                          <div className="space-y-2">
                            {sub.proTips.map((tip, i) => (
                              <div
                                key={i}
                                className="p-3.5 bg-[#221c17] rounded-xl border border-amber-900/60 text-xs text-amber-200 flex items-start gap-2.5 leading-relaxed"
                              >
                                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                <span>{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
