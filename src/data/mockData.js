// ── Hero stages ───────────────────────────────────────────────────────────
export const HERO_STAGES = ['Sprout','Seedling','Warrior','Champion','Legend'];
export const getHeroStage = (hp) => {
  if (hp >= 90) return 'Legend';
  if (hp >= 70) return 'Champion';
  if (hp >= 45) return 'Warrior';
  if (hp >= 20) return 'Seedling';
  return 'Sprout';
};

// ── Patients — iconName = lucide icon, countryCode = ISO-2 ───────────────
export const users = [
  { id:1,  rank:1,  name:'Priya Singh',      condition:'Dyslexia', hp:93, xp:1750, level:11, streak:14, countryCode:'IN', status:'Active'   },
  { id:2,  rank:2,  name:'Tony Stark',        condition:'ADHD',     hp:88, xp:1580, level:10, streak:12, countryCode:'US', status:'Active'   },
  { id:3,  rank:3,  name:'Sofia Rodriguez',   condition:'Autism',   hp:90, xp:1420, level:9,  streak:10, countryCode:'MX', status:'Active'   },
  { id:4,  rank:4,  name:'Emma Fischer',      condition:'Anxiety',  hp:82, xp:1320, level:9,  streak:6,  countryCode:'DE', status:'Active'   },
  { id:5,  rank:5,  name:'Alex Chen',         condition:'ADHD',     hp:85, xp:1240, level:8,  streak:7,  countryCode:'US', status:'Active'   },
  { id:6,  rank:6,  name:'Aisha Okafor',      condition:'Dyslexia', hp:78, xp:1100, level:7,  streak:9,  countryCode:'NG', status:'Active'   },
  { id:7,  rank:7,  name:'Maya Patel',        condition:'Dyslexia', hp:72, xp:980,  level:6,  streak:5,  countryCode:'IN', status:'Active'   },
  { id:8,  rank:8,  name:'Omar Hassan',       condition:'ADHD',     hp:68, xp:890,  level:6,  streak:4,  countryCode:'EG', status:'Active'   },
  { id:9,  rank:9,  name:'Leo Thompson',      condition:'Anxiety',  hp:60, xp:750,  level:5,  streak:3,  countryCode:'GB', status:'Active'   },
  { id:10, rank:10, name:'Jake Williams',     condition:'ADHD',     hp:45, xp:420,  level:3,  streak:1,  countryCode:'AU', status:'Active'   },
  { id:11, rank:11, name:'Liam Kim',          condition:'Anxiety',  hp:55, xp:640,  level:4,  streak:2,  countryCode:'KR', status:'Inactive' },
  { id:12, rank:12, name:'Sam Davis',         condition:'Autism',   hp:30, xp:210,  level:2,  streak:0,  countryCode:'GB', status:'Inactive' },
];

export const avatarColors = [
  '#7c3aed','#059669','#06b6d4','#d97706','#ec4899',
  '#3b82f6','#10b981','#8b5cf6','#ef4444','#f59e0b',
  '#14b8a6','#84cc16',
];

// ── Therapy Packs — iconName maps to lucide-react icons ──────────────────
export const therapyPacks = [
  { id:1, title:'Dyslexia Pack',   subtitle:'Mirror & Word Games',  iconName:'BookOpen',  bg:'#0e0e2a', color:'#67e8f9', patients:284, sessions:1240, rating:4.8,
    desc:'Letter Flip and Word Builder — identify mirror letters and build words from scrambled tiles to retrain reading pathways.' },
  { id:2, title:'ADHD Pack',       subtitle:'Focus Training',        iconName:'Zap',       bg:'#1a1a08', color:'#fcd34d', patients:196, sessions:880,  rating:4.6,
    desc:'Focus Sprint challenges train sustained attention and impulse control through rapid cognitive exercises.' },
  { id:3, title:'Autism Pack',     subtitle:'Social & Routine',      iconName:'Star',      bg:'#2a0a1a', color:'#f9a8d4', patients:158, sessions:720,  rating:4.9,
    desc:'Emotion Match and Routine Builder help develop social cognition and daily structure for children on the spectrum.' },
  { id:4, title:'Anxiety Pack',    subtitle:'Calming Exercises',     iconName:'Leaf',      bg:'#081a08', color:'#86efac', patients:212, sessions:960,  rating:4.7,
    desc:'Breath Bubble and Mystic Woods provide soothing mechanics — breathing pacing and a calm forest exploration walk.' },
  { id:5, title:'Medication Pack', subtitle:'Pill Hero Adherence',   iconName:'Pill',      bg:'#1a0a2a', color:'#c4b5fd', patients:341, sessions:2100, rating:4.9,
    desc:'The Pill Hero system gamifies daily medication tracking. Take pills → hero gains HP. Miss pills → hero loses HP.' },
  { id:6, title:'Mystic Woods',    subtitle:'Forest Walk / Anxiety', iconName:'TreePine',  bg:'#081408', color:'#4ade80', patients:142, sessions:540,  rating:4.5,
    desc:'Guided forest exploration. Walk your hero through calming woodland environments, unlocking new areas as anxiety reduces.' },
];

