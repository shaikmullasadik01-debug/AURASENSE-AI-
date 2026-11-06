import React, { useRef, useEffect } from 'react';
import { Heart, Activity, Info, ShieldCheck, Zap } from 'lucide-react';

interface PulseVisionProps {
  pulseRate: number | null;
  cardiacWaveform: number[];
  relativeArterialWaveform: number[];
  hrvSdnn: number | null;
  confidence: number;
}

export const PulseVision: React.FC<PulseVisionProps> = ({
  pulseRate,
  cardiacWaveform,
  relativeArterialWaveform,
  hrvSdnn,
  confidence,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated 3D biometric radial spectrum visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angleOffset = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = '#060914';
      ctx.fillRect(0, 0, width, height);

      // Radial rings
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      [50, 90, 130, 170].forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Rotating harmonic rays
      angleOffset += (pulseRate ? pulseRate / 60 : 1) * 0.02;
      const sampleCount = cardiacWaveform.length || 60;
      const baseRadius = 85;

      ctx.beginPath();
      for (let i = 0; i < sampleCount; i++) {
        const val = cardiacWaveform[i] || 0;
        const angle = (i / sampleCount) * Math.PI * 2 + angleOffset;
        const r = baseRadius + val * 45;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      // Glowing pulsating gradient fill
      const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 140);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
      grad.addColorStop(0.6, 'rgba(59, 130, 246, 0.15)');
      grad.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Center glowing heart indicator
      ctx.fillStyle = '#f43f5e';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      const centerPulse = Math.sin(angleOffset * 4) * 3;
      ctx.arc(cx, cy, 12 + centerPulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [pulseRate, cardiacWaveform]);

  return (
    <div className="flex flex-col min-h-[520px] p-6 glass-panel rounded-2xl border border-cyan-500/20 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
            <Heart className="w-5 h-5 animate-cardiac-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">MODE B — PulseVision</h3>
            <p className="text-xs text-slate-400">
              Real-time cardiac photoplethysmography (rPPG) harmonics & arterial wave trace
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Confidence:</span>
          <span className="font-mono text-cyan-300 font-bold">{confidence}%</span>
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center flex-1">
        {/* Radial Spectrum Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          <canvas
            ref={canvasRef}
            width={480}
            height={380}
            className="w-full max-w-[440px] h-[340px] rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl"
          />
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mt-2">
            Spherical Micro-Vascular Harmonic Spectrum
          </span>
        </div>

        {/* Real-Time Metrics & Arterial Wave */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Large BPM Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between shadow-lg">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                Current Pulse Rate
              </span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 font-mono">
                  {pulseRate ? pulseRate : '--'}
                </span>
                <span className="text-sm font-semibold text-slate-400">BPM</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </div>

          {/* HRV Card */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/20 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Heart Rate Variability (SDNN)</span>
              <div className="text-xl font-bold font-mono text-purple-300 mt-0.5">
                {hrvSdnn ? `${hrvSdnn} ms` : 'Collecting intervals...'}
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800">
              Autonomic Balance
            </span>
          </div>

          {/* Relative Arterial Pressure Waveform note */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-rose-300 font-medium">
              <Activity className="w-4 h-4" />
              <span>Arterial Pressure Waveform (Visual Trace Only)</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Reflects the continuous mechanical expansion and contraction curve of facial capillary
              arterioles. It exhibits characteristic systolic peaks and dicrotic reflections.
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory Non-Diagnostic Health Disclaimer */}
      <div className="flex items-center space-x-2 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs">
        <Info className="w-4 h-4 shrink-0 text-amber-400" />
        <span>
          <strong>Informational Wellness Notice:</strong> Optical rPPG pulse measurements are for
          lifestyle, fitness, and relaxation exploration. AuraSense is not an FDA-cleared diagnostic
          medical device and must never be used to diagnose cardiac conditions.
        </span>
      </div>
    </div>
  );
};
