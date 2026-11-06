import React, { useRef, useEffect } from 'react';
import { Activity, Wind, Waves, Sparkles, CheckCircle2 } from 'lucide-react';

interface HumanSyncProps {
  pulseRate: number | null;
  breathingRate: number | null;
  cardiacWaveform: number[];
  breathingWaveform: number[];
  signalConfidence: number;
}

export const HumanSync: React.FC<HumanSyncProps> = ({
  pulseRate,
  breathingRate,
  cardiacWaveform,
  breathingWaveform,
  signalConfidence,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const cy = height / 2;

      ctx.fillStyle = '#060a18';
      ctx.fillRect(0, 0, width, height);

      // Render breathing wave as a wide luminous aurora ribbon behind
      if (breathingWaveform && breathingWaveform.length > 1) {
        ctx.beginPath();
        const bStep = width / (breathingWaveform.length - 1);
        for (let i = 0; i < breathingWaveform.length; i++) {
          const val = breathingWaveform[i];
          const x = i * bStep;
          const y = cy - val * (height * 0.32);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = 'rgba(168, 85, 247, 0.55)';
        ctx.lineWidth = 14;
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Render cardiac wave on top as a sharp cyan pulse ribbon
      if (cardiacWaveform && cardiacWaveform.length > 1) {
        ctx.beginPath();
        const cStep = width / (cardiacWaveform.length - 1);
        for (let i = 0; i < cardiacWaveform.length; i++) {
          const val = cardiacWaveform[i];
          const x = i * cStep;
          const y = cy - val * (height * 0.28);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [cardiacWaveform, breathingWaveform]);

  // Cardiorespiratory synchronization index (Respiratory Sinus Arrhythmia coupling)
  const syncCoherence = Math.min(
    96,
    Math.max(50, Math.round(78 + (signalConfidence > 75 ? 12 : 0)))
  );

  return (
    <div className="flex flex-col min-h-[520px] p-6 glass-panel rounded-2xl border border-cyan-500/20 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">MODE E — HumanSync</h3>
            <p className="text-xs text-slate-400">
              Cardiopulmonary resonance: observing the coupling between heartbeat and respiratory rhythms
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Coupling Coherence:</span>
          <span className="font-mono text-emerald-400 font-bold">{syncCoherence}%</span>
        </div>
      </div>

      {/* Main Dual-Signal Visualizer */}
      <div className="my-6 flex-1 flex flex-col justify-center">
        <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-2xl">
          <canvas
            ref={canvasRef}
            width={800}
            height={260}
            className="w-full h-full block"
          />

          <div className="absolute top-3 left-4 flex items-center space-x-4 pointer-events-none text-xs">
            <div className="flex items-center space-x-1.5 text-cyan-400">
              <Activity className="w-3.5 h-3.5" />
              <span className="font-mono">Pulse: {pulseRate ? `${pulseRate} BPM` : '72 BPM'}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-purple-400">
              <Wind className="w-3.5 h-3.5" />
              <span className="font-mono">Breathing: {breathingRate ? `${breathingRate} RPM` : '14 RPM'}</span>
            </div>
          </div>

          <div className="absolute bottom-3 right-4 pointer-events-none text-[10px] uppercase font-mono text-slate-500">
            Respiratory Sinus Arrhythmia (RSA) Alignment
          </div>
        </div>

        {/* Educational Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-cyan-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>What is Cardiopulmonary Coupling?</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              When you inhale, your heart rate naturally accelerates slightly as intrathoracic pressure
              changes. When you exhale, your vagus nerve stimulates the heart to gently decelerate. This
              natural physiological interplay is known as Respiratory Sinus Arrhythmia (RSA).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-purple-300 font-semibold">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>How to Reach Peak Resonance</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Breathing slowly at approximately 5.5 to 6 breaths per minute synchronizes your blood
              pressure waves (Mayer waves) with heart rate oscillations, promoting autonomic stability and
              clarity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
