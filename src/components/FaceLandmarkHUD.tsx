import React from 'react';
import { FacialLandmark, LightingStatus, FramingStability } from '../types';
import { Sun, AlertTriangle, Eye, Smile } from 'lucide-react';

interface FaceLandmarkHUDProps {
  landmarks: FacialLandmark[];
  faceDetected: boolean;
  lightingStatus: LightingStatus;
  framingStability: FramingStability;
  showLandmarks: boolean;
  blinkDetected: boolean;
  talkingDetected: boolean;
  dominantExpression: string;
}

export const FaceLandmarkHUD: React.FC<FaceLandmarkHUDProps> = ({
  landmarks,
  faceDetected,
  lightingStatus,
  framingStability,
  showLandmarks,
  blinkDetected,
  talkingDetected,
  dominantExpression,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Corner Brackets */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400/70" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400/70" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400/70" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400/70" />

      {/* Central Face Target Oval / Guide */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`w-64 h-80 rounded-[48%] border-2 transition-all duration-300 ${
            faceDetected
              ? framingStability === 'moving'
                ? 'border-amber-400/80 shadow-[0_0_25px_rgba(251,191,36,0.3)]'
                : 'border-cyan-400/70 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
              : 'border-rose-500/60 border-dashed animate-pulse'
          }`}
        >
          {/* Scanning Line Animation */}
          {faceDetected && (
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[pulse_2s_ease-in-out_infinite]" />
          )}
        </div>
      </div>

      {/* Optical rPPG ROI Boxes: Forehead and Cheeks */}
      {faceDetected && (
        <>
          {/* Forehead Vascular Zone ROI */}
          <div className="absolute top-[28%] left-[42%] w-[16%] h-[8%] border border-cyan-400/60 bg-cyan-500/10 rounded flex items-center justify-center">
            <span className="text-[9px] font-mono text-cyan-300 tracking-wider">rPPG ROI 1</span>
          </div>
          {/* Left Cheek Vascular Zone ROI */}
          <div className="absolute top-[48%] left-[36%] w-[10%] h-[9%] border border-cyan-400/50 bg-cyan-500/10 rounded flex items-center justify-center">
            <span className="text-[8px] font-mono text-cyan-300">ROI 2</span>
          </div>
          {/* Right Cheek Vascular Zone ROI */}
          <div className="absolute top-[48%] right-[36%] w-[10%] h-[9%] border border-cyan-400/50 bg-cyan-500/10 rounded flex items-center justify-center">
            <span className="text-[8px] font-mono text-cyan-300">ROI 3</span>
          </div>
        </>
      )}

      {/* 68 Biometric Facial Landmarks (SVG overlay) */}
      {showLandmarks && faceDetected && landmarks && landmarks.length > 0 && (
        <svg className="absolute inset-0 w-full h-full">
          {landmarks.map((pt) => (
            <circle
              key={pt.id}
              cx={`${pt.x * 100}%`}
              cy={`${pt.y * 100}%`}
              r={pt.id >= 36 && pt.id <= 47 ? '2.2' : '1.6'}
              fill={
                pt.id >= 36 && pt.id <= 47
                  ? '#38bdf8' // eyes
                  : pt.id >= 48
                  ? '#c084fc' // lips
                  : '#22d3ee' // jaw/brows
              }
              opacity={0.85}
            />
          ))}
        </svg>
      )}

      {/* Dynamic Status Badges in Top Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {/* Lighting Badge */}
        <div
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md border ${
            lightingStatus === 'optimal'
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
              : lightingStatus === 'low'
              ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
              : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span className="capitalize">{lightingStatus} Light</span>
        </div>

        {/* Framing / Motion Badge */}
        <div
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md border ${
            framingStability === 'stable'
              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
              : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
          }`}
        >
          {framingStability === 'stable' ? (
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5" />
          )}
          <span>{framingStability === 'stable' ? 'Optimal Framing' : 'Keep Still'}</span>
        </div>

        {/* Expression / State */}
        <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md bg-purple-950/80 text-purple-300 border border-purple-500/40">
          <Smile className="w-3.5 h-3.5" />
          <span className="capitalize">{dominantExpression}</span>
        </div>
      </div>

      {/* Bottom Observables: Blink and Talking indicator */}
      <div className="absolute bottom-4 left-6 flex items-center space-x-3 text-xs">
        <div
          className={`flex items-center space-x-1.5 px-2 py-0.5 rounded backdrop-blur-md transition-all ${
            blinkDetected ? 'bg-cyan-500 text-slate-950 font-bold scale-110' : 'bg-slate-900/80 text-slate-400'
          }`}
        >
          <Eye className="w-3 h-3" />
          <span>Blink</span>
        </div>

        <div
          className={`flex items-center space-x-1.5 px-2 py-0.5 rounded backdrop-blur-md transition-all ${
            talkingDetected ? 'bg-purple-500 text-slate-950 font-bold' : 'bg-slate-900/80 text-slate-400'
          }`}
        >
          <span>Speech Motion</span>
        </div>
      </div>
    </div>
  );
};
