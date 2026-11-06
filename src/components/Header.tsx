import React from 'react';
import {
  Sparkles,
  Activity,
  Wind,
  Bot,
  Sliders,
  History,
  Play,
  Volume2,
  VolumeX,
  Shield,
  Layers,
} from 'lucide-react';
import { SessionState } from '../types';

export type NavTab =
  | 'welcome'
  | 'setup'
  | 'live'
  | 'experiences'
  | 'companion'
  | 'insights'
  | 'history'
  | 'settings';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  sessionState: SessionState;
  onLaunchDemo: () => void;
  audioFeedbackEnabled: boolean;
  onToggleAudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  sessionState,
  onLaunchDemo,
  audioFeedbackEnabled,
  onToggleAudio,
}) => {
  const isLive = sessionState === 'MEASURING';
  const isCalib = sessionState === 'CALIBRATING';

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'welcome', label: 'Welcome', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'setup', label: 'Consent & Setup', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'live', label: 'Live Studio', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'experiences', label: 'Adaptive Modes', icon: <Wind className="w-3.5 h-3.5" /> },
    { id: 'companion', label: 'Aura Companion', icon: <Bot className="w-3.5 h-3.5" /> },
    { id: 'insights', label: 'Insights & Report', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'history', label: 'History', icon: <History className="w-3.5 h-3.5" /> },
    { id: 'settings', label: 'Settings', icon: <Sliders className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-6 py-3 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div
          onClick={() => onSelectTab('welcome')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-all">
              <Activity className="w-5 h-5 text-white animate-pulse" />
            </div>
            {isLive && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-white text-base tracking-tight font-sans">
                AuraSense<span className="text-cyan-400"> AI</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-800">
                Presage SmartSpectra
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider hidden sm:block">
              Your Body Speaks. AI Understands.
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop & Tablet) */}
        <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/70 p-1 rounded-2xl border border-slate-800">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Quick Actions */}
        <div className="flex items-center space-x-2.5">
          {/* Audio Chime Toggle */}
          <button
            onClick={onToggleAudio}
            className={`p-2 rounded-xl text-xs transition-all ${
              audioFeedbackEnabled
                ? 'bg-purple-950/80 text-purple-300 border border-purple-800'
                : 'bg-slate-900 text-slate-500 hover:text-slate-300'
            }`}
            title={audioFeedbackEnabled ? 'Audio pulse enabled' : 'Audio pulse muted'}
          >
            {audioFeedbackEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* 3-Minute Demo Launcher Button */}
          <button
            onClick={onLaunchDemo}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span className="hidden sm:inline">3-Min Live Demo</span>
            <span className="sm:hidden">Demo</span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Navigation Tabs */}
      <div className="flex lg:hidden items-center space-x-1 overflow-x-auto pt-2 pb-1 scrollbar-none">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
