import React, { useState, useEffect, useRef, useCallback } from 'react';

// ==========================================
// 1. TYPES & DATA STRUCTURES
// ==========================================
export type Language = 'zh' | 'en' | 'ru';

export interface UpgradeItem {
  id: string;
  nameKey: string;
  descKey: string;
  baseCost: number;
  cps: number;
  cpc?: number;
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
}

export interface PassportData {
  id: string;
  firstWord: string;
  superpower: string;
  horoscope: string;
  issueDate: string;
  verifiedBy: string;
}

// ==========================================
// 2. AUDIO SYNTHESIZER (ZERO-ASSET WEB AUDIO)
// ==========================================
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playClick(pitchMultiplier: number = 1) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const baseFreq = 420 * (0.9 + Math.random() * 0.3) * pitchMultiplier;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {}
  }

  public playCoin() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.06);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.32);
    } catch {}
  }

  public playBuy() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.18, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.16);
      });
    } catch {}
  }

  public playLevelUp() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [
        { f: 523.25, d: 0.1, t: 0 },
        { f: 659.25, d: 0.1, t: 0.1 },
        { f: 783.99, d: 0.1, t: 0.2 },
        { f: 1046.50, d: 0.45, t: 0.3 },
      ];
      notes.forEach(({ f, d, t }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);
        gain.gain.setValueAtTime(0.28, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + d + 0.05);
      });
    } catch {}
  }

  public playAirdrop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.2);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.35);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.42);
    } catch {}
  }
}

const sound = new SoundEngine();

