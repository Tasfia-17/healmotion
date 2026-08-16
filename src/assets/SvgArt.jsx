import React from 'react';

// Warm-toned abstract body in motion - hero illustration
export function HeroArt({ width = 400, height = 400 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background warm gradient blob */}
      <ellipse cx="200" cy="200" rx="180" ry="180" fill="url(#warmGlow)" opacity="0.15" />
      {/* Abstract human figure doing stretch */}
      <path d="M200 80 C200 80 195 95 200 110 C205 125 200 130 200 130" stroke="#e1894f" strokeWidth="3" strokeLinecap="round" />
      <circle cx="200" cy="70" r="18" fill="#fde68a" stroke="#e1894f" strokeWidth="2.5" />
      {/* Torso */}
      <path d="M200 130 L200 220" stroke="#e1894f" strokeWidth="3" strokeLinecap="round" />
      {/* Arms reaching up in a stretch pose */}
      <path d="M200 145 C180 130 160 105 145 80" stroke="#f5b88a" strokeWidth="3" strokeLinecap="round" />
      <path d="M200 145 C220 130 240 105 255 80" stroke="#f5b88a" strokeWidth="3" strokeLinecap="round" />
      {/* Fingertips sparkle */}
      <circle cx="143" cy="78" r="4" fill="#fcd34d" opacity="0.8" />
      <circle cx="257" cy="78" r="4" fill="#fcd34d" opacity="0.8" />
      {/* Legs in a lunge */}
      <path d="M200 220 C190 250 170 280 155 320" stroke="#e1894f" strokeWidth="3" strokeLinecap="round" />
      <path d="M200 220 C215 260 235 290 250 320" stroke="#e1894f" strokeWidth="3" strokeLinecap="round" />
      {/* Movement arcs */}
      <path d="M120 150 C100 130 90 110 95 85" stroke="#4a9e8e" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" fill="none" />
      <path d="M280 150 C300 130 310 110 305 85" stroke="#4a9e8e" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" fill="none" />
      {/* Healing pulse rings */}
      <circle cx="200" cy="180" r="40" stroke="#4a9e8e" strokeWidth="1" opacity="0.3" fill="none" />
      <circle cx="200" cy="180" r="60" stroke="#4a9e8e" strokeWidth="0.8" opacity="0.2" fill="none" />
      <circle cx="200" cy="180" r="80" stroke="#4a9e8e" strokeWidth="0.5" opacity="0.1" fill="none" />
      {/* Floating wellness dots */}
      <circle cx="100" cy="250" r="6" fill="#fde68a" opacity="0.6" />
      <circle cx="310" cy="200" r="5" fill="#f5b88a" opacity="0.5" />
      <circle cx="130" cy="320" r="4" fill="#4a9e8e" opacity="0.4" />
      <circle cx="290" cy="310" r="7" fill="#fcd34d" opacity="0.4" />
      <circle cx="80" cy="150" r="3" fill="#e1894f" opacity="0.5" />
      <circle cx="330" cy="130" r="4" fill="#7bcfbd" opacity="0.5" />
      <defs>
        <radialGradient id="warmGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#e1894f" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// Feature icon: AI brain
export function AiBrainArt({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="30" r="24" fill="#fef3c7" stroke="#e1894f" strokeWidth="1.5" />
      <path d="M20 30 C20 22 25 18 30 18 C35 18 40 22 40 30 C40 38 35 42 30 42 C25 42 20 38 20 30Z" stroke="#e1894f" strokeWidth="1.5" fill="none" />
      <circle cx="26" cy="27" r="2" fill="#4a9e8e" />
      <circle cx="34" cy="27" r="2" fill="#4a9e8e" />
      <path d="M25 34 C27 36 33 36 35 34" stroke="#e1894f" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 25 L20 28" stroke="#fcd34d" strokeWidth="1" strokeLinecap="round" />
      <path d="M45 25 L40 28" stroke="#fcd34d" strokeWidth="1" strokeLinecap="round" />
      <path d="M30 12 L30 18" stroke="#fcd34d" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

// Feature icon: Shield/Privacy
export function PrivacyArt({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <path d="M30 8 L48 18 L48 32 C48 42 40 50 30 54 C20 50 12 42 12 32 L12 18 L30 8Z" fill="#e8f5e9" stroke="#4a9e8e" strokeWidth="1.5" />
      <path d="M24 30 L28 34 L36 26" stroke="#4a9e8e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Feature icon: Heartbeat/Health
export function HeartbeatArt({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="30" r="24" fill="#fef3c7" stroke="#e1894f" strokeWidth="1.5" />
      <path d="M12 30 L22 30 L25 22 L30 38 L35 26 L38 30 L48 30" stroke="#e1894f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// Feature icon: Movement/Pose
export function PoseArt({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="30" r="24" fill="#fef9f0" stroke="#f5b88a" strokeWidth="1.5" />
      <circle cx="30" cy="18" r="5" fill="#e1894f" />
      <path d="M30 23 L30 36" stroke="#e1894f" strokeWidth="2" strokeLinecap="round" />
      <path d="M30 28 L22 34" stroke="#e1894f" strokeWidth="2" strokeLinecap="round" />
      <path d="M30 28 L38 22" stroke="#e1894f" strokeWidth="2" strokeLinecap="round" />
      <path d="M30 36 L24 48" stroke="#e1894f" strokeWidth="2" strokeLinecap="round" />
      <path d="M30 36 L36 48" stroke="#e1894f" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Decorative wave for section backgrounds
export function WaveDecoration({ color = '#fef3c7', flip = false }) {
  return (
    <svg
      viewBox="0 0 1440 120"
      style={{ width: '100%', display: 'block', transform: flip ? 'rotate(180deg)' : 'none' }}
      preserveAspectRatio="none"
    >
      <path
        d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,40 1440,60 L1440,120 L0,120 Z"
        fill={color}
      />
    </svg>
  );
}

// Small floating elements for background decoration
export function FloatingDots() {
  return (
    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
      <circle cx="5%" cy="20%" r="4" fill="#fcd34d" opacity="0.3">
        <animate attributeName="cy" values="20%;22%;20%" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="90%" cy="30%" r="6" fill="#f5b88a" opacity="0.25">
        <animate attributeName="cy" values="30%;28%;30%" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="15%" cy="70%" r="5" fill="#4a9e8e" opacity="0.2">
        <animate attributeName="cy" values="70%;72%;70%" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="80%" cy="75%" r="3" fill="#e1894f" opacity="0.3">
        <animate attributeName="cy" values="75%;73%;75%" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="50%" cy="10%" r="4" fill="#fde68a" opacity="0.3">
        <animate attributeName="cy" values="10%;12%;10%" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="35%" cy="85%" r="5" fill="#7bcfbd" opacity="0.2">
        <animate attributeName="cy" values="85%;83%;85%" dur="4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
