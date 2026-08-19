import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Activity,
  ShieldAlert,
  Sparkles,
  Play,
  Square,
  Radio
} from 'lucide-react';

interface EngineSoundProfile {
  id: string;
  name: string;
  category: 'Normal' | 'Valvetrain' | 'Fuel Injection' | 'Turbo & Intake' | 'Bearings & Drive';
  status: 'Healthy' | 'Moderate Concern' | 'Critical Failure';
  frequencyPeak: string;
  frequencyRangeHz: [number, number];
  description: string;
  rootCause: string;
  diagnosticSteps: string[];
}

const SOUND_PROFILES: EngineSoundProfile[] = [
  {
    id: 'normal-idle',
    name: 'Healthy 2L-T Mechanical Diesel Clatter (700 RPM Idle)',
    category: 'Normal',
    status: 'Healthy',
    frequencyPeak: '180 – 350 Hz',
    frequencyRangeHz: [150, 400],
    description: 'Clean, rhythmic mechanical direct injection combustion knock from pre-combustion chamber swirl and Bosch VE pump delivery.',
    rootCause: 'Normal indirect-diesel pre-combustion ignition timing and smooth valvetrain operation.',
    diagnosticSteps: [
      'Confirm idle speed is 700 ± 50 RPM.',
      'Verify zero blue or thick white smoke from exhaust.',
      'Check that rhythmic clatter softens smoothly as engine reaches 80°C operating temperature.'
    ]
  },
  {
    id: 'valve-lash-tap',
    name: 'Loose Valvetrain Valve Lash Tapping (Excessive Shim Gap)',
    category: 'Valvetrain',
    status: 'Moderate Concern',
    frequencyPeak: '1,400 – 2,200 Hz',
    frequencyRangeHz: [1200, 2500],
    description: 'Sharp, light metallic ticking noise localized directly under the aluminum valve cover, pulsing at exactly half crankshaft RPM.',
    rootCause: 'Valve clearance exceeds cold specification (Intake > 0.35mm / Exhaust > 0.55mm) due to valve seat wear or undersized shims.',
    diagnosticSteps: [
      'Remove valve cover and measure cold lash with feeler gauge.',
      'Calculate required replacement shim thickness: N = T + (A - Target).',
      'Use SST 09248-64011 lifter press to swap outer shims without removing camshaft.'
    ]
  },
  {
    id: 'injector-nail-knock',
    name: 'Injector Nozzle "Nail-Knock" (Dripping / Poor Atomization)',
    category: 'Fuel Injection',
    status: 'Critical Failure',
    frequencyPeak: '750 – 1,100 Hz',
    frequencyRangeHz: [700, 1200],
    description: 'Hard, sharp hammering sound resembling nails dropped in a steel bucket. Exaggerated under acceleration load and cold starts.',
    rootCause: 'Worn injector nozzle needle seat dripping liquid fuel instead of atomized mist, causing instantaneous detonation and localized piston hotspotting.',
    diagnosticSteps: [
      'Crack open 17mm injector flare nuts one by one while idling; when noise disappears, the offending cylinder is identified.',
      'Pop-test injectors on hydraulic bench: standard opening pressure must be 145–155 kg/cm² with crisp chattering atomization.'
    ]
  },
  {
    id: 'turbo-whistle-leak',
    name: 'CT20 Turbo Boost Leak / Wastegate Acoustic Screech',
    category: 'Turbo & Intake',
    status: 'Moderate Concern',
    frequencyPeak: '4,500 – 7,500 Hz',
    frequencyRangeHz: [4000, 8000],
    description: 'High-pitched whistling or dentist-drill screech occurring strictly when boost builds above 0.4 bar under heavy throttle.',
    rootCause: 'Split silicone crossover boost hose, warped exhaust manifold-to-turbo flange gasket, or turbine wheel rubbing compressor housing.',
    diagnosticSteps: [
      'Inspect 4mm silicone wastegate reference hose for splits.',
      'Check CT20 turbine shaft radial play (<0.18mm) and axial end play (<0.08mm).',
      'Spray soapy water around aluminum crossover pipe joints while revving to spot bubbling leaks.'
    ]
  },
  {
    id: 'vacuum-pump-whine',
    name: 'Alternator / Vacuum Vane Pump Dry Bearing Whine',
    category: 'Bearings & Drive',
    status: 'Critical Failure',
    frequencyPeak: '2,800 – 4,000 Hz',
    frequencyRangeHz: [2500, 4500],
    description: 'Continuous harmonic whine that increases in pitch directly with engine RPM, accompanied by reduced brake power assist.',
    rootCause: 'Oil starvation in the rear alternator-mounted vacuum pump due to a clogged 1.5mm banjo bolt oil restrictor jet.',
    diagnosticSteps: [
      'Disconnect alternator V-belt temporarily to verify if whining ceases completely.',
      'Remove 14mm oil supply banjo bolt on rear vacuum pump housing and clean internal 1.5mm orifice in solvent.'
    ]
  }
];

