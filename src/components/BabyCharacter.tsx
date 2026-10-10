import React, { useState, useEffect } from 'react';

interface BabyCharacterProps {
  growthLevel: number;
  isClicked: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
  frenzyActive: boolean;
}

export const BabyCharacter: React.FC<BabyCharacterProps> = ({
  growthLevel,
  isClicked,
  onClick,
  frenzyActive,
}) => {
  const [blink, setBlink] = useState(false);
  const [wiggleAngle, setWiggleAngle] = useState(0);

  // Periodic blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 3500 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Idle happy baby sway
  useEffect(() => {
    let forward = true;
    const sway = setInterval(() => {
      setWiggleAngle(forward ? 2.5 : -2.5);
      forward = !forward;
    }, 1200);
    return () => clearInterval(sway);
  }, []);

  return (
    <div
      onClick={onClick}
      onTouchStart={onClick}
      role="button"
      tabIndex={0}
      aria-label="Click Baby SAFU"
      className="relative select-none cursor-pointer touch-manipulation group outline-none"
      style={{
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Background Aura / Glow */}
      <div
        className={`absolute inset-0 -m-8 rounded-full blur-3xl transition-all duration-300 pointer-events-none ${
          frenzyActive
            ? 'bg-amber-400/35 scale-125 animate-pulse'
            : growthLevel >= 4
            ? 'bg-[#F3BA2F]/25 scale-110'
            : 'bg-[#F3BA2F]/15 group-hover:bg-[#F3BA2F]/25 scale-100'
        }`}
      />

      {/* Orbiting Golden Coins / Stars for higher levels */}
      {growthLevel >= 3 && (
        <div className="absolute inset-0 pointer-events-none animate-[spin_12s_linear_infinite]">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#F3BA2F] rounded-full border-2 border-white/60 shadow-[0_0_12px_#F3BA2F] flex items-center justify-center text-[10px] font-bold text-slate-900">
            BNB
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-5 h-5 bg-amber-300 rounded-full border border-white/60 shadow-[0_0_10px_#F3BA2F] flex items-center justify-center text-[9px] font-bold text-slate-900">
            ★
          </div>
        </div>
      )}

      {/* Main Character SVG */}
      <div
        className="relative transition-transform duration-150 ease-out"
        style={{
          transform: isClicked
            ? 'scale(0.93) translateY(6px)'
            : `rotate(${wiggleAngle}deg) scale(1)`,
        }}
      >
        <svg
          viewBox="0 0 320 360"
          className="w-56 h-64 sm:w-68 sm:h-76 md:w-80 md:h-88 drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] transition-all"
        >
          <defs>
            {/* Skin Gradient */}
            <radialGradient id="babySkin" cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#FFF2E8" />
              <stop offset="60%" stopColor="#FFE3D1" />
              <stop offset="100%" stopColor="#F6CBB4" />
            </radialGradient>

            {/* BNB Yellow Onesie Gradient */}
            <linearGradient id="bnbYellow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD535" />
              <stop offset="50%" stopColor="#F3BA2F" />
              <stop offset="100%" stopColor="#D99E10" />
            </linearGradient>

            {/* Pure Gold Pacifier Gradient */}
            <linearGradient id="goldShine" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#FFF9C4" />
              <stop offset="40%" stopColor="#FBC02D" />
              <stop offset="100%" stopColor="#D68910" />
            </linearGradient>

            {/* Dark Glasses Gradient for CEO level */}
            <linearGradient id="ceoShades" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E2329" />
              <stop offset="50%" stopColor="#0B0E14" />
              <stop offset="100%" stopColor="#2B313A" />
            </linearGradient>

            {/* Soft Shadow */}
            <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Level 5+ Cape */}
          {growthLevel >= 5 && (
            <path
              d="M 80 180 Q 50 290 80 330 Q 160 350 240 330 Q 270 290 240 180 Z"
              fill="#D97706"
              stroke="#F3BA2F"
              strokeWidth="4"
              opacity="0.9"
            />
          )}

          {/* Baby Onesie / Body */}
          <g id="body">
            {/* Belly / Torso */}
            <ellipse
              cx="160"
              cy="255"
              rx="76"
              ry="65"
              fill="url(#bnbYellow)"
              filter="url(#softShadow)"
            />

            {/* Diaper/Leg folds */}
            <path
              d="M 98 275 Q 160 320 222 275"
              stroke="#D99E10"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />

            {/* Tiny Chubby Feet */}
            <ellipse cx="115" cy="318" rx="22" ry="16" fill="#FFE3D1" stroke="#F6CBB4" strokeWidth="2" />
            <ellipse cx="205" cy="318" rx="22" ry="16" fill="#FFE3D1" stroke="#F6CBB4" strokeWidth="2" />
            {/* Cute Foot Soles */}
            <ellipse cx="115" cy="319" rx="14" ry="10" fill="#FFC9B3" />
            <ellipse cx="205" cy="319" rx="14" ry="10" fill="#FFC9B3" />

            {/* BNB Logo on Chest */}
            <g transform="translate(160, 240) scale(0.68)">
              {/* Binance Diamond Motif */}
              <polygon points="0,-28 14,-14 0,0 -14,-14" fill="#181A20" />
              <polygon points="0,28 14,14 0,0 -14,14" fill="#181A20" />
              <polygon points="-28,0 -14,-14 0,0 -14,14" fill="#181A20" />
              <polygon points="28,0 14,-14 0,0 14,14" fill="#181A20" />
              <polygon points="0,-10 10,0 0,10 -10,0" fill="#FCD535" />
            </g>

            {/* Tiny CEO Tie (Level 4+) */}
            {growthLevel >= 4 && (
              <g transform="translate(160, 202)">
                <polygon points="-8,0 8,0 5,26 0,34 -5,26" fill="#181A20" stroke="#F3BA2F" strokeWidth="1.5" />
                <circle cx="0" cy="2" r="4" fill="#F3BA2F" />
              </g>
            )}

            {/* Tiny Chubby Arms */}
            <path
              d="M 90 220 Q 60 235 75 260 Q 95 255 105 235 Z"
              fill="#FFE3D1"
              stroke="#F6CBB4"
              strokeWidth="2"
            />
            <path
              d="M 230 220 Q 260 235 245 260 Q 225 255 215 235 Z"
              fill="#FFE3D1"
              stroke="#F6CBB4"
              strokeWidth="2"
            />

            {/* Holding Smart Contract Scroll (Level 2+) */}
            {growthLevel === 2 && (
              <g transform="translate(50, 230) rotate(-15)">
                <rect x="0" y="0" width="30" height="42" rx="3" fill="#FFFDF0" stroke="#D99E10" strokeWidth="2" />
                <line x1="6" y1="8" x2="24" y2="8" stroke="#181A20" strokeWidth="2" />
                <line x1="6" y1="16" x2="24" y2="16" stroke="#F3BA2F" strokeWidth="2" />
                <line x1="6" y1="24" x2="18" y2="24" stroke="#181A20" strokeWidth="2" />
                <text x="7" y="36" fontSize="7" fill="#6B7280" fontFamily="monospace">SOL</text>
              </g>
            )}

            {/* Holding Rule #4 Golden Shield (Level 6) */}
            {growthLevel >= 6 && (
              <g transform="translate(42, 210)">
                <polygon points="18,0 36,8 36,32 18,44 0,32 0,8" fill="#F3BA2F" stroke="#FFFFFF" strokeWidth="2" />
                <text x="18" y="28" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#181A20">4</text>
              </g>
            )}
          </g>

          {/* Baby Head */}
          <g id="head">
            {/* Cute Ears */}
            <circle cx="78" cy="138" r="18" fill="#FFE3D1" stroke="#F6CBB4" strokeWidth="2" />
            <circle cx="78" cy="138" r="9" fill="#FFC9B3" />
            <circle cx="242" cy="138" r="18" fill="#FFE3D1" stroke="#F6CBB4" strokeWidth="2" />
            <circle cx="242" cy="138" r="9" fill="#FFC9B3" />

            {/* Chubby Head Base */}
            <ellipse
              cx="160"
              cy="135"
              rx="82"
              ry="74"
              fill="url(#babySkin)"
              filter="url(#softShadow)"
            />

            {/* Rosy Cheeks */}
            <ellipse cx="106" cy="155" rx="15" ry="10" fill="#FF8A80" opacity="0.45" />
            <ellipse cx="214" cy="155" rx="15" ry="10" fill="#FF8A80" opacity="0.45" />

            {/* Baby Hair Tuft with Cute Curl */}
            <path
              d="M 160 62 Q 172 40 185 48 Q 180 62 165 66 Q 148 45 158 35 Q 163 52 160 62"
              fill="#5D4037"
            />

            {/* Eyes */}
            {growthLevel < 4 ? (
              <g id="eyes">
                {blink ? (
                  // Blinking lines
                  <>
                    <path d="M 112 128 Q 126 134 138 128" stroke="#374151" strokeWidth="4" strokeLinecap="round" fill="none" />
                    <path d="M 182 128 Q 194 134 208 128" stroke="#374151" strokeWidth="4" strokeLinecap="round" fill="none" />
                  </>
                ) : (
                  // Sparkly Baby Eyes
                  <>
                    {/* Left Eye */}
                    <ellipse cx="125" cy="126" rx="11" ry="14" fill="#181A20" />
                    <circle cx="122" cy="121" r="4.5" fill="#FFFFFF" />
                    <circle cx="128" cy="131" r="2" fill="#FFFFFF" />
                    {/* Right Eye */}
                    <ellipse cx="195" cy="126" rx="11" ry="14" fill="#181A20" />
                    <circle cx="192" cy="121" r="4.5" fill="#FFFFFF" />
                    <circle cx="198" cy="131" r="2" fill="#FFFFFF" />
                    {/* Cute Eyebrows */}
                    <path d="M 115 106 Q 126 102 136 106" stroke="#8D6E63" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <path d="M 184 106 Q 194 102 205 106" stroke="#8D6E63" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  </>
                )}
              </g>
            ) : (
              // Level 4+ Cool CEO 8-bit / Boss Sunglasses!
              <g id="ceoGlasses" transform="translate(160, 126)">
                {/* Frame */}
                <rect x="-65" y="-14" width="56" height="28" rx="5" fill="url(#ceoShades)" stroke="#F3BA2F" strokeWidth="2.5" />
                <rect x="9" y="-14" width="56" height="28" rx="5" fill="url(#ceoShades)" stroke="#F3BA2F" strokeWidth="2.5" />
                {/* Bridge */}
                <rect x="-10" y="-8" width="20" height="6" fill="#F3BA2F" />
                {/* Glare reflections */}
                <polygon points="-50,-10 -35,-10 -45,10 -60,10" fill="#FFFFFF" opacity="0.35" />
                <polygon points="25,-10 40,-10 30,10 15,10" fill="#FFFFFF" opacity="0.35" />
              </g>
            )}

            {/* Cute Little Baby Nose */}
            <ellipse cx="160" cy="144" rx="3.5" ry="2.5" fill="#E5987A" />

            {/* Golden Pacifier in Mouth (Sucking Animation) */}
            <g
              id="pacifier"
              className="transition-transform duration-300"
              style={{
                transform: `translate(160px, 168px) scale(${isClicked ? 1.08 : 1})`,
              }}
            >
              {/* Pacifier Shield */}
              <ellipse
                cx="0"
                cy="0"
                rx="28"
                ry="20"
                fill="url(#goldShine)"
                stroke="#B7791F"
                strokeWidth="2.5"
                filter="url(#softShadow)"
              />
              {/* Pacifier Knob */}
              <circle cx="0" cy="0" r="10" fill="#FFE082" stroke="#B7791F" strokeWidth="2" />
              {/* Pacifier Ring */}
              <path
                d="M -9 8 Q 0 24 9 8"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Mini BNB Logo on Pacifier */}
              <polygon points="0,-4 3,0 0,4 -3,0" fill="#181A20" />
            </g>

            {/* Level 3+ BNB Validator Crown */}
            {growthLevel >= 3 && (
              <g transform="translate(160, 60)">
                <polygon
                  points="-42,0 -28,-22 -14,-4 0,-28 14,-4 28,-22 42,0"
                  fill="url(#goldShine)"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  filter="url(#softShadow)"
                />
                <circle cx="-28" cy="-22" r="3.5" fill="#60A5FA" />
                <circle cx="0" cy="-28" r="4.5" fill="#34D399" />
                <circle cx="28" cy="-22" r="3.5" fill="#F472B6" />
                {/* Crown Base */}
                <rect x="-44" y="0" width="88" height="8" rx="3" fill="#D97706" />
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* Floating Status Pill over Baby */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#181A20]/90 border border-[#F3BA2F]/40 backdrop-blur-md px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#F3BA2F] animate-ping" />
        <span className="text-xs font-semibold text-[#F3BA2F] tracking-wide">
          {frenzyActive ? '🔥 2X FRENZY' : 'SAFU BABY'}
        </span>
      </div>
    </div>
  );
};
