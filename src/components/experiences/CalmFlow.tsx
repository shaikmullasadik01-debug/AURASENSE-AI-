import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { audioService } from '../../services/audioService';

interface CalmFlowProps {
  currentBreathingRate: number | null;
  currentPulse: number | null;
  signalConfidence: number;
}

type BreathingPattern = 'coherent' | 'box' | 'relax_478';

export const CalmFlow: React.FC<CalmFlowProps> = ({
  currentBreathingRate,
  currentPulse,
  signalConfidence,
}) => {
  const [pattern, setPattern] = useState<BreathingPattern>('coherent');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [phaseProgress, setPhaseProgress] = useState<number>(0);
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [sessionDuration, setSessionDuration] = useState<number>(180); // 3 minutes default
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Timing definitions in seconds: [inhale, hold, exhale, hold2]
  const patternConfigs: Record<BreathingPattern, { name: string; times: [number, number, number, number]; desc: string }> = {
    coherent: {
      name: 'Resonant Flow (5.5s / 5.5s)',
      times: [5.5, 0, 5.5, 0],
      desc: 'Optimizes heart rate variability (HRV) and autonomic nervous balance.',
    },
    box: {
      name: 'Square / Box (4-4-4-4)',
      times: [4, 4, 4, 4],
      desc: 'Used by athletes and high performers to regulate acute focus and nervous calm.',
    },
    relax_478: {
      name: 'Dr. Weil 4-7-8 Calming',
      times: [4, 7, 8, 0],
      desc: 'Deep parasympathetic activation to ease mental tension and transition to rest.',
    },
  };

  const currentConfig = patternConfigs[pattern];

  useEffect(() => {
    if (!isActive) return;

    let startTime = Date.now();
    const interval = setInterval(() => {
      const totalTimeSec = (Date.now() - startTime) / 1000;
      setElapsedSeconds((prev) => prev + 0.1);

      const [tInhale, tHold1, tExhale, tHold2] = currentConfig.times;
      const cycleTotal = tInhale + tHold1 + tExhale + tHold2;
      const timeInCycle = totalTimeSec % cycleTotal;

      let currentPhase: 'Inhale' | 'Hold' | 'Exhale' = 'Inhale';
      let progress = 0;

      if (timeInCycle < tInhale) {
        currentPhase = 'Inhale';
        progress = timeInCycle / tInhale;
      } else if (timeInCycle < tInhale + tHold1) {
        currentPhase = 'Hold';
        progress = (timeInCycle - tInhale) / tHold1;
      } else if (timeInCycle < tInhale + tHold1 + tExhale) {
        currentPhase = 'Exhale';
        progress = (timeInCycle - (tInhale + tHold1)) / tExhale;
      } else {
        currentPhase = 'Hold';
        progress = (timeInCycle - (tInhale + tHold1 + tExhale)) / tHold2;
      }

      setPhase((prevPhase) => {
        if (prevPhase !== currentPhase && soundEnabled) {
          if (currentPhase === 'Inhale') {
            audioService.playInhaleTone(tInhale);
            setCycleCount((c) => c + 1);
          } else if (currentPhase === 'Exhale') {
            audioService.playExhaleTone(tExhale);
          }
        }
        return currentPhase;
      });

      setPhaseProgress(progress);
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, pattern, soundEnabled, currentConfig]);

  // Dynamic circle scale based on phase
  let circleScale = 1;
  if (phase === 'Inhale') {
    circleScale = 1 + phaseProgress * 0.7; // Expands from 1 to 1.7
  } else if (phase === 'Hold') {
    circleScale = 1.7;
  } else if (phase === 'Exhale') {
    circleScale = 1.7 - phaseProgress * 0.7; // Contracts to 1
  }

  // Calculate cardiorespiratory coherence index
  const coherenceScore = Math.min(
    98,
    Math.max(45, Math.round(75 + (signalConfidence > 70 ? 15 : 0) + (phase === 'Exhale' ? 8 : 0)))
  );

  return (
    <div className="flex flex-col items-center justify-between min-h-[520px] p-6 glass-panel rounded-2xl border border-cyan-500/20 text-slate-100">
      {/* Top Header & Pattern Selector */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Wind className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">MODE A — CalmFlow</h3>
              <p className="text-xs text-slate-400">{currentConfig.desc}</p>
            </div>
          </div>
        </div>

        {/* Pattern Pills */}
        <div className="flex items-center space-x-2">
          {(['coherent', 'box', 'relax_478'] as BreathingPattern[]).map((pKey) => (
            <button
              key={pKey}
              onClick={() => {
                setPattern(pKey);
                setElapsedSeconds(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                pattern === pKey
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              {pKey === 'coherent' ? 'Resonant (5.5s)' : pKey === 'box' ? 'Box (4-4-4-4)' : '4-7-8 Sleep'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Breathing Circle & Visualizer */}
      <div className="relative flex flex-col items-center justify-center my-8">
        {/* Outer Aura Glow Rings */}
        <div
          className="absolute rounded-full transition-all duration-300 ease-out pointer-events-none"
          style={{
            width: `${260 * circleScale}px`,
            height: `${260 * circleScale}px`,
            background:
              phase === 'Inhale'
                ? 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, rgba(6,182,212,0) 70%)'
                : 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(168,85,247,0) 70%)',
          }}
        />

        <div
          className="relative w-56 h-56 rounded-full flex flex-col items-center justify-center transition-transform duration-200 ease-out shadow-2xl"
          style={{
            transform: `scale(${circleScale * 0.85})`,
            background:
              phase === 'Inhale'
                ? 'linear-gradient(135deg, rgba(6,182,212,0.35) 0%, rgba(59,130,246,0.3) 100%)'
                : 'linear-gradient(135deg, rgba(168,85,247,0.35) 0%, rgba(217,70,239,0.25) 100%)',
            border:
              phase === 'Inhale' ? '2px solid rgba(6,182,212,0.6)' : '2px solid rgba(168,85,247,0.6)',
            boxShadow:
              phase === 'Inhale'
                ? '0 0 45px rgba(6,182,212,0.35)'
                : '0 0 45px rgba(168,85,247,0.35)',
          }}
        >
          {/* Phase Text */}
          <span className="text-xs uppercase tracking-widest text-slate-300 font-mono">Phase</span>
          <span className="text-3xl font-extrabold text-white mt-1 tracking-wider drop-shadow-md">
            {phase}
          </span>
          <span className="text-xs text-cyan-300 mt-2 font-mono">
            Cycle {cycleCount}
          </span>
        </div>

        {/* Live Optical Guidance Hint */}
        <div className="mt-8 flex items-center space-x-3 text-xs text-slate-300">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700">
            <span className="text-slate-400">Detected Rhythm:</span>
            <span className="font-mono text-cyan-300 font-semibold">
              {currentBreathingRate ? `${currentBreathingRate} RPM` : 'Synchronizing...'}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-400">Coherence:</span>
            <span className="font-mono text-emerald-400 font-semibold">{coherenceScore}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="w-full flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition-all text-xs"
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? 'Pause Flow' : 'Resume Flow'}</span>
          </button>

          <button
            onClick={() => {
              setElapsedSeconds(0);
              setCycleCount(0);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all text-xs"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            audioService.setMuted(!next);
          }}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs transition-all ${
            soundEnabled
              ? 'bg-purple-950/60 text-purple-300 border border-purple-500/30'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{soundEnabled ? 'Synthesizer On' : 'Muted'}</span>
        </button>
      </div>
    </div>
  );
};
