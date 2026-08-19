import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Activity,
  ShieldAlert,
  Sparkles,
  Play,
  Square,
  Radio,
  Volume2,
  VolumeX
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
    description: 'Rhythmic mechanical combustion knock from indirect-injection pre-combustion chambers and Bosch VE pump delivery.',
    rootCause: 'Normal pre-combustion chamber ignition timing and smooth valvetrain operation.',
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
  const [activeAudioMode, setActiveAudioMode] = useState<'idle' | 'synth' | 'recording' | 'playback' | 'live-mic'>('idle');
  const [micError, setMicError] = useState<string | null>(null);

  // Recording states
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Synth generators interval ref
  const synthIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const liveMicStreamRef = useRef<MediaStream | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Peak hold array for equalizer bars
  const peakHoldRef = useRef<number[]>(new Array(64).fill(0));

  // Safe AudioContext Initializer / Resumer
  const getAudioContext = async (): Promise<{ ctx: AudioContext; analyser: AnalyserNode; masterGain: GainNode }> => {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new AudioContextClass();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    if (!analyserRef.current) {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;
    }

    if (!masterGainRef.current) {
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : 0.35, ctx.currentTime);
      masterGain.connect(analyserRef.current);
      analyserRef.current.connect(ctx.destination);
      masterGainRef.current = masterGain;
    }

    return {
      ctx,
      analyser: analyserRef.current,
      masterGain: masterGainRef.current
    };
  };

  // Stop All Active Sounds & Streams
  const stopAllAudio = () => {
    // Stop synth pulses
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }

    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    // Stop Mic stream
    if (liveMicStreamRef.current) {
      liveMicStreamRef.current.getTracks().forEach((t) => t.stop());
      liveMicStreamRef.current = null;
    }

    // Stop HTML Audio Playback
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }

    setActiveAudioMode('idle');
  };

  // 1. Play Synthetic Engine Sounds
  const playSynthesizedProfile = async (profile: EngineSoundProfile) => {
    stopAllAudio();
    setMicError(null);

    try {
      const { ctx, masterGain } = await getAudioContext();
      setActiveAudioMode('synth');

      if (profile.id === 'normal-idle') {
        // Rhythmic Diesel Combustion Thumps (23 Hz pulse rate)
        synthIntervalRef.current = setInterval(() => {
          if (ctx.state === 'closed') return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.04);

          gain.gain.setValueAtTime(0.4, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start();
          osc.stop(ctx.currentTime + 0.05);
        }, 43); // ~23 Hz = 700 RPM 4-cylinder firing
      } else if (profile.id === 'valve-lash-tap') {
        // High Frequency Metallic Ticks (1.8 kHz sharp tick at 11.6 Hz)
        synthIntervalRef.current = setInterval(() => {
          if (ctx.state === 'closed') return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(1850, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.02);

          gain.gain.setValueAtTime(0.5, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start();
          osc.stop(ctx.currentTime + 0.03);
        }, 86);
      } else if (profile.id === 'injector-nail-knock') {
        // Harsh Detonation Snaps (900 Hz square wave)
        synthIntervalRef.current = setInterval(() => {
          if (ctx.state === 'closed') return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'square';
          osc.frequency.setValueAtTime(920, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.035);

          gain.gain.setValueAtTime(0.6, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start();
          osc.stop(ctx.currentTime + 0.045);
        }, 86);
      } else if (profile.id === 'turbo-whistle-leak') {
        // High Pitch Whistle (5.5 kHz)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(5400, ctx.currentTime);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();

        synthIntervalRef.current = setInterval(() => {
          osc.frequency.setValueAtTime(5200 + Math.random() * 600, ctx.currentTime);
        }, 80);
      } else if (profile.id === 'vacuum-pump-whine') {
        // Alternator / Vacuum Pump Harmonic Whine (3.4 kHz)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(3200, ctx.currentTime);
        gain.gain.setValueAtTime(0.22, ctx.currentTime);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();

        synthIntervalRef.current = setInterval(() => {
          osc.frequency.linearRampToValueAtTime(3200 + Math.sin(Date.now() * 0.003) * 400, ctx.currentTime + 0.05);
        }, 50);
      }
    } catch (err) {
      setMicError('Audio engine error: ' + (err instanceof Error ? err.message : String(err)));
      setActiveAudioMode('idle');
    }
  };

  // 2. Start Live Microphone Capture & Real-Time FFT
  const startLiveMic = async () => {
    stopAllAudio();
    setMicError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      liveMicStreamRef.current = stream;

      const { ctx, analyser } = await getAudioContext();
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      setActiveAudioMode('live-mic');
    } catch (err) {
      setMicError('Microphone permission denied or device unavailable.');
      setActiveAudioMode('idle');
    }
  };

  // 3. Record User's Engine Sound via MediaRecorder
  const startRecording = async () => {
    stopAllAudio();
    setMicError(null);
    setRecordedAudioUrl(null);
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      liveMicStreamRef.current = stream;

      const { ctx, analyser } = await getAudioContext();
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
      };

      mediaRecorder.start(100);
      setActiveAudioMode('recording');
    } catch (err) {
      setMicError('Microphone recording error: ' + (err instanceof Error ? err.message : String(err)));
      setActiveAudioMode('idle');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    if (liveMicStreamRef.current) {
      liveMicStreamRef.current.getTracks().forEach((t) => t.stop());
      liveMicStreamRef.current = null;
    }
    setActiveAudioMode('idle');
  };

  // Recording Timer Countdown (10s auto-stop)
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (activeAudioMode === 'recording') {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 10) {
            stopRecording();
            return 10;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeAudioMode]);

  // 4. Playback Recorded Audio through Web Audio Analyser
  const playRecordedAudio = async () => {
    if (!recordedAudioUrl) return;
    stopAllAudio();

    try {
      const { ctx, analyser } = await getAudioContext();
      const audio = new Audio(recordedAudioUrl);
      audioElementRef.current = audio;

      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audio.onended = () => {
        setActiveAudioMode('idle');
      };

      await audio.play();
      setActiveAudioMode('playback');
    } catch (err) {
      setMicError('Audio playback failed: ' + (err instanceof Error ? err.message : String(err)));
      setActiveAudioMode('idle');
    }
  };

  // Master Mute Toggle
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (masterGainRef.current && audioContextRef.current) {
      masterGainRef.current.gain.setValueAtTime(!isMuted ? 0 : 0.35, audioContextRef.current.currentTime);
    }
  };

  // Oscilloscope & Equalizer Canvas Render Loop
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

      // Dark Industrial CRT Background
      ctx.fillStyle = '#06090e';
      ctx.fillRect(0, 0, width, height);

      // Grid Reticle
      ctx.strokeStyle = 'rgba(15, 60, 90, 0.3)';
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

      const isLive = analyserRef.current && activeAudioMode !== 'idle';

      if (isLive && analyserRef.current) {
        // 1. Draw 48-Band Frequency Bars
        const bufferLength = analyserRef.current.frequencyBinCount;
        const freqData = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(freqData);

        const numBars = 48;
        const barWidth = width / numBars;

        for (let i = 0; i < numBars; i++) {
          const val = freqData[i * 2] || 0;
          const barHeight = (val / 255) * (height * 0.75);

          // Update Peak Hold Needle
          if (barHeight > (peakHoldRef.current[i] || 0)) {
            peakHoldRef.current[i] = barHeight;
          } else {
            peakHoldRef.current[i] = Math.max(0, (peakHoldRef.current[i] || 0) - 1.5);
          }

          // Glowing Frequency Bar Gradient
          const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
          grad.addColorStop(0, 'rgba(14, 165, 233, 0.8)');
          grad.addColorStop(0.6, 'rgba(56, 189, 248, 0.9)');
          grad.addColorStop(1, 'rgba(244, 63, 94, 0.9)');

          ctx.fillStyle = grad;
          ctx.fillRect(i * barWidth + 2, height - barHeight, barWidth - 4, barHeight);

          // Peak Hold White Needle
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
        // Standby Trace Waveform
        ctx.save();
        ctx.strokeStyle = '#38bdf840';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < width; x += 4) {
          const y = height / 2 + Math.sin(x * 0.04 + tick * 0.05) * 12;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#64748b';
        ctx.font = '11px monospace';
        ctx.fillText('STANDBY: Click "Play Reference Audio" or "Record My Engine" to begin analysis', 24, height - 24);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      stopAllAudio();
    };
  }, [activeAudioMode]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="tech-panel p-6 bg-gradient-to-r from-[#171c24] via-[#121922] to-[#1a151f] border-purple-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-toyota">Web Audio API Diagnostic Suite</span>
              <span className="badge-spec flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" /> "Listen to My 2L-T" Audio Lab
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-6 h-6 text-purple-400" />
              2L-T Acoustic & Frequency Sound Diagnostic Lab
            </h2>
            <p className="text-sm text-gray-400 mt-1 max-w-3xl leading-relaxed">
              Record live audio of your engine bay, play it back through the digital FFT spectrum analyzer, or synthesize reference failure frequencies for loose valve lash, injector nail-knock, and turbo boost whistle.
            </p>
          </div>

          {/* Master Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Record / Stop Recording Button */}
            {activeAudioMode === 'recording' ? (
              <button
                onClick={stopRecording}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg animate-pulse"
              >
                <Square className="w-4 h-4" /> Stop Recording ({10 - recordingSeconds}s)
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
              >
                <Mic className="w-4 h-4" /> Record My Engine (10s)
              </button>
            )}

            {/* Play Recorded Audio Button */}
            {recordedAudioUrl && (
              <button
                onClick={activeAudioMode === 'playback' ? stopAllAudio : playRecordedAudio}
                className={`px-4 py-2 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                  activeAudioMode === 'playback'
                    ? 'bg-amber-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {activeAudioMode === 'playback' ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {activeAudioMode === 'playback' ? 'Stop Playback' : 'Play Back Recording'}
              </button>
            )}

            {/* Live Mic Mode */}
            {activeAudioMode === 'live-mic' ? (
              <button
                onClick={stopAllAudio}
                className="px-3.5 py-2 rounded-lg bg-red-600 text-white font-mono text-xs font-bold flex items-center gap-1.5"
              >
                <MicOff className="w-4 h-4" /> Stop Live Mic
              </button>
            ) : (
              <button
                onClick={startLiveMic}
                className="px-3.5 py-2 rounded-lg bg-[#1b222c] hover:bg-[#252f3e] border border-[#2b3848] text-gray-200 hover:text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Radio className="w-4 h-4 text-purple-400" /> Live Stream Mic
              </button>
            )}

            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className="p-2 rounded-lg bg-[#1b222c] border border-[#2b3848] text-gray-400 hover:text-white"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>
      </div>

      {micError && (
        <div className="p-3.5 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-300 font-mono flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{micError}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FFT Spectrum & Waveform Display (2 Columns) */}
        <div className="lg:col-span-2 tech-panel bg-[#090d12] border-[#222b37] p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1f2733]">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-purple-400" />
              Dual-Channel Digital Oscilloscope & 48-Band FFT Analyzer
            </span>
            <span className="badge-spec text-[10px] font-mono">
              {activeAudioMode === 'recording'
                ? `🔴 RECORDING LIVE (${recordingSeconds}s / 10s)`
                : activeAudioMode === 'playback'
                ? '▶ PLAYING BACK RECORDED ENGINE'
                : activeAudioMode === 'synth'
                ? '🔊 SYNTHETIC REFERENCE SOUND'
                : activeAudioMode === 'live-mic'
                ? '🎙 LIVE MIC MONITOR'
                : 'STANDBY'}
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
              Reference Sound Library (Click to Play):
            </span>

            {SOUND_PROFILES.map((prof) => {
              const isSelected = selectedProfile.id === prof.id;
              const isPlayingThis = activeAudioMode === 'synth' && isSelected;

              return (
                <button
                  key={prof.id}
                  onClick={() => {
                    setSelectedProfile(prof);
                    if (isPlayingThis) {
                      stopAllAudio();
                    } else {
                      playSynthesizedProfile(prof);
                    }
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs font-mono ${
                    isSelected
                      ? 'border-purple-500 bg-[#211728] text-white ring-1 ring-purple-500/50 shadow-md'
                      : 'border-[#222b37] bg-[#14181f] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      {isPlayingThis ? (
                        <Square className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-purple-400" />
                      )}
                      <span className="font-bold text-white line-clamp-1">{prof.name}</span>
                    </div>
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
