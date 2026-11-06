import React, { useState, useEffect } from 'react';
import { History, Trash2, Download, FileText, Activity, Wind, Heart, Sparkles, AlertTriangle } from 'lucide-react';
import { SessionSummary } from '../types';
import { StorageService } from '../services/storageService';
import { SessionReportModal } from '../components/SessionReportModal';

interface HistoryViewProps {
  onSelectSession: (s: SessionSummary) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onSelectSession }) => {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [selectedSessionForModal, setSelectedSessionForModal] = useState<SessionSummary | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const list = StorageService.getSessions();
    setSessions(list);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    StorageService.deleteSession(id);
    loadSessions();
  };

  const handleClearAll = () => {
    StorageService.clearAllData();
    setShowClearConfirm(false);
    loadSessions();
  };

  const formatSec = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-black text-white tracking-wide">Session History & Trends</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Locally stored physiological capture records. All data remains strictly within your browser.
          </p>
        </div>

        {sessions.length > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800 text-xs transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All History</span>
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div className="p-4 rounded-2xl bg-rose-950/90 border border-rose-500/50 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center space-x-3 text-xs text-rose-200">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>Are you sure you want to permanently erase all locally stored session records?</span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleClearAll}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all"
            >
              Yes, Delete Everything
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Session List */}
      {sessions.length === 0 ? (
        <div className="p-12 rounded-3xl glass-panel border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto text-slate-500">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Captured Sessions Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            When you complete a live optical sensing session in the Live Studio, your non-diagnostic
            metrics summary will automatically be archived here for trend review.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelectedSessionForModal(s)}
              className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-cyan-400 text-xs font-semibold">
                    {s.id}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300 text-xs">{s.date}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400 text-xs font-mono">{formatSec(s.durationSeconds)}</span>
                </div>
                <p className="text-xs text-slate-400 max-w-lg truncate">{s.wellnessObservation}</p>
              </div>

              {/* Metrics Pills */}
              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span className="font-mono text-white font-bold">{s.avgPulseRate} BPM</span>
                </div>

                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <Wind className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-mono text-white font-bold">{s.avgBreathingRate} RPM</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSessionForModal(s);
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                  title="View Full Report"
                >
                  <FileText className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => handleDelete(s.id, e)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-all"
                  title="Delete Session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Modal */}
      <SessionReportModal
        isOpen={Boolean(selectedSessionForModal)}
        onClose={() => setSelectedSessionForModal(null)}
        session={selectedSessionForModal}
      />
    </div>
  );
};
