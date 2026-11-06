import React, { useState } from 'react';
import { Wind, Heart, Focus, Palette, Waves, Sparkles } from 'lucide-react';
import { SmartSpectraTelemetry, ExperienceMode } from '../types';
import { CalmFlow } from '../components/experiences/CalmFlow';
import { PulseVision } from '../components/experiences/PulseVision';
import { FocusSpace } from '../components/experiences/FocusSpace';
import { ExpressionCanvas } from '../components/experiences/ExpressionCanvas';
import { HumanSync } from '../components/experiences/HumanSync';

interface AdaptiveExperiencesViewProps {
  telemetry: SmartSpectraTelemetry | null;
  initialMode?: ExperienceMode;
}

export const AdaptiveExperiencesView: React.FC<AdaptiveExperiencesViewProps> = ({
  telemetry,
  initialMode = 'CalmFlow',
}) => {
  const [activeMode, setActiveMode] = useState<ExperienceMode>(initialMode);

  const tabs: { id: ExperienceMode; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'CalmFlow', label: 'A — CalmFlow', icon: <Wind className="w-4 h-4" />, color: 'cyan' },
    { id: 'PulseVision', label: 'B — PulseVision', icon: <Heart className="w-4 h-4" />, color: 'rose' },
    { id: 'FocusSpace', label: 'C — FocusSpace', icon: <Focus className="w-4 h-4" />, color: 'indigo' },
    { id: 'ExpressionCanvas', label: 'D — ExpressionCanvas', icon: <Palette className="w-4 h-4" />, color: 'fuchsia' },
    { id: 'HumanSync', label: 'E — HumanSync', icon: <Waves className="w-4 h-4" />, color: 'purple' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Top Header & Mode Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-2xl font-black text-white tracking-wide">Signature Adaptive Experiences</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time biometric resonance: turning live human signals into interactive audiovisual experiences.
          </p>
        </div>

        {/* Live Signal Status Pill */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Live Telemetry Active:</span>
          <span className="font-mono text-cyan-400 font-bold">
            {telemetry?.pulseRate ? `${telemetry.pulseRate} BPM` : '72 BPM'}
          </span>
        </div>
      </div>

      {/* Mode Navigation Buttons */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveMode(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shadow-sm ${
              activeMode === tab.id
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)]'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Render Active Experience Mode */}
      <div className="mt-4">
        {activeMode === 'CalmFlow' && (
          <CalmFlow
            currentBreathingRate={telemetry?.breathingRate || null}
            currentPulse={telemetry?.pulseRate || null}
            signalConfidence={telemetry?.signalQuality || 85}
          />
        )}

        {activeMode === 'PulseVision' && (
          <PulseVision
            pulseRate={telemetry?.pulseRate || null}
            cardiacWaveform={telemetry?.cardiacWaveform || []}
            relativeArterialWaveform={telemetry?.relativeArterialWaveform || []}
            hrvSdnn={telemetry?.hrvSdnn || null}
            confidence={telemetry?.pulseConfidence || 85}
          />
        )}

        {activeMode === 'FocusSpace' && (
          <FocusSpace
            blinkRate={telemetry?.blinkRate || 14}
            blinkDetected={telemetry?.blinkDetected || false}
            talkingDetected={telemetry?.talkingDetected || false}
            framingStability={telemetry?.framingStability || 'stable'}
          />
        )}

        {activeMode === 'ExpressionCanvas' && (
          <ExpressionCanvas
            expression={
              telemetry?.facialExpression || {
                dominant: 'calm',
                probabilities: { calm: 0.7, focused: 0.15, smiling: 0.08, fatigued: 0.05, neutral: 0.02 },
              }
            }
          />
        )}

        {activeMode === 'HumanSync' && (
          <HumanSync
            pulseRate={telemetry?.pulseRate || null}
            breathingRate={telemetry?.breathingRate || null}
            cardiacWaveform={telemetry?.cardiacWaveform || []}
            breathingWaveform={telemetry?.upperBreathingWaveform || []}
            signalConfidence={telemetry?.signalQuality || 85}
          />
        )}
      </div>
    </div>
  );
};
