# HealMotion

**AI-Powered Adaptive Rehabilitation with Biomechanical Intelligence**

A web-based physiotherapy system that watches your body, understands your pain, and adapts in real time. It combines clinical joint-angle analysis with an on-device health-context engine to deliver personalized rehab that gets smarter every session.

Built for the CS Girlies Annual Hackathon 2026: Technology for Wellness (Health Track).

## What It Does

HealMotion uses your webcam and browser-based AI (MediaPipe PoseLandmarker) to analyze your body movements during rehabilitation exercises. Unlike basic pose matching, it detects:

1. **Compensation Patterns**: When you lean or shift your weight to avoid using a painful joint, the system recognizes this and adapts. Based on kinetic chain theory (Sahrmann, 2002), when one joint is weak or painful, adjacent joints over-activate.

2. **Movement Quality (Jerk Analysis)**: Measures smoothness of motion as a biomarker for musculoskeletal health (Hogan and Sternad, 2009). Jerky movement indicates pain or muscle weakness.

3. **Fatigue Detection**: Monitors your range of motion across reps. A decline greater than 15% is clinically significant (Enoka and Duchateau, 2008) and triggers automatic workload reduction.

4. **Bilateral Asymmetry**: Compares left vs right side performance. Greater than 10% difference is clinically significant (Impellizzeri et al., 2007).

5. **Real-Time Adaptive Difficulty**: Unlike systems that only adjust at the start, HealMotion adapts during your session. Detecting fatigue reduces remaining reps. Detecting compensation switches to an easier variant. Detecting perfect form suggests harder progression.

6. **Clinical Report Generation**: After each session, generates a structured PDF report with joint ROM measurements, symmetry scores, fatigue curves, and plain-language clinical insights you can bring to your doctor.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18, Material UI 6 | UI framework and component library |
| Pose Detection | MediaPipe Tasks Vision (PoseLandmarker) | Real-time 33-joint pose extraction in browser |
| Biomechanics Engine | Custom JavaScript | Joint angles, velocity, jerk, symmetry, compensation detection |
| AI Coach | OpenRouter API with Anthropic Claude | Personalized exercise recommendations and guidance |
| Data Storage | IndexedDB (idb-keyval) | Local storage, no server |
| Charts | Recharts | Progress visualization and fatigue curves |
| Reports | jsPDF | Clinical PDF report generation |
| Design | Poppins font, custom SVG illustrations | Warm coral/teal/gold palette |

## Features

### Real-Time Pose Detection
Uses MediaPipe PoseLandmarker running entirely in the browser via WebAssembly and GPU acceleration. Extracts 33 body landmarks at video framerate. No video data ever leaves your device.

### Biomechanical Analysis Engine
Computes all major joint angles (elbow, shoulder, hip, knee, ankle) plus trunk lean angle. Calculates movement velocity, acceleration, and jerk (third derivative) for smoothness analysis. Builds a symmetry index comparing bilateral joint angles.

### Compensation Pattern Detection
Monitors for patterns like:
- Trunk lean during shoulder exercises (avoiding painful shoulder)
- Hip hike during knee exercises (compensating for weak quadriceps)
- Weight shift during squats (favoring one leg)

When detected, provides immediate feedback and can switch to an easier exercise variant.

### Adaptive Difficulty System
Three adaptation triggers:
- **Fatigue**: ROM declining over reps triggers rep reduction
- **Compensation**: Persistent compensation triggers exercise switch
- **Excellence**: Consistent good form triggers progression suggestion

Each adaptation includes a plain-language explanation: "I noticed your range of motion decreased on the last few reps, let us reduce to 8 reps today."

### Exercise Library
8 exercises with clinical-grade form rules:
- Shoulder Flexion (beginner)
- Seated Shoulder Flexion (easiest)
- Seated Knee Extension (beginner)
- Bodyweight Squat (intermediate)
- Chair-Assisted Squat (beginner)
- Neck Rotation (beginner)
- Standing Hip Abduction (intermediate)
- Wrist Circles (easiest)

Each exercise defines acceptable joint angle ranges, compensation rules, rep detection state machine, and an easier variant.

### AI Coach
Powered by Anthropic Claude via OpenRouter. Provides:
- Exercise recommendations based on your condition
- Form tips and technique advice
- Pain management guidance
- Recovery planning

### Pain Journal
Track daily pain levels (0 to 10 scale) with notes. Helps identify patterns over time and correlate with exercise sessions.

### Clinical Reports
Exportable PDF and CSV containing:
- Joint ROM measurements in degrees
- Symmetry index (left vs right)
- Fatigue curve (ROM per rep)
- Compensation patterns detected
- Week-over-week improvement trends
- Plain-language clinical insights

### Privacy
All computation happens on-device:
- Pose detection runs in browser via WebAssembly
- Session data stored in IndexedDB (never transmitted)
- Video feed never leaves the browser
- AI chat uses your own API key (stored locally)
- Export and delete your data at any time

