import React from 'react';

// Rich anatomical figure doing a stretch with gradient fills and detail
export function HeroIllustration() {
  return (
    <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 480 }}>
      {/* Background warm gradient circle */}
      <circle cx="250" cy="250" r="220" fill="url(#bgGrad)" opacity="0.4" />
      <circle cx="250" cy="250" r="170" fill="url(#bgGrad2)" opacity="0.25" />

      {/* Ground shadow */}
      <ellipse cx="250" cy="430" rx="100" ry="12" fill="#e1894f" opacity="0.1" />

      {/* Human figure - anatomical proportions */}
      {/* Head */}
      <circle cx="250" cy="105" r="28" fill="url(#skinGrad)" stroke="#d4764a" strokeWidth="1.5" />
      {/* Hair */}
      <path d="M225 90 C225 72 275 72 275 90 C275 82 225 82 225 90Z" fill="#5c3d2e" />
      {/* Face details */}
      <circle cx="240" cy="102" r="2.5" fill="#5c3d2e" />
      <circle cx="260" cy="102" r="2.5" fill="#5c3d2e" />
      <path d="M243 115 C247 119 253 119 257 115" stroke="#d4764a" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Neck */}
      <rect x="244" y="130" width="12" height="15" rx="5" fill="url(#skinGrad)" />

      {/* Torso - wearing a sports top */}
      <path d="M220 145 C220 145 230 140 250 140 C270 140 280 145 280 145 L285 220 C285 225 215 225 215 220 Z" fill="url(#topGrad)" stroke="#c7673d" strokeWidth="1" />
      {/* Top neckline */}
      <path d="M232 145 C240 150 260 150 268 145" stroke="#c7673d" strokeWidth="1" fill="none" />

      {/* Arms - left arm raised up (stretch pose) */}
      <path d="M220 155 C205 150 185 130 175 100 C172 92 168 82 165 75" stroke="url(#skinGrad)" strokeWidth="14" strokeLinecap="round" fill="none" />
      {/* Left hand */}
      <circle cx="163" cy="72" r="8" fill="url(#skinGrad)" />
      <path d="M158 68 L156 62" stroke="#d4764a" strokeWidth="2" strokeLinecap="round" />
      <path d="M161 67 L160 61" stroke="#d4764a" strokeWidth="2" strokeLinecap="round" />
      <path d="M164 67 L164 61" stroke="#d4764a" strokeWidth="2" strokeLinecap="round" />
      <path d="M167 68 L168 62" stroke="#d4764a" strokeWidth="2" strokeLinecap="round" />

      {/* Right arm extended out */}
      <path d="M280 155 C295 160 315 175 335 185 C345 190 355 192 360 193" stroke="url(#skinGrad)" strokeWidth="14" strokeLinecap="round" fill="none" />
      {/* Right hand */}
      <circle cx="363" cy="194" r="8" fill="url(#skinGrad)" />

      {/* Leggings */}
      <path d="M225 220 L218 310 L215 380 C215 385 230 385 230 380 L235 310 L240 250" fill="url(#leggingGrad)" stroke="#2d7566" strokeWidth="1" />
      <path d="M255 220 L262 310 L265 380 C265 385 280 385 280 380 L275 310 L270 250" fill="url(#leggingGrad)" stroke="#2d7566" strokeWidth="1" />

      {/* Shoes */}
      <ellipse cx="222" cy="388" rx="18" ry="8" fill="#e1894f" />
      <ellipse cx="272" cy="388" rx="18" ry="8" fill="#e1894f" />

      {/* Motion lines around raised arm */}
      <path d="M140 65 C135 60 130 58 125 60" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" opacity="0.7" fill="none" />
      <path d="M145 50 C140 45 135 44 130 46" stroke="#fcd34d" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" fill="none" />
      <path d="M150 80 C145 78 140 78 135 80" stroke="#fcd34d" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" fill="none" />

      {/* Joint highlight dots (showing the tracking) */}
      <circle cx="175" cy="100" r="6" fill="none" stroke="#4a9e8e" strokeWidth="2" opacity="0.8" />
      <circle cx="175" cy="100" r="3" fill="#4a9e8e" opacity="0.6" />
      <circle cx="220" cy="155" r="6" fill="none" stroke="#4a9e8e" strokeWidth="2" opacity="0.8" />
      <circle cx="220" cy="155" r="3" fill="#4a9e8e" opacity="0.6" />
      <circle cx="250" cy="220" r="6" fill="none" stroke="#4a9e8e" strokeWidth="2" opacity="0.8" />
      <circle cx="335" cy="185" r="6" fill="none" stroke="#4a9e8e" strokeWidth="2" opacity="0.8" />
      <circle cx="335" cy="185" r="3" fill="#4a9e8e" opacity="0.6" />

      {/* AI scan lines connecting joints */}
      <line x1="175" y1="100" x2="220" y2="155" stroke="#4a9e8e" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
      <line x1="220" y1="155" x2="250" y2="220" stroke="#4a9e8e" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
      <line x1="280" y1="155" x2="335" y2="185" stroke="#4a9e8e" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />

      {/* Angle arc indicator at shoulder */}
      <path d="M200 140 A30 30 0 0 1 175 115" stroke="#e1894f" strokeWidth="2" fill="none" opacity="0.7" />
      <text x="185" y="125" fontSize="10" fill="#e1894f" fontWeight="bold">72°</text>

      {/* Floating UI elements - representing the app interface */}
      {/* Symmetry badge */}
      <rect x="340" y="80" width="80" height="30" rx="15" fill="white" stroke="#4a9e8e" strokeWidth="1.5" />
      <text x="355" y="100" fontSize="10" fill="#4a9e8e" fontWeight="bold">Sym: 96%</text>

      {/* Form feedback badge */}
      <rect x="60" y="180" width="90" height="30" rx="15" fill="white" stroke="#e1894f" strokeWidth="1.5" />
      <text x="72" y="200" fontSize="9" fill="#e1894f" fontWeight="bold">✓ Good Form</text>

      {/* Rep counter */}
      <rect x="350" y="280" width="70" height="35" rx="10" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1.5" />
      <text x="365" y="295" fontSize="8" fill="#795030">Reps</text>
      <text x="372" y="310" fontSize="14" fill="#e1894f" fontWeight="bold">5/10</text>

      {/* Decorative particles */}
      <circle cx="100" cy="350" r="5" fill="#fcd34d" opacity="0.4" />
      <circle cx="400" cy="120" r="4" fill="#7bcfbd" opacity="0.4" />
      <circle cx="420" cy="350" r="6" fill="#f5b88a" opacity="0.3" />
      <circle cx="80" cy="120" r="3" fill="#4a9e8e" opacity="0.3" />
      <circle cx="350" cy="400" r="4" fill="#fcd34d" opacity="0.3" />

      <defs>
        <radialGradient id="bgGrad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#fef9f0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bgGrad2" cx="0.5" cy="0.4" r="0.5">
          <stop offset="0%" stopColor="#4a9e8e" stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5c5a3" />
          <stop offset="100%" stopColor="#e8a882" />
        </linearGradient>
        <linearGradient id="topGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e1894f" />
          <stop offset="100%" stopColor="#c7673d" />
        </linearGradient>
        <linearGradient id="leggingGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a9e8e" />
          <stop offset="100%" stopColor="#2d7566" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Feature card illustration: real-time tracking
