import React, { useState } from 'react';
import { DIAGNOSTIC_TREES } from '../data/diagnosticTrees';
import type { DiagnosticNode, DiagnosticConclusion } from '../data/diagnosticTrees';
import {
  Stethoscope,
  ArrowRight,
  AlertTriangle,
  ShieldAlert,
  Info,
  ChevronLeft,
  Wrench,
  Flame,
  Zap,
  Wind,
  Compass,
  Volume2,
  Disc,
  Copy,
  Check,
  RotateCcw
} from 'lucide-react';

interface HistoryStep {
  nodeId: string;
  question: string;
  selectedOption: string;
}

interface DiagnosticWizardProps {
  onSelectProcedure?: (procedureId: string) => void;
}

const FAULT_CATEGORIES = [
  { id: 'start-node-no-start', name: 'Starting & Glow', icon: Zap, color: 'text-red-400', border: 'border-red-500/40' },
  { id: 'start-node-overheating', name: 'Cooling & Overheat', icon: Flame, color: 'text-amber-400', border: 'border-amber-500/40' },
  { id: 'start-node-smoke', name: 'Smoke & Emissions', icon: Wind, color: 'text-purple-400', border: 'border-purple-500/40' },
  { id: 'start-node-power-loss', name: 'Turbo & Boost Loss', icon: Wind, color: 'text-blue-400', border: 'border-blue-500/40' },
  { id: 'start-node-4wd', name: '4WD & Driveline', icon: Compass, color: 'text-emerald-400', border: 'border-emerald-500/40' },
  { id: 'start-node-noise', name: 'Engine Knock & Idle', icon: Volume2, color: 'text-yellow-400', border: 'border-yellow-500/40' },
  { id: 'start-node-brakes', name: 'Brakes & LSPV', icon: Disc, color: 'text-rose-400', border: 'border-rose-500/40' },
];

