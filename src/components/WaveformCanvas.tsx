import React, { useEffect, useRef } from 'react';
import { Activity, Wind } from 'lucide-react';

interface WaveformCanvasProps {
  cardiacData: number[];
  breathingData: number[];
  relativeArterialData?: number[];
  pulseBpm: number | null;
  breathingRpm: number | null;
  quality: number;
}

export const WaveformCanvas: React.FC<WaveformCanvasProps> = ({
  cardiacData,
  breathingData,
  relativeArterialData,
  pulseBpm,
  breathingRpm,
  quality,
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

      // Dark futuristic biometric grid background
      ctx.fillStyle = '#070b19';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
      ctx.lineWidth = 1;
      const stepX = 30;
      const stepY = 24;

      ctx.beginPath();
      for (let x = 0; x < width; x += stepX) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += stepY) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Horizontal separator line between Cardiac (top) and Breathing (bottom)
      const midY = height * 0.52;
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();
      ctx.setLineDash([]);

      // 1. Draw Cardiac rPPG Waveform (Top Half: Cyan / Electric Blue phosphor trace)
      if (cardiacData && cardiacData.length > 1) {
        const cHeight = midY - 20;
        const cCenterY = midY * 0.52;

        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2.4;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.beginPath();

        const step = width / (cardiacData.length - 1);
        for (let i = 0; i < cardiacData.length; i++) {
          const val = cardiacData[i];
          const x = i * step;
          // Invert y because canvas 0 is top
          const y = cCenterY - val * (cHeight * 0.42);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Current leading pulse dot
        const lastIdx = cardiacData.length - 1;
        const dotX = width - 2;
        const dotY = cCenterY - cardiacData[lastIdx] * (cHeight * 0.42);

        ctx.fillStyle = '#22d3ee';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 2. Draw Breathing Waveform (Bottom Half: Lavender / Vibrant Violet trace)
      if (breathingData && breathingData.length > 1) {
        const bTop = midY + 12;
        const bHeight = height - bTop - 12;
        const bCenterY = bTop + bHeight * 0.5;

        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2.2;
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const bStep = width / (breathingData.length - 1);
        for (let i = 0; i < breathingData.length; i++) {
          const val = breathingData[i];
          const x = i * bStep;
          const y = bCenterY - val * (bHeight * 0.42);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Leading breath dot
        const lastBIdx = breathingData.length - 1;
        const dotBX = width - 2;
        const dotBY = bCenterY - breathingData[lastBIdx] * (bHeight * 0.42);

        ctx.fillStyle = '#c084fc';
        ctx.shadowColor = '#e879f9';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(dotBX, dotBY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw faint relative arterial pressure waveform behind cardiac if present
      if (relativeArterialData && relativeArterialData.length > 1) {
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        const aStep = width / (relativeArterialData.length - 1);
        for (let i = 0; i < relativeArterialData.length; i++) {
          const val = relativeArterialData[i];
          const x = i * aStep;
          const y = midY * 0.52 - val * (midY * 0.35);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [cardiacData, breathingData, relativeArterialData]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden glass-panel border border-cyan-500/20 p-4">
      {/* Waveform Header Labels */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 text-cyan-400 font-medium">
            <Activity className="w-4 h-4 animate-pulse text-cyan-400" />
            <span>CARDIAC PPG WAVEFORM</span>
          </div>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-mono">
            {pulseBpm ? `${pulseBpm} BPM` : 'CALIBRATING...'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 text-purple-400 font-medium">
            <Wind className="w-4 h-4 text-purple-400" />
            <span>RESPIRATORY RHYTHM</span>
          </div>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-mono">
            {breathingRpm ? `${breathingRpm} RPM` : 'ACQUIRING...'}
          </span>
        </div>

        <div className="flex items-center space-x-1 text-[11px] text-slate-400">
          <span>Signal SNR:</span>
          <span className={`font-mono font-semibold ${quality > 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {quality}%
          </span>
        </div>
      </div>

      {/* High-FPS Canvas Renderer */}
      <div className="relative w-full h-56 md:h-64 rounded-xl overflow-hidden bg-slate-950/80 border border-slate-800/80">
        <canvas
          ref={canvasRef}
          width={800}
          height={260}
          className="w-full h-full block"
        />

        {/* Informational overlay tags */}
        <div className="absolute top-2 left-3 pointer-events-none">
          <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
            Channel 1: Arterial Micro-vascular Perfusion (30Hz)
          </span>
        </div>
        <div className="absolute bottom-2 left-3 pointer-events-none">
          <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30">
            Channel 2: Thoracoabdominal Displacement
          </span>
        </div>

        <div className="absolute bottom-2 right-3 pointer-events-none text-[9px] text-slate-500 font-mono">
          Non-diagnostic optical telemetry
        </div>
      </div>
    </div>
  );
};