// ==========================================
// 3. TRANSLATIONS & GAME DATA
// ==========================================
export const translations: Record<Language, Record<string, string>> = {
  zh: {
    appTitle: 'Baby SAFU Simulator',
    appSubtitle: '何一宝宝加密模拟器 · 币安社区暖心献礼',
    congratsBanner: '🎉 热烈祝贺何一姐喜迎新生命！愿小宝贝平安顺遂，SAFU一生！💛',
    safuPower: 'SAFU 算力',
    safuPerSec: '每秒产出',
    clickPower: '单次点击',
    growthLevel: '成长等级',
    nextLevelAt: '距离升级还需',
    maxLevelReached: '已达最高神圣等级！',
    tapBabyPrompt: '轻触小宝贝注入 SAFU 能量 🍼',
    frenzyActive: '🚀 2X 狂欢加速中！',

    // Levels
    level1_title: 'Level 1: Baby Hodler (小小持币者)',
    level1_desc: '嘴含24K纯金安抚奶嘴，天生拥有钻石手！',
    level2_title: 'Level 2: Whitepaper Reader (白皮书幼童)',
    level2_desc: '睡前故事不听安徒生，专研比特币与BNB智能合约。',
    level3_title: 'Level 3: Youngest BNB Validator (最年轻BNB验证节点)',
    level3_desc: '咿呀学语间已确认数百万笔链上区块交易。',
    level4_title: 'Level 4: Future Binance CEO (未来币安CEO)',
    level4_desc: '戴上极酷墨镜，手持流动性大权，执掌全球加密航标。',
    level5_title: 'Level 5: Master of Liquidity (流动性守护神)',
    level5_desc: '一呼一吸皆是全球做市深度，任何插针都被瞬间抹平。',
    level6_title: 'Level 6: Rule 4 Master (贯彻原则4号的小掌门)',
    level6_desc: '“Do not get distracted. Keep building.” 坚守BUIDL信仰！',

    // Shop
    shopTitle: '养育与启蒙商店',
    shopTabPassive: '自动产出 (SAFU/秒)',
    shopTabClick: '点击增益 (SAFU/点击)',
    owned: '已拥有',
    buy: '购买',
    cost: '消耗',
    sec: '秒',
    click: '点击',

    // Upgrades
    upg_bnb_milk_name: 'BNB 婴幼儿高能奶粉',
    upg_bnb_milk_desc: '富含高蛋白与链上流动性微量元素，每秒产出 +1 SAFU',
    upg_gold_pacifier_name: '24K 纯金安抚奶嘴',
    upg_gold_pacifier_desc: '纯金打造，防胀气防FUD，每秒产出 +5 SAFU',
    upg_lullaby_whitepaper_name: '催眠曲：白皮书第一卷',
    upg_lullaby_whitepaper_desc: '轻声哼唱中本聪与BNB Genesis区块，每秒产出 +20 SAFU',
    upg_cold_wallet_name: 'Ledger 磨牙棒冷钱包',
    upg_cold_wallet_desc: '牙床更坚固，助记词嚼得烂，每秒产出 +100 SAFU',
    upg_vip_diaper_name: 'VIP 9 零费率透气纸尿裤',
    upg_vip_diaper_desc: '告别滑点与红屁屁，极速打包，每秒产出 +400 SAFU',
    upg_cz_tweet_alert_name: 'CZ 推特播报拨浪鼓 4️⃣',
    upg_cz_tweet_alert_desc: '摇一摇自动发出 "4" 和 "Funds are SAFU"，每秒产出 +1,500 SAFU',
    upg_launchpool_crib_name: 'Launchpool 新币挖矿婴儿床',
    upg_launchpool_crib_desc: '睡着也能自动打新无损躺赚，每秒产出 +6,000 SAFU',
    upg_merkle_baby_gym_name: '默克尔树储备金游戏护栏',
    upg_merkle_baby_gym_desc: '100% 储备金透明包裹，安全感拉满，每秒产出 +25,000 SAFU',

    // Click Upgrades
    upg_diamond_hands_name: '金刚不坏婴儿钻石手',
    upg_diamond_hands_desc: '小抓手紧紧抓牢筹码，每次点击 +1 SAFU',
    upg_laser_eyes_name: '萌宝极光激光眼',
    upg_laser_eyes_desc: '一眼看穿任何庄家画门，每次点击 +5 SAFU',
    upg_buidl_rattle_name: 'BUIDL 信仰能量棒',
    upg_buidl_rattle_desc: '摇晃注入满满正能量，每次点击 +25 SAFU',

    // Passport
    getPassportBtn: '获取 SAFU 护照',
    passportTitle: 'BINANCE BABY SAFU PASSPORT',
    passportSub: '何一小萌宝 · 全球加密诞生护照',
    passportUniqueId: '专属护照号',
    passportFirstWord: '萌宝第一声啼鸣',
    passportSuperpower: '天生超能力',
    passportHoroscope: '链上星宿',
    passportBalance: '累计 SAFU 能量',
    passportRank: '成长军衔',
    passportIssuer: '签发单位',
    passportIssuerVal: 'Binance Smart Maternity · 何一与社区联合认证',
    regeneratePassport: '重新抽取属性',
    copyForX: '复制推特/X祝福文案',
    copiedSuccess: '已成功复制到剪贴板！快去 X / Twitter 分享吧！',
    shareOnX: '发推祝福何一姐',
    closeModal: '关闭',

    // Airdrop
    airdropTitle: '🎁 黄金神秘空投降临！',
    airdropClickMe: '点击领取空投！',
    airdropClaimed: '获得 30 秒收益奖励 + 10秒狂欢双倍！',

    // Footer
    soundOn: '音效开启',
    soundOff: '音效静音',
    resetGame: '重置进度',
    resetConfirm: '确定要重置当前游戏进度吗？',
    communityLove: '谨以此小游戏恭贺何一姐喜得贵子 · 愿小天使健康成长！',
  },

  en: {
    appTitle: 'Baby SAFU Simulator',
    appSubtitle: 'Dedicated to Yi He’s Newborn Baby · A Binance Community Tribute',
    congratsBanner: '🎉 Warmest congratulations to Yi He on the new baby! Wishing health, happiness & SAFU forever! 💛',
    safuPower: 'SAFU Power',
    safuPerSec: 'per second',
    clickPower: 'per click',
    growthLevel: 'Growth Level',
    nextLevelAt: 'Next level at',
    maxLevelReached: 'Maximum Divine Level Reached!',
    tapBabyPrompt: 'Tap Baby to inject SAFU energy 🍼',
    frenzyActive: '🚀 2X FRENZY ACTIVE!',

    // Levels
    level1_title: 'Level 1: Baby Hodler',
    level1_desc: 'Pure gold pacifier with natural-born diamond hands!',
    level2_title: 'Level 2: Whitepaper Reader',
    level2_desc: 'Reads Ethereum and BNB smart contracts instead of fairy tales.',
    level3_title: 'Level 3: Youngest BNB Validator',
    level3_desc: 'Validating millions of on-chain blocks between babbling coos.',
    level4_title: 'Level 4: Future Binance CEO',
    level4_desc: 'Cool shades on, holding liquidity keys and navigating global crypto.',
    level5_title: 'Level 5: Master of Liquidity',
    level5_desc: 'Breathing pure market depth; wiping out flash crashes in seconds.',
    level6_title: 'Level 6: Rule 4 Master',
    level6_desc: '“Do not get distracted. Keep building.” True BUIDL discipline!',

    // Shop
    shopTitle: 'Nourishment & Education',
    shopTabPassive: 'Passive Income (SAFU/s)',
    shopTabClick: 'Click Power (SAFU/tap)',
    owned: 'Owned',
    buy: 'Upgrade',
    cost: 'Cost',
    sec: 'sec',
    click: 'tap',

    // Upgrades
    upg_bnb_milk_name: 'BNB Milk Formula',
    upg_bnb_milk_desc: 'High protein enriched with on-chain liquidity minerals. +1 SAFU/sec',
    upg_gold_pacifier_name: 'Golden Pacifier',
    upg_gold_pacifier_desc: 'Pure 24K gold, anti-colic & anti-FUD. +5 SAFU/sec',
    upg_lullaby_whitepaper_name: 'Lullaby: Whitepaper Vol. 1',
    upg_lullaby_whitepaper_desc: 'Soft whispers of Satoshi and the BNB Genesis block. +20 SAFU/sec',
    upg_cold_wallet_name: 'Cold Wallet Teething Toy',
    upg_cold_wallet_desc: 'Hardware teething ring, chewing on seed phrases safely. +100 SAFU/sec',
    upg_vip_diaper_name: 'VIP 9 Zero-Fee Diaper',
    upg_vip_diaper_desc: 'Zero slippage, zero diaper rash, lightning fast block packing. +400 SAFU/sec',
    upg_cz_tweet_alert_name: 'CZ’s Tweet Alert Rattle 4️⃣',
    upg_cz_tweet_alert_desc: 'Rattles "4" and "Funds are SAFU" whenever shaken. +1,500 SAFU/sec',
    upg_launchpool_crib_name: 'Launchpool Yield Crib',
    upg_launchpool_crib_desc: 'Farming new tokens without impermanent loss while sleeping. +6,000 SAFU/sec',
    upg_merkle_baby_gym_name: 'Proof of Reserves Playpen',
    upg_merkle_baby_gym_desc: '100% verified asset backing for ultimate peace of mind. +25,000 SAFU/sec',

    // Click Upgrades
    upg_diamond_hands_name: 'Diamond Baby Hands',
    upg_diamond_hands_desc: 'Tiny hands that never drop the bag! +1 SAFU per click',
    upg_laser_eyes_name: 'Baby Laser Eyes',
    upg_laser_eyes_desc: 'Sees through market noise with laser precision. +5 SAFU per click',
    upg_buidl_rattle_name: 'BUIDL Energy Rattle',
    upg_buidl_rattle_desc: 'Shaking with pure cryptographic conviction. +25 SAFU per click',

    // Passport
    getPassportBtn: 'Get Baby Passport',
    passportTitle: 'BINANCE BABY SAFU PASSPORT',
    passportSub: 'Official Crypto Birth Certificate for Yi He’s Baby',
    passportUniqueId: 'Unique Passport ID',
    passportFirstWord: 'First Baby Word',
    passportSuperpower: 'Inborn Superpower',
    passportHoroscope: 'Crypto Sign',
    passportBalance: 'Total SAFU Energy',
    passportRank: 'Growth Rank',
    passportIssuer: 'Authority',
    passportIssuerVal: 'Binance Maternity Chain · Certified by Yi He & Community',
    regeneratePassport: 'Re-roll Stats',
    copyForX: 'Copy for X / Twitter',
    copiedSuccess: 'Copied to clipboard! Ready to share on X / Twitter!',
    shareOnX: 'Tweet Congrats to Yi He',
    closeModal: 'Close',

    // Airdrop
    airdropTitle: '🎁 Golden Airdrop Arrived!',
    airdropClickMe: 'Click to Claim Airdrop!',
    airdropClaimed: 'Claimed 30s of passive income + 10s 2X Frenzy Boost!',

    // Footer
    soundOn: 'Sound: ON',
    soundOff: 'Sound: OFF',
    resetGame: 'Reset Game',
    resetConfirm: 'Are you sure you want to reset your baby’s progress?',
    communityLove: 'Made with love for Yi He & the Binance Baby · Keep on BUIDLing!',
  },

  ru: {
    appTitle: 'Baby SAFU Simulator',
    appSubtitle: 'Посвящается рождению малыша у Yi He · С любовью от крипто-сообщества',
    congratsBanner: '🎉 Сердечные поздравления Yi He с рождением малыша! Пусть растет здоровым и счастливым! 💛',
    safuPower: 'SAFU Сила',
    safuPerSec: 'в секунду',
    clickPower: 'за клик',
    growthLevel: 'Уровень развития',
    nextLevelAt: 'До след. уровня',
    maxLevelReached: 'Максимальный уровень достигнут!',
    tapBabyPrompt: 'Жми на младенца, чтобы наполнять его силой SAFU 🍼',
    frenzyActive: '🚀 2X КРИПТО-КУРАЖ АКТИВЕН!',

    // Levels
    level1_title: 'Level 1: Baby Hodler',
    level1_desc: 'Золотая соска и алмазные ручки с самого рождения!',
    level2_title: 'Level 2: Whitepaper Reader',
    level2_desc: 'Вместо детских сказок на ночь читает смарт-контракты BNB.',
    level3_title: 'Level 3: Youngest BNB Validator',
    level3_desc: 'Самый юный валидатор: одобряет блоки между кормлениями.',
    level4_title: 'Level 4: Future Binance CEO',
    level4_desc: 'Стильные очки, ключи от ликвидности и руководство экосистемой.',
    level5_title: 'Level 5: Master of Liquidity',
    level5_desc: 'Дышит чистой ликвидностью; ликвидирует дампы в секунду.',
    level6_title: 'Level 6: Rule 4 Master',
    level6_desc: '«Не отвлекайся. Строй дальше.» Истинный дух BUIDL!',

    // Shop
    shopTitle: 'Питание и обучение',
    shopTabPassive: 'Пассивный доход (SAFU/сек)',
    shopTabClick: 'Усиление клика (SAFU/клик)',
    owned: 'Куплено',
    buy: 'Купить',
    cost: 'Цена',
    sec: 'сек',
    click: 'клик',

    // Upgrades
    upg_bnb_milk_name: 'Молочная смесь BNB',
    upg_bnb_milk_desc: 'Обогащена белком и ончейн-минералами. +1 SAFU/сек',
    upg_gold_pacifier_name: 'Золотая соска 24K',
    upg_gold_pacifier_desc: 'Из чистого золота, защита от колик и FUD. +5 SAFU/сек',
    upg_lullaby_whitepaper_name: 'Колыбельная: Whitepaper Vol. 1',
    upg_lullaby_whitepaper_desc: 'Нежный шёпот о генезис-блоке и Сатоши. +20 SAFU/сек',
    upg_cold_wallet_name: 'Холодный кошелек-прорезыватель',
    upg_cold_wallet_desc: 'Безопасный Ledger для первых зубок и сид-фраз. +100 SAFU/сек',
    upg_vip_diaper_name: 'Подгузники со скидкой VIP 9',
    upg_vip_diaper_desc: 'Нулевая комиссия, сухость без проскальзывания. +400 SAFU/сек',
    upg_cz_tweet_alert_name: 'Погремушка с твитами CZ 4️⃣',
    upg_cz_tweet_alert_desc: 'Звенит "4" и "Funds are SAFU" при каждом движении. +1,500 SAFU/сек',
    upg_launchpool_crib_name: 'Кроватка Launchpool',
    upg_launchpool_crib_desc: 'Спит и фармит новые токены с нулевым риском. +6,000 SAFU/сек',
    upg_merkle_baby_gym_name: 'Манеж Proof of Reserves',
    upg_merkle_baby_gym_desc: '100% подтвержденный резерв спокойствия и уюта. +25,000 SAFU/сек',

    // Click Upgrades
    upg_diamond_hands_name: 'Алмазные ручки младенца',
    upg_diamond_hands_desc: 'Крепко держит монеты и не продает на панике! +1 SAFU за клик',
    upg_laser_eyes_name: 'Лазерный взгляд',
    upg_laser_eyes_desc: 'Видит развороты тренда невооруженным глазом. +5 SAFU за клик',
    upg_buidl_rattle_name: 'Погремушка BUIDL',
    upg_buidl_rattle_desc: 'Заряжает каждый клик неиссякаемой энергией. +25 SAFU за клик',

    // Passport
    getPassportBtn: 'Получить SAFU Паспорт',
    passportTitle: 'BINANCE BABY SAFU PASSPORT',
    passportSub: 'Официальное крипто-свидетельство о рождении малыша Yi He',
    passportUniqueId: 'Номер паспорта',
    passportFirstWord: 'Первое слово малыша',
    passportSuperpower: 'Врожденная суперсила',
    passportHoroscope: 'Крипто-знак',
    passportBalance: 'Накоплено SAFU',
    passportRank: 'Звание',
    passportIssuer: 'Кем выдан',
    passportIssuerVal: 'Binance Smart Maternity · Заверено Yi He и крипто-сообществом',
    regeneratePassport: 'Сгенерировать заново',
    copyForX: 'Скопировать для X / Twitter',
    copiedSuccess: 'Текст скопирован! Поделись поздравлением в X / Twitter!',
    shareOnX: 'Твитнуть поздравление Yi He',
    closeModal: 'Закрыть',

    // Airdrop
    airdropTitle: '🎁 Золотой аирдроп прилетел!',
    airdropClickMe: 'Кликни, чтобы забрать аирдроп!',
    airdropClaimed: 'Получено: 30 сек пассивного дохода + 10 сек 2X Куража!',

    // Footer
    soundOn: 'Звук: ВКЛ',
    soundOff: 'Звук: ВЫКЛ',
    resetGame: 'Сбросить игру',
    resetConfirm: 'Вы уверены, что хотите сбросить прогресс игры?',
    communityLove: 'Создано с теплом для Yi He и малыша · Funds are SAFU!',
  },
};

