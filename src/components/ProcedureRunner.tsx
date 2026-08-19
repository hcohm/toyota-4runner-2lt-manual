import React, { useState, useEffect } from 'react';
import { PROCEDURES_DATA } from '../data/proceduresData';
import type { Procedure } from '../data/proceduresData';
import { Wrench, CheckCircle2, Play, Pause, RotateCcw, Clock, ShieldAlert, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProcedureRunnerProps {
  initialProcedureId?: string;
}

export const ProcedureRunner: React.FC<ProcedureRunnerProps> = ({ initialProcedureId }) => {
  const [selectedProcId, setSelectedProcId] = useState<string>(
    initialProcedureId || PROCEDURES_DATA[0].id
  );
  const [completedSteps, setCompletedSteps] = useState<Record<string, number[]>>({});
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  
  // Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerLabel, setTimerLabel] = useState<string>('');

  // Load from local storage
  useEffect(() => {
    try {
      const savedSteps = localStorage.getItem('toyota_2lt_proc_steps');
      if (savedSteps) setCompletedSteps(JSON.parse(savedSteps));
      const savedNotes = localStorage.getItem('toyota_2lt_proc_notes');
      if (savedNotes) setUserNotes(JSON.parse(savedNotes));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Update initialProcedureId if prop changes
  useEffect(() => {
    if (initialProcedureId) {
      setSelectedProcId(initialProcedureId);
    }
  }, [initialProcedureId]);

  // Timer interval effect
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false);
      // Alert completion
      alert(`⏱️ Timer complete: ${timerLabel}`);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds, timerLabel]);

  const activeProc: Procedure =
    PROCEDURES_DATA.find((p) => p.id === selectedProcId) || PROCEDURES_DATA[0];

  const currentCompleted = completedSteps[activeProc.id] || [];

  const toggleStep = (stepNum: number) => {
    const isCompleted = currentCompleted.includes(stepNum);
    const updated = isCompleted
      ? currentCompleted.filter((s) => s !== stepNum)
      : [...currentCompleted, stepNum];

    const newCompletedMap = { ...completedSteps, [activeProc.id]: updated };
    setCompletedSteps(newCompletedMap);
    localStorage.setItem('toyota_2lt_proc_steps', JSON.stringify(newCompletedMap));

    // If all steps finished, trigger celebratory confetti!
    if (updated.length === activeProc.steps.length) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const startTimer = (seconds: number, label: string) => {
    setTimerSeconds(seconds);
    setTimerLabel(label);
    setTimerActive(true);
  };

  const handleNotesChange = (val: string) => {
    const newNotes = { ...userNotes, [activeProc.id]: val };
    setUserNotes(newNotes);
    localStorage.setItem('toyota_2lt_proc_notes', JSON.stringify(newNotes));
  };

  const formatTimerDisplay = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(
    (currentCompleted.length / activeProc.steps.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header Banner & Selector */}
      <div className="tech-panel p-6 bg-gradient-to-r from-[#1b222a] via-[#1a1d20] to-[#25181b] border-red-900/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-toyota">FSM Workshop Runner</span>
              <span className="badge-spec">{activeProc.category}</span>
              <span className="badge-green">{activeProc.difficulty}</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Wrench className="w-6 h-6 text-red-500" />
              {activeProc.title}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Estimated Service Duration: <strong className="text-white">{activeProc.estimatedTime}</strong>
            </p>
          </div>

          {/* Procedure Selector Dropdown */}
          <div className="w-full lg:w-80">
            <label className="block text-[11px] font-mono uppercase text-gray-400 font-bold mb-1">
              Select Workshop Procedure:
            </label>
            <select
              value={selectedProcId}
              onChange={(e) => setSelectedProcId(e.target.value)}
              className="w-full bg-[#121417] border border-[#333a42] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-red-500"
            >
              {PROCEDURES_DATA.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-gray-400">CHECKLIST PROGRESS:</span>
            <span className="text-emerald-400 font-bold">
              {currentCompleted.length} / {activeProc.steps.length} Steps ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-[#121417] h-2.5 rounded-full overflow-hidden border border-[#2a303a]">
            <div
              className="bg-gradient-to-r from-red-600 to-emerald-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Floating Timer Bar (If active) */}
      {timerSeconds > 0 && (
        <div className="tech-card bg-[#141b24] border-blue-500/70 p-4 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-blue-400">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <span className="text-xs font-mono text-blue-400 font-bold uppercase">{timerLabel}</span>
              <div className="text-2xl font-mono font-bold text-white tracking-widest">
                {formatTimerDisplay(timerSeconds)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimerActive(!timerActive)}
              className="p-2 rounded-lg bg-[#202732] hover:bg-[#2b3544] text-white border border-[#334050]"
            >
              {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => { setTimerActive(false); setTimerSeconds(0); }}
              className="p-2 rounded-lg bg-[#202732] hover:bg-[#2b3544] text-gray-400 hover:text-white border border-[#334050]"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Required SSTs & Consumables Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SST Table */}
        <div className="tech-panel p-5 bg-[#14171c]">
          <h3 className="text-xs font-mono text-gray-400 font-bold uppercase mb-3 flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-amber-500" />
            Required Special Service Tools (SSTs)
          </h3>
          <div className="space-y-2">
            {activeProc.requiredSSTs.map((sst, idx) => (
              <div key={idx} className="p-2.5 rounded bg-[#101317] border border-[#252c36] text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 font-mono">SST {sst.number}</span>
                  <span className="text-[11px] text-gray-400">{sst.name}</span>
                </div>
                <div className="text-gray-400 text-[11px] mt-0.5">{sst.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Consumables Checklist */}
        <div className="tech-panel p-5 bg-[#14171c]">
          <h3 className="text-xs font-mono text-gray-400 font-bold uppercase mb-3 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-500" />
            Parts & Required Consumables
          </h3>
          <ul className="space-y-1.5 text-xs text-gray-300">
            {activeProc.consumables.map((c, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Step-by-Step Execution List */}
      <div className="space-y-4">
        {activeProc.steps.map((step) => {
          const isDone = currentCompleted.includes(step.stepNumber);
          return (
            <div
              key={step.stepNumber}
              className={`tech-panel p-6 transition-all ${
                isDone
                  ? 'bg-[#12161b] border-emerald-900/40 opacity-80'
                  : 'bg-[#15191f] border-[#2c3542] hover:border-gray-500 shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleStep(step.stepNumber)}
                  className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 transition-all ${
                    isDone
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'border-gray-500 bg-[#0e1115] hover:border-emerald-400'
                  }`}
                >
                  {isDone && <CheckCircle2 className="w-4 h-4" />}
                </button>

                {/* Step Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gray-400">
                        STEP {step.stepNumber}
                      </span>
                      <h4
                        className={`text-base font-bold ${
                          isDone ? 'line-through text-gray-400' : 'text-white'
                        }`}
                      >
                        {step.title}
                      </h4>
                    </div>

                    {/* Torque / SST Callout Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {step.torqueCallout && (
                        <span className="badge-spec text-[11px] font-mono">
                          {step.torqueCallout}
                        </span>
                      )}
                      {step.sstNumber && (
                        <span className="badge-blue text-[11px] font-mono">
                          SST {step.sstNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                    {step.instruction}
                  </p>

                  {/* Warning Box if present */}
                  {step.warningAlert && (
                    <div className="p-3 rounded bg-red-950/70 border border-red-800 text-xs text-red-300 flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{step.warningAlert}</span>
                    </div>
                  )}

                  {/* Built-in Step Timer button */}
                  {step.timerDurationSeconds && (
                    <div className="pt-1">
                      <button
                        onClick={() =>
                          startTimer(step.timerDurationSeconds!, step.timerLabel || step.title)
                        }
                        className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 text-blue-300 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all"
                      >
                        <Clock className="w-3.5 h-3.5" /> Start Step Timer (
                        {Math.floor(step.timerDurationSeconds / 60)} min)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mechanic's Notebook */}
      <div className="tech-panel p-5 bg-[#14171c]">
        <label className="block text-xs font-mono uppercase text-gray-400 font-bold mb-2">
          Workshop Service Notes (Saved locally for this procedure):
        </label>
        <textarea
          rows={3}
          value={userNotes[activeProc.id] || ''}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Record piston protrusion measurements, measured valve lash, replacement shim sizes, or torque notes here..."
          className="w-full bg-[#0d1014] border border-[#2b333e] rounded-lg p-3 text-xs text-gray-200 font-mono focus:outline-none focus:border-red-500"
        />
      </div>
    </div>
  );
};
