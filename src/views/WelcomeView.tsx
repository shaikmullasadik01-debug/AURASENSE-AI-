import React from 'react';
import { Sparkles, Shield, Video, Activity, Wind, Bot, ArrowRight, Play, CheckCircle2, Cpu } from 'lucide-react';

interface WelcomeViewProps {
  onStartExperience: () => void;
  onLaunchDemo: () => void;
  onOpenSetup: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onStartExperience,
  onLaunchDemo,
  onOpenSetup,
}) => {
  return (
    <div className="flex flex-col space-y-12 max-w-6xl mx-auto py-6 px-4">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden glass-panel-glow border border-cyan-500/30 p-8 sm:p-12 text-center flex flex-col items-center">
        {/* Ambient background glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Tag */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold tracking-wide uppercase mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Contactless Human-Sensing Intelligence</span>
        </div>

        {/* Brand Headline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-3xl leading-tight">
          Your Body Speaks. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
            AI Understands.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          Transform your standard smartphone or laptop camera into an intelligent, contactless human-sensing
          interface. Powered by remote photoplethysmography (rPPG) and the Presage SmartSpectra framework.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onStartExperience}
            className="flex items-center space-x-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            <span>Start Live Sensing</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onLaunchDemo}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 font-bold text-sm shadow-md transition-all hover:border-cyan-400"
          >
            <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            <span>Launch 3-Min Guided Tour</span>
          </button>

          <button
            onClick={onOpenSetup}
            className="px-5 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border border-slate-700 text-sm font-medium transition-all"
          >
            Camera & Setup
          </button>
        </div>

        {/* Privacy Pill */}
        <div className="mt-8 flex items-center space-x-2 text-xs text-slate-400 bg-slate-900/70 px-4 py-2 rounded-full border border-slate-800">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>100% On-Device Optical Processing • No Raw Video Recording or Storage</span>
        </div>
      </div>

      {/* Feature Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-panel border border-cyan-500/20 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Contactless Pulse & Cardiac Wave</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Detects microscopic skin color shifts in facial capillaries caused by each heartbeat. Delivers
              real-time BPM, systolic waveforms, and heart-rate variability (SDNN).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center text-[11px] font-mono text-cyan-400">
            <span>Precision Optical rPPG</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-purple-500/20 hover:border-purple-500/40 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Wind className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Optical Respiratory Kinematics</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tracks micrometric thoracoabdominal displacement to compute respiration rate (RPM), upper chest
              expansion curves, and cardiorespiratory resonance.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center text-[11px] font-mono text-purple-400">
            <span>Thoracic Optical Motion Flow</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Aura AI Wellness Companion</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Conversational Gemini-powered AI that responsibly explains observations, highlights lighting and
              positioning factors, and guides tailored relaxation routines.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center text-[11px] font-mono text-emerald-400">
            <span>Empathetic Intelligence</span>
          </div>
        </div>
      </div>

      {/* 5 Adaptive Modes Overview */}
      <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-white">Five Signature Adaptive Experiences</h3>
            <p className="text-xs text-slate-400">
              AuraSense transforms raw biometric telemetry into responsive, interactive human experiences.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800">
            Zero-Wearable Technology
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { mode: 'A', name: 'CalmFlow', desc: 'Guided paced breathing with resonant 5.5s circle & audio cues' },
            { mode: 'B', name: 'PulseVision', desc: 'Interactive radial harmonic cardiac visualizer & arterial trace' },
            { mode: 'C', name: 'FocusSpace', desc: 'Distraction-aware physical stillness & blink observation' },
            { mode: 'D', name: 'ExpressionCanvas', desc: 'Generative fluid art driven by facial kinematics' },
            { mode: 'E', name: 'HumanSync', desc: 'Cardiopulmonary coupling & Respiratory Sinus Arrhythmia' },
          ].map((item) => (
            <div key={item.mode} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono text-cyan-400 font-bold">MODE {item.mode}</span>
              <h4 className="text-sm font-bold text-white">{item.name}</h4>
              <p className="text-[11px] text-slate-400 leading-normal">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trust & Architecture Statement */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>
            Integrated with <strong>Presage SmartSpectra v2.4.1</strong> SDK specifications and browser-edge WebAssembly rPPG.
          </span>
        </div>
        <span className="hidden sm:inline font-mono text-[11px] text-slate-500">
          Strict non-diagnostic informational wellness tool
        </span>
      </div>
    </div>
  );
};
