import React from 'react';
import { Bot, Sparkles, ShieldCheck } from 'lucide-react';
import { SmartSpectraTelemetry } from '../types';
import { AuraCompanionChat } from '../components/AuraCompanionChat';

interface AICompanionViewProps {
  telemetry: SmartSpectraTelemetry | null;
  sessionDuration: number;
}

export const AICompanionView: React.FC<AICompanionViewProps> = ({
  telemetry,
  sessionDuration,
}) => {
  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Bot className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-black text-white tracking-wide">Aura Companion</h2>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Your personal physiological intelligence companion. Explains optical readings, recommends calming
          routines, and clarifies camera capture parameters.
        </p>
      </div>

      {/* Main Chat Component */}
      <AuraCompanionChat currentTelemetry={telemetry} sessionDuration={sessionDuration} />

      {/* Science & Ethical Boundaries Note */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="flex items-center space-x-2 text-cyan-300 font-semibold">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Responsible AI Guidelines</span>
        </div>
        <p className="leading-relaxed">
          Aura Companion operates under strict safety constraints: it utilizes live session observations
          (pulse rate, breathing frequency, and optical quality) solely to educate and encourage healthy
          wellness habits. It does not store medical records or deliver medical diagnosis or pharmaceutical
          treatment advice.
        </p>
      </div>
    </div>
  );
};