export function TrackingArt() {
  return (
    <svg viewBox="0 0 120 120" fill="none" style={{ width: '100%', maxWidth: 100 }}>
      <rect x="10" y="10" width="100" height="100" rx="20" fill="#fef9f0" stroke="#f5b88a" strokeWidth="1.5" />
      {/* Stick figure with joints highlighted */}
      <circle cx="60" cy="30" r="8" fill="#f5b88a" />
      <line x1="60" y1="38" x2="60" y2="65" stroke="#e1894f" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="45" x2="45" y2="58" stroke="#e1894f" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="45" x2="75" y2="38" stroke="#e1894f" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="65" x2="48" y2="90" stroke="#e1894f" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="65" x2="72" y2="90" stroke="#e1894f" strokeWidth="3" strokeLinecap="round" />
      {/* Joint dots */}
      <circle cx="60" cy="45" r="4" fill="#4a9e8e" />
      <circle cx="45" cy="58" r="4" fill="#4a9e8e" />
      <circle cx="75" cy="38" r="4" fill="#4a9e8e" />
      <circle cx="60" cy="65" r="4" fill="#4a9e8e" />
      {/* Angle arc */}
      <path d="M52 50 A12 12 0 0 1 60 38" stroke="#fcd34d" strokeWidth="2" fill="none" />
    </svg>
  );
}