export const GROWTH_LEVELS: GrowthLevel[] = [
  {
    level: 1,
    titleKey: 'level1_title',
    descKey: 'level1_desc',
    requiredTotalSafu: 0,
    badge: '🍼',
    unlockedItem: 'Pure Gold Pacifier',
  },
  {
    level: 2,
    titleKey: 'level2_title',
    descKey: 'level2_desc',
    requiredTotalSafu: 100,
    badge: '📜',
    unlockedItem: 'Smart Contract Scroll',
  },
  {
    level: 3,
    titleKey: 'level3_title',
    descKey: 'level3_desc',
    requiredTotalSafu: 1000,
    badge: '⚡',
    unlockedItem: 'BNB Validator Crown',
  },
  {
    level: 4,
    titleKey: 'level4_title',
    descKey: 'level4_desc',
    requiredTotalSafu: 10000,
    badge: '👑',
    unlockedItem: 'CEO Golden Shades & Tie',
  },
  {
    level: 5,
    titleKey: 'level5_title',
    descKey: 'level5_desc',
    requiredTotalSafu: 50000,
    badge: '💎',
    unlockedItem: 'Master of Liquidity Cape',
  },
  {
    level: 6,
    titleKey: 'level6_title',
    descKey: 'level6_desc',
    requiredTotalSafu: 250000,
    badge: '4️⃣',
    unlockedItem: 'Rule #4 Golden Shield',
  },
];

