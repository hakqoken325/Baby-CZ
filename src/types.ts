export type Language = 'zh' | 'en' | 'ru';

export interface UpgradeItem {
  id: string;
  nameKey: string;
  descKey: string;
  baseCost: number;
  cps: number; // SAFU per sec
  cpc?: number; // SAFU per click bonus
  icon: string;
  category: 'passive' | 'click';
}

export interface GrowthLevel {
  level: number;
  titleKey: string;
  descKey: string;
  requiredTotalSafu: number;
  badge: string;
  unlockedItem: string;
}

export interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  value: string;
  emoji: string;
  color?: string;
}

export interface PassportData {
  id: string;
  firstWord: string;
  superpower: string;
  horoscope: string;
  issueDate: string;
  verifiedBy: string;
  parentBlessing: string;
}