export const allGames = therapyPacks;

// ── Popular packs panel ──────────────────────────────────────────────────
export const popularGames = [
  { id:1, title:'Medication Pack', publisher:'Adherence Module', iconName:'Pill',     bg:'#1a0a2a', likes:341, plays:2100,
    desc:'Pill Hero — daily pill tracking with hero HP tied to adherence rate.' },
  { id:2, title:'Dyslexia Pack',   publisher:'Mirror & Words',   iconName:'BookOpen', bg:'#0e0e2a', likes:284, plays:1240,
    desc:'Letter Flip + Word Builder — retrain reading via gamified letter recognition.' },
  { id:3, title:'Anxiety Pack',    publisher:'Calming Series',   iconName:'Leaf',     bg:'#081a08', likes:212, plays:960,
    desc:'Breath Bubble + Mystic Woods — paced breathing exercises and calming forest walk.' },
  { id:4, title:'ADHD Pack',       publisher:'Focus Series',     iconName:'Zap',      bg:'#1a1a08', likes:196, plays:880,
    desc:'Focus Sprint — timed target exercises to improve impulse control.' },
  { id:5, title:'Autism Pack',     publisher:'Social Series',    iconName:'Star',     bg:'#2a0a1a', likes:158, plays:720,
    desc:'Emotion Match + Routine Builder — social cues and daily structure.' },
];

// ── Chart / time-series data ──────────────────────────────────────────────
export const weeklyActiveData = [
  { day:'Mon', sessions:42 }, { day:'Tue', sessions:68 },
  { day:'Wed', sessions:55 }, { day:'Thu', sessions:81 },
  { day:'Fri', sessions:74 }, { day:'Sat', sessions:38 },
  { day:'Sun', sessions:29 },
];
export const adherenceData = [
  { month:'Jan', rate:71 }, { month:'Feb', rate:74 },
  { month:'Mar', rate:69 }, { month:'Apr', rate:78 },
  { month:'May', rate:82 }, { month:'Jun', rate:85 },
  { month:'Jul', rate:88 }, { month:'Aug', rate:91 },
];
export const userGrowthData = [
  { month:'Jan', total:28,  new:8  }, { month:'Feb', total:42,  new:14 },
  { month:'Mar', total:58,  new:16 }, { month:'Apr', total:74,  new:16 },
  { month:'May', total:94,  new:20 }, { month:'Jun', total:112, new:18 },
  { month:'Jul', total:134, new:22 }, { month:'Aug', total:156, new:22 },
];
export const revenueData = [
  { month:'Jan', xp:3200  }, { month:'Feb', xp:5100  },
  { month:'Mar', xp:4600  }, { month:'Apr', xp:6800  },
  { month:'May', xp:7200  }, { month:'Jun', xp:9400  },
  { month:'Jul', xp:10800 }, { month:'Aug', xp:12600 },
];
export const conditionDistribution = [
  { name:'ADHD',     value:34, color:'#fcd34d' },
  { name:'Dyslexia', value:28, color:'#67e8f9' },
  { name:'Autism',   value:22, color:'#f9a8d4' },
  { name:'Anxiety',  value:16, color:'#86efac' },
];
export const gameDistribution = conditionDistribution;
export const heroStageData = [
  { stage:'Sprout',   count:18 }, { stage:'Seedling', count:32 },
  { stage:'Warrior',  count:45 }, { stage:'Champion', count:38 },
  { stage:'Legend',   count:23 },
];
export const retentionData = [
  { day:'Day 1',  rate:100 }, { day:'Day 3',  rate:84 },
  { day:'Day 7',  rate:71  }, { day:'Day 14', rate:62 },
  { day:'Day 30', rate:54  }, { day:'Day 60', rate:47 },
];
export const countryData = [
  { country:'United States',  users:38, pct:24 },
  { country:'India',          users:29, pct:19 },
  { country:'United Kingdom', users:21, pct:13 },
  { country:'Germany',        users:17, pct:11 },
  { country:'Australia',      users:14, pct:9  },
  { country:'Others',         users:37, pct:24 },
];
export const miniBarData  = [{ v:30 },{ v:55 },{ v:42 },{ v:71 },{ v:58 },{ v:82 },{ v:68 }];
export const miniLineData = [{ v:20 },{ v:38 },{ v:30 },{ v:52 },{ v:44 },{ v:67 },{ v:60 },{ v:74 },{ v:70 },{ v:88 }];
export const pillData = [
  { name:'Ritalin',    time:'08:00', adherence:92, color:'#7c3aed' },
  { name:'Sertraline', time:'12:00', adherence:87, color:'#06b6d4' },
  { name:'Melatonin',  time:'20:00', adherence:94, color:'#10b981' },
  { name:'Omega-3',    time:'08:00', adherence:78, color:'#f59e0b' },
  { name:'Vit D',      time:'12:00', adherence:65, color:'#ec4899' },
];
