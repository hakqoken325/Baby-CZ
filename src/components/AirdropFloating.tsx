import React, { useEffect, useState } from 'react';
import { sound } from '../audio';
import { Language } from '../types';
import { translations } from '../translations';

interface AirdropFloatingProps {
  onClaim: () => void;
  lang: Language;
}

export const AirdropFloating: React.FC<AirdropFloatingProps> = ({ onClaim, lang }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [positionY, setPositionY] = useState(25); // percentage from top
  const t = translations[lang];

  useEffect(() => {
    // Spawn airdrop every 35-50 seconds
    const scheduleNextSpawn = () => {
      const delay = (35 + Math.random() * 20) * 1000;
      return setTimeout(() => {
        setPositionY(15 + Math.random() * 55);
        setIsVisible(true);

        // Disappear after 12 seconds if not clicked
        setTimeout(() => {
          setIsVisible(false);
          scheduleNextSpawn();
        }, 12000);
      }, delay);
    };

    const timer = scheduleNextSpawn();
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      style={{ top: `${positionY}%` }}
      onClick={() => {
        sound.playAirdrop();
        setIsVisible(false);
        onClaim();
      }}
      className="fixed z-40 cursor-pointer animate-[airdropFly_12s_linear_forwards] select-none group"
    >
      <div className="relative flex items-center gap-2 p-2.5 pr-4 rounded-2xl bg-gradient-to-r from-[#F3BA2F] via-[#FCD535] to-[#F3BA2F] text-[#0B0E14] shadow-[0_0_25px_rgba(243,186,47,0.8)] border-2 border-white hover:scale-110 active:scale-95 transition-transform duration-150">
        <span className="text-2xl animate-bounce">🎁</span>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-mono font-black tracking-wider text-black/70">
            AIRDROP
          </span>
          <span className="text-xs font-black tracking-wide leading-none">
            {t.airdropClickMe}
          </span>
        </div>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
      </div>
    </div>
  );
};
