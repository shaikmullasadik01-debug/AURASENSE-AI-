import React, { useState, useEffect } from 'react';
import { Focus, Eye, Mic, ShieldAlert, Timer, Play, Pause, RotateCcw } from 'lucide-react';
import { FramingStability } from '../../types';

interface FocusSpaceProps {
  blinkRate: number;
  blinkDetected: boolean;
  talkingDetected: boolean;
  framingStability: FramingStability;
}

export const FocusSpace: React.FC<FocusSpaceProps> = ({
  blinkRate,
  blinkDetected,
  talkingDetected,
  framingStability,
}) => {
  const [isFocusSessionActive, setIsFocusSessionActive] = useState<boolean>(false);
  const [focusSeconds, setFocusSeconds] = useState<number>(25 * 60); // 25 min default
  const [remainingSeconds, setRemainingSeconds] = useState<number>(25 * 60);
  const [talkingEventsCount, setTalkingEventsCount] = useState<number>(0);
  const [totalBlinksCount, setTotalBlinksCount] = useState<number>(0);

  // Focus timer
  useEffect(() => {
    if (!isFocusSessionActive) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsFocusSessionActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFocusSessionActive]);

  // Track observable events
  useEffect(() => {
    if (talkingDetected && isFocusSessionActive) {
      setTalkingEventsCount((c) => c + 1);
    }
  }, [talkingDetected, isFocusSessionActive]);

  useEffect(() => {
    if (blinkDetected && isFocusSessionActive) {
      setTotalBlinksCount((b) => b + 1);
    }
  }, [blinkDetected, isFocusSessionActive]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Observable Physical Stillness Index (based strictly on mechanical optical motion)
  const stillnessScore = framingStability === 'stable' ? 94 : 68;

  return (
    <div className="flex flex-col min-h-[520px] p-6 glass-panel rounded-2xl border border-cyan-500/20 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Focus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">MODE C — FocusSpace</h3>
            <p className="text-xs text-slate-400">
              Distraction-aware physical environment using observable kinematics & speech motion
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setRemainingSeconds(25 * 60);
              setFocusSeconds(25 * 60);
            }}
            className={`px-3 py-1 rounded-xl text-xs ${
              focusSeconds === 25 * 60 ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
            }`}
          >
            25m Pomodoro
          </button>
          <button
            onClick={() => {
              setRemainingSeconds(50 * 60);
              setFocusSeconds(50 * 60);
            }}
            className={`px-3 py-1 rounded-xl text-xs ${
              focusSeconds === 50 * 60 ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
            }`}
          >
            50m Deep Block
          </button>
        </div>
      </div>

      {/* Main Focus Zone */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center flex-1">
        {/* Timer Orb */}
        <div className="md:col-span-6 flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950/80 border-2 border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
            <Timer className="w-6 h-6 text-indigo-400 mb-1" />
            <span className="text-4xl font-extrabold font-mono text-white tracking-widest">
              {formatTimer(remainingSeconds)}
            </span>
            <span className="text-xs uppercase tracking-wider text-slate-400 mt-2 font-mono">
              {isFocusSessionActive ? 'Active Focus Sprint' : 'Sprint Ready'}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3 mt-6">
            <button
              onClick={() => setIsFocusSessionActive(!isFocusSessionActive)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              {isFocusSessionActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isFocusSessionActive ? 'Pause Session' : 'Start Focus Session'}</span>
            </button>
            <button
              onClick={() => {
                setIsFocusSessionActive(false);
                setRemainingSeconds(focusSeconds);
                setTalkingEventsCount(0);
                setTotalBlinksCount(0);
              }}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-all"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Observable Signals Telemetry */}
        <div className="md:col-span-6 flex flex-col space-y-4">
          <h4 className="text-sm font-semibold text-slate-200">Observable Physical Indicators</h4>

          {/* Blink Rate Monitor */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400">Current Blink Rate</span>
                <div className="text-xl font-bold font-mono text-cyan-300">
                  {blinkRate} <span className="text-xs text-slate-400 font-normal">blinks/min</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Session Blinks</span>
              <span className="font-mono text-slate-200 text-sm font-semibold">{totalBlinksCount}</span>
            </div>
          </div>

          {/* Talking / Speech Motion Detector */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2.5 rounded-lg transition-all ${
                  talkingDetected ? 'bg-amber-500/30 text-amber-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400">Jaw Kinematics / Speech</span>
                <div className="text-sm font-semibold text-slate-200">
                  {talkingDetected ? 'Speech Motion Active' : 'Silent Workspace'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Speech Events</span>
              <span className="font-mono text-slate-200 text-sm font-semibold">{talkingEventsCount}</span>
            </div>
          </div>

          {/* Physical Stillness Score */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Posture & Framing Stillness</span>
              <div className="text-xl font-bold font-mono text-emerald-400">{stillnessScore}%</div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                framingStability === 'stable'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}
            >
              {framingStability === 'stable' ? 'Stable Posture' : 'Movement Detected'}
            </span>
          </div>
        </div>
      </div>

      {/* Strict Ethical AI Disclaimer */}
      <div className="flex items-center space-x-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs">
        <ShieldAlert className="w-4 h-4 shrink-0 text-cyan-400" />
        <span>
          <strong>Ethical AI Guardrail:</strong> AuraSense tracks observable physical motion (eye
          blinks, head framing stability, and jaw movement). It does <em>not</em> claim to measure
          mental productivity, inner attention, or intelligence from facial images.
        </span>
      </div>
    </div>
  );
};
