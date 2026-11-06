/**
 * Session & Settings Local Storage Service
 * Enforces privacy-first on-device persistence with full data deletion controls.
 */

import { AppSettings, SessionSummary } from '../types';

const SETTINGS_KEY = 'aurasense_settings_v1';
const SESSIONS_KEY = 'aurasense_sessions_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  preferredCameraId: '',
  resolution: '720p',
  targetFps: 30,
  audioPulseFeedback: true,
  audioVolume: 0.25,
  mirrorPreview: true,
  showLandmarks: true,
  smartSpectraApiKey: '',
  smartSpectraEndpoint: 'https://api.smartspectra.presagetech.com/v1',
  opticalEngineMode: 'browser_rppg',
  autoSaveSession: true,
  dataRetentionDays: 30,
};

export class StorageService {
  public static getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  }

  public static saveSettings(settings: Partial<AppSettings>): AppSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch {
      // Storage quota or disabled
    }
    return updated;
  }

  public static getSessions(): SessionSummary[] {
    try {
      const stored = localStorage.getItem(SESSIONS_KEY);
      if (stored) {
        const parsed: SessionSummary[] = JSON.parse(stored);
        return parsed.sort((a, b) => b.timestamp - a.timestamp);
      }
    } catch {
      // Storage error
    }
    return [];
  }

  public static saveSession(session: SessionSummary): void {
    try {
      const current = this.getSessions();
      // Keep up to 50 recent sessions locally
      const updated = [session, ...current.filter((s) => s.id !== session.id)].slice(0, 50);
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save session to local storage:', err);
    }
  }

  public static deleteSession(sessionId: string): void {
    try {
      const current = this.getSessions();
      const updated = current.filter((s) => s.id !== sessionId);
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  }

  public static clearAllData(): void {
    try {
      localStorage.removeItem(SESSIONS_KEY);
      localStorage.removeItem(SETTINGS_KEY);
    } catch {
      // Ignore
    }
  }

  public static exportAllDataJSON(): string {
    const data = {
      app: 'AuraSense AI',
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      sessions: this.getSessions(),
    };
    return JSON.stringify(data, null, 2);
  }
}
