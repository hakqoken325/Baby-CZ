import React, { useState } from 'react';
import { PASSIVE_UPGRADES, CLICK_UPGRADES } from '../translations';
import { Language } from '../types';
import { translations } from '../translations';
import { sound } from '../audio';

interface UpgradesPanelProps {
  currentSafu: number;
  inventory: Record<string, number>;
  onBuyUpgrade: (id: string, cost: number, cps: number, cpc?: number) => void;
  lang: Language;
}

export const UpgradesPanel: React.FC<UpgradesPanelProps> = ({
  currentSafu,
  inventory,
  onBuyUpgrade,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'passive' | 'click'>('passive');
  const t = translations[lang];

  const calculateCost = (baseCost: number, count: number) => {
    return Math.floor(baseCost * Math.pow(1.15, count));
  };

  const upgradesList = activeTab === 'passive' ? PASSIVE_UPGRADES : CLICK_UPGRADES;

  return (
    <div className="bg-[#181A20] border border-[#2B313A] rounded-2xl p-4 sm:p-5 flex flex-col h-full shadow-xl">
      {/* Panel Header & Category Tabs */}
      <div className="flex flex-col gap-3 pb-3 border-b border-[#2B313A]">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>🛒</span> {t.shopTitle}
          </h2>
          <span className="text-xs font-mono text-[#848E9C]">
            BNB Chain DEX v4
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#0B0E14] rounded-xl border border-[#2B313A]/60">
          <button
            onClick={() => {
              setActiveTab('passive');
              sound.playClick(0.9);
            }}
            className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'passive'
                ? 'bg-[#F3BA2F] text-[#0B0E14] shadow-md font-bold'
                : 'text-[#848E9C] hover:text-[#EAECEF] hover:bg-white/5'
            }`}
          >
            <span>⚡</span>
            <span className="truncate">{t.shopTabPassive}</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('click');
              sound.playClick(1.1);
            }}
            className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'click'
                ? 'bg-[#F3BA2F] text-[#0B0E14] shadow-md font-bold'
                : 'text-[#848E9C] hover:text-[#EAECEF] hover:bg-white/5'
            }`}
          >
            <span>👆</span>
            <span className="truncate">{t.shopTabClick}</span>
          </button>
        </div>
      </div>

      {/* Upgrades Scrollable List */}
      <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-2.5 max-h-[520px] custom-scrollbar">
        {upgradesList.map((item) => {
          const count = inventory[item.id] || 0;
          const cost = calculateCost(item.baseCost, count);
          const canAfford = currentSafu >= cost;

          const name = t[item.nameKey] || item.id;
          const desc = t[item.descKey] || '';

          return (
            <div
              key={item.id}
              className={`group relative p-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                canAfford
                  ? 'bg-[#202630]/70 border-[#2B313A] hover:border-[#F3BA2F]/60 hover:bg-[#202630]'
                  : 'bg-[#14171D]/60 border-[#20252D] opacity-60'
              }`}
            >
              {/* Left: Icon & Details */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 border ${
                    canAfford
                      ? 'bg-[#2B313A]/70 border-[#F3BA2F]/30 text-white'
                      : 'bg-[#181A20] border-[#2B313A] text-slate-500'
                  }`}
                >
                  {item.icon}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white truncate group-hover:text-[#F3BA2F] transition-colors">
                      {name}
                    </h3>
                    {count > 0 && (
                      <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-[#0B0E14] text-[#F3BA2F] border border-[#F3BA2F]/20 font-bold shrink-0">
                        x{count}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#848E9C] line-clamp-1 mt-0.5">
                    {desc}
                  </p>
                  <div className="text-[11px] text-[#0ECB81] font-mono mt-0.5 flex items-center gap-1 font-medium">
                    {item.category === 'passive' ? (
                      <span>+{item.cps.toLocaleString()} SAFU/{t.sec}</span>
                    ) : (
                      <span>+{(item.cpc || 1).toLocaleString()} SAFU/{t.click}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Buy Button */}
              <button
                disabled={!canAfford}
                onClick={() => {
                  if (canAfford) {
                    onBuyUpgrade(item.id, cost, item.cps, item.cpc);
                  }
                }}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all flex flex-col items-end justify-center min-w-[84px] ${
                  canAfford
                    ? 'bg-[#F3BA2F] text-[#0B0E14] hover:bg-[#FCD535] active:scale-95 shadow-[0_4px_12px_rgba(243,186,47,0.25)] cursor-pointer'
                    : 'bg-[#2B313A]/50 text-[#848E9C] cursor-not-allowed border border-[#2B313A]/40'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider opacity-80">
                  {t.buy}
                </span>
                <span className="text-xs font-bold flex items-center gap-1">
                  🟡 {cost.toLocaleString()}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
