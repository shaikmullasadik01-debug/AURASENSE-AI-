# AuraSense AI — The Human Intelligence Experience

> **Your Body Speaks. AI Understands.**  
> A contactless human-sensing interface powered by Presage SmartSpectra and real-time optical vitals intelligence.

---

## 1. Product Vision

AuraSense AI transforms an ordinary smartphone or laptop camera into an intelligent human-sensing interface without requiring any wearable bands or physical contact sensors.

Using **remote photoplethysmography (rPPG)** and the **Presage SmartSpectra framework**, AuraSense captures real-time cardiopulmonary optical fluctuations, interprets human signals responsibly, and responds with personalized, interactive visual and auditory experiences.

---

## 2. Supported Optical Signals & Metrics

AuraSense AI supports 13 optical telemetry data streams:

1. **Pulse / Heart Rate (BPM)**: Captures microscopic dermal hemoglobin absorption in facial capillaries.
2. **Cardiac PPG Waveform**: Real-time 30Hz photoplethysmography curve displaying systolic peak and dicrotic notch.
3. **Heart-Rate Variability (HRV - SDNN)**: Autonomic nervous system balance estimated from inter-beat intervals.
4. **Respiration Rate (RPM)**: Extracted via periodic thoracoabdominal displacement.
5. **Upper & Lower Breathing Waveforms**: Synchronized chest expansion and diaphragmatic motion.
6. **68-Point Facial Landmarks**: Real-time geometric face tracking mesh.
7. **Blink Detection & Frequency**: Eye aspect ratio kinematics and blinks/minute tracking.
8. **Talking / Speech Detection**: Lower jaw and lip displacement kinematics.
9. **Facial Expression Kinematics**: Observable valence classification (`calm`, `focused`, `smiling`, `fatigued`).
10. **Signal Confidence & SNR Score (0-100%)**: Evaluates capture stability, illumination, and contrast.
11. **Lighting & Motion Quality**: Identifies underexposure, overexposure, and movement jitter.
12. **Relative Arterial Pressure Waveform**: Continuous mechanical expansion curve (strictly visual trace, never numerical blood pressure).
13. **Cardiopulmonary Coupling Coherence**: Respiratory Sinus Arrhythmia (RSA) resonance analysis.

---

## 3. Five Signature Adaptive Experiences

- **MODE A — CalmFlow**: Guided paced breathing circle (Resonant 5.5s, Box 4-4-4-4, or 4-7-8) with Web Audio harmonic chimes and live coherence feedback.
- **MODE B — PulseVision**: Interactive radial harmonic sphere pulsating with actual detected pulse and arterial waveform exploration.
- **MODE C — FocusSpace**: Distraction-aware physical environment tracking blink cadence, speech motion, and framing stillness with Pomodoro timer.
- **MODE D — ExpressionCanvas**: Generative fluid particle visual art responding to facial landmark tension and smile valence.
- **MODE E — HumanSync**: Cardiopulmonary resonance visualizer demonstrating the biological coupling between breathing cycles and heart rate.

---

## 4. Aura Companion (AI Wellness Assistant)

Powered by **Gemini 3.8 Flash** via server-side `@google/genai` (with intelligent rule-based offline fallback):
- Explains why ambient lighting and head stillness affect optical signal extraction.
- Explains biological principles (e.g., Respiratory Sinus Arrhythmia, green light capillary absorption).
- Recommends personalized breathing routines based on current session observations.
- **Strict Ethical Guardrails**: Clarifies non-diagnostic nature, never diagnoses illnesses, and never prescribes treatments.

---

## 5. Technology Stack & Architecture

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Web Audio API, HTML5 Canvas 2D.
- **Backend / Proxy**: Node.js 20, Express, `@google/genai` SDK.
- **Desktop Ready**: Optional Electron main and preload architecture with context isolation.
- **Presage SmartSpectra SDK Integration**: Schema-compliant telemetry pipeline with local bridge and diagnostics.
- **Privacy & Storage**: 100% on-device optical processing. No raw video recording or cloud transmission.

---

## 6. Installation & Development

### Prerequisites
- Node.js 20+
- Webcam / camera device

### Commands
```bash
# Install dependencies
npm install

# Start development server (Node.js Express + Vite)
npm run dev

# Run TypeScript linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

---

## 7. Guided 3-Minute Live Demonstration

AuraSense includes an interactive scripted 3-minute guided demonstration (accessible from the header or Welcome page):
- **0:00–0:30**: Introduction to contactless camera sensing.
- **0:30–1:00**: Live camera capture and Presage SmartSpectra setup.
- **1:00–1:45**: Real-time human signals, telemetry cards, and dual phosphor waveforms.
- **1:45–2:30**: Adaptive interactions (CalmFlow & ExpressionCanvas).
- **2:30–3:00**: AI Companion observations, session report, and downloadable PDF/HTML summary.

---

## 8. Privacy & Non-Diagnostic Disclaimer

AuraSense AI is an informational wellness and biofeedback interface. It is **not** an FDA-cleared medical device and should not be used to diagnose, treat, or prevent any cardiovascular, respiratory, or psychiatric condition. All video processing occurs strictly on your local device.
