import React from 'react';
import { X, Download, ShieldCheck, Heart, Wind, Activity, Sparkles, Printer } from 'lucide-react';
import { SessionSummary } from '../types';

interface SessionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: SessionSummary | null;
}

export const SessionReportModal: React.FC<SessionReportModalProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  if (!isOpen || !session) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(session, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `aurasense_report_${session.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const formatSec = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel-glow rounded-3xl p-6 sm:p-8 border border-cyan-500/40 text-slate-100 shadow-[0_0_80px_rgba(6,182,212,0.15)] my-8">
        {/* Header Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                AuraSense Biometric Session Report
              </h2>
              <span className="text-xs font-mono text-slate-400">
                Session ID: {session.id} • {session.date}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all text-xs flex items-center space-x-1.5"
              title="Print Report"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition-all text-xs flex items-center space-x-1.5"
              title="Export JSON"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Report Content for print / review */}
        <div className="space-y-6 my-6 text-sm">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] uppercase tracking-wider font-mono text-slate-400">
                Session Duration
              </span>
              <div className="text-xl font-bold font-mono text-white mt-1">
                {formatSec(session.durationSeconds)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30">
              <span className="text-[11px] uppercase tracking-wider font-mono text-slate-400 flex items-center space-x-1">
                <Heart className="w-3 h-3 text-rose-400" />
                <span>Mean Pulse</span>
              </span>
              <div className="text-2xl font-black font-mono text-cyan-300 mt-1">
                {session.avgPulseRate ? `${session.avgPulseRate} BPM` : 'N/A'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Range: {session.minPulseRate}-{session.maxPulseRate} BPM
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30">
              <span className="text-[11px] uppercase tracking-wider font-mono text-slate-400 flex items-center space-x-1">
                <Wind className="w-3 h-3 text-purple-400" />
                <span>Respiration</span>
              </span>
              <div className="text-2xl font-black font-mono text-purple-300 mt-1">
                {session.avgBreathingRate ? `${session.avgBreathingRate} RPM` : 'N/A'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Diaphragmatic rhythm</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30">
              <span className="text-[11px] uppercase tracking-wider font-mono text-slate-400 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>HRV (SDNN)</span>
              </span>
              <div className="text-2xl font-black font-mono text-emerald-300 mt-1">
                {session.hrvSdnn ? `${session.hrvSdnn} ms` : 'Stabilizing'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Autonomic index</div>
            </div>
          </div>

          {/* Optical Quality & SNR */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Mean Optical Signal Quality (SNR)</span>
              <div className="text-lg font-bold font-mono text-white mt-0.5">
                {session.avgQuality}% Quality Index
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Total Eye Blinks Logged</span>
              <div className="text-lg font-bold font-mono text-cyan-300 mt-0.5">
                {session.blinkCountTotal} blinks
              </div>
            </div>
          </div>

          {/* Waveform Visual Snapshot Preview */}
          {session.waveformSnapshot?.cardiac && session.waveformSnapshot.cardiac.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                Captured Cardiac PPG Waveform Sample
              </span>
              <div className="h-20 w-full flex items-center">
                <svg className="w-full h-full overflow-visible">
                  <polyline
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    points={session.waveformSnapshot.cardiac
                      .map((val, idx) => {
                        const x = (idx / (session.waveformSnapshot.cardiac.length - 1)) * 680;
                        const y = 40 - val * 30;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Personal Wellness Takeaways */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 space-y-2">
            <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Aura Wellness Observations</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {session.wellnessObservation}
            </p>
          </div>

          {/* Non-Diagnostic Disclaimer */}
          <div className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong>Informational Wellness Report:</strong> This document was produced via
              contactless optical photoplethysmography by AuraSense AI. It is intended solely for
              personal lifestyle, wellness, and breathing pacing exploration. It is not an FDA-cleared
              diagnostic test, ECG, or clinical medical evaluation.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
