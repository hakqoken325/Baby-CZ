import React, { useState } from 'react';
import { Language, PassportData } from '../types';
import { translations } from '../translations';
import { sound } from '../audio';

interface PassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  passportData: PassportData;
  onRegenerate: () => void;
  currentSafu: number;
  growthLevel: number;
  levelTitle: string;
  lang: Language;
}

export const PassportModal: React.FC<PassportModalProps> = ({
  isOpen,
  onClose,
  passportData,
  onRegenerate,
  currentSafu,
  growthLevel,
  levelTitle,
  lang,
}) => {
  const [copied, setCopied] = useState(false);
  const t = translations[lang];

  if (!isOpen) return null;

  // Prepare tweet text
  const shareTextZh = `🍼 我为何一小宝贝铸造了专属加密出生证明！\n👶 护照编号: ${passportData.id}\n💬 萌宝第一声: "${passportData.firstWord}"\n⚡ 天生超能力: ${passportData.superpower}\n🛡️ SAFU 能量: ${Math.floor(currentSafu).toLocaleString()} (${levelTitle})\n\n热烈祝贺 @heyibinance 喜得贵子！愿宝宝平安顺遂，SAFU一生！💛🚀\n#BinanceBaby #SAFU #BNB #YiHe`;

  const shareTextEn = `🍼 Just minted the official Baby SAFU Passport for @heyibinance's newborn!\n👶 ID: ${passportData.id}\n💬 First Word: "${passportData.firstWord}"\n⚡ Superpower: ${passportData.superpower}\n🛡️ SAFU Power: ${Math.floor(currentSafu).toLocaleString()} (${levelTitle})\n\nHuge congratulations to Yi He on the new baby! Funds are SAFU, baby is HODLing! 👶💛🚀\n#BinanceBaby #SAFU #BNB #YiHe`;

  const shareTextRu = `🍼 Сгенерировал официальный крипто-паспорт SAFU для малыша Yi He!\n👶 ID: ${passportData.id}\n💬 Первое слово: "${passportData.firstWord}"\n⚡ Суперсила: ${passportData.superpower}\n🛡️ Баланс SAFU: ${Math.floor(currentSafu).toLocaleString()} (${levelTitle})\n\nСердечные поздравления @heyibinance с рождением ребенка! Здоровья и SAFU! 👶💛🚀\n#BinanceBaby #SAFU #BNB #YiHe`;

  const currentTweetText =
    lang === 'zh' ? shareTextZh : lang === 'ru' ? shareTextRu : shareTextEn;

  const handleCopy = () => {
    sound.playCoin();
    navigator.clipboard.writeText(currentTweetText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleShareTwitter = () => {
    sound.playCoin();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      currentTweetText
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#14171E] border-2 border-[#F3BA2F]/70 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(243,186,47,0.25)] text-[#EAECEF] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Holographic Background Watermark Pattern */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#F3BA2F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#2B313A] relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F3BA2F] to-[#B7791F] p-0.5 shadow-lg flex items-center justify-center text-2xl">
              🍼
            </div>
            <div>
              <div className="text-[11px] font-mono tracking-widest text-[#F3BA2F] uppercase font-bold">
                {t.passportTitle}
              </div>
              <h3 className="text-lg font-bold text-white">
                {t.passportSub}
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#202630] hover:bg-[#2B313A] text-[#848E9C] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* The Digital Passport Card */}
        <div className="my-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#1C2029] to-[#12151B] border border-[#F3BA2F]/40 shadow-inner relative z-10">
          {/* Top row: Unique ID & Verified Hologram badge */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] text-[#848E9C] font-mono uppercase block">
                {t.passportUniqueId}
              </span>
              <span className="text-base sm:text-lg font-mono font-black text-[#F3BA2F] tracking-wider">
                {passportData.id}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3BA2F]/15 border border-[#F3BA2F]/40 text-[#F3BA2F] text-xs font-bold font-mono">
              <span>🛡️</span>
              <span>100% SAFU</span>
            </div>
          </div>

          {/* Grid of Passport Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-3.5 text-xs">
            {/* First Word */}
            <div className="p-2.5 rounded-xl bg-[#0B0E14]/60 border border-[#2B313A]">
              <span className="text-[10px] text-[#848E9C] uppercase font-mono block">
                {t.passportFirstWord}
              </span>
              <span className="text-sm font-bold text-white mt-0.5 block text-amber-300">
                "{passportData.firstWord}"
              </span>
            </div>

            {/* Superpower */}
            <div className="p-2.5 rounded-xl bg-[#0B0E14]/60 border border-[#2B313A]">
              <span className="text-[10px] text-[#848E9C] uppercase font-mono block">
                {t.passportSuperpower}
              </span>
              <span className="text-sm font-semibold text-emerald-400 mt-0.5 block">
                {passportData.superpower}
              </span>
            </div>

            {/* Current Growth Level */}
            <div className="p-2.5 rounded-xl bg-[#0B0E14]/60 border border-[#2B313A]">
              <span className="text-[10px] text-[#848E9C] uppercase font-mono block">
                {t.passportRank}
              </span>
              <span className="text-xs font-bold text-white mt-0.5 block truncate">
                Lvl {growthLevel} · {levelTitle}
              </span>
            </div>

            {/* Total Balance */}
            <div className="p-2.5 rounded-xl bg-[#0B0E14]/60 border border-[#2B313A]">
              <span className="text-[10px] text-[#848E9C] uppercase font-mono block">
                {t.passportBalance}
              </span>
              <span className="text-sm font-mono font-bold text-[#F3BA2F] mt-0.5 block">
                🟡 {Math.floor(currentSafu).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Constellation & Cert Authority */}
          <div className="pt-2 text-[11px] text-[#848E9C] space-y-1 border-t border-white/5">
            <div className="flex justify-between">
              <span>{t.passportHoroscope}:</span>
              <span className="font-medium text-slate-300">{passportData.horoscope}</span>
            </div>
            <div className="flex justify-between">
              <span>{t.passportIssuer}:</span>
              <span className="font-mono text-[#F3BA2F] text-[10px]">{t.passportIssuerVal}</span>
            </div>
          </div>
        </div>

        {/* Copy Toast Alert */}
        {copied && (
          <div className="mb-3 p-2.5 bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs rounded-xl flex items-center justify-center gap-2 animate-bounce">
            <span>✅</span>
            <span>{t.copiedSuccess}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Copy For X Button */}
            <button
              onClick={handleCopy}
              className="w-full py-2.5 px-4 rounded-xl bg-[#F3BA2F] hover:bg-[#FCD535] text-[#0B0E14] font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg active:scale-98 cursor-pointer"
            >
              <span>📋</span>
              <span>{t.copyForX}</span>
            </button>

            {/* Direct Tweet Intent Button */}
            <button
              onClick={handleShareTwitter}
              className="w-full py-2.5 px-4 rounded-xl bg-[#000000] hover:bg-neutral-900 border border-neutral-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md active:scale-98 cursor-pointer"
            >
              <span>𝕏</span>
              <span>{t.shareOnX}</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                sound.playClick(1.2);
                onRegenerate();
              }}
              className="text-xs text-[#848E9C] hover:text-[#F3BA2F] flex items-center gap-1.5 transition-colors cursor-pointer py-1"
            >
              <span>🎲</span>
              <span>{t.regeneratePassport}</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="text-xs text-[#848E9C] hover:text-white transition-colors cursor-pointer py-1"
            >
              {t.closeModal}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