export const PASSIVE_UPGRADES: UpgradeItem[] = [
  {
    id: 'bnb_milk',
    nameKey: 'upg_bnb_milk_name',
    descKey: 'upg_bnb_milk_desc',
    baseCost: 15,
    cps: 1,
    icon: '🍼',
    category: 'passive',
  },
  {
    id: 'gold_pacifier',
    nameKey: 'upg_gold_pacifier_name',
    descKey: 'upg_gold_pacifier_desc',
    baseCost: 100,
    cps: 5,
    icon: '✨',
    category: 'passive',
  },
  {
    id: 'lullaby_whitepaper',
    nameKey: 'upg_lullaby_whitepaper_name',
    descKey: 'upg_lullaby_whitepaper_desc',
    baseCost: 1100,
    cps: 20,
    icon: '📜',
    category: 'passive',
  },
  {
    id: 'cold_wallet',
    nameKey: 'upg_cold_wallet_name',
    descKey: 'upg_cold_wallet_desc',
    baseCost: 12000,
    cps: 100,
    icon: '🔐',
    category: 'passive',
  },
  {
    id: 'vip_diaper',
    nameKey: 'upg_vip_diaper_name',
    descKey: 'upg_vip_diaper_desc',
    baseCost: 50000,
    cps: 400,
    icon: '🩲',
    category: 'passive',
  },
  {
    id: 'cz_tweet_alert',
    nameKey: 'upg_cz_tweet_alert_name',
    descKey: 'upg_cz_tweet_alert_desc',
    baseCost: 200000,
    cps: 1500,
    icon: '4️⃣',
    category: 'passive',
  },
  {
    id: 'launchpool_crib',
    nameKey: 'upg_launchpool_crib_name',
    descKey: 'upg_launchpool_crib_desc',
    baseCost: 1000000,
    cps: 6000,
    icon: '🛏️',
    category: 'passive',
  },
  {
    id: 'merkle_baby_gym',
    nameKey: 'upg_merkle_baby_gym_name',
    descKey: 'upg_merkle_baby_gym_desc',
    baseCost: 5000000,
    cps: 25000,
    icon: '🌳',
    category: 'passive',
  },
];

export const CLICK_UPGRADES: UpgradeItem[] = [
  {
    id: 'diamond_hands',
    nameKey: 'upg_diamond_hands_name',
    descKey: 'upg_diamond_hands_desc',
    baseCost: 50,
    cps: 0,
    cpc: 1,
    icon: '💎',
    category: 'click',
  },
  {
    id: 'laser_eyes',
    nameKey: 'upg_laser_eyes_name',
    descKey: 'upg_laser_eyes_desc',
    baseCost: 500,
    cps: 0,
    cpc: 5,
    icon: '👀',
    category: 'click',
  },
  {
    id: 'buidl_rattle',
    nameKey: 'upg_buidl_rattle_name',
    descKey: 'upg_buidl_rattle_desc',
    baseCost: 5000,
    cps: 0,
    cpc: 25,
    icon: '⚡',
    category: 'click',
  },
];

export const FIRST_WORDS_POOL: Record<Language, string[]> = {
  zh: [
    'SAFU！(资金安全)',
    '4！(保持专注，继续BUIDL)',
    '逢跌必抄 (BUY THE DIP)',
    'GM！(加密早安)',
    'HODL！(钻石手)',
    'WAGMI！(我们都会成功)',
    '币安智能链启动！',
    '致敬中本聪！',
  ],
  en: [
    'SAFU! (Funds Are Safe)',
    '4! (Ignore FUD, Keep Buidling)',
    'BUY THE DIP!',
    'GM! ☀️',
    'HODL!',
    'WAGMI!',
    'To The Moon! 🚀',
    'Verified by Merkle Tree!',
  ],
  ru: [
    'SAFU! (Средства в безопасности)',
    '4! (Не отвлекайся, BUIDL!)',
    'BUY THE DIP! (Откупай просадку)',
    'GM! (Доброе крипто-утро)',
    'HODL! (Держи крепко)',
    'WAGMI!',
    'TO THE MOON! 🚀',
    'Надежнее любого банка!',
  ],
};

