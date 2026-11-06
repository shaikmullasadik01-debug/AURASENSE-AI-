import React, { useState } from 'react';
import { Activity, Wind, Heart, Sparkles, Download, ArrowRight, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SessionSummary } from '../types';
import { SessionReportModal } from '../components/SessionReportModal';

interface SessionInsightsViewProps {
  lastSession: SessionSummary | null;
  onNavigateToCompanion: () => void;
  onStartNewSession: () => void;
}

export const SessionInsightsView: React.FC<SessionInsightsViewProps> = ({
  lastSession,
  onNavigateToCompanion,
  onStartNewSession,
}) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // If no session completed yet, provide a baseline representative session for preview
  const session: SessionSummary = lastSession || {
    id: 'DEMO-7489',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timestamp: Date.now(),
    durationSeconds: 185,
    avgPulseRate: 71,
    minPulseRate: 64,
    maxPulseRate: 79,
    avgBreathingRate: 14,
    hrvSdnn: 46,
    avgQuality: 92,
    blinkCountTotal: 42,
    wellnessObservation:
      'Heart rate remained calm and stable across the 3-minute capture window. Respiration synchronized harmoniously around 14 breaths per minute with healthy signal signal-to-noise ratio.',
    completedExercises: ['Resonant Flow Paced Breathing (Mode A)', 'PulseVision Waveform Review (Mode B)'],
    waveformSnapshot: {
      cardiac: Array.from({ length: 60 }, (_, i) => Math.sin((i / 60) * Math.PI * 4)),
      breathing: Array.from({ length: 60 }, (_, i) => Math.sin((i / 60) * Math.PI * 2)),
    },
  };

  const formatSec = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-black text-white tracking-wide">Session Intelligence Insights</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Session ID: {session.id} • Completed at {session.date} • Duration {formatSec(session.durationSeconds)}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Generate Official Report</span>
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl glass-panel border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase">Mean Pulse</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white">
            {session.avgPulseRate} <span className="text-xs text-slate-400 font-sans">BPM</span>
          </div>
          <div className="text-[11px] text-cyan-400 font-mono">
            Range: {session.minPulseRate} – {session.maxPulseRate} BPM
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-panel border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase">Respiration</span>
            <Wind className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white">
            {session.avgBreathingRate} <span className="text-xs text-slate-400 font-sans">RPM</span>
          </div>
          <div className="text-[11px] text-purple-300 font-mono">Smooth periodic rhythm</div>
        </div>

        <div className="p-5 rounded-3xl glass-panel border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase">HRV (SDNN)</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white">
            {session.hrvSdnn || 46} <span className="text-xs text-slate-400 font-sans">ms</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">Autonomic balance index</div>
        </div>

        <div className="p-5 rounded-3xl glass-panel border border-blue-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase">Signal SNR</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white">
            {session.avgQuality}%
          </div>
          <div className="text-[11px] text-blue-300 font-mono">High optical clarity</div>
        </div>
      </div>

      {/* Wellness Observation Card */}
      <div className="p-6 rounded-3xl glass-panel border border-cyan-500/20 space-y-4">
        <div className="flex items-center space-x-2 text-cyan-300 font-bold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Session Wellness Synthesis</span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">{session.wellnessObservation}</p>

        {session.completedExercises && session.completedExercises.length > 0 && (
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              Completed Mindful Practices:
            </span>
            <div className="flex flex-wrap gap-2">
              {session.completedExercises.map((ex, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300"
                >
                  {ex}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Next Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <button
          onClick={onNavigateToCompanion}
          className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-sm"
        >
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span>Discuss Observations with Aura Companion</span>
        </button>

        <button
          onClick={onStartNewSession}
          className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-black transition-all shadow-md"
        >
          <span>Start New Live Session</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Downloadable / Printable Report Modal */}
      <SessionReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        session={session}
      />
    </div>
  );
};
