import React, { useState, useEffect } from 'react';
import { Play, Pause, X, ChevronRight, Sparkles, CheckCircle2, Video, Activity, Wind, Bot } from 'lucide-react';

interface GuidedDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onStartLiveSession: () => void;
}

interface DemoMilestone {
  timeRange: string;
  startSec: number;
  endSec: number;
  title: string;
  targetTab: string;
  icon: React.ReactNode;
  script: string;
  actionText?: string;
  action?: () => void;
}

export const GuidedDemoModal: React.FC<GuidedDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onStartLiveSession,
}) => {
  const [currentSec, setCurrentSec] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const milestones: DemoMilestone[] = [
    {
      timeRange: '0:00 – 0:30',
      startSec: 0,
      endSec: 30,
      title: 'Introduction & Contactless Sensing Concept',
      targetTab: 'welcome',
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      script:
        "Welcome to AuraSense AI. An ordinary smartphone or computer camera can transform into an intelligent human-sensing interface. Using remote photoplethysmography (rPPG) and spatial facial landmark kinematics, subtle micro-vascular blood pulsations and breathing movements are extracted without any wearable device.",
      actionText: 'View Welcome Tour',
    },
    {
      timeRange: '0:30 – 1:00',
      startSec: 30,
      endSec: 60,
      title: 'Live Camera Capture & SDK Setup',
      targetTab: 'setup',
      icon: <Video className="w-5 h-5 text-purple-400" />,
      script:
        "Informed consent and setup: We request camera access strictly for real-time edge processing. No video is ever recorded or uploaded. Notice the positioning oval, lighting quality detector, and Presage SmartSpectra readiness check.",
      actionText: 'Launch Live Sensing',
      action: onStartLiveSession,
    },
    {
      timeRange: '1:00 – 1:45',
      startSec: 60,
      endSec: 105,
      title: 'Real-Time Human Signals & Waveforms',
      targetTab: 'live',
      icon: <Activity className="w-5 h-5 text-cyan-400" />,
      script:
        "Observing real-time signals: Pulse Rate in BPM, Respiration Rate in RPM, Heart Rate Variability (SDNN), and 68-point facial landmarks. Watch the dual-channel phosphor canvas rendering the systolic arterial pulse wave and respiratory motion.",
      actionText: 'Inspect Live Studio',
    },
    {
      timeRange: '1:45 – 2:30',
      startSec: 105,
      endSec: 150,
      title: 'Adaptive Experiences (CalmFlow & ExpressionCanvas)',
      targetTab: 'experiences',
      icon: <Wind className="w-5 h-5 text-emerald-400" />,
      script:
        "Turning signals into meaningful action: CalmFlow guides paced resonant breathing (5.5s) to synchronize heart rhythms, while ExpressionCanvas transforms kinematic facial features into dynamic generative fluid art.",
      actionText: 'Explore Adaptive Modes',
    },
    {
      timeRange: '2:30 – 3:00',
      startSec: 150,
      endSec: 180,
      title: 'AI Companion Insights & Session Summary',
      targetTab: 'companion',
      icon: <Bot className="w-5 h-5 text-fuchsia-400" />,
      script:
        "Session completion & intelligence: Aura Companion responsibly explains observations, highlights lighting and posture factors, and provides non-diagnostic wellness takeaways with downloadable reports.",
      actionText: 'Talk to Aura Companion',
    },
  ];

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSec((prev) => {
        if (prev >= 180) {
          setIsPlaying(false);
          return 180;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  // Find active milestone
  const currentMilestone =
    milestones.find((m) => currentSec >= m.startSec && currentSec < m.endSec) ||
    milestones[milestones.length - 1];

  const formatSec = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const jumpToMilestone = (m: DemoMilestone) => {
    setCurrentSec(m.startSec);
    onNavigateTab(m.targetTab);
    if (m.action) m.action();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl glass-panel-glow rounded-3xl p-6 border border-cyan-500/40 text-slate-100 shadow-[0_0_60px_rgba(6,182,212,0.15)] animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white tracking-wide">
                AuraSense 3-Minute Live Demo Tour
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[11px] font-mono font-semibold">
                {formatSec(currentSec)} / 3:00
              </span>
            </div>
            <p className="text-xs text-slate-400">Section 15 Guided Product Demonstration Walkthrough</p>
          </div>
        </div>

        {/* Milestone Timeline Bar */}
        <div className="space-y-1.5 my-4">
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${(currentSec / 180) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0:00 Intro</span>
            <span>0:30 Capture</span>
            <span>1:00 Signals</span>
            <span>1:45 Adaptive</span>
            <span>2:30 Insights</span>
            <span>3:00 Complete</span>
          </div>
        </div>

        {/* Active Stage Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 my-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30">
                {currentMilestone.icon}
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                  Stage {milestones.indexOf(currentMilestone) + 1} ({currentMilestone.timeRange})
                </span>
                <h3 className="text-base font-bold text-white">{currentMilestone.title}</h3>
              </div>
            </div>

            <button
              onClick={() => {
                onNavigateTab(currentMilestone.targetTab);
                if (currentMilestone.action) currentMilestone.action();
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md"
            >
              <span>{currentMilestone.actionText || 'Go to Page'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            "{currentMilestone.script}"
          </p>
        </div>

        {/* Stage List Navigator */}
        <div className="grid grid-cols-5 gap-2 my-4">
          {milestones.map((m, idx) => {
            const isPassed = currentSec >= m.endSec;
            const isCurrent = currentMilestone === m;
            return (
              <button
                key={idx}
                onClick={() => jumpToMilestone(m)}
                className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col justify-between h-16 ${
                  isCurrent
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                    : isPassed
                    ? 'bg-slate-900/60 border-emerald-500/40 text-slate-300'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-[9px]">{m.timeRange.split(' ')[0]}</span>
                  {isPassed && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                </div>
                <span className="truncate text-[10px] font-medium leading-tight">
                  {m.title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-all"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Demo' : 'Resume Demo'}</span>
            </button>
            <button
              onClick={() => setCurrentSec(0)}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs"
            >
              Restart
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition-all shadow-md"
          >
            Enter Full Application
          </button>
        </div>
      </div>
    </div>
  );
};
