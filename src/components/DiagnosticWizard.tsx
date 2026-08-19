import React, { useState } from 'react';
import { DIAGNOSTIC_TREES } from '../data/diagnosticTrees';
import type { DiagnosticNode } from '../data/diagnosticTrees';
import { Stethoscope, ArrowRight, AlertTriangle, ShieldAlert, Info, ChevronLeft, Wrench } from 'lucide-react';

interface HistoryStep {
  nodeId: string;
  question: string;
  selectedOption: string;
}

interface DiagnosticWizardProps {
  onSelectProcedure?: (procedureId: string) => void;
}

export const DiagnosticWizard: React.FC<DiagnosticWizardProps> = ({ onSelectProcedure }) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>("start-node-no-start");
  const [history, setHistory] = useState<HistoryStep[]>([]);
  const [activeConclusion, setActiveConclusion] = useState<any>(null);

  const currentNode: DiagnosticNode | undefined = DIAGNOSTIC_TREES[currentNodeId];

  const handleSelectOption = (option: any) => {
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

  const handleReset = (startNode: string) => {
    setCurrentNodeId(startNode);
    setHistory([]);
    setActiveConclusion(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="tech-panel p-6 bg-gradient-to-r from-[#201824] via-[#1a1d20] to-[#181d28] border-purple-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-toyota">FSM Diagnostic Decision Engine</span>
              <span className="badge-spec">Interactive Fault Tree</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-purple-400" />
              Interactive Diagnostic Wizard & Symptom Resolver
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Step-by-step branching fault trees for 2L-T diesel starting faults, cooling overflow, boost loss, and exhaust smoke colors.
            </p>
          </div>

          {/* Quick Tree Selectors */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleReset('start-node-no-start')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                currentNodeId.startsWith('no-start') || currentNodeId === 'start-node-no-start'
                  ? 'bg-red-600 border-red-500 text-white shadow-md'
                  : 'bg-[#15191e] border-[#2c3238] text-gray-300 hover:text-white'
              }`}
            >
              Cranks / No-Start Tree
            </button>
            <button
              onClick={() => handleReset('start-node-overheating')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                currentNodeId.startsWith('overheat') || currentNodeId === 'start-node-overheating'
                  ? 'bg-amber-600 border-amber-500 text-white shadow-md'
                  : 'bg-[#15191e] border-[#2c3238] text-gray-300 hover:text-white'
              }`}
            >
              Overheating Tree
            </button>
            <button
              onClick={() => handleReset('start-node-smoke')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                currentNodeId.startsWith('smoke') || currentNodeId === 'start-node-smoke'
                  ? 'bg-purple-600 border-purple-500 text-white shadow-md'
                  : 'bg-[#15191e] border-[#2c3238] text-gray-300 hover:text-white'
              }`}
            >
              Smoke Color Tree
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb Trail */}
      {history.length > 0 && (
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 overflow-x-auto pb-1">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-white hover:text-red-400 font-bold bg-[#1d2229] px-2.5 py-1 rounded border border-[#2d343f]"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back One Step
          </button>
          <span>|</span>
          <span>Step {history.length + 1}</span>
        </div>
      )}

      {/* Main Diagnostic Question / Conclusion Box */}
      <div className="tech-panel p-6 bg-[#13161a]">
        {!activeConclusion && currentNode ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-spec">{currentNode.category}</span>
              {currentNode.expectedSpec && (
                <span className="badge-green font-mono">SPEC: {currentNode.expectedSpec}</span>
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
                  className="w-full text-left p-4 rounded-xl border border-[#2e3743] bg-[#1a1f26] hover:bg-[#222a33] hover:border-red-500/60 transition-all flex items-center justify-between group shadow-sm"
                >
                  <span className="text-sm font-medium text-gray-200 group-hover:text-white pr-4">
                    {opt.label}
                  </span>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-red-400 flex-shrink-0 transition-transform group-hover:translate-x-1" />
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
              <div className="flex items-center gap-2 mb-2">
                {activeConclusion.severity === 'critical' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold bg-red-900/80 text-red-300 px-2.5 py-0.5 rounded border border-red-600">
                    <ShieldAlert className="w-3.5 h-3.5" /> CRITICAL FAULT IDENTIFIED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold bg-amber-900/80 text-amber-300 px-2.5 py-0.5 rounded border border-amber-600">
                    <AlertTriangle className="w-3.5 h-3.5" /> REPAIR REQUIRED
                  </span>
                )}
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
                    Standard Repair Action:
                  </strong>
                  <p className="text-gray-200 leading-relaxed text-xs">{activeConclusion.fix}</p>
                </div>
              </div>

              {activeConclusion.procedureRef && onSelectProcedure && (
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onSelectProcedure(activeConclusion.procedureRef)}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg"
                  >
                    <Wrench className="w-4 h-4" /> Open Full Step-by-Step Procedure
                  </button>
                  <button
                    onClick={() => handleReset('start-node-no-start')}
                    className="px-4 py-2.5 bg-[#21262d] hover:bg-[#2c3238] text-gray-300 font-mono text-xs rounded-lg transition-all border border-[#333a42]"
                  >
                    Start New Diagnosis
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