export const SUPERPOWERS_POOL: Record<Language, string[]> = {
  zh: [
    '天生免疫一切 FUD (FUD Immunity)',
    '襁褓中的钻石手 (Diamond Hands Since Birth)',
    '链上滑点瞬间抵消 (Zero Slippage Telepathy)',
    '巨鲸异动神速预警 (Whale Radar Instinct)',
    '全网最优流动性感知 (Infinite Market Depth)',
    '闪电网络超速思维 (Microsecond Block Validator)',
  ],
  en: [
    'Complete Immunity to FUD',
    'Diamond Hands Since Birth',
    'Zero Slippage Telepathy',
    'Whale Alert Radar',
    'Infinite Liquidity Manifestation',
    'Instant Merkle Proof Verification',
  ],
  ru: [
    'Абсолютный иммунитет к FUD',
    'Алмазные ручки с пеленок (Diamond Hands)',
    'Врожденная телепатия нулевого проскальзывания',
    'Инстинктивный радар движений Китов',
    'Генерация бесконечной ликвидности',
    'Мгновенная валидация блоков во сне',
  ],
};

export const HOROSCOPE_POOL: Record<Language, string[]> = {
  zh: ['牛市冉冉升起 · 创世区块座', '超级周期守护 · 中本聪天顶', '流动性充盈 · 恒星共识宫'],
  en: ['Bull Run Ascendant · Genesis Constellation', 'Supercycle Sovereign · Satoshi Zenith', 'Infinite Depth · Proof of Reserves Moon'],
  ru: ['Восходящий Бычий Рынок · Созвездие Генезиса', 'Суперцикл удачи · Зенит Сатоши', 'Знак Непоколебимой Ликвидности'],
};

// ==========================================
// 4. EMBEDDED SUBCOMPONENTS
// ==========================================