## Project Structure

```
healmotion/
├── src/
│   ├── App.js                     # Route configuration
│   ├── index.js                   # Entry point
│   ├── index.css                  # Global styles
│   ├── theme/
│   │   └── theme.js               # MUI theme configuration
│   ├── assets/
│   │   └── SvgArt.jsx             # Inline SVG illustrations and decorations
│   ├── pages/
│   │   ├── Landing.jsx            # Landing page with illustrations
│   │   ├── Login.jsx              # Authentication page
│   │   ├── Dashboard.jsx          # Main dashboard with sidebar navigation
│   │   ├── Session.jsx            # Exercise session with live pose detection
│   │   ├── Chat.jsx               # AI Coach (OpenRouter + Claude)
│   │   └── Report.jsx             # Clinical report with charts and PDF export
│   ├── engine/
│   │   ├── biomechanics.js        # Joint angles, symmetry, jerk, compensation, fatigue
│   │   ├── exercises.js           # Exercise library with form rules
│   │   └── sessionEngine.js       # Rep counter, adaptive difficulty, session manager
│   └── services/
│       ├── poseService.js         # MediaPipe PoseLandmarker integration
│       ├── storageService.js      # IndexedDB local storage
│       └── reportService.js       # PDF report generation
├── public/
│   └── index.html
├── package.json
├── vercel.json
└── README.md
```

## Architecture

```
Browser (React + MediaPipe)

  Layer 1: Pose Extraction
    MediaPipe PoseLandmarker -> 33 joint coordinates per frame
        |
        v
  Layer 2: Biomechanical Analysis Engine
    Joint angle computation (all major joints)
    Movement velocity and acceleration
    Jerk analysis (smoothness of motion)
    Symmetry index (left vs right comparison)
    Compensation pattern detection
        |
        v
  Layer 3: Clinical Intelligence
    Rep counting (state machine per exercise)
    Fatigue detection (ROM decline over reps)
    Form rules (angle thresholds + correction messages)
    Adaptive difficulty (real-time adjustment)
        |
        v
  Layer 4: AI Personalization
    Generates personalized routine from user input
    Interprets biomechanical data into plain language
    Explains adaptations to user
    Clinical report narrative generation
        |
        v
  Layer 5: Privacy and Storage
    All data in IndexedDB (local only)
    No video or pose data ever leaves browser
    Export: PDF report, CSV data
```

## Getting Started

### Prerequisites
- Node.js 18 or later
- A modern browser with WebGL support (Chrome, Edge, Firefox)
- Webcam access

### Installation

```bash
git clone https://github.com/Tasfia-17/healmotion.git
cd healmotion
npm install
```

### Running Locally

```bash
npm start
```

Opens at http://localhost:3000

### Building for Production

```bash
CI=false npm run build
```

The build folder will contain the production-ready static files.

### AI Coach Setup (Optional)

To enable the AI Coach feature:
1. Get a free API key from https://openrouter.ai
2. In the app, go to AI Coach and enter your key
3. The key is stored locally and never transmitted to our servers

## Scientific References

- Sahrmann, S. (2002). Diagnosis and Treatment of Movement Impairment Syndromes. Mosby. Kinetic chain theory for compensation detection.
- Hogan, N. and Sternad, D. (2009). Sensitivity of Smoothness Measures to Movement Duration, Amplitude, and Arrests. Journal of Motor Behavior. Movement smoothness as a validated biomarker.
- Enoka, R.M. and Duchateau, J. (2008). Muscle Fatigue: What, Why and How It Influences Muscle Function. Journal of Physiology. 15% ROM decline threshold for meaningful fatigue.
- Impellizzeri, F.M. et al. (2007). Effect of Plyometric Training on Sand Versus Grass on Muscle Soreness and Jumping and Sprinting Ability in Soccer Players. British Journal of Sports Medicine. 10% bilateral difference as clinically significant asymmetry.
- Ota, M. et al. (2022). Verification of the Validity of MediaPipe for Gait Analysis. Sensors. MediaPipe validated within 2 to 3 degrees accuracy vs marker-based systems.

## Hackathon Track

**Health Track** (Advanced): This project works with real biomechanical health data, implements security measures (all data local, no transmission), and provides clinical-grade analysis accessible through just a webcam.

**Best Use of AI** (Bonus): Claude AI integrated for personalized rehabilitation coaching. Used creatively to interpret biomechanical data into actionable health insights, not just as a chatbot wrapper.

## Design

The warm coral, teal, and gold color palette was chosen to create a welcoming, non-clinical feel for a medical tool. Custom SVG illustrations with gradient fills and anatomical detail reinforce the rehabilitation context without feeling sterile. The design prioritizes clarity and encouragement over clinical coldness.

## License

MIT

## Author

Built by Tasfia for the CS Girlies Annual Hackathon 2026.
