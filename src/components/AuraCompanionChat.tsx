import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, ShieldAlert, RefreshCw, Zap } from 'lucide-react';
import { CompanionMessage, SmartSpectraTelemetry } from '../types';

interface AuraCompanionChatProps {
  currentTelemetry: SmartSpectraTelemetry | null;
  sessionDuration: number;
}

export const AuraCompanionChat: React.FC<AuraCompanionChatProps> = ({
  currentTelemetry,
  sessionDuration,
}) => {
  const [messages, setMessages] = useState<CompanionMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content:
        "Hello! I'm Aura Companion. I interpret your contactless optical human-sensing measurements, explain why lighting affects optical signals, guide you through tailored breathing routines, and summarize your session observations. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'gemini',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    'Why is breathing rate calibrating?',
    'How does my camera detect my pulse?',
    'Recommend a calming exercise for right now',
    'Summarize my current readings',
  ];

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: CompanionMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const sessionData = currentTelemetry
        ? {
            pulseRate: currentTelemetry.pulseRate,
            confidence: currentTelemetry.pulseConfidence,
            breathingRate: currentTelemetry.breathingRate,
            hrvSdnn: currentTelemetry.hrvSdnn,
            blinkRate: currentTelemetry.blinkRate,
            signalQuality: currentTelemetry.signalQuality,
            lightingStatus: currentTelemetry.lightingStatus,
            framingStability: currentTelemetry.framingStability,
            dominantExpression: currentTelemetry.facialExpression?.dominant,
            sessionDurationSeconds: sessionDuration,
          }
        : null;

      const conversationHistory = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionData,
          conversationHistory,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const replyMsg: CompanionMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I observed your request. Please let me know how else I can assist your session.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'gemini',
      };
      setMessages((prev) => [...prev, replyMsg]);
    } catch {
      // Local graceful fallback
      const replyMsg: CompanionMessage = {
        id: `assistant-fallback-${Date.now()}`,
        role: 'assistant',
        content:
          "Optical sensing measures microvascular light reflections from facial capillary beds. If your signal confidence drops, check that your frontal lighting is even and remain relatively still. Try our CalmFlow mode for guided relaxation!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'rule-based',
      };
      setMessages((prev) => [...prev, replyMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] glass-panel rounded-2xl border border-cyan-500/20 overflow-hidden text-slate-100">
      {/* Header */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-white text-base">Aura Companion</h3>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono">
                Gemini AI + Rule Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">Context-aware physiological wellness guide</p>
          </div>
        </div>

        {/* Live Context Telemetry Pill */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
          <span className="text-slate-400">Live Context:</span>
          <span className="font-mono text-cyan-300 font-semibold">
            {currentTelemetry?.pulseRate ? `${currentTelemetry.pulseRate} BPM` : 'Baseline'}
          </span>
          <span className="text-slate-600">/</span>
          <span className="font-mono text-purple-300 font-semibold">
            {currentTelemetry?.breathingRate ? `${currentTelemetry.breathingRate} RPM` : 'Syncing'}
          </span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-cyan-600 text-slate-950 font-medium rounded-tr-none'
                  : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none shadow-md'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
              <div
                className={`flex items-center justify-between text-[10px] mt-2 pt-1 border-t ${
                  m.role === 'user' ? 'border-cyan-700/40 text-slate-800' : 'border-slate-800/80 text-slate-500'
                }`}
              >
                <span>{m.timestamp}</span>
                {m.source && (
                  <span className="font-mono capitalize opacity-75">via {m.source}</span>
                )}
              </div>
            </div>

            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-cyan-600 text-slate-950 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-cyan-400 text-xs p-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Aura Companion is analyzing physiological telemetry...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-2.5 bg-slate-950/70 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 ml-1" />
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(q)}
            disabled={isLoading}
            className="shrink-0 text-xs px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-500/40 transition-all text-left whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-slate-900 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Aura Companion about your signals, lighting, or exercises..."
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
          <span className="flex items-center space-x-1">
            <ShieldAlert className="w-3 h-3 text-cyan-500" />
            <span>Informational wellness assistant. Never provides medical diagnosis or prescriptions.</span>
          </span>
          <span className="font-mono">Privacy-safe</span>
        </div>
      </div>
    </div>
  );
};