// Character Component
function BabyCharacter({
  growthLevel,
  isClicked,
  onClick,
  frenzyActive,
}: {
  growthLevel: number;
  isClicked: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
  frenzyActive: boolean;
}) {
  const [blink, setBlink] = useState(false);
  const [wiggleAngle, setWiggleAngle] = useState(0);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 3500 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

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
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div
        className={`absolute inset-0 -m-8 rounded-full blur-3xl transition-all duration-300 pointer-events-none ${
          frenzyActive
            ? 'bg-amber-400/35 scale-125 animate-pulse'
            : growthLevel >= 4
            ? 'bg-[#F3BA2F]/25 scale-110'
            : 'bg-[#F3BA2F]/15 group-hover:bg-[#F3BA2F]/25 scale-100'
        }`}
      />

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
            <radialGradient id="babySkin" cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#FFF2E8" />
              <stop offset="60%" stopColor="#FFE3D1" />
              <stop offset="100%" stopColor="#F6CBB4" />
            </radialGradient>
            <linearGradient id="bnbYellow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD535" />
              <stop offset="50%" stopColor="#F3BA2F" />
              <stop offset="100%" stopColor="#D99E10" />
            </linearGradient>
            <linearGradient id="goldShine" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#FFF9C4" />
              <stop offset="40%" stopColor="#FBC02D" />
              <stop offset="100%" stopColor="#D68910" />
            </linearGradient>
            <linearGradient id="ceoShades" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E2329" />
              <stop offset="50%" stopColor="#0B0E14" />
              <stop offset="100%" stopColor="#2B313A" />
            </linearGradient>
            <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.25" />
            </filter>
          </defs>

          {growthLevel >= 5 && (
            <path
              d="M 80 180 Q 50 290 80 330 Q 160 350 240 330 Q 270 290 240 180 Z"
              fill="#D97706"
              stroke="#F3BA2F"
              strokeWidth="4"
              opacity="0.9"
            />
          )}

          <g id="body">
            <ellipse cx="160" cy="255" rx="76" ry="65" fill="url(#bnbYellow)" filter="url(#softShadow)" />
            <path d="M 98 275 Q 160 320 222 275" stroke="#D99E10" strokeWidth="4" fill="none" strokeLinecap="round" />
            <ellipse cx="115" cy="318" rx="22" ry="16" fill="#FFE3D1" stroke="#F6CBB4" strokeWidth="2" />
            <ellipse cx="205" cy="318" rx="22" ry="16" fill="#FFE3D1" stroke="#F6CBB4" strokeWidth="2" />
            <ellipse cx="115" cy="319" rx="14" ry="10" fill="#FFC9B3" />
            <ellipse cx="205" cy="319" rx="14" ry="10" fill="#FFC9B3" />

            <g transform="translate(160, 240) scale(0.68)">
              <polygon points="0,-28 14,-14 0,0 -14,-14" fill="#181A20" />
              <polygon points="0,28 14,14 0,0 -14,14" fill="#181A20" />
              <polygon points="-28,0 -14,-14 0,0 -14,14" fill="#181A20" />
              <polygon points="28,0 14,-14 0,0 14,14" fill="#181A20" />
              <polygon points="0,-10 10,0 0,10 -10,0" fill="#FCD535" />
            </g>

            {growthLevel >= 4 && (
              <g transform="translate(160, 202)">
                <polygon points="-8,0 8,0 5,26 0,34 -5,26" fill="#181A20" stroke="#F3BA2F" strokeWidth="1.5" />
                <circle cx="0" cy="2" r="4" fill="#F3BA2F" />
              </g>
            )}

            <path d="M 90 220 Q 60 235 75 260 Q 95 255 105 235 Z" fill="#FFE3D1" stroke="#F6CBB4" strokeWidth="2" />
            <path d="M 230 220 Q 260 235 245 260 Q 225 255 215 235 Z" fill="#FFE3D1" stroke="#F6CBB4" strokeWidth="2" />

            {growthLevel === 2 && (
              <g transform="translate(50, 230) rotate(-15)">
                <rect x="0" y="0" width="30" height="42" rx="3" fill="#FFFDF0" stroke="#D99E10" strokeWidth="2" />
                <line x1="6" y1="8" x2="24" y2="8" stroke="#181A20" strokeWidth="2" />
                <line x1="6" y1="16" x2="24" y2="16" stroke="#F3BA2F" strokeWidth="2" />
                <line x1="6" y1="24" x2="18" y2="24" stroke="#181A20" strokeWidth="2" />
                <text x="7" y="36" fontSize="7" fill="#6B7280" fontFamily="monospace">SOL</text>
              </g>
            )}

            {growthLevel >= 6 && (
              <g transform="translate(42, 210)">
                <polygon points="18,0 36,8 36,32 18,44 0,32 0,8" fill="#F3BA2F" stroke="#FFFFFF" strokeWidth="2" />
                <text x="18" y="28" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#181A20">4</text>
              </g>
            )}
          </g>

          <g id="head">
            <circle cx="78" cy="138" r="18" fill="#FFE3D1" stroke="#F6CBB4" strokeWidth="2" />
            <circle cx="78" cy="138" r="9" fill="#FFC9B3" />
            <circle cx="242" cy="138" r="18" fill="#FFE3D1" stroke="#F6CBB4" strokeWidth="2" />
            <circle cx="242" cy="138" r="9" fill="#FFC9B3" />
            <ellipse cx="160" cy="135" rx="82" ry="74" fill="url(#babySkin)" filter="url(#softShadow)" />
            <ellipse cx="106" cy="155" rx="15" ry="10" fill="#FF8A80" opacity="0.45" />
            <ellipse cx="214" cy="155" rx="15" ry="10" fill="#FF8A80" opacity="0.45" />
            <path d="M 160 62 Q 172 40 185 48 Q 180 62 165 66 Q 148 45 158 35 Q 163 52 160 62" fill="#5D4037" />

            {growthLevel < 4 ? (
              <g id="eyes">
                {blink ? (
                  <>
                    <path d="M 112 128 Q 126 134 138 128" stroke="#374151" strokeWidth="4" strokeLinecap="round" fill="none" />
                    <path d="M 182 128 Q 194 134 208 128" stroke="#374151" strokeWidth="4" strokeLinecap="round" fill="none" />
                  </>
                ) : (
                  <>
                    <ellipse cx="125" cy="126" rx="11" ry="14" fill="#181A20" />
                    <circle cx="122" cy="121" r="4.5" fill="#FFFFFF" />
                    <circle cx="128" cy="131" r="2" fill="#FFFFFF" />
                    <ellipse cx="195" cy="126" rx="11" ry="14" fill="#181A20" />
                    <circle cx="192" cy="121" r="4.5" fill="#FFFFFF" />
                    <circle cx="198" cy="131" r="2" fill="#FFFFFF" />
                    <path d="M 115 106 Q 126 102 136 106" stroke="#8D6E63" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <path d="M 184 106 Q 194 102 205 106" stroke="#8D6E63" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  </>
                )}
              </g>
            ) : (
              <g id="ceoGlasses" transform="translate(160, 126)">
                <rect x="-65" y="-14" width="56" height="28" rx="5" fill="url(#ceoShades)" stroke="#F3BA2F" strokeWidth="2.5" />
                <rect x="9" y="-14" width="56" height="28" rx="5" fill="url(#ceoShades)" stroke="#F3BA2F" strokeWidth="2.5" />
                <rect x="-10" y="-8" width="20" height="6" fill="#F3BA2F" />
                <polygon points="-50,-10 -35,-10 -45,10 -60,10" fill="#FFFFFF" opacity="0.35" />
                <polygon points="25,-10 40,-10 30,10 15,10" fill="#FFFFFF" opacity="0.35" />
              </g>
            )}

            <ellipse cx="160" cy="144" rx="3.5" ry="2.5" fill="#E5987A" />

            <g
              id="pacifier"
              className="transition-transform duration-300"
              style={{
                transform: `translate(160px, 168px) scale(${isClicked ? 1.08 : 1})`,
              }}
            >
              <ellipse cx="0" cy="0" rx="28" ry="20" fill="url(#goldShine)" stroke="#B7791F" strokeWidth="2.5" filter="url(#softShadow)" />
              <circle cx="0" cy="0" r="10" fill="#FFE082" stroke="#B7791F" strokeWidth="2" />
              <path d="M -9 8 Q 0 24 9 8" fill="none" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
              <polygon points="0,-4 3,0 0,4 -3,0" fill="#181A20" />
            </g>

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
                <rect x="-44" y="0" width="88" height="8" rx="3" fill="#D97706" />
              </g>
            )}
          </g>
        </svg>
      </div>

      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#181A20]/90 border border-[#F3BA2F]/40 backdrop-blur-md px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#F3BA2F] animate-ping" />
        <span className="text-xs font-semibold text-[#F3BA2F] tracking-wide">
          {frenzyActive ? '🔥 2X FRENZY' : 'SAFU BABY'}
        </span>
      </div>
    </div>
  );
}

