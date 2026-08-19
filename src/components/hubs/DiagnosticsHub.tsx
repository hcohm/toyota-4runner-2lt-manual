import React, { useState } from 'react';
import { AcousticDiagnosticLab } from '../AcousticDiagnosticLab';
import { DiagnosticWizard } from '../DiagnosticWizard';
import { ProcedureRunner } from '../ProcedureRunner';
import { Activity, Stethoscope, BookOpen } from 'lucide-react';

interface DiagnosticsHubProps {
  initialProcedureId?: string;
}

export const DiagnosticsHub: React.FC<DiagnosticsHubProps> = ({ initialProcedureId }) => {
  const [subTab, setSubTab] = useState<'acoustic' | 'wizard' | 'procedures'>(
    initialProcedureId ? 'procedures' : 'acoustic'
  );
  const [targetProcId, setTargetProcId] = useState<string | undefined>(initialProcedureId);

  return (
    <div className="space-y-6">
      {/* Sub-navigation bar */}
      <div className="flex items-center gap-2 p-1.5 bg-[#12151b] rounded-xl border border-[#26303d] overflow-x-auto">
        <button
          onClick={() => setSubTab('acoustic')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'acoustic'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#1b222d]'
          }`}
        >
          <Activity className="w-4 h-4 text-purple-400" /> Acoustic FFT Sound Analyzer ("Listen to My 2L-T")
        </button>
        <button
          onClick={() => setSubTab('wizard')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'wizard'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#1b222d]'
          }`}
        >
          <Stethoscope className="w-4 h-4 text-cyan-400" /> Diagnostic Decision Wizard (7 Fault Trees)
        </button>
        <button
          onClick={() => setSubTab('procedures')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'procedures'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#1b222d]'
          }`}
        >
          <BookOpen className="w-4 h-4" /> 12 Workshop Procedures & Checklists
        </button>
      </div>

      {/* Sub-view Rendering */}
      {subTab === 'acoustic' && <AcousticDiagnosticLab />}
      {subTab === 'wizard' && (
        <DiagnosticWizard
          onSelectProcedure={(procId) => {
            setTargetProcId(procId);
            setSubTab('procedures');
          }}
        />
      )}
      {subTab === 'procedures' && <ProcedureRunner initialProcedureId={targetProcId} />}
    </div>
  );
};
