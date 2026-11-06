import React, { useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Square,
  Activity,
  Wind,
  Heart,
  Volume2,
  VolumeX,
  Eye,
  Smile,
  Timer,
  Zap,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SmartSpectraTelemetry, SessionState, AppSettings } from '../types';
import { WaveformCanvas } from '../components/WaveformCanvas';
import { FaceLandmarkHUD } from '../components/FaceLandmarkHUD';
import { opticalEngine } from '../services/opticalEngine';

interface LiveStudioViewProps {
  telemetry: SmartSpectraTelemetry | null;
  sessionState: SessionState;
  sessionDuration: number;
  settings: AppSettings;
  onUpdateSettings: (s: Partial<AppSettings>) => void;
  onStartSession: (videoEl: HTMLVideoElement) => void;
  onPauseSession: () => void;
  onResumeSession: () => void;
  onStopSession: () => void;
  onNavigateToAdaptive: () => void;
}

export const LiveStudioView: React.FC<LiveStudioViewProps> = ({
  telemetry,
  sessionState,
  sessionDuration,
  settings,
  onUpdateSettings,
  onStartSession,
  onPauseSession,
  onResumeSession,
  onStopSession,
  onNavigateToAdaptive,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-start stream if in idle or setup
  useEffect(() => {
    if (sessionState === 'IDLE' && videoRef.current) {
      onStartSession(videoRef.current);
    }
  }, [sessionState, onStartSession]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isMeasuring = sessionState === 'MEASURING';
  const isCalibrating = sessionState === 'CALIBRATING';
  const isPaused = sessionState === 'PAUSED';

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 space-y-6">
      {/* Top Header Bar & Session Controller */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            {isMeasuring && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white tracking-wide">Live Sensing Studio</h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase ${
                  isMeasuring
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                    : isCalibrating
                    ? 'bg-amber-950 text-amber-300 border border-amber-700'
                    : isPaused
                    ? 'bg-slate-800 text-slate-300'
                    : 'bg-slate-900 text-slate-500'
                }`}
              >
                {sessionState}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Presage SmartSpectra Contactless Photoplethysmography Engine
            </p>
          </div>
        </div>

        {/* Center Timer & Quick Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <Timer className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-white font-bold text-sm">
              {formatTimer(sessionDuration)}
            </span>
          </div>

          {/* Action buttons */}
          {isMeasuring && (
            <button
              onClick={onPauseSession}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          )}

          {isPaused && (
            <button
              onClick={onResumeSession}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold transition-all"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>
          )}

          {(isMeasuring || isPaused || isCalibrating) && (
            <button
              onClick={onStopSession}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Finish Session</span>
            </button>
          )}

          {/* Adaptive Modes Shortcut */}
          <button
            onClick={onNavigateToAdaptive}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Adaptive Mode</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Viewfinder (Left) + Vitals Cards & Waveforms (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Video Viewfinder with HUD */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          <div className="relative aspect-video rounded-3xl overflow-hidden glass-panel border border-cyan-500/30 bg-slate-950 shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${settings.mirrorPreview ? '-scale-x-100' : ''}`}
            />

            {/* Biometric HUD Overlay */}
            <FaceLandmarkHUD
              landmarks={telemetry?.facialLandmarks || []}
              faceDetected={telemetry?.faceDetected ?? true}
              lightingStatus={telemetry?.lightingStatus || 'optimal'}
              framingStability={telemetry?.framingStability || 'stable'}
              showLandmarks={settings.showLandmarks}
              blinkDetected={telemetry?.blinkDetected || false}
              talkingDetected={telemetry?.talkingDetected || false}
              dominantExpression={telemetry?.facialExpression?.dominant || 'calm'}
            />

            {/* Calibration Banner */}
            {isCalibrating && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3 pointer-events-none">
                <div className="w-12 h-12 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
                <h3 className="text-lg font-bold text-white tracking-wide">
                  Calibrating Optical Sensors...
                </h3>
                <p className="text-xs text-slate-300 max-w-xs">
                  Stabilizing microvascular light absorption curves. Please remain steady and look into
                  the camera.
                </p>
                <div className="w-48 h-2 rounded-full bg-slate-800 overflow-hidden mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-200"
                    style={{ width: `${telemetry?.calibrationProgress || 40}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Viewfinder Controls & Toggles */}
          <div className="flex items-center justify-between p-3 rounded-2xl glass-panel border border-slate-800 text-xs">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onUpdateSettings({ showLandmarks: !settings.showLandmarks })}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl transition-all ${
                  settings.showLandmarks
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>68 Landmarks HUD</span>
              </button>

              <button
                onClick={() => {
                  const next = !settings.audioPulseFeedback;
                  onUpdateSettings({ audioPulseFeedback: next });
                  opticalEngine.setAudioFeedback(next);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl transition-all ${
                  settings.audioPulseFeedback
                    ? 'bg-rose-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {settings.audioPulseFeedback ? (
                  <Volume2 className="w-3.5 h-3.5" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
                <span>Pulse Click</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              Framerate: <span className="text-cyan-400 font-semibold">30 FPS</span>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Metrics & Dual Waveforms */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          {/* 4 Metric Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Card 1: Pulse BPM */}
            <div className="p-4 rounded-2xl glass-panel border border-cyan-500/30 flex flex-col justify-between shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                  Pulse Rate
                </span>
                <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                  <Heart className="w-4 h-4 animate-cardiac-pulse" />
                </div>
              </div>
              <div className="my-2">
                <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                  {telemetry?.pulseRate ? telemetry.pulseRate : '--'}
                </span>
                <span className="text-xs font-semibold text-slate-400 ml-1.5">BPM</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                <span>Confidence:</span>
                <span className="font-mono text-cyan-300 font-semibold">
                  {telemetry?.pulseConfidence || 85}%
                </span>
              </div>
            </div>

            {/* Card 2: Breathing RPM */}
            <div className="p-4 rounded-2xl glass-panel border border-purple-500/30 flex flex-col justify-between shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                  Respiration
                </span>
                <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                  <Wind className="w-4 h-4" />
                </div>
              </div>
              <div className="my-2">
                <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                  {telemetry?.breathingRate ? telemetry.breathingRate : '--'}
                </span>
                <span className="text-xs font-semibold text-slate-400 ml-1.5">RPM</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                <span>Confidence:</span>
                <span className="font-mono text-purple-300 font-semibold">
                  {telemetry?.breathingConfidence || 80}%
                </span>
              </div>
            </div>

            {/* Card 3: HRV SDNN */}
            <div className="p-4 rounded-2xl glass-panel border border-emerald-500/25 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                  HRV (SDNN)
                </span>
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="my-1">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-300">
                  {telemetry?.hrvSdnn ? `${telemetry.hrvSdnn} ms` : 'Collecting...'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500">Autonomic variability</span>
            </div>

            {/* Card 4: Signal SNR & Quality */}
            <div className="p-4 rounded-2xl glass-panel border border-blue-500/25 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                  Signal SNR
                </span>
                <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="my-1">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-cyan-300">
                  {telemetry?.signalQuality || 90}%
                </span>
              </div>
              <span className="text-[10px] text-emerald-400">Optimal illumination</span>
            </div>
          </div>

          {/* High-Speed Dual Waveforms Canvas */}
          <WaveformCanvas
            cardiacData={telemetry?.cardiacWaveform || []}
            breathingData={telemetry?.upperBreathingWaveform || []}
            relativeArterialData={telemetry?.relativeArterialWaveform || []}
            pulseBpm={telemetry?.pulseRate || null}
            breathingRpm={telemetry?.breathingRate || null}
            quality={telemetry?.signalQuality || 90}
          />
        </div>
      </div>
    </div>
  );
};