// Upgrades Panel Component
function UpgradesPanel({
  currentSafu,
  inventory,
  onBuyUpgrade,
  lang,
}: {
  currentSafu: number;
  inventory: Record<string, number>;
  onBuyUpgrade: (id: string, cost: number, cps: number, cpc?: number) => void;
  lang: Language;
}) {
  const [activeTab, setActiveTab] = useState<'passive' | 'click'>('passive');
  const t = translations[lang];

  const calculateCost = (baseCost: number, count: number) => {
    return Math.floor(baseCost * Math.pow(1.15, count));
  };

  const upgradesList = activeTab === 'passive' ? PASSIVE_UPGRADES : CLICK_UPGRADES;

  return (
    <div className="bg-[#181A20] border border-[#2B313A] rounded-2xl p-4 sm:p-5 flex flex-col h-full shadow-xl">
      <div className="flex flex-col gap-3 pb-3 border-b border-[#2B313A]">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>🛒</span> {t.shopTitle}
          </h2>
          <span className="text-xs font-mono text-[#848E9C]">BNB Chain DEX v4</span>
        </div>

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
                  <p className="text-xs text-[#848E9C] line-clamp-1 mt-0.5">{desc}</p>
                  <div className="text-[11px] text-[#0ECB81] font-mono mt-0.5 flex items-center gap-1 font-medium">
                    {item.category === 'passive' ? (
                      <span>+{item.cps.toLocaleString()} SAFU/{t.sec}</span>
                    ) : (
                      <span>+{(item.cpc || 1).toLocaleString()} SAFU/{t.click}</span>
                    )}
                  </div>
                </div>
              </div>

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
                <span className="text-[10px] uppercase tracking-wider opacity-80">{t.buy}</span>
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
}

// Passport Modal Component
function PassportModal({
  isOpen,
  onClose,
  passportData,
  onRegenerate,
  currentSafu,
  growthLevel,
  levelTitle,
  lang,
}: {
  isOpen: boolean;
  onClose: () => void;
  passportData: PassportData;
  onRegenerate: () => void;
  currentSafu: number;
  growthLevel: number;
  levelTitle: string;
  lang: Language;
}) {
  const [copied, setCopied] = useState(false);
  const t = translations[lang];

  if (!isOpen) return null;

  const shareTextZh = `🍼 我为何一小宝贝铸造了专属加密出生证明！\n👶 护照编号: ${passportData.id}\n💬 萌宝第一声: "${passportData.firstWord}"\n⚡ 天生超能力: ${passportData.superpower}\n🛡️ SAFU 能量: ${Math.floor(currentSafu).toLocaleString()} (${levelTitle})\n\n热烈祝贺 @heyibinance 喜得贵子！愿宝宝平安顺遂，SAFU一生！💛🚀\n#BinanceBaby #SAFU #BNB #YiHe`;
  const shareTextEn = `🍼 Just minted the official Baby SAFU Passport for @heyibinance's newborn!\n👶 ID: ${passportData.id}\n💬 First Word: "${passportData.firstWord}"\n⚡ Superpower: ${passportData.superpower}\n🛡️ SAFU Power: ${Math.floor(currentSafu).toLocaleString()} (${levelTitle})\n\nHuge congratulations to Yi He on the new baby! Funds are SAFU, baby is HODLing! 👶💛🚀\n#BinanceBaby #SAFU #BNB #YiHe`;
  const shareTextRu = `🍼 Сгенерировал официальный крипто-паспорт SAFU для малыша Yi He!\n👶 ID: ${passportData.id}\n💬 Первое слово: "${passportData.firstWord}"\n⚡ Суперсила: ${passportData.superpower}\n🛡️ Баланс SAFU: ${Math.floor(currentSafu).toLocaleString()} (${levelTitle})\n\nСердечные поздравления @heyibinance с рождением ребенка! Здоровья и SAFU! 👶💛🚀\n#BinanceBaby #SAFU #BNB #YiHe`;

  const currentTweetText = lang === 'zh' ? shareTextZh : lang === 'ru' ? shareTextRu : shareTextEn;

  const handleCopy = () => {
    sound.playCoin();
    navigator.clipboard.writeText(currentTweetText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleShareTwitter = () => {
    sound.playCoin();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(currentTweetText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#14171E] border-2 border-[#F3BA2F]/70 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(243,186,47,0.25)] text-[#EAECEF] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#F3BA2F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between pb-4 border-b border-[#2B313A] relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F3BA2F] to-[#B7791F] p-0.5 shadow-lg flex items-center justify-center text-2xl">
              🍼
            </div>
            <div>
              <div className="text-[11px] font-mono tracking-widest text-[#F3BA2F] uppercase font-bold">
                {t.passportTitle}
              </div>
              <h3 className="text-lg font-bold text-white">{t.passportSub}</h3>
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

        <div className="my-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#1C2029] to-[#12151B] border border-[#F3BA2F]/40 shadow-inner relative z-10">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] text-[#848E9C] font-mono uppercase block">{t.passportUniqueId}</span>
              <span className="text-base sm:text-lg font-mono font-black text-[#F3BA2F] tracking-wider">
                {passportData.id}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3BA2F]/15 border border-[#F3BA2F]/40 text-[#F3BA2F] text-xs font-bold font-mono">
              <span>🛡️</span>
              <span>100% SAFU</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-3.5 text-xs">
            <div className="p-2.5 rounded-xl bg-[#0B0E14]/60 border border-[#2B313A]">
              <span className="text-[10px] text-[#848E9C] uppercase font-mono block">{t.passportFirstWord}</span>
              <span className="text-sm font-bold text-white mt-0.5 block text-amber-300">
                "{passportData.firstWord}"
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0B0E14]/60 border border-[#2B313A]">
              <span className="text-[10px] text-[#848E9C] uppercase font-mono block">{t.passportSuperpower}</span>
              <span className="text-sm font-semibold text-emerald-400 mt-0.5 block">{passportData.superpower}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0B0E14]/60 border border-[#2B313A]">
              <span className="text-[10px] text-[#848E9C] uppercase font-mono block">{t.passportRank}</span>
              <span className="text-xs font-bold text-white mt-0.5 block truncate">
                Lvl {growthLevel} · {levelTitle}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0B0E14]/60 border border-[#2B313A]">
              <span className="text-[10px] text-[#848E9C] uppercase font-mono block">{t.passportBalance}</span>
              <span className="text-sm font-mono font-bold text-[#F3BA2F] mt-0.5 block">
                🟡 {Math.floor(currentSafu).toLocaleString()}
              </span>
            </div>
          </div>

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

        {copied && (
          <div className="mb-3 p-2.5 bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs rounded-xl flex items-center justify-center gap-2 animate-bounce">
            <span>✅</span>
            <span>{t.copiedSuccess}</span>
          </div>
        )}

        <div className="space-y-2 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={handleCopy}
              className="w-full py-2.5 px-4 rounded-xl bg-[#F3BA2F] hover:bg-[#FCD535] text-[#0B0E14] font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg active:scale-98 cursor-pointer"
            >
              <span>📋</span>
              <span>{t.copyForX}</span>
            </button>
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
}

// Floating Airdrop Component
function AirdropFloating({
  onClaim,
  lang,
}: {
  onClaim: () => void;
  lang: Language;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [positionY, setPositionY] = useState(25);
  const t = translations[lang];

  useEffect(() => {
    const scheduleNextSpawn = () => {
      const delay = (35 + Math.random() * 20) * 1000;
      return setTimeout(() => {
        setPositionY(15 + Math.random() * 55);
        setIsVisible(true);
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
          <span className="text-xs font-black tracking-wide leading-none">{t.airdropClickMe}</span>
        </div>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
      </div>
    </div>
  );
}

// ==========================================
// 5. MAIN APPLICATION COMPONENT
// ==========================================
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
    };
  }, []);

  const [passportData, setPassportData] = useState<PassportData>(() =>
    generateNewPassportData('zh')
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.safu === 'number') setSafu(parsed.safu);
        if (typeof parsed.totalSafuEarned === 'number') setTotalSafuEarned(parsed.totalSafuEarned);
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
    } catch {}
  }, []);

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

  let currentLevelIdx = 0;
  for (let i = GROWTH_LEVELS.length - 1; i >= 0; i--) {
    if (totalSafuEarned >= GROWTH_LEVELS[i].requiredTotalSafu) {
      currentLevelIdx = i;
      break;
    }
  }
  const currentGrowthLevel = GROWTH_LEVELS[currentLevelIdx];
  const nextGrowthLevel = GROWTH_LEVELS[currentLevelIdx + 1];

  const prevLevelRef = useRef<number>(currentGrowthLevel.level);
  useEffect(() => {
    if (currentGrowthLevel.level > prevLevelRef.current) {
      sound.playLevelUp();
      setToast(`🎉 LEVEL UP! ${t[currentGrowthLevel.titleKey]} (${currentGrowthLevel.unlockedItem})`);
      setTimeout(() => setToast(null), 4000);
    }
    prevLevelRef.current = currentGrowthLevel.level;
  }, [currentGrowthLevel.level, currentGrowthLevel.titleKey, currentGrowthLevel.unlockedItem, t]);

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

  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setTimeout(() => {
      setParticles((prev) => prev.filter((p) => Date.now() - p.id < 1200));
    }, 600);
    return () => clearTimeout(timer);
  }, [particles]);

  const handleBabyClick = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    sound.playClick();
    setIsBabyClicked(true);
    setTimeout(() => setIsBabyClicked(false), 140);

    setSafu((prev) => prev + currentCpc);
    setTotalSafuEarned((prev) => prev + currentCpc);
    setTotalClicks((prev) => prev + 1);

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

  const handleBuyUpgrade = (id: string, cost: number, _cps: number, _cpc?: number) => {
    if (safu < cost) return;
    sound.playBuy();
    setSafu((prev) => prev - cost);
    setInventory((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleClaimAirdrop = () => {
    const bonusPoints = Math.max(50, Math.floor(basePassiveCps * 30) + 20);
    setSafu((prev) => prev + bonusPoints);
    setTotalSafuEarned((prev) => prev + bonusPoints);
    setFrenzyTimer(10);
    setToast(`🎁 ${t.airdropClaimed} (+${bonusPoints.toLocaleString()} SAFU)`);
    setTimeout(() => setToast(null), 4500);
  };

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
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(rgba(243, 186, 47, 0.15) 1px, transparent 1px), radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px, 20px 20px',
        }}
      />
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-[#F3BA2F]/5 rounded-full blur-[140px] pointer-events-none" />

      <AirdropFloating onClaim={handleClaimAirdrop} lang={lang} />

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

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-[90%] px-4 py-3 bg-[#181A20]/95 border-2 border-[#F3BA2F] text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-[0_10px_30px_rgba(243,186,47,0.3)] backdrop-blur-md flex items-center justify-center gap-2 animate-bounce">
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0B0E14]/90 backdrop-blur-md border-b border-[#20252D] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 md:gap-8 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F3BA2F] to-[#D99E10] flex items-center justify-center text-lg shadow-md font-bold text-[#0B0E14]">
            🍼
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap font-display">
            Baby SAFU <span className="text-[#F3BA2F]">Simulator</span>
          </span>
        </div>

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

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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

      {/* Banner */}
      <div className="w-full bg-gradient-to-r from-[#1E1B18] via-[#2A2315] to-[#1E1B18] border-b border-[#F3BA2F]/20 py-2.5 px-4 text-center">
        <p className="text-xs sm:text-sm font-medium text-[#F3BA2F] flex items-center justify-center gap-2">
          <span>{t.congratsBanner}</span>
        </p>
      </div>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <section className="lg:col-span-7 flex flex-col items-center justify-start gap-6">
          <div className="w-full bg-[#181A20] border border-[#2B313A] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
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
                  <span className="text-base sm:text-xl font-bold text-[#F3BA2F]">BNB</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <div className="px-3 py-1.5 rounded-xl bg-[#0B0E14] border border-[#2B313A] flex items-center gap-1.5">
                  <span className="text-[#848E9C]">{t.safuPerSec}:</span>
                  <span className="text-[#0ECB81] font-bold">+{currentCps.toLocaleString()}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-[#0B0E14] border border-[#2B313A] flex items-center gap-1.5">
                  <span className="text-[#848E9C]">{t.clickPower}:</span>
                  <span className="text-[#F3BA2F] font-bold">+{currentCpc.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{currentGrowthLevel.badge}</span>
                  <span className="font-bold text-white">{t[currentGrowthLevel.titleKey]}</span>
                </div>
                <span className="text-[#848E9C] font-mono">
                  {nextGrowthLevel
                    ? `${t.nextLevelAt} ${remainingSafu.toLocaleString()} SAFU`
                    : t.maxLevelReached}
                </span>
              </div>

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

          <div className="relative w-full py-6 sm:py-10 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[440px]">
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-dashed border-[#F3BA2F]/15 pointer-events-none animate-[spin_60s_linear_infinite]" />
            <div className="absolute w-56 h-56 sm:w-76 sm:h-76 rounded-full border border-[#2B313A] pointer-events-none" />

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
              <span className="text-xs font-bold text-white mt-1">CZ Rule #4</span>
            </div>
          </div>
        </section>

        <section className="lg:col-span-5 w-full">
          <UpgradesPanel
            currentSafu={safu}
            inventory={inventory}
            onBuyUpgrade={handleBuyUpgrade}
            lang={lang}
          />
        </section>
      </main>

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
