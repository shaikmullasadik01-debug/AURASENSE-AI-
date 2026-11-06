import React, { useRef, useEffect } from 'react';
import { Palette, Sparkles, Smile, ShieldCheck } from 'lucide-react';
import { ExpressionClassification } from '../../types';

interface ExpressionCanvasProps {
  expression: ExpressionClassification;
}

export const ExpressionCanvas: React.FC<ExpressionCanvasProps> = ({ expression }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generative fluid particles influenced by expression probabilities
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      hue: number;
      alpha: number;
    }

    const particles: Particle[] = [];
    const count = 75;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 5 + 2,
        hue: 180,
        alpha: Math.random() * 0.7 + 0.2,
      });
    }

    const render = () => {
      ctx.fillStyle = 'rgba(7, 10, 24, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Map dominant expression to color hue palette
      let targetHue = 190; // Calm cyan
      let speedMultiplier = 1;

      if (expression.dominant === 'smiling') {
        targetHue = 45; // Radiant Amber/Gold
        speedMultiplier = 1.8;
      } else if (expression.dominant === 'focused') {
        targetHue = 270; // Deep Violet/Purple
        speedMultiplier = 0.9;
      } else if (expression.dominant === 'fatigued') {
        targetHue = 215; // Soft Slate/Muted Blue
        speedMultiplier = 0.5;
      }

      particles.forEach((p, idx) => {
        p.x += p.vx * speedMultiplier;
        p.y += p.vy * speedMultiplier;

        // Wrap edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Smooth color transition
        p.hue += (targetHue - p.hue) * 0.05;

        // Draw particle
        ctx.fillStyle = `hsla(${p.hue + (idx % 30)}, 85%, 60%, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles with generative constellation lines
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 70) {
            ctx.strokeStyle = `hsla(${p.hue}, 80%, 55%, ${(1 - dist / 70) * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [expression]);

  const probs = expression.probabilities || {
    calm: 0.7,
    focused: 0.15,
    smiling: 0.1,
    fatigued: 0.05,
    neutral: 0.0,
  };

  return (
    <div className="flex flex-col min-h-[520px] p-6 glass-panel rounded-2xl border border-cyan-500/20 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-fuchsia-500/20 text-fuchsia-400">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">MODE D — ExpressionCanvas</h3>
            <p className="text-xs text-slate-400">
              Generative visual art reacting to facial muscle kinematics and orientation
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs">
          <Smile className="w-3.5 h-3.5 text-fuchsia-400" />
          <span className="text-slate-400">Kinematic:</span>
          <span className="font-semibold text-white capitalize">{expression.dominant}</span>
        </div>
      </div>

      {/* Main Canvas & Probabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center flex-1">
        {/* Generative Visual Canvas */}
        <div className="lg:col-span-8 relative">
          <canvas
            ref={canvasRef}
            width={640}
            height={360}
            className="w-full h-80 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl block"
          />
          <div className="absolute bottom-3 left-4 pointer-events-none flex items-center space-x-2 text-[10px] uppercase font-mono tracking-wider text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>Interactive Fluid Aura Stream</span>
          </div>
        </div>

        {/* Observable Expression Distribution */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          <span className="text-xs uppercase font-mono text-slate-400 tracking-wider">
            Observable Kinematic Distribution
          </span>

          {Object.entries(probs).map(([label, value]) => (
            <div key={label} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="capitalize font-medium text-slate-300">{label}</span>
                <span className="font-mono text-slate-400">{Math.round(value * 100)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round(value * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-center space-x-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs">
        <ShieldCheck className="w-4 h-4 shrink-0 text-fuchsia-400" />
        <span>
          <strong>Ethical AI Guardrail:</strong> Facial landmark analysis classifies physical muscle
          positions (e.g. smile curvature, brow furrowing). It does <em>not</em> claim to know a
          person's inner thoughts, emotional state, or psychological profile.
        </span>
      </div>
    </div>
  );
};