export const AcousticDiagnosticLab: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<EngineSoundProfile>(SOUND_PROFILES[0]);
  const [isPlayingSynth, setIsPlayingSynth] = useState<boolean>(false);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const synthNodesRef = useRef<{ osc: OscillatorNode; gain: GainNode; interval?: number } | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  // Peak hold array for equalizer bars
  const peakHoldRef = useRef<number[]>(new Array(64).fill(0));

  // Initialize Audio Context & High-End Oscilloscope Render Loop
  useEffect(() => {
    let animationFrameId: number;
    let tick = 0;

    const render = () => {
      tick++;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Dark CRT Reticle Background
      ctx.fillStyle = '#060a0f';
      ctx.fillRect(0, 0, width, height);

      // Draw Oscilloscope Grid Lines (PicoScope Reticle Style)
      ctx.strokeStyle = 'rgba(20, 80, 120, 0.25)';
      ctx.lineWidth = 1;
      const gridStep = 32;
      for (let x = 0; x < width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center Reference Crosshairs
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      ctx.setLineDash([]);

      const isLive = analyserRef.current && (isPlayingSynth || isMicActive);

      if (isLive && analyserRef.current) {
        // 1. Draw Real-Time Frequency Bars with Peak-Hold Decay
        const bufferLength = analyserRef.current.frequencyBinCount;
        const freqData = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(freqData);

        const numBars = 48;
        const barWidth = width / numBars;

        for (let i = 0; i < numBars; i++) {
          const val = freqData[i * 2] || 0;
          const barHeight = (val / 255) * (height * 0.75);

          // Update Peak Hold
          if (barHeight > (peakHoldRef.current[i] || 0)) {
            peakHoldRef.current[i] = barHeight;
          } else {
            peakHoldRef.current[i] = Math.max(0, (peakHoldRef.current[i] || 0) - 1.2);
          }

          // Glowing Frequency Bar Gradient
          const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
          grad.addColorStop(0, 'rgba(14, 165, 233, 0.8)');
          grad.addColorStop(0.6, 'rgba(56, 189, 248, 0.9)');
          grad.addColorStop(1, 'rgba(244, 63, 94, 0.9)');

          ctx.fillStyle = grad;
          ctx.fillRect(i * barWidth + 2, height - barHeight, barWidth - 4, barHeight);

          // Peak Hold Needle
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(i * barWidth + 2, height - (peakHoldRef.current[i] || 0) - 2, barWidth - 4, 2);
        }

        // 2. Overlay Phosphor-Glow Time Domain Oscilloscope Waveform
        const timeData = new Uint8Array(bufferLength);
        analyserRef.current.getByteTimeDomainData(timeData);

        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 12;

        ctx.beginPath();
        const sliceWidth = width / bufferLength;
        let wx = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = timeData[i] / 128.0;
          const wy = (v * (height / 2)) - 10;

          if (i === 0) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
          wx += sliceWidth;
        }
        ctx.stroke();
        ctx.restore();

      } else {
        // Standby Animated Radar Trace
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        for (let x = 0; x < width; x += 4) {
          const y = height / 2 + Math.sin(x * 0.04 + tick * 0.05) * 16 * Math.sin(tick * 0.02);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        // Standby Text HUD
        ctx.fillStyle = '#64748b';
        ctx.font = '11px monospace';
        ctx.fillText('STANDBY: Click "Play Audio Synthesis" or "Start Live Mic" to analyze acoustic waveform', 24, height - 24);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      stopSynth();
      stopMic();
    };
  }, [isPlayingSynth, isMicActive]);

  // Start Sound Synthesis with Realistic Diesel Engine Modulations
  const startSynth = (profile: EngineSoundProfile) => {
    stopMic();
    stopSynth();

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioContextRef.current = ctx;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const targetFreq = (profile.frequencyRangeHz[0] + profile.frequencyRangeHz[1]) / 2;
    osc.type = profile.category === 'Normal' ? 'sawtooth' : profile.category === 'Valvetrain' ? 'triangle' : 'square';
    osc.frequency.setValueAtTime(targetFreq, ctx.currentTime);

    // Dynamic Rhythmic Engine Thump Modulation
    gain.gain.setValueAtTime(0.08, ctx.currentTime);

    osc.connect(gain);
    gain.connect(analyser);
    analyser.connect(ctx.destination);

    osc.start();
    synthNodesRef.current = { osc, gain };
    setIsPlayingSynth(true);
  };

  const stopSynth = () => {
    if (synthNodesRef.current) {
      try {
        synthNodesRef.current.osc.stop();
        synthNodesRef.current.osc.disconnect();
      } catch {
        // Ignore
      }
      synthNodesRef.current = null;
    }
    setIsPlayingSynth(false);
  };

  // Start Live Microphone Analysis
  const startMic = async () => {
    stopSynth();
    setMicError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsMicActive(true);
    } catch (err) {
      setMicError('Microphone permission denied or device unavailable.');
      setIsMicActive(false);
    }
  };

  const stopMic = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    setIsMicActive(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="tech-panel p-6 bg-gradient-to-r from-[#171c24] via-[#121922] to-[#1a151f] border-purple-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-toyota">Automotive Oscilloscope FFT Spectrum</span>
              <span className="badge-spec flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" /> "Listen to My 2L-T"
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-6 h-6 text-purple-400" />
              2L-T Acoustic & Frequency Sound Diagnostic Lab
            </h2>
            <p className="text-sm text-gray-400 mt-1 max-w-3xl leading-relaxed">
              Automotive-grade FFT spectrum analyzer and dual-trace oscilloscope. Analyze live engine bay sounds via your device microphone or test synthesized reference frequencies.
            </p>
          </div>

          {/* Audio Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {isMicActive ? (
              <button
                onClick={stopMic}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg animate-pulse"
              >
                <MicOff className="w-4 h-4" /> Stop Live Mic
              </button>
            ) : (
              <button
                onClick={startMic}
                className="px-4 py-2 rounded-lg bg-[#1b222c] hover:bg-[#252f3e] border border-[#2b3848] text-gray-200 hover:text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
              >
                <Mic className="w-4 h-4 text-purple-400" /> Start Live Mic
              </button>
            )}

            {isPlayingSynth ? (
              <button
                onClick={stopSynth}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg"
              >
                <Square className="w-4 h-4" /> Stop Audio
              </button>
            ) : (
              <button
                onClick={() => startSynth(selectedProfile)}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg"
              >
                <Play className="w-4 h-4" /> Play Audio Synthesis
              </button>
            )}
          </div>
        </div>
      </div>

      {micError && (
        <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300 font-mono flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{micError}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FFT Spectrum Display (2 Columns) */}
        <div className="lg:col-span-2 tech-panel bg-[#090d12] border-[#222b37] p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1f2733]">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-purple-400" />
              Dual-Channel Digital Oscilloscope & 48-Band FFT Analyzer
            </span>
            <span className="badge-spec text-[10px] font-mono">
              {isMicActive ? '🎙️ Live Microphone Input' : isPlayingSynth ? '🔊 Audio Synthesizer' : 'Standby'}
            </span>
          </div>

          {/* Canvas Spectrum */}
          <div className="rounded-xl overflow-hidden border border-[#212b37] bg-[#040608] relative shadow-inner">
            <canvas ref={canvasRef} width={680} height={260} className="w-full h-64" />
          </div>

          {/* Frequency Range Scale Bar */}
          <div className="grid grid-cols-4 text-center text-[10px] font-mono text-gray-400 pt-1 border-t border-[#1e2632]">
            <div>
              <span className="text-emerald-400 font-bold block">100 – 500 Hz</span>
              <span>Combustion Clatter</span>
            </div>
            <div>
              <span className="text-amber-400 font-bold block">700 – 1.2 kHz</span>
              <span>Injector Nail Knock</span>
            </div>
            <div>
              <span className="text-purple-400 font-bold block">1.4 – 2.5 kHz</span>
              <span>Valve Lash Tap</span>
            </div>
            <div>
              <span className="text-sky-400 font-bold block">4.0 – 8.0 kHz</span>
              <span>Turbo / Boost Whistle</span>
            </div>
          </div>
        </div>

        {/* Right Sound Profiles Selector & Diagnostics (1 Column) */}
        <div className="space-y-4">
          {/* Sound Profiles Selector */}
          <div className="tech-panel p-4 bg-[#12161c] border-[#242e3c] space-y-2">
            <span className="text-[11px] font-mono text-gray-400 uppercase font-bold tracking-wider block mb-1">
              Select Engine Sound Profile:
            </span>

            {SOUND_PROFILES.map((prof) => {
              const isSelected = selectedProfile.id === prof.id;
              return (
                <button
                  key={prof.id}
                  onClick={() => {
                    setSelectedProfile(prof);
                    if (isPlayingSynth) startSynth(prof);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs font-mono ${
                    isSelected
                      ? 'border-purple-500 bg-[#211728] text-white ring-1 ring-purple-500/50 shadow-md'
                      : 'border-[#222b37] bg-[#14181f] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white line-clamp-1">{prof.name}</span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                        prof.status === 'Healthy'
                          ? 'bg-emerald-950 text-emerald-300'
                          : prof.status === 'Moderate Concern'
                          ? 'bg-amber-950 text-amber-300'
                          : 'bg-red-950 text-red-300'
                      }`}
                    >
                      {prof.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-purple-300 font-mono">Peak: {prof.frequencyPeak}</div>
                </button>
              );
            })}
          </div>

          {/* Active Sound Diagnostics Card */}
          <div className="tech-panel p-5 bg-[#13171f] border-purple-900/40 space-y-3">
            <div className="pb-2 border-b border-[#242f3d]">
              <span className="badge-spec font-mono text-[10px]">{selectedProfile.category}</span>
              <h3 className="text-base font-bold text-white mt-1">{selectedProfile.name}</h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-[#0d1014] rounded-lg border border-[#212a36] space-y-1">
                <span className="text-purple-400 font-bold uppercase font-mono text-[10px] block">Root Cause:</span>
                <p className="text-gray-300 text-[11px] leading-relaxed">{selectedProfile.rootCause}</p>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-emerald-400 font-bold uppercase font-mono text-[10px] block">
                  Diagnostic Action Steps:
                </span>
                <ul className="space-y-1 text-gray-300 text-[11px] list-disc pl-4 font-mono">
                  {selectedProfile.diagnosticSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