export const DiagnosticWizard: React.FC<DiagnosticWizardProps> = ({ onSelectProcedure }) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>("start-node-no-start");
  const [history, setHistory] = useState<HistoryStep[]>([]);
  const [activeConclusion, setActiveConclusion] = useState<DiagnosticConclusion | null>(null);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  const currentNode: DiagnosticNode | undefined = DIAGNOSTIC_TREES[currentNodeId];

  const handleSelectOption = (option: { label: string; nextNodeId?: string; conclusion?: DiagnosticConclusion }) => {
    if (option.conclusion) {
      setActiveConclusion(option.conclusion);
      setHistory([
        ...history,
        { nodeId: currentNodeId, question: currentNode?.question || '', selectedOption: option.label }
      ]);
    } else if (option.nextNodeId) {
      setHistory([
        ...history,
        { nodeId: currentNodeId, question: currentNode?.question || '', selectedOption: option.label }
      ]);
      setCurrentNodeId(option.nextNodeId);
      setActiveConclusion(null);
    }
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setCurrentNodeId(prev.nodeId);
    setActiveConclusion(null);
  };

  const handleJumpToHistory = (index: number) => {
    const target = history[index];
    setHistory(history.slice(0, index));
    setCurrentNodeId(target.nodeId);
    setActiveConclusion(null);
  };

  const handleReset = (startNode: string) => {
    setCurrentNodeId(startNode);
    setHistory([]);
    setActiveConclusion(null);
    setCopiedReport(false);
  };

  const handleCopyReport = () => {
    if (!activeConclusion) return;
    const stepsText = history
      .map((h, i) => `Step ${i + 1}: ${h.question}\nAnswer: ${h.selectedOption}`)
      .join('\n\n');

    const report = `================================================
TOYOTA 4RUNNER 2L-T DIAGNOSTIC REPORT
================================================
FAULT: ${activeConclusion.title}
SEVERITY: ${activeConclusion.severity.toUpperCase()}

DIAGNOSTIC TEST TRAIL:
${stepsText}

PROBABLE ROOT CAUSE:
${activeConclusion.cause}

RECOMMENDED REPAIR ACTION:
${activeConclusion.fix}
================================================`;

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="tech-panel p-6 bg-gradient-to-r from-[#201824] via-[#1a1d20] to-[#181d28] border-purple-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-toyota">FSM Diagnostic Decision Engine</span>
              <span className="badge-spec">Interactive Fault Resolver</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-purple-400" />
              Interactive Diagnostic Wizard & Troubleshooting Engine
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Comprehensive decision trees for 2L-T diesel starting, cooling overflow, boost loss, 4WD ADD engagement, engine clatter, and brake balance.
            </p>
          </div>

          <button
            onClick={() => handleReset(currentNodeId.split('-')[0] === 'start' ? currentNodeId : 'start-node-no-start')}
            className="p-2 rounded-lg bg-[#21262d] hover:bg-[#2c3238] text-gray-300 hover:text-white transition-all border border-[#333a42] self-start md:self-auto flex items-center gap-1.5 text-xs font-mono"
            title="Reset Current Tree"
          >
            <RotateCcw className="w-4 h-4" /> Reset Tree
          </button>
        </div>

        {/* 7-Category Quick Switcher Bar */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
          {FAULT_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isCurrent =
              currentNodeId.startsWith(cat.id.replace('start-node-', '')) ||
              currentNodeId === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleReset(cat.id)}
                className={`p-2.5 rounded-xl border text-xs font-mono font-bold transition-all flex flex-col items-center justify-center gap-1.5 ${
                  isCurrent
                    ? 'bg-purple-600 border-purple-400 text-white shadow-lg scale-105'
                    : 'bg-[#15191f] border-[#29323d] text-gray-300 hover:border-gray-500 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isCurrent ? 'text-white' : cat.color}`} />
                <span className="text-center leading-tight text-[11px]">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Breadcrumb History Trail */}
      {history.length > 0 && (
        <div className="tech-panel p-3 bg-[#13161a] flex items-center gap-2 text-xs font-mono text-gray-400 overflow-x-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-white hover:text-red-400 font-bold bg-[#1d2229] px-2.5 py-1 rounded border border-[#2d343f] flex-shrink-0"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back One Step
          </button>
          <span>|</span>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {history.map((step, idx) => (
              <button
                key={idx}
                onClick={() => handleJumpToHistory(idx)}
                className="bg-[#181d24] hover:bg-[#202732] px-2 py-1 rounded border border-[#28323f] text-gray-300 hover:text-white flex items-center gap-1 flex-shrink-0 text-[11px]"
              >
                <span>#{idx + 1}: {step.selectedOption.slice(0, 22)}...</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Diagnostic Question / Conclusion Box */}
      <div className="tech-panel p-6 bg-[#13161a]">
        {!activeConclusion && currentNode ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-spec">{currentNode.category}</span>
              {currentNode.expectedSpec && (
                <span className="badge-green font-mono">FACTORY SPEC: {currentNode.expectedSpec}</span>
              )}
            </div>

            <h3 className="text-xl font-bold text-white mb-3 leading-snug">
              {currentNode.question}
            </h3>

            {currentNode.testAction && (
              <div className="p-3 mb-6 rounded-lg bg-[#1a2028] border border-[#2b3542] text-xs text-blue-300 flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Recommended Physical Inspection / Test:</strong> {currentNode.testAction}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <span className="text-xs font-mono text-gray-400 uppercase font-bold tracking-wider">
                Select Your Test Finding:
              </span>
              {currentNode.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  className="w-full text-left p-4 rounded-xl border border-[#2e3743] bg-[#1a1f26] hover:bg-[#222a33] hover:border-purple-500/60 transition-all flex items-center justify-between group shadow-sm"
                >
                  <span className="text-sm font-medium text-gray-200 group-hover:text-white pr-4">
                    {opt.label}
                  </span>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        ) : activeConclusion ? (
          /* Conclusion Card */
          <div className="space-y-4">
            <div
              className={`p-6 rounded-xl border ${
                activeConclusion.severity === 'critical'
                  ? 'border-red-700 bg-gradient-to-r from-[#2a1315] to-[#1e1518]'
                  : activeConclusion.severity === 'warning'
                  ? 'border-amber-700 bg-gradient-to-r from-[#2a2213] to-[#1e1a14]'
                  : 'border-blue-700 bg-gradient-to-r from-[#131d2a] to-[#141a20]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {activeConclusion.severity === 'critical' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-bold bg-red-900/80 text-red-300 px-2.5 py-0.5 rounded border border-red-600">
                      <ShieldAlert className="w-3.5 h-3.5" /> CRITICAL FAULT IDENTIFIED
                    </span>
                  ) : activeConclusion.severity === 'warning' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-bold bg-amber-900/80 text-amber-300 px-2.5 py-0.5 rounded border border-amber-600">
                      <AlertTriangle className="w-3.5 h-3.5" /> REPAIR ACTION REQUIRED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-bold bg-blue-900/80 text-blue-300 px-2.5 py-0.5 rounded border border-blue-600">
                      <Info className="w-3.5 h-3.5" /> SYSTEM INFORMATION
                    </span>
                  )}
                </div>

                <button
                  onClick={handleCopyReport}
                  className="px-3 py-1 bg-[#1a1f26] hover:bg-[#252d37] border border-[#333e4d] text-gray-300 hover:text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all"
                  title="Copy complete diagnostic report to clipboard"
                >
                  {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedReport ? 'Report Copied!' : 'Copy Diagnostic Report'}</span>
                </button>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">{activeConclusion.title}</h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="bg-[#0f1216]/80 p-4 rounded-lg border border-[#2b333e]">
                  <strong className="text-gray-300 uppercase font-mono text-xs block mb-1">
                    Probable Root Cause:
                  </strong>
                  <p className="text-gray-300 leading-relaxed text-xs">{activeConclusion.cause}</p>
                </div>

                <div className="bg-[#0f1216]/80 p-4 rounded-lg border border-[#2b333e]">
                  <strong className="text-emerald-400 uppercase font-mono text-xs block mb-1">
                    Standard Workshop Repair Action:
                  </strong>
                  <p className="text-gray-200 leading-relaxed text-xs">{activeConclusion.fix}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {activeConclusion.procedureRef && onSelectProcedure && (
                  <button
                    onClick={() => onSelectProcedure(activeConclusion.procedureRef!)}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg"
                  >
                    <Wrench className="w-4 h-4" /> Open Full Step-by-Step Procedure
                  </button>
                )}
                <button
                  onClick={() => handleReset('start-node-no-start')}
                  className="px-4 py-2.5 bg-[#21262d] hover:bg-[#2c3238] text-gray-300 font-mono text-xs rounded-lg transition-all border border-[#333a42]"
                >
                  Start New Diagnosis
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
