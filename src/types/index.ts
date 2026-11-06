/**
 * AuraSense AI - Core Type Definitions
 * Inspired by Presage SmartSpectra SDK schemas and contactless optical sensing.
 */

export type SessionState =
  | 'IDLE'
  | 'CAMERA_PERMISSION'
  | 'INITIALIZING'
  | 'CALIBRATING'
  | 'MEASURING'
  | 'PAUSED'
  | 'SESSION_COMPLETE'
  | 'ERROR';

export type LightingStatus = 'optimal' | 'low' | 'overexposed' | 'uneven';
export type FramingStability = 'stable' | 'moving' | 'face_lost';

export interface FacialLandmark {
  x: number; // 0 to 1 normalized
  y: number; // 0 to 1 normalized
  id: number;
}

export interface ExpressionClassification {
  dominant: 'calm' | 'focused' | 'smiling' | 'fatigued' | 'neutral';
  probabilities: {
    calm: number;
    focused: number;
    smiling: number;
    fatigued: number;
    neutral: number;
  };
}

export interface SmartSpectraTelemetry {
  timestamp: number;
  pulseRate: number | null; // BPM (e.g. 68)
  pulseConfidence: number; // 0 - 100
  breathingRate: number | null; // Breaths/min (e.g. 14)
  breathingConfidence: number; // 0 - 100
  cardiacWaveform: number[]; // recent 80 samples (-1.0 to 1.0)
  upperBreathingWaveform: number[]; // recent 80 samples
  lowerBreathingWaveform: number[]; // recent 80 samples
  relativeArterialWaveform: number[]; // relative pressure wave (visual only)
  hrvSdnn: number | null; // ms (e.g. 42ms)
  facialLandmarks: FacialLandmark[];
  blinkDetected: boolean;
  blinkRate: number; // blinks per minute
  talkingDetected: boolean;
  facialExpression: ExpressionClassification;
  signalQuality: number; // 0 - 100
  lightingStatus: LightingStatus;
  framingStability: FramingStability;
  faceDetected: boolean;
  calibrationProgress: number; // 0 - 100
}

export interface SessionSummary {
  id: string;
  date: string;
  timestamp: number;
  durationSeconds: number;
  avgPulseRate: number;
  minPulseRate: number;
  maxPulseRate: number;
  avgBreathingRate: number;
  hrvSdnn: number | null;
  avgQuality: number;
  blinkCountTotal: number;
  wellnessObservation: string;
  completedExercises: string[];
  waveformSnapshot: {
    cardiac: number[];
    breathing: number[];
  };
}

export interface CompanionMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: 'gemini' | 'rule-based' | 'system';
}

export type ExperienceMode =
  | 'CalmFlow'
  | 'PulseVision'
  | 'FocusSpace'
  | 'ExpressionCanvas'
  | 'HumanSync';

export interface AppSettings {
  preferredCameraId: string;
  resolution: '720p' | '1080p' | '480p';
  targetFps: 30 | 60;
  audioPulseFeedback: boolean;
  audioVolume: number; // 0 - 1
  mirrorPreview: boolean;
  showLandmarks: boolean;
  smartSpectraApiKey: string;
  smartSpectraEndpoint: string;
  opticalEngineMode: 'browser_rppg' | 'sdk_bridge';
  autoSaveSession: boolean;
  dataRetentionDays: number;
}
