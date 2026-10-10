import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BabyCharacter } from './components/BabyCharacter';
import { UpgradesPanel } from './components/UpgradesPanel';
import { PassportModal } from './components/PassportModal';
import { AirdropFloating } from './components/AirdropFloating';
import {
  translations,
  GROWTH_LEVELS,
  PASSIVE_UPGRADES,
  CLICK_UPGRADES,
  FIRST_WORDS_POOL,
  SUPERPOWERS_POOL,
  HOROSCOPE_POOL,
} from './translations';
import { Language, FloatingParticle, PassportData } from './types';
import { sound } from './audio';

const STORAGE_KEY = 'baby_safu_save_v1';

export default function App() {
  const [lang, setLang] = useState<Language>('zh');
  const [safu, setSafu] = useState<number>(0);
  const [totalSafuEarned, setTotalSafuEarned] = useState<number>(0);
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [frenzyTimer, setFrenzyTimer] = useState<number>(0);
  const [passportOpen, setPassportOpen] = useState<boolean>(false);
  const [isBabyClicked, setIsBabyClicked] = useState<boolean>(false);
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const t = translations[lang];

  // Helper to generate fresh passport data
  const generateNewPassportData = useCallback((targetLang: Language): PassportData => {
    const randomWords = FIRST_WORDS_POOL[targetLang];
    const randomPowers = SUPERPOWERS_POOL[targetLang];
    const randomHoroscopes = HOROSCOPE_POOL[targetLang];

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const firstWord = randomWords[Math.floor(Math.random() * randomWords.length)];
    const superpower = randomPowers[Math.floor(Math.random() * randomPowers.length)];
    const horoscope = randomHoroscopes[Math.floor(Math.random() * randomHoroscopes.length)];

    return {
      id: `#SAFU-${randomNum}`,
      firstWord,
      superpower,
      horoscope,
      issueDate: new Date().toLocaleDateString(),
      verifiedBy: 'Yi He & Binance Community',
      parentBlessing: 'May you HODL with love and wisdom.',
    };
  }, []);

  const [passportData, setPassportData] = useState<PassportData>(() =>
    generateNewPassportData('zh')
  );

  // Load saved state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.safu === 'number') setSafu(parsed.safu);
        if (typeof parsed.totalSafuEarned === 'number')
          setTotalSafuEarned(parsed.totalSafuEarned);
        if (typeof parsed.totalClicks === 'number') setTotalClicks(parsed.totalClicks);
        if (parsed.inventory) setInventory(parsed.inventory);
        if (parsed.lang && ['zh', 'en', 'ru'].includes(parsed.lang)) {
          setLang(parsed.lang);
        }
        if (typeof parsed.isMuted === 'boolean') {
          setIsMuted(parsed.isMuted);
          sound.setMuted(parsed.isMuted);
        }
        if (parsed.passportData) setPassportData(parsed.passportData);
      }
    } catch {
      // ignore JSON parse error
    }
  }, []);

  // Save game periodically
  useEffect(() => {
    const saveTimer = setInterval(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            safu,
            totalSafuEarned,
            totalClicks,
            inventory,
            lang,
            isMuted,
            passportData,
          })
        );
      } catch {}
    }, 5000);
    return () => clearInterval(saveTimer);
  }, [safu, totalSafuEarned, totalClicks, inventory, lang, isMuted, passportData]);

  // Sync language with passport options if regenerated
  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    sound.playClick();
    setPassportData(generateNewPassportData(newLang));
  };

  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
    if (!nextMuted) sound.playClick();
  };

  // Calculate stats
  const basePassiveCps = PASSIVE_UPGRADES.reduce((sum, item) => {
    const count = inventory[item.id] || 0;
    return sum + count * item.cps;
  }, 0);

  const baseClickPower = CLICK_UPGRADES.reduce((sum, item) => {
    const count = inventory[item.id] || 0;
    return sum + count * (item.cpc || 1);
  }, 1);

  const isFrenzy = frenzyTimer > 0;
  const currentCps = isFrenzy ? basePassiveCps * 2 : basePassiveCps;
  const currentCpc = isFrenzy ? baseClickPower * 2 : baseClickPower;

  // Determine current growth level
  let currentLevelIdx = 0;
  for (let i = GROWTH_LEVELS.length - 1; i >= 0; i--) {
    if (totalSafuEarned >= GROWTH_LEVELS[i].requiredTotalSafu) {
      currentLevelIdx = i;
      break;
    }
  }
  const currentGrowthLevel = GROWTH_LEVELS[currentLevelIdx];
  const nextGrowthLevel = GROWTH_LEVELS[currentLevelIdx + 1];

  // Previous level tracker to play celebration sound on level up
  const prevLevelRef = useRef<number>(currentGrowthLevel.level);
  useEffect(() => {
    if (currentGrowthLevel.level > prevLevelRef.current) {
      sound.playLevelUp();
      setToast(
        `🎉 LEVEL UP! ${t[currentGrowthLevel.titleKey]} (${currentGrowthLevel.unlockedItem})`
      );
      setTimeout(() => setToast(null), 4000);
    }
    prevLevelRef.current = currentGrowthLevel.level;
  }, [currentGrowthLevel.level, currentGrowthLevel.titleKey, currentGrowthLevel.unlockedItem, t]);

  // Main game tick loop (every 100ms)
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentCps > 0) {
        const increment = currentCps / 10;
        setSafu((prev) => prev + increment);
        setTotalSafuEarned((prev) => prev + increment);
      }

      setFrenzyTimer((prev) => (prev > 0.1 ? prev - 0.1 : 0));
    }, 100);

    return () => clearInterval(interval);
  }, [currentCps]);

  // Clean up floating particles
  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setTimeout(() => {
      setParticles((prev) => prev.filter((p) => Date.now() - p.id < 1200));
    }, 600);
    return () => clearTimeout(timer);
  }, [particles]);

  // Baby click handler
  const handleBabyClick = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    sound.playClick();
    setIsBabyClicked(true);
    setTimeout(() => setIsBabyClicked(false), 140);

    setSafu((prev) => prev + currentCpc);
    setTotalSafuEarned((prev) => prev + currentCpc);
    setTotalClicks((prev) => prev + 1);

    // Get click coords for particle spawn
    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2;

    if ('clientX' in e && e.clientX) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if ('touches' in e && e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    const emojis = ['🚀', '🍼', '🟡', '💎', '📈', '✨', '👶'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const newParticle: FloatingParticle = {
      id: Date.now() + Math.random(),
      x: clientX + (Math.random() * 40 - 20),
      y: clientY + (Math.random() * 20 - 10),
      value: `+${currentCpc}`,
      emoji: randomEmoji,
    };

    setParticles((prev) => [...prev.slice(-15), newParticle]);
  };

  // Buy upgrade handler
  const handleBuyUpgrade = (
    id: string,
    cost: number,
    _cps: number,
    _cpc?: number
  ) => {
    if (safu < cost) return;
    sound.playBuy();
    setSafu((prev) => prev - cost);
    setInventory((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  // Airdrop claim handler
  const handleClaimAirdrop = () => {
    const bonusPoints = Math.max(50, Math.floor(basePassiveCps * 30) + 20);
    setSafu((prev) => prev + bonusPoints);
    setTotalSafuEarned((prev) => prev + bonusPoints);
    setFrenzyTimer(10); // 10s of 2X Frenzy!

    setToast(
      `🎁 ${t.airdropClaimed} (+${bonusPoints.toLocaleString()} SAFU)`
    );
    setTimeout(() => setToast(null), 4500);
  };

  // Reset progress handler
  const handleResetGame = () => {
    if (window.confirm(t.resetConfirm)) {
      setSafu(0);
      setTotalSafuEarned(0);
      setTotalClicks(0);
      setInventory({});
      setFrenzyTimer(0);
      setPassportData(generateNewPassportData(lang));
      localStorage.removeItem(STORAGE_KEY);
      sound.playCoin();
    }
  };

  // Growth level progress calculation
  let progressPct = 100;
  let remainingSafu = 0;
  if (nextGrowthLevel) {
    const curBase = currentGrowthLevel.requiredTotalSafu;
    const nextTarget = nextGrowthLevel.requiredTotalSafu;
    const earnedInCurrentBracket = Math.max(0, totalSafuEarned - curBase);
    const bracketSpan = nextTarget - curBase;
    progressPct = Math.min(100, Math.max(0, (earnedInCurrentBracket / bracketSpan) * 100));
    remainingSafu = Math.max(0, Math.ceil(nextTarget - totalSafuEarned));
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#EAECEF] flex flex-col selection:bg-[#F3BA2F]/30 selection:text-[#F3BA2F] relative overflow-x-hidden">
      {/* Subtle crypto background grid and ambient lighting */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(rgba(243, 186, 47, 0.15) 1px, transparent 1px), radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px, 20px 20px',
        }}
      />
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-[#F3BA2F]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Airdrop Mystery Box */}
      <AirdropFloating onClaim={handleClaimAirdrop} lang={lang} />

      {/* Floating Click Particles */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {particles.map((p, idx) => (
          <div
            key={p.id}
            style={
              {
                left: `${p.x}px`,
                top: `${p.y}px`,
                '--rx': ((idx % 5) - 2).toString(),
              } as React.CSSProperties
            }
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 font-mono font-black text-sm sm:text-base text-[#F3BA2F] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] animate-[floatParticle_0.9s_ease-out_forwards]"
          >
            <span className="text-base sm:text-lg">{p.emoji}</span>
            <span>{p.value}</span>
          </div>
        ))}
      </div>

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-[90%] px-4 py-3 bg-[#181A20]/95 border-2 border-[#F3BA2F] text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-[0_10px_30px_rgba(243,186,47,0.3)] backdrop-blur-md flex items-center justify-center gap-2 animate-bounce">
          <span>{toast}</span>
        </div>
      )}

      {/* TOP BAR CONTRACT: Zone 1 (Brand) — Zone 2 (Nav links) — Zone 3 (Action) */}
      <header className="sticky top-0 z-40 bg-[#0B0E14]/90 backdrop-blur-md border-b border-[#20252D] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 md:gap-8 max-w-7xl w-full mx-auto">
        {/* Zone 1: Single element brand wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F3BA2F] to-[#D99E10] flex items-center justify-center text-lg shadow-md font-bold text-[#0B0E14]">
            🍼
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap font-display">
            Baby SAFU <span className="text-[#F3BA2F]">Simulator</span>
          </span>
        </div>

        {/* Zone 2: Concise single-line navigation indicators */}
        <div className="hidden lg:flex items-center gap-6 text-xs text-[#848E9C]">
          <span className="whitespace-nowrap flex items-center gap-1.5">
            <span className="text-[#F3BA2F]">👑</span> {t[currentGrowthLevel.titleKey]}
          </span>
          <span className="text-[#2B313A]">·</span>
          <span className="whitespace-nowrap font-mono tabular-nums">
            {t.clickPower}: <strong className="text-white">+{currentCpc}</strong>
          </span>
          <span className="text-[#2B313A]">·</span>
          <span className="whitespace-nowrap font-mono tabular-nums">
            {t.safuPerSec}: <strong className="text-white">+{currentCps.toLocaleString()}</strong>
          </span>
        </div>

        {/* Zone 3: Language switcher, Audio toggle, and Primary CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Switcher Tabs */}
          <div className="flex items-center bg-[#14171E] border border-[#2B313A] rounded-xl p-0.5 text-xs">
            <button
              onClick={() => handleLanguageChange('zh')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                lang === 'zh'
                  ? 'bg-[#F3BA2F] text-[#0B0E14] font-bold shadow-sm'
                  : 'text-[#848E9C] hover:text-white'
              }`}
              title="简体中文"
            >
              中文
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                lang === 'en'
                  ? 'bg-[#F3BA2F] text-[#0B0E14] font-bold shadow-sm'
                  : 'text-[#848E9C] hover:text-white'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => handleLanguageChange('ru')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                lang === 'ru'
                  ? 'bg-[#F3BA2F] text-[#0B0E14] font-bold shadow-sm'
                  : 'text-[#848E9C] hover:text-white'
              }`}
              title="Русский"
            >
              RU
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            aria-label={isMuted ? t.soundOff : t.soundOn}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center text-sm transition-all cursor-pointer ${
              isMuted
                ? 'bg-[#181A20] border-[#2B313A] text-slate-500'
                : 'bg-[#1C2029] border-[#F3BA2F]/40 text-[#F3BA2F]'
            }`}
            title={isMuted ? t.soundOff : t.soundOn}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          {/* Primary Action Button: SAFU Passport */}
          <button
            onClick={() => {
              sound.playCoin();
              setPassportOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#F3BA2F] to-[#E5A81E] hover:from-[#FCD535] hover:to-[#F3BA2F] text-[#0B0E14] font-bold text-xs sm:text-sm tracking-wide shadow-[0_2px_12px_rgba(243,186,47,0.3)] transition-all cursor-pointer whitespace-nowrap active:scale-95 flex items-center gap-1.5"
          >
            <span>📜</span>
            <span className="hidden sm:inline">{t.getPassportBtn}</span>
            <span className="sm:hidden">SAFU ID</span>
          </button>
        </div>
      </header>

      {/* Congratulatory Hero Banner for Yi He */}
      <div className="w-full bg-gradient-to-r from-[#1E1B18] via-[#2A2315] to-[#1E1B18] border-b border-[#F3BA2F]/20 py-2.5 px-4 text-center">
        <p className="text-xs sm:text-sm font-medium text-[#F3BA2F] flex items-center justify-center gap-2">
          <span>{t.congratsBanner}</span>
        </p>
      </div>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Baby Clicker Arena (7 cols) */}
        <section className="lg:col-span-7 flex flex-col items-center justify-start gap-6">
          {/* Main SAFU Metric Card */}
          <div className="w-full bg-[#181A20] border border-[#2B313A] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            {/* Ambient background glow if frenzy */}
            {isFrenzy && (
              <div className="absolute inset-0 bg-amber-500/10 pointer-events-none animate-pulse" />
            )}

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#2B313A] pb-4">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-[#848E9C]">
                  {t.safuPower}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-white tabular-nums drop-shadow-md">
                    {Math.floor(safu).toLocaleString()}
                  </span>
                  <span className="text-base sm:text-xl font-bold text-[#F3BA2F]">
                    BNB
                  </span>
                </div>
              </div>

              {/* Rates badge */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <div className="px-3 py-1.5 rounded-xl bg-[#0B0E14] border border-[#2B313A] flex items-center gap-1.5">
                  <span className="text-[#848E9C]">{t.safuPerSec}:</span>
                  <span className="text-[#0ECB81] font-bold">
                    +{currentCps.toLocaleString()}
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-[#0B0E14] border border-[#2B313A] flex items-center gap-1.5">
                  <span className="text-[#848E9C]">{t.clickPower}:</span>
                  <span className="text-[#F3BA2F] font-bold">
                    +{currentCpc.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Growth Level Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{currentGrowthLevel.badge}</span>
                  <span className="font-bold text-white">
                    {t[currentGrowthLevel.titleKey]}
                  </span>
                </div>
                <span className="text-[#848E9C] font-mono">
                  {nextGrowthLevel
                    ? `${t.nextLevelAt} ${remainingSafu.toLocaleString()} SAFU`
                    : t.maxLevelReached}
                </span>
              </div>

              {/* Progress bar line */}
              <div className="w-full h-3 bg-[#0B0E14] rounded-full overflow-hidden border border-[#2B313A] p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#F3BA2F] via-[#FCD535] to-[#10B981] rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(243,186,47,0.6)]"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <p className="text-xs text-[#848E9C] mt-2 italic">
                "{t[currentGrowthLevel.descKey]}"
              </p>
            </div>
          </div>

          {/* Baby Interaction Arena */}
          <div className="relative w-full py-6 sm:py-10 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[440px]">
            {/* Concentric subtle rings */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-dashed border-[#F3BA2F]/15 pointer-events-none animate-[spin_60s_linear_infinite]" />
            <div className="absolute w-56 h-56 sm:w-76 sm:h-76 rounded-full border border-[#2B313A] pointer-events-none" />

            {/* Interactive Animated Baby */}
            <BabyCharacter
              growthLevel={currentGrowthLevel.level}
              isClicked={isBabyClicked}
              onClick={handleBabyClick}
              frenzyActive={isFrenzy}
            />

            <div className="mt-6 text-center">
              <p className="text-xs sm:text-sm text-[#848E9C] flex items-center justify-center gap-1.5 select-none">
                <span>{t.tapBabyPrompt}</span>
              </p>
              {isFrenzy && (
                <span className="inline-block mt-1 text-xs font-mono font-bold text-amber-400 animate-pulse">
                  {t.frenzyActive} ({Math.ceil(frenzyTimer)}s)
                </span>
              )}
            </div>
          </div>

          {/* Quick Action & Milestone Badges */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              onClick={() => {
                sound.playCoin();
                setPassportOpen(true);
              }}
              className="p-3 rounded-xl bg-[#181A20] border border-[#2B313A] hover:border-[#F3BA2F]/50 transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">🆔</span>
                <span className="text-[10px] font-mono text-[#F3BA2F]">CERTIFIED</span>
              </div>
              <span className="text-xs font-bold text-white mt-1 group-hover:text-[#F3BA2F]">
                {t.getPassportBtn}
              </span>
            </button>

            <div className="p-3 rounded-xl bg-[#181A20] border border-[#2B313A] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-lg">👆</span>
                <span className="text-[10px] font-mono text-[#848E9C]">TOTAL</span>
              </div>
              <span className="text-xs font-bold text-white mt-1">
                {totalClicks.toLocaleString()} {t.click}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#181A20] border border-[#2B313A] flex flex-col justify-between col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-lg">🔒</span>
                <span className="text-[10px] font-mono text-emerald-400">100% SAFU</span>
              </div>
              <span className="text-xs font-bold text-white mt-1">
                CZ Rule #4
              </span>
            </div>
          </div>
        </section>

        {/* Right Column: Upgrades Store & Passive Items (5 cols) */}
        <section className="lg:col-span-5 w-full">
          <UpgradesPanel
            currentSafu={safu}
            inventory={inventory}
            onBuyUpgrade={handleBuyUpgrade}
            lang={lang}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#20252D] py-6 px-4 bg-[#0B0E14] text-center text-xs text-[#848E9C]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5">
            <span>💛</span> {t.communityLove}
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={handleResetGame}
              className="text-red-400 hover:text-red-300 underline cursor-pointer"
            >
              {t.resetGame}
            </button>
            <span>·</span>
            <span>#BinanceBaby #SAFU #BNB</span>
          </div>
        </div>
      </footer>

      {/* SAFU Passport Modal */}
      <PassportModal
        isOpen={passportOpen}
        onClose={() => setPassportOpen(false)}
        passportData={passportData}
        onRegenerate={() => setPassportData(generateNewPassportData(lang))}
        currentSafu={safu}
        growthLevel={currentGrowthLevel.level}
        levelTitle={t[currentGrowthLevel.titleKey]}
        lang={lang}
      />
    </div>
  );
}