// Feature card illustration: brain/AI
export function BrainArt() {
  return (
    <svg viewBox="0 0 120 120" fill="none" style={{ width: '100%', maxWidth: 100 }}>
      <rect x="10" y="10" width="100" height="100" rx="20" fill="#f0faf7" stroke="#7bcfbd" strokeWidth="1.5" />
      {/* Brain shape */}
      <path d="M45 55 C40 45 42 35 50 32 C55 30 60 32 60 35 C60 32 65 30 70 32 C78 35 80 45 75 55 C80 58 82 65 78 72 C75 78 68 80 62 78 C58 80 52 80 48 78 C42 75 40 68 42 62 C38 58 40 55 45 55Z" fill="url(#brainGrad)" stroke="#4a9e8e" strokeWidth="1.5" />
      {/* Neural connections */}
      <circle cx="52" cy="48" r="2.5" fill="#fff" opacity="0.8" />
      <circle cx="68" cy="48" r="2.5" fill="#fff" opacity="0.8" />
      <circle cx="58" cy="62" r="2.5" fill="#fff" opacity="0.8" />
      <circle cx="65" cy="68" r="2" fill="#fff" opacity="0.6" />
      <line x1="52" y1="48" x2="58" y2="62" stroke="#fff" strokeWidth="1" opacity="0.5" />
      <line x1="68" y1="48" x2="58" y2="62" stroke="#fff" strokeWidth="1" opacity="0.5" />
      <line x1="58" y1="62" x2="65" y2="68" stroke="#fff" strokeWidth="1" opacity="0.5" />
      {/* Sparkle */}
      <path d="M85 30 L87 25 L89 30 L94 32 L89 34 L87 39 L85 34 L80 32 Z" fill="#fcd34d" />
      <defs>
        <linearGradient id="brainGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4a9e8e" />
          <stop offset="100%" stopColor="#2d7566" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Feature card: shield/privacy
export function ShieldArt() {
  return (
    <svg viewBox="0 0 120 120" fill="none" style={{ width: '100%', maxWidth: 100 }}>
      <rect x="10" y="10" width="100" height="100" rx="20" fill="#fef9f0" stroke="#f5b88a" strokeWidth="1.5" />
      <path d="M60 25 L85 38 L85 58 C85 75 73 87 60 92 C47 87 35 75 35 58 L35 38 Z" fill="url(#shieldGrad)" stroke="#4a9e8e" strokeWidth="2" />
      <path d="M50 58 L56 64 L72 48" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a9e8e" />
          <stop offset="100%" stopColor="#2d7566" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Feature card: chart/progress
export function ChartArt() {
  return (
    <svg viewBox="0 0 120 120" fill="none" style={{ width: '100%', maxWidth: 100 }}>
      <rect x="10" y="10" width="100" height="100" rx="20" fill="#fef9f0" stroke="#f5b88a" strokeWidth="1.5" />
      {/* Chart lines */}
      <line x1="30" y1="85" x2="90" y2="85" stroke="#ccc" strokeWidth="1" />
      <line x1="30" y1="85" x2="30" y2="30" stroke="#ccc" strokeWidth="1" />
      {/* Upward trend line */}
      <path d="M35 75 L50 65 L60 55 L72 42 L85 35" stroke="#e1894f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Dots on line */}
      <circle cx="35" cy="75" r="3" fill="#e1894f" />
      <circle cx="50" cy="65" r="3" fill="#e1894f" />
      <circle cx="60" cy="55" r="3" fill="#e1894f" />
      <circle cx="72" cy="42" r="3" fill="#e1894f" />
      <circle cx="85" cy="35" r="4" fill="#e1894f" stroke="#fcd34d" strokeWidth="2" />
      {/* Area fill */}
      <path d="M35 75 L50 65 L60 55 L72 42 L85 35 L85 85 L35 85 Z" fill="#e1894f" opacity="0.08" />
    </svg>
  );
}

// Decorative background wave
export function WaveBg({ color = '#fef3c7', flip = false }) {
  return (
    <svg viewBox="0 0 1440 100" style={{ width: '100%', display: 'block', transform: flip ? 'scaleY(-1)' : 'none' }} preserveAspectRatio="none">
      <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,10 1440,50 L1440,100 L0,100 Z" fill={color} />
    </svg>
  );
}
