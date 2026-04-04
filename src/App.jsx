import { useState, useEffect, useCallback, useRef } from "react";
import { AppButton, StatusChip, EmptyState } from "./components/ui";
import voiceService from "./services/voiceService";

// ════════════════════════════════════════
// PILLHERO v2 — Game4Health Hackathon
// ════════════════════════════════════════

const HERO_STAGES = [
  { name: "Sprout", minHP: 0, emoji: "🌱", color: "#ccc", desc: "Barely alive..." },
  { name: "Seedling", minHP: 20, emoji: "🌿", color: "#A8E6CF", desc: "Getting stronger!" },
  { name: "Warrior", minHP: 45, emoji: "⚔️", color: "#FFD93D", desc: "Ready to fight!" },
  { name: "Champion", minHP: 70, emoji: "🛡️", color: "#74B9FF", desc: "Almost legendary!" },
  { name: "Legend", minHP: 90, emoji: "👑", color: "#FDA7DF", desc: "UNSTOPPABLE!" },
];

const getHeroStage = (hp, max) => {
  const pct = (hp / max) * 100;
  for (let i = HERO_STAGES.length - 1; i >= 0; i--) {
    if (pct >= HERO_STAGES[i].minHP) return { ...HERO_STAGES[i], index: i };
  }
  return { ...HERO_STAGES[0], index: 0 };
};

const PACK_LIBRARY = [
  {
    id: "dyslexia",
    name: "Dyslexia Pack",
    condition: "dyslexia",
    color: "#74B9FF",
    icon: "🔤",
    weeklyTarget: 5,
    desc: "Reading, spelling, and letter-spotting missions.",
    games: [
      { id: "g1", name: "Letter Flip", cat: "dyslexia", icon: "🔤", diff: "Easy", desc: "Identify mirror letters" },
      { id: "g2", name: "Word Builder", cat: "dyslexia", icon: "🧩", diff: "Medium", desc: "Build words from scrambled letters" },
      { id: "g3", name: "Syllable Stomp", cat: "dyslexia", icon: "👣", diff: "Easy", desc: "Break words into syllables" },
      { id: "g6", name: "Mirror Letters", cat: "dyslexia", icon: "🪞", diff: "Medium", desc: "Spot the reversed letters" },
    ],
  },
  {
    id: "adhd",
    name: "ADHD Pack",
    condition: "adhd",
    color: "#FFB347",
    icon: "⚡",
    weeklyTarget: 4,
    desc: "Focus, impulse control, and short attention missions.",
    games: [
      { id: "a1", name: "Focus Sprint", cat: "adhd", icon: "🎯", diff: "Easy", desc: "Keep attention on the moving target" },
      { id: "a2", name: "Impulse Pause", cat: "adhd", icon: "⏸️", diff: "Medium", desc: "Wait before acting" },
      { id: "a3", name: "Memory Dash", cat: "adhd", icon: "🧠", diff: "Medium", desc: "Repeat the pattern fast" },
      { id: "a4", name: "Calm Countdown", cat: "adhd", icon: "🌬️", diff: "Easy", desc: "Slow breathing challenge" },
    ],
  },
  {
    id: "autism",
    name: "Autism Pack",
    condition: "autism",
    color: "#A29BFE",
    icon: "🧩",
    weeklyTarget: 4,
    desc: "Routine, emotion matching, and calm sensory-friendly missions.",
    games: [
      { id: "u1", name: "Routine Builder", cat: "autism", icon: "🗓️", diff: "Easy", desc: "Order the daily steps" },
      { id: "u2", name: "Emotion Match", cat: "autism", icon: "🙂", diff: "Medium", desc: "Match faces to feelings" },
      { id: "u3", name: "Calm Corner", cat: "autism", icon: "🫧", diff: "Easy", desc: "Breathing and calming practice" },
      { id: "u4", name: "Social Sequence", cat: "autism", icon: "🗣️", diff: "Medium", desc: "Choose the next social step" },
    ],
  },
  {
    id: "anxiety",
    name: "Anxiety Pack",
    condition: "anxiety",
    color: "#6BCB77",
    icon: "🌈",
    weeklyTarget: 4,
    desc: "Calming, breathing, and confidence-building missions, including Mystic Woods.",
    games: [
      { id: "mw1", name: "Mystic Woods", cat: "anxiety", icon: "🌲", diff: "Medium", desc: "Walk the forest trail and calm the mind" },
      { id: "n1", name: "Breath Bubble", cat: "anxiety", icon: "💨", diff: "Easy", desc: "Match breathing to bubble size" },
      { id: "n2", name: "Worry Drop", cat: "anxiety", icon: "🍃", diff: "Easy", desc: "Let worries float away" },
      { id: "n3", name: "Brave Steps", cat: "anxiety", icon: "👣", diff: "Medium", desc: "Pick the calm next step" },
      { id: "n4", name: "Safe Space", cat: "anxiety", icon: "🏡", diff: "Medium", desc: "Build a comfort routine" },
    ],
  },
  {
    id: "medication",
    name: "Medication Adherence Pack",
    condition: "medication",
    color: "#FFD93D",
    icon: "💊",
    weeklyTarget: 3,
    desc: "Daily habit and reminder missions for medicine routines.",
    games: [
      { id: "m1", name: "Dose Dodge", cat: "medication", icon: "💊", diff: "Easy", desc: "Match the right dose at the right time" },
      { id: "m2", name: "Reminder Run", cat: "medication", icon: "⏰", diff: "Easy", desc: "Follow the medicine schedule" },
      { id: "m3", name: "Habit Hero", cat: "medication", icon: "🏅", diff: "Medium", desc: "Keep the routine streak alive" },
    ],
  },
];

const INIT = {
  childName: "Yassine",
  childAvatar: "🧒",
  heroSkin: "knight",
  heroHP: 12,
  heroMaxHP: 100,
  xp: 20,
  xpToNext: 300,
  level: 2,
  totalPoints: 35,
  streak: 1,
  bestStreak: 7,
  pills: [
    { id: 1, name: "Vitamin D", dose: "1000 IU", time: "08:00", taken: true, color: "#FFD93D", icon: "☀️" },
    { id: 2, name: "Omega-3", dose: "500mg", time: "12:00", taken: false, color: "#74B9FF", icon: "🐟" },
    { id: 3, name: "Iron", dose: "18mg", time: "14:00", taken: false, color: "#FF7675", icon: "💪" },
    { id: 4, name: "Probiotic", dose: "10B CFU", time: "18:00", taken: false, color: "#A29BFE", icon: "🦠" },
    { id: 5, name: "Melatonin", dose: "1mg", time: "21:00", taken: false, color: "#6C5CE7", icon: "🌙" },
  ],
  conditions: ["dyslexia"],
  carePlan: {
    condition: "dyslexia",
    packId: null,
    packName: "No pack assigned",
    weeklyTarget: 5,
    active: false,
    assignedBy: "Parent",
  },
  assignedGames: [],
  availableGames: [
    { id: "g3", name: "Syllable Stomp", cat: "dyslexia", icon: "👣", diff: "Easy", desc: "Break words into syllables" },
    { id: "g4", name: "Reading Race", cat: "dyslexia", icon: "🏎️", diff: "Hard", desc: "Speed reading challenge" },
    { id: "g5", name: "Rhyme Time", cat: "dyslexia", icon: "🎵", diff: "Easy", desc: "Match words that rhyme" },
    { id: "g6", name: "Mirror Letters", cat: "dyslexia", icon: "🪞", diff: "Medium", desc: "Spot the reversed letters" },
    { id: "g7", name: "Story Sequencer", cat: "dyslexia", icon: "📖", diff: "Medium", desc: "Order story events correctly" },
    { id: "g8", name: "Phonics Blast", cat: "dyslexia", icon: "💥", diff: "Hard", desc: "Sound out tricky words" },
  ],
  rewards: [
    { id: "r1", name: "30min Screen Time", cost: 30, icon: "📱", cat: "Digital", claimed: false },
    { id: "r2", name: "Ice Cream Trip", cost: 80, icon: "🍦", cat: "Treats", claimed: false },
    { id: "r3", name: "New Toy", cost: 200, icon: "🧸", cat: "Big Prize", claimed: false },
    { id: "r4", name: "Park Day", cost: 25, icon: "🌳", cat: "Activities", claimed: false },
    { id: "r5", name: "Movie Night", cost: 60, icon: "🎬", cat: "Activities", claimed: false },
    { id: "r6", name: "Extra Dessert", cost: 15, icon: "🍰", cat: "Treats", claimed: false },
    { id: "r7", name: "Stay Up Late", cost: 40, icon: "🌃", cat: "Digital", claimed: false },
    { id: "r8", name: "Pizza Party", cost: 120, icon: "🍕", cat: "Big Prize", claimed: false },
    { id: "r9", name: "Choose Dinner", cost: 20, icon: "🍽️", cat: "Treats", claimed: false },
    { id: "r10", name: "Sticker Pack", cost: 10, icon: "⭐", cat: "Small", claimed: false },
  ],
  achievements: [
    { id: "a1", name: "First Pill!", icon: "💊", unlocked: true, desc: "Take your first pill" },
    { id: "a2", name: "3-Day Streak", icon: "🔥", unlocked: true, desc: "3 days in a row" },
    { id: "a3", name: "Game Master", icon: "🎮", unlocked: false, desc: "Play 10 games" },
    { id: "a4", name: "Perfect Day", icon: "🌟", unlocked: false, desc: "Take all pills in a day" },
    { id: "a5", name: "Hero Lv.5", icon: "👑", unlocked: false, desc: "Reach hero level 5" },
    { id: "a6", name: "Week Warrior", icon: "⚔️", unlocked: false, desc: "7-day streak" },
  ],
  pendingPillApprovals: [],
  pendingApprovals: [],
  log: [
    { text: "Took Vitamin D (waiting for parent confirmation)", time: "08:12 today", pts: 0, type: "pending" },
    { text: "No therapy games assigned yet", time: "Today", pts: 0, type: "info" },
    { text: "Played Letter Flip — scored 850!", time: "Yesterday", pts: 15, type: "game" },
    { text: "3-day streak bonus!", time: "Yesterday", pts: 20, type: "streak" },
    { text: "Took all pills", time: "2 days ago", pts: 25, type: "pill" },
    { text: "Played Word Builder", time: "3 days ago", pts: 12, type: "game" },
  ],
  weeklyPills: [5, 4, 5, 3, 5, 2, 1],
};

// ════════════════════════════════════════
// PARTICLES / CONFETTI
// ════════════════════════════════════════
function Confetti({ active }) {
  if (!active) return null;
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    dur: 1 + Math.random() * 1.5,
    color: ["#FFD93D", "#FF6B6B", "#6BCB77", "#74B9FF", "#A29BFE", "#FDA7DF"][i % 6],
    size: 6 + Math.random() * 8,
    rot: Math.random() * 360,
  }));
  return (
    <div className="confetti-layer">
      {pieces.map((p) => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.x}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`,
          background: p.color, width: p.size, height: p.size * 0.6,
          transform: `rotate(${p.rot}deg)`,
        }} />
      ))}
    </div>
  );
}

// ════════════════════════════════════════
// HERO SVG — Evolving Character
// ════════════════════════════════════════
function Hero({ hp, maxHP, size = 200, bounce = false, skin = "knight" }) {
  const r = hp / maxHP;
  const stage = getHeroStage(hp, maxHP);
  const skinMap = {
    knight: {
      primary: "#7A7F8A",
      secondary: "#525862",
      accent: "#F4B34B",
      cloth: "#9C5534",
      weapon: "#D9DEE6",
      hat: "#9CA3AF",
    },
    ranger: {
      primary: "#4E6C3D",
      secondary: "#2F4A2A",
      accent: "#C98F59",
      cloth: "#6D4A2E",
      weapon: "#8D613C",
      hat: "#3B5C31",
    },
    mage: {
      primary: "#4A6A84",
      secondary: "#2E4459",
      accent: "#C7E8FF",
      cloth: "#5B4365",
      weapon: "#7A593A",
      hat: "#3F5C74",
    },
  };
  const tone = skinMap[skin] || skinMap.knight;
  const hpGlow = r > 0.75 ? "#6BCB77" : r > 0.45 ? "#FFD93D" : "#FF8A65";

  const heroScale = 0.5 + r * 0.5;
  const droopY = r < 0.25 ? 4 : r < 0.5 ? 2 : 0;
  const heroOpacity = Math.max(0.5, 0.4 + r * 0.6);

  return (
    <div className={`hero-wrap hero-pixel ${bounce ? "hero-mega-bounce" : ""}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 96 96" width={size} height={size} shapeRendering="crispEdges" style={{ transform: `scale(${heroScale}) translateY(${droopY}px)`, opacity: heroOpacity, transition: "transform 0.8s ease, opacity 0.8s ease" }}>
        <defs>
          <filter id="pixelStickerStrong">
            <feMorphology operator="dilate" radius="1.8" in="SourceAlpha" result="outline" />
            <feFlood floodColor="#FFFFFF" floodOpacity="1" result="outlineColor" />
            <feComposite in="outlineColor" in2="outline" operator="in" result="sticker" />
            <feMerge>
              <feMergeNode in="sticker" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
            <feDropShadow dx="0" dy="3" stdDeviation="1.2" floodOpacity="0.24" />
          </filter>
        </defs>
        <g filter="url(#pixelStickerStrong)">
          <rect x="36" y="20" width="24" height="16" fill="#F2C186" />
          <rect x="34" y="18" width="28" height="6" fill={tone.hat} />
          <rect x="38" y="16" width="20" height="2" fill={tone.secondary} />

          <rect x="38" y="26" width="4" height="4" fill="#191919" />
          <rect x="54" y="26" width="4" height="4" fill="#191919" />
          {r > 0.32 ? <rect x="44" y="31" width="8" height="2" fill="#6A2E22" /> : <rect x="44" y="31" width="8" height="2" fill="#8F1E1E" />}

          <rect x="34" y="36" width="28" height="24" fill={tone.primary} />
          <rect x="38" y="40" width="20" height="12" fill={tone.secondary} />
          <rect x="44" y="52" width="8" height="8" fill={tone.accent} />

          <rect x="26" y="38" width="8" height="18" fill={tone.cloth} />
          <rect x="62" y="38" width="8" height="18" fill={tone.cloth} />

          <rect x="34" y="60" width="10" height="16" fill={tone.cloth} />
          <rect x="52" y="60" width="10" height="16" fill={tone.cloth} />
          <rect x="34" y="76" width="10" height="6" fill="#2E2E2E" />
          <rect x="52" y="76" width="10" height="6" fill="#2E2E2E" />

          {skin === "knight" && (
            <>
              <rect x="18" y="40" width="8" height="20" fill="#A67A4F" />
              <rect x="16" y="40" width="2" height="8" fill={tone.weapon} />
              <rect x="16" y="48" width="2" height="10" fill="#8B98A8" />
              <rect x="70" y="42" width="10" height="14" fill="#616A78" />
              <rect x="68" y="44" width="2" height="10" fill="#4D555E" />
            </>
          )}

          {skin === "ranger" && (
            <>
              <rect x="66" y="40" width="2" height="22" fill="#5C3A22" />
              <rect x="68" y="40" width="10" height="2" fill="#8D613C" />
              <rect x="68" y="60" width="10" height="2" fill="#8D613C" />
              <rect x="76" y="42" width="2" height="18" fill="#8D613C" />
              <rect x="23" y="44" width="8" height="12" fill="#7A4A2B" />
            </>
          )}

          {skin === "mage" && (
            <>
              <rect x="70" y="32" width="4" height="34" fill={tone.weapon} />
              <rect x="68" y="28" width="8" height="8" fill="#7ED7FF" />
              <rect x="22" y="42" width="10" height="16" fill="#7C3255" />
            </>
          )}

          {stage.index >= 2 && <rect x="33" y="38" width="30" height="2" fill="#F4E6C8" opacity="0.9" />}
          {stage.index >= 3 && <rect x="30" y="40" width="4" height="24" fill="#D94C4C" className="cape-flow" />}
          {stage.index >= 4 && (
            <>
              <rect x="40" y="12" width="16" height="4" fill="#FFD93D" />
              <rect x="42" y="8" width="3" height="4" fill="#FFD93D" />
              <rect x="47" y="6" width="3" height="6" fill="#FFD93D" />
              <rect x="52" y="8" width="3" height="4" fill="#FFD93D" />
            </>
          )}
        </g>

        {r < 0.25 && (
          <>
            <rect x="38" y="34" width="2" height="2" fill="#95A5A6" className="sparkle-float" style={{ animationDelay: "0s" }} />
            <rect x="56" y="34" width="2" height="2" fill="#95A5A6" className="sparkle-float" style={{ animationDelay: "0.5s" }} />
            <text x="48" y="90" textAnchor="middle" fontSize="6" fill="#BDC3C7" fontWeight="800">zzz</text>
          </>
        )}

        {r > 0.55 && (
          <>
            <rect x="16" y="18" width="3" height="3" fill={hpGlow} className="sparkle-float" style={{ animationDelay: "0s" }} />
            <rect x="76" y="24" width="3" height="3" fill={hpGlow} className="sparkle-float" style={{ animationDelay: "0.7s" }} />
            <rect x="12" y="64" width="3" height="3" fill={hpGlow} className="sparkle-float" style={{ animationDelay: "1.2s" }} />
            {r > 0.85 && <rect x="78" y="66" width="3" height="3" fill="#FFD93D" className="sparkle-float" style={{ animationDelay: "0.3s" }} />}
          </>
        )}
      </svg>
      {r > 0.75 && <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle, ${hpGlow}22 0%, transparent 70%)`, pointerEvents: "none", animation: "sparkle 3s ease-in-out infinite" }} />}
    </div>
  );
}

// ════════════════════════════════════════
// MINI-GAME: Letter Flip (Dyslexia)
// ════════════════════════════════════════
function GameLetterFlip({ onDone }) {
  const challenges = useRef([
    { prompt: "Which one is the letter B?", options: ["b", "d"], answer: "b" },
    { prompt: "Which one is the letter Q?", options: ["p", "q"], answer: "q" },
    { prompt: "Which word means 'existed'?", options: ["was", "saw"], answer: "was" },
    { prompt: "Which one is the letter M?", options: ["m", "w"], answer: "m" },
    { prompt: "Which word means 'not yes'?", options: ["on", "no"], answer: "no" },
    { prompt: "Which word is an animal?", options: ["dog", "bog"], answer: "dog" },
    { prompt: "Which is the letter N?", options: ["n", "u"], answer: "n" },
    { prompt: "Which word means 'jumped'?", options: ["pal", "lap"], answer: "lap" },
  ]).current;
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [fb, setFb] = useState(null);
  const [done, setDone] = useState(false);
  const total = 8;

  const pick = (ans) => {
    if (fb) return;
    const ok = ans === challenges[round].answer;
    const pts = ok ? 10 + combo * 5 : 0;
    setScore((s) => s + pts);
    setCombo(ok ? combo + 1 : 0);
    setFb(ok ? "right" : "wrong");
    setTimeout(() => {
      setFb(null);
      if (round + 1 >= total) { setDone(true); onDone(score + pts); }
      else setRound((r) => r + 1);
    }, 700);
  };

  if (done) return (
    <div className="game-done">
      <Confetti active={true} />
      <img src="/star.png" className="win-star" alt="Victory star" />
      <h2>Game Over!</h2>
      <div className="gd-score">{score} pts</div>
      <p>{score > 60 ? "You're a letter LEGEND!" : score > 30 ? "Great work! Keep going!" : "Nice try! Practice makes perfect!"}</p>
    </div>
  );

  const c = challenges[round];
  return (
    <div className="game-inner">
      <div className="gi-progress">
        {challenges.map((_, i) => <div key={i} className={`gi-dot ${i < round ? "gi-done" : i === round ? "gi-now" : ""}`} />)}
      </div>
      <div className="gi-stats">
        <span className="gi-score">⭐ {score}</span>
        {combo > 1 && <span className="gi-combo">🔥 x{combo}</span>}
      </div>
      <h2 className="gi-prompt">{c.prompt}</h2>
      <div className="gi-options">
        {c.options.map((o) => (
          <button key={o} className={`gi-card ${fb === "right" && o === c.answer ? "gi-correct" : ""} ${fb === "wrong" && o !== c.answer ? "gi-wrong" : ""}`}
            onClick={() => pick(o)}>
            <span className="gi-letter">{o}</span>
          </button>
        ))}
      </div>
      {fb && <div className={`gi-fb ${fb}`}>{fb === "right" ? "🎉 Correct!" : "❌ Try again next time!"}</div>}
    </div>
  );
}

// ════════════════════════════════════════
// MINI-GAME: Word Builder (Dyslexia)
// ════════════════════════════════════════
function GameWordBuilder({ onDone }) {
  const puzzles = useRef([
    { scrambled: ["a", "c", "t"], answer: "cat", hint: "🐱 A furry pet" },
    { scrambled: ["o", "d", "g"], answer: "dog", hint: "🐕 Man's best friend" },
    { scrambled: ["n", "s", "u"], answer: "sun", hint: "☀️ Shines in the sky" },
    { scrambled: ["p", "a", "m"], answer: "map", hint: "🗺️ Shows directions" },
    { scrambled: ["t", "a", "h"], answer: "hat", hint: "🎩 Wear on your head" },
    { scrambled: ["p", "c", "u"], answer: "cup", hint: "☕ Drink from it" },
  ]).current;
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState([]);
  const [avail, setAvail] = useState([...puzzles[0].scrambled].sort(() => Math.random() - 0.5));
  const [score, setScore] = useState(0);
  const [fb, setFb] = useState(null);
  const [done, setDone] = useState(false);

  const addLetter = (letter, idx) => {
    if (fb) return;
    const newSel = [...selected, letter];
    const newAvail = avail.filter((_, i) => i !== idx);
    setSelected(newSel);
    setAvail(newAvail);
    if (newSel.length === puzzles[round].scrambled.length) {
      const word = newSel.join("");
      const ok = word === puzzles[round].answer;
      setScore(s => s + (ok ? 20 : 0));
      setFb(ok ? "right" : "wrong");
      setTimeout(() => {
        setFb(null);
        if (round + 1 >= puzzles.length) { setDone(true); onDone(score + (ok ? 20 : 0)); }
        else {
          const next = round + 1;
          setRound(next);
          setSelected([]);
          setAvail([...puzzles[next].scrambled].sort(() => Math.random() - 0.5));
        }
      }, 900);
    }
  };

  const removeLetter = (letter, idx) => {
    if (fb) return;
    setSelected(selected.filter((_, i) => i !== idx));
    setAvail([...avail, letter]);
  };

  if (done) return (
    <div className="game-done">
      <Confetti active={true} />
      <img src="/star.png" className="win-star" alt="Victory star" />
      <h2>Words Built!</h2>
      <div className="gd-score">{score} pts</div>
    </div>
  );

  const p = puzzles[round];
  return (
    <div className="game-inner">
      <div className="gi-progress">
        {puzzles.map((_, i) => <div key={i} className={`gi-dot ${i < round ? "gi-done" : i === round ? "gi-now" : ""}`} />)}
      </div>
      <span className="gi-score" style={{ display: "block", textAlign: "center", marginBottom: 8 }}>⭐ {score}</span>
      <p className="wb-hint">{p.hint}</p>
      <div className="wb-slots">
        {p.scrambled.map((_, i) => (
          <div key={i} className={`wb-slot ${selected[i] ? "wb-filled" : ""} ${fb === "right" ? "wb-correct" : ""} ${fb === "wrong" ? "wb-wrong" : ""}`}
            onClick={() => selected[i] && removeLetter(selected[i], i)}>
            {selected[i] || ""}
          </div>
        ))}
      </div>
      <div className="wb-bank">
        {avail.map((l, i) => (
          <button key={i} className="wb-tile" onClick={() => addLetter(l, i)}>{l}</button>
        ))}
      </div>
      {fb && <div className={`gi-fb ${fb}`}>{fb === "right" ? "🎉 Correct!" : "❌ Oops! The word was: " + p.answer}</div>}
    </div>
  );
}

// ════════════════════════════════════════
// MINI-GAME: Breath Bubble (Anxiety)
// ════════════════════════════════════════
function GameBreathBubble({ onDone }) {
  const [phase, setPhase] = useState("inhale");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [size, setSize] = useState(60);
  const [target, setTarget] = useState(140);
  const [holding, setHolding] = useState(false);
  const [fb, setFb] = useState(null);
  const [done, setDone] = useState(false);
  const total = 6;
  const growRef = useRef(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const patterns = useRef([
    { label: "Breathe In slowly...", dir: "grow", target: 150 },
    { label: "Breathe Out gently...", dir: "shrink", target: 60 },
    { label: "Big breath In!", dir: "grow", target: 160 },
    { label: "Slow breath Out...", dir: "shrink", target: 50 },
    { label: "Deep breath In...", dir: "grow", target: 155 },
    { label: "Let it all Out...", dir: "shrink", target: 55 },
  ]).current;

  useEffect(() => {
    setTarget(patterns[round]?.target || 140);
    setPhase(patterns[round]?.dir === "grow" ? "inhale" : "exhale");
  }, [round, patterns]);

  const onPointerDown = () => {
    if (fb || done) return;
    setHolding(true);
    growRef.current = setInterval(() => {
      setSize(s => {
        const dir = phaseRef.current === "inhale" ? 1.8 : -1.8;
        return Math.max(30, Math.min(180, s + dir));
      });
    }, 30);
  };

  const onPointerUp = () => {
    if (!holding || fb || done) return;
    setHolding(false);
    clearInterval(growRef.current);
    const diff = Math.abs(size - target);
    const pts = diff < 15 ? 20 : diff < 30 ? 12 : 5;
    setScore(s => s + pts);
    setFb(diff < 15 ? "perfect" : diff < 30 ? "good" : "ok");
    setTimeout(() => {
      setFb(null);
      if (round + 1 >= total) { setDone(true); onDone(score + pts); }
      else { setRound(r => r + 1); setSize(patterns[round]?.dir === "grow" ? 60 : 150); }
    }, 800);
  };

  useEffect(() => () => clearInterval(growRef.current), []);

  if (done) return (
    <div className="game-done">
      <Confetti active={true} />
      <img src="/star.png" className="win-star" alt="Victory star" />
      <h2>Calm Achieved!</h2>
      <div className="gd-score">{score} pts</div>
      <p>Great breathing! Your body feels so relaxed now.</p>
    </div>
  );

  const p = patterns[round];
  return (
    <div className="game-inner" style={{ userSelect: "none" }}>
      <div className="gi-progress">
        {patterns.map((_, i) => <div key={i} className={`gi-dot ${i < round ? "gi-done" : i === round ? "gi-now" : ""}`} />)}
      </div>
      <span className="gi-score" style={{ display: "block", textAlign: "center", marginBottom: 8 }}>⭐ {score}</span>
      <h2 className="gi-prompt">{p.label}</h2>
      <p style={{ fontSize: 13, color: "#999", marginBottom: 16, textAlign: "center" }}>
        {phase === "inhale" ? "Hold to grow the bubble" : "Hold to shrink the bubble"}
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, position: "relative" }}>
        <div style={{
          width: size, height: size, borderRadius: "50%", transition: holding ? "none" : "all 0.3s",
          background: `radial-gradient(circle at 35% 35%, #89F7FE, #66A6FF)`,
          boxShadow: `0 0 ${size / 3}px rgba(102,166,255,0.4)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 28, opacity: 0.7 }}>💨</span>
        </div>
        <div style={{
          position: "absolute", width: target, height: target, borderRadius: "50%",
          border: "3px dashed rgba(102,166,255,0.35)", pointerEvents: "none",
        }} />
      </div>
      <button
        onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
        style={{
          marginTop: 20, padding: "16px 48px", borderRadius: 18, border: "none", fontSize: 18, fontWeight: 800,
          background: holding ? "linear-gradient(135deg,#66A6FF,#89F7FE)" : "linear-gradient(135deg,#89F7FE,#66A6FF)",
          color: "white", cursor: "pointer", fontFamily: "var(--font-body)", transform: holding ? "scale(0.95)" : "scale(1)",
          transition: "transform 0.15s",
        }}>
        {holding ? (phase === "inhale" ? "Breathing In..." : "Breathing Out...") : "Hold to Breathe"}
      </button>
      {fb && <div className={`gi-fb ${fb === "perfect" ? "right" : fb === "good" ? "right" : "wrong"}`}>
        {fb === "perfect" ? "🌟 Perfect breath!" : fb === "good" ? "👍 Good job!" : "💪 Keep practicing!"}
      </div>}
    </div>
  );
}

// ════════════════════════════════════════
// MINI-GAME: Focus Sprint (ADHD)
// ════════════════════════════════════════
function GameFocusSprint({ onDone }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [fb, setFb] = useState(null);
  const [done, setDone] = useState(false);
  const [timer, setTimer] = useState(3.0);
  const timerRef = useRef(null);
  const total = 10;

  const challenges = useRef(Array.from({ length: total }, () => {
    const shapes = ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠"];
    const targetIdx = Math.floor(Math.random() * shapes.length);
    const targetShape = shapes[targetIdx];
    const gridSize = 9;
    const correctPos = Math.floor(Math.random() * gridSize);
    const grid = Array.from({ length: gridSize }, (_, i) => {
      if (i === correctPos) return targetShape;
      let s;
      do { s = shapes[Math.floor(Math.random() * shapes.length)]; } while (s === targetShape);
      return s;
    });
    return { target: targetShape, grid, correctPos };
  })).current;

  useEffect(() => {
    if (done || fb) return;
    setTimer(3.0);
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 0.1) {
          clearInterval(timerRef.current);
          setFb("timeout");
          setCombo(0);
          setTimeout(() => {
            setFb(null);
            if (round + 1 >= total) { setDone(true); onDone(score); }
            else setRound(r => r + 1);
          }, 600);
          return 0;
        }
        return Math.round((t - 0.1) * 10) / 10;
      });
    }, 100);
    return () => clearInterval(timerRef.current);
  }, [round, done, fb]);

  const pick = (idx) => {
    if (fb || done) return;
    clearInterval(timerRef.current);
    const ok = idx === challenges[round].correctPos;
    const timeBonus = Math.round(timer * 5);
    const pts = ok ? 10 + combo * 3 + timeBonus : 0;
    setScore(s => s + pts);
    setCombo(ok ? combo + 1 : 0);
    setFb(ok ? "right" : "wrong");
    setTimeout(() => {
      setFb(null);
      if (round + 1 >= total) { setDone(true); onDone(score + pts); }
      else setRound(r => r + 1);
    }, 500);
  };

  if (done) return (
    <div className="game-done">
      <Confetti active={true} />
      <img src="/star.png" className="win-star" alt="Victory star" />
      <h2>Focus Complete!</h2>
      <div className="gd-score">{score} pts</div>
      <p>{score > 100 ? "Lightning fast reflexes!" : "Great focus practice!"}</p>
    </div>
  );

  const c = challenges[round];
  return (
    <div className="game-inner">
      <div className="gi-progress">
        {challenges.map((_, i) => <div key={i} className={`gi-dot ${i < round ? "gi-done" : i === round ? "gi-now" : ""}`} />)}
      </div>
      <div className="gi-stats">
        <span className="gi-score">⭐ {score}</span>
        {combo > 1 && <span className="gi-combo">🔥 x{combo}</span>}
      </div>
      <h2 className="gi-prompt">Find the {c.target} quickly!</h2>
      <div style={{ fontSize: 14, color: timer < 1 ? "#E74C3C" : "#999", fontWeight: 800, marginBottom: 12, textAlign: "center" }}>
        ⏱️ {timer.toFixed(1)}s
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, maxWidth: 280, width: "100%",
      }}>
        {c.grid.map((shape, i) => (
          <button key={i} onClick={() => pick(i)} style={{
            width: "100%", aspectRatio: "1", fontSize: 36, border: `3px solid ${fb === "right" && i === c.correctPos ? "#6BCB77" : fb === "wrong" && i === c.correctPos ? "#FFD93D" : "#e0e0e0"}`,
            borderRadius: 16, background: fb === "right" && i === c.correctPos ? "#E8FFF0" : "white",
            cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {shape}
          </button>
        ))}
      </div>
      {fb && <div className={`gi-fb ${fb === "right" ? "right" : "wrong"}`}>
        {fb === "right" ? "🎉 Found it!" : fb === "timeout" ? "⏰ Too slow!" : "❌ Wrong one!"}
      </div>}
    </div>
  );
}

// ════════════════════════════════════════
// MINI-GAME: Emotion Match (Autism)
// ════════════════════════════════════════
function GameEmotionMatch({ onDone }) {
  const challenges = useRef([
    { face: "😊", options: ["Happy", "Sad", "Angry"], answer: "Happy" },
    { face: "😢", options: ["Excited", "Sad", "Bored"], answer: "Sad" },
    { face: "😠", options: ["Happy", "Scared", "Angry"], answer: "Angry" },
    { face: "😨", options: ["Scared", "Tired", "Happy"], answer: "Scared" },
    { face: "😴", options: ["Angry", "Tired", "Sad"], answer: "Tired" },
    { face: "🤩", options: ["Bored", "Excited", "Scared"], answer: "Excited" },
    { face: "😕", options: ["Confused", "Happy", "Angry"], answer: "Confused" },
    { face: "🥰", options: ["Loved", "Tired", "Scared"], answer: "Loved" },
  ]).current;
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [fb, setFb] = useState(null);
  const [done, setDone] = useState(false);

  const pick = (ans) => {
    if (fb) return;
    const ok = ans === challenges[round].answer;
    const pts = ok ? 15 + combo * 5 : 0;
    setScore(s => s + pts);
    setCombo(ok ? combo + 1 : 0);
    setFb(ok ? "right" : "wrong");
    setTimeout(() => {
      setFb(null);
      if (round + 1 >= challenges.length) { setDone(true); onDone(score + pts); }
      else setRound(r => r + 1);
    }, 700);
  };

  if (done) return (
    <div className="game-done">
      <Confetti active={true} />
      <img src="/star.png" className="win-star" alt="Victory star" />
      <h2>Emotions Mastered!</h2>
      <div className="gd-score">{score} pts</div>
      <p>{score > 80 ? "You really understand feelings!" : "Great job recognizing emotions!"}</p>
    </div>
  );

  const c = challenges[round];
  return (
    <div className="game-inner">
      <div className="gi-progress">
        {challenges.map((_, i) => <div key={i} className={`gi-dot ${i < round ? "gi-done" : i === round ? "gi-now" : ""}`} />)}
      </div>
      <div className="gi-stats">
        <span className="gi-score">⭐ {score}</span>
        {combo > 1 && <span className="gi-combo">🔥 x{combo}</span>}
      </div>
      <div style={{ fontSize: 80, textAlign: "center", margin: "12px 0 8px", animation: "popIn 0.3s ease" }}>{c.face}</div>
      <h2 className="gi-prompt">How is this person feeling?</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 300 }}>
        {c.options.map(o => (
          <button key={o} onClick={() => pick(o)} style={{
            padding: "14px 20px", borderRadius: 16, fontSize: 17, fontWeight: 800,
            border: `3px solid ${fb === "right" && o === c.answer ? "#6BCB77" : fb === "wrong" && o !== c.answer ? "#eee" : fb === "wrong" && o === c.answer ? "#FFD93D" : "#e0e0e0"}`,
            background: fb === "right" && o === c.answer ? "#E8FFF0" : "white",
            cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.15s", color: "#2D3436",
          }}>
            {o}
          </button>
        ))}
      </div>
      {fb && <div className={`gi-fb ${fb}`}>{fb === "right" ? "🎉 That's right!" : `❌ It was: ${c.answer}`}</div>}
    </div>
  );
}

// ════════════════════════════════════════
// MINI-GAME: Routine Builder (Autism)
// ════════════════════════════════════════
function GameRoutineBuilder({ onDone }) {
  const puzzles = useRef([
    { title: "Morning Routine", steps: ["Wake up", "Brush teeth", "Get dressed", "Eat breakfast", "Go to school"], icon: "🌅" },
    { title: "Bedtime Routine", steps: ["Take a bath", "Put on pajamas", "Brush teeth", "Read a story", "Go to sleep"], icon: "🌙" },
    { title: "Meal Time", steps: ["Wash hands", "Set the table", "Eat food", "Drink water", "Clean up"], icon: "🍽️" },
    { title: "Going Outside", steps: ["Check weather", "Put on shoes", "Grab jacket", "Tell a parent", "Go outside"], icon: "🚪" },
  ]).current;
  const [round, setRound] = useState(0);
  const [order, setOrder] = useState([]);
  const [pool, setPool] = useState(() => [...puzzles[0].steps].sort(() => Math.random() - 0.5));
  const [score, setScore] = useState(0);
  const [fb, setFb] = useState(null);
  const [done, setDone] = useState(false);

  const pickStep = (step) => {
    if (fb) return;
    const nextIdx = order.length;
    const correct = puzzles[round].steps[nextIdx];
    const ok = step === correct;
    const newOrder = [...order, step];
    setOrder(newOrder);
    setPool(pool.filter(s => s !== step));

    if (!ok) {
      setFb("wrong");
      setTimeout(() => {
        setFb(null);
        setOrder([]);
        setPool([...puzzles[round].steps].sort(() => Math.random() - 0.5));
      }, 800);
      return;
    }

    if (newOrder.length === puzzles[round].steps.length) {
      const pts = 25;
      setScore(s => s + pts);
      setFb("right");
      setTimeout(() => {
        setFb(null);
        if (round + 1 >= puzzles.length) { setDone(true); onDone(score + pts); }
        else {
          const next = round + 1;
          setRound(next);
          setOrder([]);
          setPool([...puzzles[next].steps].sort(() => Math.random() - 0.5));
        }
      }, 900);
    }
  };

  if (done) return (
    <div className="game-done">
      <Confetti active={true} />
      <img src="/star.png" className="win-star" alt="Victory star" />
      <h2>Routines Nailed!</h2>
      <div className="gd-score">{score} pts</div>
      <p>You know exactly what to do and when!</p>
    </div>
  );

  const p = puzzles[round];
  return (
    <div className="game-inner">
      <div className="gi-progress">
        {puzzles.map((_, i) => <div key={i} className={`gi-dot ${i < round ? "gi-done" : i === round ? "gi-now" : ""}`} />)}
      </div>
      <span className="gi-score" style={{ display: "block", textAlign: "center", marginBottom: 8 }}>⭐ {score}</span>
      <div style={{ fontSize: 40, textAlign: "center" }}>{p.icon}</div>
      <h2 className="gi-prompt">{p.title}</h2>
      <p style={{ fontSize: 13, color: "#999", marginBottom: 12, textAlign: "center" }}>Tap the steps in the right order!</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", maxWidth: 320, marginBottom: 16 }}>
        {p.steps.map((_, i) => (
          <div key={i} style={{
            padding: "10px 14px", borderRadius: 12, fontSize: 14, fontWeight: 700,
            border: `2px solid ${order[i] ? "#6BCB77" : "#e8e8e8"}`,
            background: order[i] ? "#E8FFF0" : "#FAFAFA", color: order[i] ? "#27AE60" : "#ccc",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ width: 24, height: 24, borderRadius: "50%", background: order[i] ? "#6BCB77" : "#e0e0e0", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
              {i + 1}
            </span>
            {order[i] || "..."}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 320 }}>
        {pool.map(step => (
          <button key={step} onClick={() => pickStep(step)} style={{
            padding: "12px 16px", borderRadius: 14, fontSize: 15, fontWeight: 700,
            border: "2px solid #74B9FF", background: "linear-gradient(135deg,#F0F7FF,#FFFFFF)",
            cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.15s", color: "#2D3436",
          }}>
            {step}
          </button>
        ))}
      </div>
      {fb && <div className={`gi-fb ${fb}`} style={{ marginTop: 12 }}>
        {fb === "right" ? "🎉 Perfect order!" : "❌ Wrong step! Try again from the start."}
      </div>}
    </div>
  );
}

// ════════════════════════════════════════
// MINI-GAME: Mystic Woods (Anxiety / Calm Quest)
// ════════════════════════════════════════
function GameMysticWoods({ onDone }) {
  const path = useRef([
    {
      title: "Enter the Woods",
      prompt: "The forest gate glows. What helps the hero start safely?",
      options: ["Take a slow breath", "Run in fast", "Hide and wait"],
      answer: "Take a slow breath",
      reward: 20,
    },
    {
      title: "Moon Pond",
      prompt: "A calm pond appears. What keeps the hero balanced?",
      options: ["Look at the water and breathe", "Jump in the water", "Shout loudly"],
      answer: "Look at the water and breathe",
      reward: 20,
    },
    {
      title: "Lantern Trail",
      prompt: "Three lantern paths are ahead. Which path feels safest?",
      options: ["The bright clear path", "The dark shaky path", "The noisy windy path"],
      answer: "The bright clear path",
      reward: 25,
    },
    {
      title: "Forest Spirit",
      prompt: "The spirit asks for one calm move. What should the hero do?",
      options: ["Count 3 slow breaths", "Hold the breath forever", "Rush to the end"],
      answer: "Count 3 slow breaths",
      reward: 30,
    },
  ]).current;
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);
  const current = path[step];

  const pick = (choice) => {
    if (feedback) return;
    const correct = choice === current.answer;
    setFeedback(correct ? "right" : "wrong");
    if (correct) setScore((value) => value + current.reward);

    setTimeout(() => {
      setFeedback(null);
      if (!correct) return;
      if (step + 1 >= path.length) {
        const finalScore = score + current.reward;
        setDone(true);
        onDone(finalScore);
      } else {
        setStep((value) => value + 1);
      }
    }, 750);
  };

  if (done) {
    return (
      <div className="game-done mystic-done">
        <Confetti active={true} />
        <div className="gd-emoji">🌲</div>
        <h2>Mystic Woods Cleared!</h2>
        <div className="gd-score">{score} pts</div>
        <p>The forest is calm now. Your hero learned a peaceful routine.</p>
      </div>
    );
  }

  return (
    <div className="game-inner mystic-woods">
      <div className="mystic-scene">
        <div className="mystic-sky">
          <span>🌙</span>
          <span>✨</span>
          <span>🌟</span>
        </div>
        <div className="mystic-trees">
          <span>🌲</span>
          <span>🌳</span>
          <span>🌲</span>
        </div>
      </div>

      <div className="gi-progress">
        {path.map((_, i) => <div key={i} className={`gi-dot ${i < step ? "gi-done" : i === step ? "gi-now" : ""}`} />)}
      </div>

      <h2 className="gi-prompt">{current.title}</h2>
      <p className="mystic-prompt">{current.prompt}</p>

      <div className="mystic-options">
        {current.options.map((choice) => (
          <button
            key={choice}
            className={`mystic-option ${feedback === "right" && choice === current.answer ? "mystic-right" : ""} ${feedback === "wrong" && choice !== current.answer ? "mystic-wrong" : ""}`}
            onClick={() => pick(choice)}
          >
            {choice}
          </button>
        ))}
      </div>

      {feedback && <div className={`gi-fb ${feedback}`}>{feedback === "right" ? "🌿 Calm choice!" : "🫧 Try the calmer path."}</div>}
    </div>
  );
}

// ════════════════════════════════════════
// GAME WRAPPER
// ════════════════════════════════════════
function renderGameEngine(gameId, cat, onDone) {
  if (gameId === "g1" || gameId === "g6") return <GameLetterFlip onDone={onDone} />;
  if (gameId === "g2" || gameId === "g3") return <GameWordBuilder onDone={onDone} />;
  if (gameId === "mw1") return <GameMysticWoods onDone={onDone} />;
  if (cat === "anxiety") return <GameBreathBubble onDone={onDone} />;
  if (cat === "adhd") return <GameFocusSprint onDone={onDone} />;
  if (cat === "autism" && (gameId === "u2" || gameId === "u4")) return <GameEmotionMatch onDone={onDone} />;
  if (cat === "autism") return <GameRoutineBuilder onDone={onDone} />;
  if (cat === "medication") return <GameFocusSprint onDone={onDone} />;
  return <GameLetterFlip onDone={onDone} />;
}

function GameScreen({ game, onBack, onScore }) {
  const [started, setStarted] = useState(false);
  const [finalScore, setFinalScore] = useState(null);

  const handleDone = (pts) => {
    setFinalScore(pts);
    onScore(pts);
    // Voice feedback on game completion
    const trigger = pts > 60 ? "game_win_high" : "game_win_normal";
    voiceService.speak(trigger, { score: pts }, "high");
  };

  if (finalScore !== null) {
    return (
      <div className="game-screen">
        <div className="gs-header">
          <button className="gs-back" onClick={onBack}>← Done</button>
          <span className="gs-title">{game.name}</span>
          <span />
        </div>
        {renderGameEngine(game.id, game.cat, handleDone)}
      </div>
    );
  }

  if (!started) {
    return (
      <div className="game-screen">
        <div className="gs-header">
          <button className="gs-back" onClick={onBack}>← Back</button>
          <span className="gs-title">{game.name}</span>
          <span />
        </div>
        <div className="gs-intro">
          <div className="gsi-icon">{game.icon}</div>
          <h2>{game.name}</h2>
          <p className="gsi-desc">{game.desc}</p>
          <div className="gsi-diff" data-diff={game.diff}>{game.diff}</div>
          {game.best > 0 && <p className="gsi-best">Your best: ⭐ {game.best}</p>}
          <AppButton className="btn-go" onClick={() => { setStarted(true); voiceService.speak("game_start", {}, "high"); }}>
            <span>Let's Go!</span>
            <span className="btn-go-arrow">→</span>
          </AppButton>
        </div>
      </div>
    );
  }

  return (
    <div className="game-screen">
      <div className="gs-header">
        <button className="gs-back" onClick={onBack}>← Quit</button>
        <span className="gs-title">{game.name}</span>
        <span />
      </div>
      {renderGameEngine(game.id, game.cat, handleDone)}
    </div>
  );
}

function WeeklyStory({ s, stage, pillsDone, weeklyGameSessions, weeklyTarget, variant = "child" }) {
  const progress = Math.min(100, Math.round(((pillsDone + weeklyGameSessions) / Math.max(s.pills.length + weeklyTarget, 1)) * 100));
  const styleLabel = variant === "parent" ? "Family Progress Story" : "My Health Story";
  const intro = variant === "parent"
    ? "This week shows how the family helped health goals become a routine."
    : "This week shows how medicine and therapy are helping your hero get stronger.";

  return (
    <div className="weekly-story">
      <div className="ws-hero">
        <div className="ws-badge">📖 {styleLabel}</div>
        <h3>{intro}</h3>
        <p>{s.childName}'s hero is now {stage.name.toLowerCase()}, {pillsDone} pills are done, and {weeklyGameSessions} therapy sessions are complete.</p>
      </div>

      <div className="ws-grid">
        <div className="ws-card">
          <span className="ws-kicker">Hero Stage</span>
          <strong>{stage.emoji} {stage.name}</strong>
          <span>{stage.desc}</span>
        </div>
        <div className="ws-card">
          <span className="ws-kicker">Medicine</span>
          <strong>{pillsDone}/{s.pills.length}</strong>
          <span>Pills completed this cycle</span>
        </div>
        <div className="ws-card">
          <span className="ws-kicker">Therapy</span>
          <strong>{weeklyGameSessions}/{weeklyTarget}</strong>
          <span>Dyslexia sessions this week</span>
        </div>
        <div className="ws-card">
          <span className="ws-kicker">Points</span>
          <strong>⭐ {s.totalPoints}</strong>
          <span>Rewards earned and waiting</span>
        </div>
      </div>

      <div className="ws-timeline">
        {[
          { title: "Medicine missions", note: `${pillsDone} completed`, tone: pillsDone > 0 ? "success" : "warning" },
          { title: "Care plan sessions", note: `${weeklyGameSessions}/${weeklyTarget} completed`, tone: weeklyGameSessions > 0 ? "success" : "warning" },
          { title: "Hero growth", note: `${stage.name} stage unlocked`, tone: "info" },
          { title: "Family reward loop", note: variant === "parent" ? "Parent approvals keep rewards fair" : "Ask a parent to unlock rewards", tone: "neutral" },
        ].map((item) => (
          <div key={item.title} className="ws-row">
            <StatusChip tone={item.tone}>{item.title}</StatusChip>
            <span>{item.note}</span>
          </div>
        ))}
      </div>

      <div className="ws-progress">
        <div className="ws-progress-head">
          <span>Weekly health story progress</span>
          <strong>{progress}%</strong>
        </div>
        <div className="ws-track"><div className="ws-fill" style={{ width: `${progress}%` }} /></div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// CHILD DASHBOARD
// ════════════════════════════════════════
function ChildApp({ s, set, logout, dyslexiaMode, onToggleDyslexiaMode }) {
  const [tab, setTab] = useState("home");
  const [game, setGame] = useState(null);
  const [heroBounce, setHeroBounce] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [popup, setPopup] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(() => voiceService.getEnabled());
  const [autoReminders, setAutoReminders] = useState(() => voiceService.getAutoReminders());
  const [coachStyle, setCoachStyle] = useState(() => voiceService.getStyle());
  const [voiceReady, setVoiceReady] = useState(false);
  const lastSpokenPillRef = useRef(null);

  const stage = getHeroStage(s.heroHP, s.heroMaxHP);
  const heroSkin = s.heroSkin || "knight";
  const pillsDone = s.pills.filter(p => p.taken).length;
  const nextPill = s.pills.find(p => !p.taken);
  const activePack = PACK_LIBRARY.find((pack) => pack.id === s.carePlan?.packId) || null;
  const weeklyTarget = s.carePlan?.weeklyTarget || 5;
  const weeklyGameSessions = s.assignedGames.reduce((a, g) => a + g.played, 0);
  const carePlanProgress = Math.min(100, Math.round((weeklyGameSessions / Math.max(weeklyTarget, 1)) * 100));
  const confirmedPillEvents = s.log.filter(l => l.type === "pill").length;
  const medicineGateMet = confirmedPillEvents >= 2;
  const therapyGateMet = s.assignedGames.length === 0 ? true : weeklyGameSessions >= Math.min(2, weeklyTarget);
  const rewardGateMet = medicineGateMet && therapyGateMet;

  // ── Voice service integration ──
  useEffect(() => {
    voiceService.init();
    setVoiceReady(voiceService.isReady());
    return () => voiceService.cleanup();
  }, []);

  useEffect(() => {
    voiceService.setEnabled(voiceEnabled);
    voiceService.setAutoReminders(autoReminders);
    voiceService.setStyle(coachStyle);
  }, [voiceEnabled, autoReminders, coachStyle]);

  useEffect(() => {
    if (!nextPill) { lastSpokenPillRef.current = null; return; }
    if (!autoReminders || !voiceEnabled) return;
    if (lastSpokenPillRef.current === nextPill.id) return;
    lastSpokenPillRef.current = nextPill.id;
    const timer = setTimeout(() => {
      voiceService.speak("pill_reminder", { childName: s.childName, pillName: nextPill.name }, "high");
    }, 500);
    return () => clearTimeout(timer);
  }, [autoReminders, nextPill, s.childName, voiceEnabled]);

  const takePill = (id) => {
    setHeroBounce(true);
    const pill = s.pills.find(p => p.id === id);
    const newPills = s.pills.map(p => p.id === id ? { ...p, taken: true } : p);
    const allDone = newPills.every(p => p.taken);
    if (allDone) setConfetti(true);
    set(prev => ({
      ...prev,
      pills: newPills,
      heroHP: Math.min(prev.heroHP + 15, prev.heroMaxHP),
      xp: prev.xp + 12,
      pendingPillApprovals: [
        { id: `pill-${pill.id}-${Date.now()}`, reason: `${pill.name} completed`, pts: 10, type: "pill", when: "Just now" },
        ...(allDone ? [{ id: `perfect-day-${Date.now()}`, reason: "Perfect medicine day", pts: 25, type: "perfect", when: "Just now" }] : []),
        ...prev.pendingPillApprovals,
      ],
      log: [{ text: `Took ${pill.name} (awaiting parent confirmation)`, time: "Just now", pts: 0, type: "pending" }, ...prev.log],
      achievements: allDone ? prev.achievements.map(a => a.id === "a4" ? { ...a, unlocked: true } : a) : prev.achievements,
    }));
    voiceService.speak("pill_taken", { childName: s.childName, pillName: pill.name }, "high");
    if (allDone) {
      voiceService.speak("all_pills_done", { childName: s.childName }, "high");
    }
    setTimeout(() => setHeroBounce(false), 1200);
    setTimeout(() => setConfetti(false), 3000);
  };

  const claimReward = (r) => {
    if (s.totalPoints < r.cost || !rewardGateMet) return;
    set(prev => ({
      ...prev,
      totalPoints: prev.totalPoints - r.cost,
      rewards: prev.rewards.map(x => x.id === r.id ? { ...x, claimed: true } : x),
      pendingApprovals: [...prev.pendingApprovals, { ...r, when: "Just now" }],
    }));
    setPopup(r);
    setTimeout(() => setPopup(null), 2200);
  };

  if (game) {
    return <GameScreen game={game} onBack={() => setGame(null)} onScore={(pts) => {
      set(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + Math.round(pts * 0.5),
        xp: prev.xp + pts,
        assignedGames: prev.assignedGames.map(g =>
          g.id === game.id ? { ...g, played: g.played + 1, best: Math.max(g.best || 0, pts) } : g
        ),
        log: [{ text: `Played ${game.name} — scored ${pts}!`, time: "Just now", pts: Math.round(pts * 0.5), type: "game" }, ...prev.log],
      }));
    }} />;
  }

  return (
    <div className="child-app">
      <Confetti active={confetti} />
      {/* Header */}
      <header className="ch-header">
        <div className="ch-left">
          <div className="ch-avatar">{s.childAvatar}</div>
          <div>
            <div className="ch-name">Hi {s.childName}!</div>
            <div className="ch-streak">🔥 {s.streak} day streak</div>
          </div>
        </div>
        <div className="ch-right">
          <button
            className={`a11y-toggle ${dyslexiaMode ? "a11y-on" : ""}`}
            onClick={onToggleDyslexiaMode}
            title="Toggle dyslexia-friendly mode"
            aria-label="Toggle dyslexia-friendly mode"
          >
            {dyslexiaMode ? "A+ On" : "A+"}
          </button>
          <div className="ch-pts-pill">⭐ {s.totalPoints}</div>
          <button className="btn-icon-sm" onClick={logout}>🚪</button>
        </div>
      </header>

      {/* XP Bar */}
      <div className="xp-strip">
        <span className="xp-lv">Lv.{s.level}</span>
        <div className="xp-track"><div className="xp-fill" style={{ width: `${(s.xp / s.xpToNext) * 100}%` }} /></div>
        <span className="xp-nums">{s.xp}/{s.xpToNext}</span>
      </div>

      {/* Content */}
      <div className="ch-scroll">
        {tab === "home" && (
          <>
            {/* Hero Card */}
            <div className="hero-stage-card" style={{ "--sc": stage.color }}>
              <Hero hp={s.heroHP} maxHP={s.heroMaxHP} size={160} bounce={heroBounce} skin={heroSkin} />
              <div className="hsc-info">
                <div className="hsc-name">
                  {stage.emoji} {stage.name}
                  <span className="hsc-idx">Stage {stage.index + 1}/5</span>
                </div>
                <div className="hp-outer"><div className="hp-inner" style={{ width: `${(s.heroHP / s.heroMaxHP) * 100}%` }}><span>{s.heroHP} HP</span></div></div>
                <p className="hsc-msg">{s.heroHP < 25 ? "Help me... I need my medicine! 😢" : s.heroHP < 50 ? "I'm feeling a bit better! 💊" : s.heroHP < 75 ? "Getting so much stronger! 💪" : s.heroHP < 95 ? "I'm almost at full power! ⚡" : "I'M A LEGEND!! 👑🌟"}</p>
                <div className="hero-skins">
                  <button
                    className={`hs-chip ${heroSkin === "knight" ? "hs-on" : ""}`}
                    type="button"
                    onClick={() => set(prev => ({ ...prev, heroSkin: "knight" }))}
                  >
                    🛡️ Knight
                  </button>
                  <button
                    className={`hs-chip ${heroSkin === "ranger" ? "hs-on" : ""}`}
                    type="button"
                    onClick={() => set(prev => ({ ...prev, heroSkin: "ranger" }))}
                  >
                    🏹 Ranger
                  </button>
                  <button
                    className={`hs-chip ${heroSkin === "mage" ? "hs-on" : ""}`}
                    type="button"
                    onClick={() => set(prev => ({ ...prev, heroSkin: "mage" }))}
                  >
                    🔮 Mage
                  </button>
                </div>
              </div>
            </div>

            <div className="voice-coach-card">
              <div className="vc-head">
                <div>
                  <div className="vc-title">🗣️ Hero Voice Coach</div>
                  <p className="vc-sub">Motivational reminders and guided pill prompts.</p>
                </div>
                <StatusChip tone={voiceReady ? "success" : "warning"}>{voiceReady ? "Voice Ready" : "Voice Not Supported"}</StatusChip>
              </div>
              <div className="vc-quote">
                “{nextPill
                  ? `Let's take ${nextPill.name} at ${nextPill.time}!`
                  : "All medicine missions are complete. Great work today!"}”
              </div>
              <div className="vc-actions">
                <AppButton size="sm" variant={voiceEnabled ? "success" : "primary"} onClick={() => setVoiceEnabled(v => !v)}>
                  {voiceEnabled ? "🔊 Voice On" : "🔈 Voice Off"}
                </AppButton>
                <AppButton
                  size="sm"
                  variant="accent"
                  onClick={() => {
                    voiceService.speak(
                      nextPill ? "pill_reminder" : "greeting",
                      { childName: s.childName, pillName: nextPill?.name || "" },
                      "high"
                    );
                  }}
                  disabled={!voiceEnabled || !voiceReady}
                >
                  ▶ Speak Now
                </AppButton>
                <AppButton
                  size="sm"
                  variant={autoReminders ? "primary" : "danger"}
                  onClick={() => setAutoReminders(v => !v)}
                  disabled={!voiceEnabled}
                >
                  {autoReminders ? "⏰ Auto On" : "⏰ Auto Off"}
                </AppButton>
              </div>
              <div className="vc-style-toggle" role="group" aria-label="Voice style">
                <button
                  className={`vc-pill ${coachStyle === "gentle" ? "vc-pill-on" : ""}`}
                  onClick={() => setCoachStyle("gentle")}
                  type="button"
                >
                  🌤️ Gentle
                </button>
                <button
                  className={`vc-pill ${coachStyle === "energetic" ? "vc-pill-on" : ""}`}
                  onClick={() => setCoachStyle("energetic")}
                  type="button"
                >
                  ⚡ Energetic
                </button>
              </div>
            </div>

            {/* Today's Pills */}
            <div className="ch-section">
              <div className="mission-card">
                <div>
                  <div className="mission-title">🎯 Today's Mission</div>
                  {nextPill ? (
                    <div className="mission-body">Take <strong>{nextPill.name}</strong> at {nextPill.time} and help your hero grow.</div>
                  ) : (
                    <div className="mission-body">All medicine missions complete today. Great job!</div>
                  )}
                </div>
                {nextPill && (
                  <AppButton variant="accent" size="sm" onClick={() => takePill(nextPill.id)}>
                    Do Mission
                  </AppButton>
                )}
              </div>

              <div className="chs-head">
                <h3>💊 Today's Medicine</h3>
                <div className="chs-counter">{pillsDone}/{s.pills.length}</div>
              </div>
              <div className="pills-grid">
                {s.pills.map((p, i) => (
                  <button key={p.id} className={`pill-card ${p.taken ? "pill-done" : ""}`}
                    style={{ "--pc": p.color, animationDelay: `${i * 0.08}s` }}
                    onClick={() => !p.taken && takePill(p.id)} disabled={p.taken}>
                    <div className="pc-top">
                      <span className="pc-icon">{p.taken ? "✅" : p.icon}</span>
                      <span className="pc-time">{p.time}</span>
                    </div>
                    <div className="pc-dose">{p.dose}</div>
                    {!p.taken && <div className="pc-pts">+10 ⭐ (parent confirms)</div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Play */}
            {s.assignedGames.length > 0 && (
              <div className="ch-section">
                <div className="chs-head"><h3>🎮 Quick Play</h3></div>
                <div className="qp-scroll">
                  {s.assignedGames.map((g) => (
                    <button key={g.id} className="qp-card" onClick={() => setGame(g)}>
                      <div className="qp-icon">{g.icon}</div>
                      <div className="qp-name">{g.name}</div>
                      <div className="qp-play">Play ▶</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="ch-section">
              <div className="pack-card">
                <div className="pack-top">
                  <div>
                    <div className="pack-label">Assigned Pack</div>
                    <div className="pack-name">
                      {activePack ? `${activePack.icon} ${activePack.name}` : "⏳ Waiting for parent to assign a pack"}
                    </div>
                  </div>
                  <StatusChip tone={activePack ? "success" : "warning"}>
                    {activePack ? "Ready" : "Not Ready"}
                  </StatusChip>
                </div>
                <p className="pack-desc">
                  {activePack
                    ? activePack.desc
                    : "The child interface stays goal-first. Once a pack is chosen, the right games will appear here."}
                </p>
                {activePack && (
                  <div className="pack-meta">
                    <span>Focus: {activePack.condition}</span>
                    <span>{weeklyTarget} sessions / week</span>
                  </div>
                )}
              </div>
            </div>

            <div className="ch-section">
              <div className={`careplan-card ${s.assignedGames.length === 0 ? "cp-empty" : ""}`}>
                <div className="cp-head">
                  <h3>🧠 My Care Plan</h3>
                  <StatusChip tone={s.assignedGames.length > 0 ? "success" : "warning"}>
                    {s.assignedGames.length > 0 ? "Active" : "Waiting For Parent"}
                  </StatusChip>
                </div>
                <p className="cp-sub">Focus: {s.conditions.join(", ")} • Weekly target: {weeklyTarget} sessions</p>
                <div className="cp-track">
                  <div className="cp-fill" style={{ width: `${carePlanProgress}%` }} />
                </div>
                <div className="cp-meta">{weeklyGameSessions}/{weeklyTarget} sessions done this week</div>
              </div>
            </div>

            {/* Achievements */}
            <div className="ch-section">
              <div className="chs-head"><h3>🏅 Achievements</h3></div>
              <div className="ach-row">
                {s.achievements.map((a) => (
                  <div key={a.id} className={`ach-badge ${a.unlocked ? "ach-on" : "ach-off"}`} title={a.desc}>
                    <span className="ach-icon">{a.unlocked ? a.icon : "🔒"}</span>
                    <span className="ach-name">{a.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "games" && (
          <>
            <h2 className="pg-title">🎮 My Games</h2>
            <div className="careplan-inline">
              <StatusChip tone={s.assignedGames.length > 0 ? "success" : "warning"}>
                Care Plan: {s.assignedGames.length > 0 ? "Assigned By Parent" : "Not Assigned Yet"}
              </StatusChip>
              <span>{weeklyGameSessions}/{weeklyTarget} weekly sessions</span>
            </div>
            {s.assignedGames.length === 0 ? (
              <EmptyState
                icon="🎮"
                title="No therapy missions yet"
                description="Your parent can assign dyslexia training games from the care plan."
              />
            ) : (
              <div className="games-list">
                {s.assignedGames.map((g, i) => (
                  <div key={g.id} className="gl-card" style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className="gl-icon">{g.icon}</div>
                    <div className="gl-mid">
                      <div className="gl-name">{g.name}</div>
                      <div className="gl-meta">
                        <StatusChip tone={g.diff === "Easy" ? "success" : g.diff === "Medium" ? "warning" : "danger"}>{g.diff}</StatusChip>
                        <span>Played {g.played}x</span>
                        {g.best > 0 && <span>Best: ⭐{g.best}</span>}
                      </div>
                      <div className="gl-desc">{g.desc}</div>
                    </div>
                    <AppButton variant="accent" className="gl-play" onClick={() => setGame(g)}>▶</AppButton>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "rewards" && (
          <>
            <h2 className="pg-title">🏪 Rewards Shop</h2>
            <div className="rw-balance">
              <span>Your Balance</span>
              <span className="rw-big">⭐ {s.totalPoints}</span>
            </div>
            <div className={`reward-gate ${rewardGateMet ? "rg-open" : "rg-locked"}`}>
              <div className="rg-title">🔐 Reward Unlock Rules</div>
              <div className="rg-row">
                <StatusChip tone={medicineGateMet ? "success" : "warning"}>
                  Medicine confirmations: {confirmedPillEvents}/2
                </StatusChip>
                <StatusChip tone={therapyGateMet ? "success" : "warning"}>
                  Therapy sessions: {weeklyGameSessions}/{Math.min(2, weeklyTarget)}
                </StatusChip>
              </div>
              {!rewardGateMet && <p className="rg-note">Complete the missing health goals to unlock reward claims.</p>}
            </div>
            <div className="rw-grid">
              {s.rewards.map((r, i) => (
                <div key={r.id} className={`rw-card ${r.claimed ? "rw-claimed" : ""} ${s.totalPoints >= r.cost && !r.claimed ? "rw-afford" : ""}`}
                  style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="rw-icon">{r.icon}</div>
                  <div className="rw-name">{r.name}</div>
                  <div className="rw-cost">⭐ {r.cost}</div>
                  {r.claimed ? (
                    <div className="rw-status">Requested ✓</div>
                  ) : (
                    <AppButton variant="reward" className="rw-btn" disabled={s.totalPoints < r.cost || !rewardGateMet} onClick={() => claimReward(r)}>
                      {!rewardGateMet ? "Locked by health goals" : s.totalPoints >= r.cost ? "Claim!" : `Need ${r.cost - s.totalPoints} more`}
                    </AppButton>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Popup */}
      {popup && (
        <div className="overlay"><div className="popup pop-in">
          <Confetti active={true} />
          <div className="popup-icon">{popup.icon}</div>
          <h3>Reward Requested! 🎉</h3>
          <p>Your parent will approve <strong>{popup.name}</strong> soon!</p>
        </div></div>
      )}

      {/* Nav */}
      <nav className="ch-nav">
        {[{ id: "home", icon: "🏠", label: "Home" }, { id: "games", icon: "🎮", label: "Games" }, { id: "rewards", icon: "🏪", label: "Rewards" }].map(t => (
          <button key={t.id} className={`ch-tab ${tab === t.id ? "ch-tab-on" : ""}`} onClick={() => setTab(t.id)}>
            <span className="cht-icon">{t.icon}</span>
            <span className="cht-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ════════════════════════════════════════
// PARENT DASHBOARD
// ════════════════════════════════════════
function ParentApp({ s, set, logout, dyslexiaMode, onToggleDyslexiaMode }) {
  const [tab, setTab] = useState("overview");
  const [addPts, setAddPts] = useState(false);
  const [ptsVal, setPtsVal] = useState(10);
  const [showAdded, setShowAdded] = useState(false);

  const stage = getHeroStage(s.heroHP, s.heroMaxHP);
  const pillsDone = s.pills.filter(p => p.taken).length;
  const totalGamesPlayed = s.assignedGames.reduce((a, g) => a + g.played, 0);
  const activePack = PACK_LIBRARY.find((pack) => pack.id === s.carePlan?.packId) || null;

  const doAddPts = () => {
    set(p => ({ ...p, totalPoints: p.totalPoints + ptsVal, log: [{ text: `Parent added ${ptsVal} bonus points`, time: "Just now", pts: ptsVal, type: "bonus" }, ...p.log] }));
    setShowAdded(true);
    setTimeout(() => { setShowAdded(false); setAddPts(false); }, 1200);
  };

  const assignPack = (pack) => {
    set(p => ({
      ...p,
      carePlan: {
        ...p.carePlan,
        condition: pack.condition,
        packId: pack.id,
        packName: pack.name,
        weeklyTarget: pack.weeklyTarget,
        active: true,
      },
      assignedGames: pack.games.map((game) => ({
        ...game,
        played: 0,
        best: 0,
        assignedBy: "Parent",
        assignedAt: "Today",
      })),
      availableGames: pack.games.map((game) => ({
        id: game.id,
        name: game.name,
        cat: game.cat,
        icon: game.icon,
        diff: game.diff,
        desc: game.desc,
      })),
      log: [{ text: `Parent assigned ${pack.name}`, time: "Just now", pts: 0, type: "info" }, ...p.log],
    }));
  };

  const assignGame = (g) => {
    set(p => ({
      ...p,
      carePlan: { ...p.carePlan, active: true },
      assignedGames: [...p.assignedGames, { ...g, played: 0, best: 0, assignedBy: "Parent", assignedAt: "Today" }],
      availableGames: p.availableGames.filter(x => x.id !== g.id),
    }));
  };

  const removeGame = (g) => {
    set(p => ({
      ...p,
      assignedGames: p.assignedGames.filter(x => x.id !== g.id),
      availableGames: [...p.availableGames, { id: g.id, name: g.name, cat: g.cat, icon: g.icon, diff: g.diff, desc: g.desc }],
      carePlan: { ...p.carePlan, active: p.assignedGames.filter(x => x.id !== g.id).length > 0 },
    }));
  };

  const updateWeeklyTarget = (target) => {
    set(p => ({
      ...p,
      carePlan: { ...p.carePlan, weeklyTarget: target },
    }));
  };

  const approveReward = (r, approved) => {
    set(p => ({
      ...p,
      pendingApprovals: p.pendingApprovals.filter(x => x.id !== r.id),
      totalPoints: approved ? p.totalPoints : p.totalPoints + r.cost,
      rewards: approved ? p.rewards : p.rewards.map(x => x.id === r.id ? { ...x, claimed: false } : x),
    }));
  };

  const reviewPillApproval = (req, approved) => {
    set(p => ({
      ...p,
      pendingPillApprovals: p.pendingPillApprovals.filter(x => x.id !== req.id),
      totalPoints: approved ? p.totalPoints + req.pts : p.totalPoints,
      log: [
        {
          text: approved ? `Parent confirmed medicine points: ${req.reason}` : `Parent declined medicine points: ${req.reason}`,
          time: "Just now",
          pts: approved ? req.pts : 0,
          type: approved ? "pill" : "denied",
        },
        ...p.log,
      ],
    }));
  };

  const maxPills = Math.max(...s.weeklyPills, 1);
  const pillsPending = s.pills.length - pillsDone;
  const pendingMedicineCount = s.pendingPillApprovals.length;
  const pendingRewardsCount = s.pendingApprovals.length;
  const pendingActionsCount = pendingMedicineCount + pendingRewardsCount;
  const needsAttention = pillsPending > 0 || pendingActionsCount > 0;

  return (
    <div className="parent-app">
      <header className="pa-header">
        <div>
          <div className="pa-title">👨‍⚕️ Parent Dashboard</div>
          <div className="pa-sub">Managing <strong>{s.childName}</strong>'s health journey</div>
        </div>
        <div className="pa-right-actions">
          <button
            className={`a11y-toggle a11y-parent ${dyslexiaMode ? "a11y-on" : ""}`}
            onClick={onToggleDyslexiaMode}
            title="Toggle dyslexia-friendly mode"
            aria-label="Toggle dyslexia-friendly mode"
          >
            {dyslexiaMode ? "A+ On" : "A+"}
          </button>
          <button className="btn-icon-sm inv" onClick={logout}>🚪</button>
        </div>
      </header>

      <div className="pa-tabs">
        {["overview", "story", "games", "rewards"].map(t => (
          <button key={t} className={`pa-tab ${tab === t ? "pa-tab-on" : ""}`} onClick={() => setTab(t)}>
            {t === "overview" ? "📊 Overview" : t === "story" ? "📖 Story" : t === "games" ? "🎮 Games" : "🎁 Rewards"}
          </button>
        ))}
      </div>

      <div className="pa-scroll">
        {tab === "overview" && (
          <>
            <div className={`pa-card today-summary ${needsAttention ? "ts-attention" : "ts-good"}`}>
              <div className="ts-header">
                <h4 className="pac-title">🧭 Today Summary</h4>
                <StatusChip tone={needsAttention ? "warning" : "success"}>
                  {needsAttention ? "Attention Needed" : "On Track"}
                </StatusChip>
              </div>
              <div className="ts-grid">
                <div className="ts-item">
                  <span className="ts-label">Pills Completed</span>
                  <strong className="ts-value">{pillsDone}/{s.pills.length}</strong>
                </div>
                <div className="ts-item">
                  <span className="ts-label">Pills Pending</span>
                  <strong className="ts-value">{pillsPending}</strong>
                </div>
                <div className="ts-item">
                  <span className="ts-label">Medicine Confirmations</span>
                  <strong className="ts-value">{pendingMedicineCount}</strong>
                </div>
                <div className="ts-item">
                  <span className="ts-label">Reward Approvals</span>
                  <strong className="ts-value">{pendingRewardsCount}</strong>
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="pa-stats">
              {[
                { label: "Pills Today", value: `${pillsDone}/${s.pills.length}`, accent: "#6BCB77", icon: "💊" },
                { label: "Total Points", value: s.totalPoints, accent: "#FFD93D", icon: "⭐" },
                { label: "Day Streak", value: `${s.streak} 🔥`, accent: "#FF6B6B", icon: "" },
                { label: "Games Played", value: totalGamesPlayed, accent: "#74B9FF", icon: "🎮" },
                { label: "Hero Stage", value: stage.name, accent: stage.color, icon: stage.emoji },
                { label: "Best Streak", value: `${s.bestStreak} days`, accent: "#A29BFE", icon: "🏆" },
              ].map((c, i) => (
                <div key={i} className="pa-stat" style={{ "--ac": c.accent, animationDelay: `${i * 0.06}s` }}>
                  <div className="pas-top">{c.icon}</div>
                  <div className="pas-val">{c.value}</div>
                  <div className="pas-label">{c.label}</div>
                </div>
              ))}
            </div>

            {/* Hero Preview */}
            <div className="pa-card">
              <div className="pac-row">
                <Hero hp={s.heroHP} maxHP={s.heroMaxHP} size={90} />
                <div className="pac-info">
                  <h4>{stage.emoji} {stage.name} — Stage {stage.index + 1}/5</h4>
                  <div className="pac-bar-bg"><div className="pac-bar" style={{ width: `${(s.heroHP / s.heroMaxHP) * 100}%` }} /></div>
                  <span className="pac-hp">{s.heroHP}/{s.heroMaxHP} HP</span>
                </div>
              </div>
            </div>

            {/* Weekly Chart */}
            <div className="pa-card">
              <h4 className="pac-title">📊 Weekly Pill Adherence</h4>
              <div className="chart-row">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                  <div key={d} className="chart-col">
                    <div className="chart-bar-bg">
                      <div className="chart-bar" style={{ height: `${(s.weeklyPills[i] / maxPills) * 100}%`, animationDelay: `${i * 0.08}s` }} />
                    </div>
                    <span className="chart-label">{d}</span>
                    <span className="chart-val">{s.weeklyPills[i]}/{s.pills.length}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Points */}
            <div className="pa-card">
              <div className="pac-hrow">
                <h4 className="pac-title">⭐ Bonus Points</h4>
                <AppButton variant="accent" className="btn-mint" onClick={() => setAddPts(!addPts)}>+ Add</AppButton>
              </div>
              {addPts && (
                <div className="addpts-box">
                  <div className="addpts-chips">
                    {[5, 10, 20, 50, 100].map(v => (
                      <button key={v} className={`addpts-chip ${ptsVal === v ? "apc-on" : ""}`} onClick={() => setPtsVal(v)}>+{v}</button>
                    ))}
                  </div>
                  <AppButton variant="accent" className="btn-mint full" onClick={doAddPts}>{showAdded ? "✅ Added!" : `Award ${ptsVal} points`}</AppButton>
                </div>
              )}
            </div>

            {/* Pending */}
            {s.pendingPillApprovals.length > 0 && (
              <div className="pa-card highlight">
                <h4 className="pac-title">💊 Pending Medicine Confirmations</h4>
                {s.pendingPillApprovals.map(req => (
                  <div key={req.id} className="appr-row">
                    <span className="appr-info">{req.reason} <span className="appr-cost">(⭐ {req.pts})</span></span>
                    <div className="appr-btns">
                      <AppButton variant="success" className="btn-yes" onClick={() => reviewPillApproval(req, true)}>Confirm</AppButton>
                      <AppButton variant="danger" className="btn-no" onClick={() => reviewPillApproval(req, false)}>Decline</AppButton>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {s.pendingApprovals.length > 0 && (
              <div className="pa-card highlight">
                <h4 className="pac-title">🎁 Pending Reward Approvals</h4>
                {s.pendingApprovals.map(r => (
                  <div key={r.id} className="appr-row">
                    <span className="appr-info">{r.icon} {r.name} <span className="appr-cost">(⭐ {r.cost})</span></span>
                    <div className="appr-btns">
                      <AppButton variant="success" className="btn-yes" onClick={() => approveReward(r, true)}>✅</AppButton>
                      <AppButton variant="danger" className="btn-no" onClick={() => approveReward(r, false)}>❌</AppButton>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Activity */}
            <div className="pa-card">
              <h4 className="pac-title">📋 Recent Activity</h4>
              {s.log.slice(0, 8).map((l, i) => (
                <div key={i} className="act-row">
                  <span className="act-dot" data-type={l.type} />
                  <span className="act-text">{l.text}</span>
                  <span className="act-time">{l.time}</span>
                  <span className="act-pts">+{l.pts}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "games" && (
          <>
            <div className="pa-card careplan-admin">
              <h4 className="pac-title">🧠 Choose a Health Pack</h4>
              <p className="pa-helper">Pick the condition pack that best matches the child’s needs. The selected pack becomes the care plan.</p>
              <div className="pack-grid">
                {PACK_LIBRARY.map((pack) => (
                  <button
                    key={pack.id}
                    className={`pack-tile ${activePack?.id === pack.id ? "pack-tile-on" : ""}`}
                    style={{ "--pack-accent": pack.color }}
                    onClick={() => assignPack(pack)}
                  >
                    <div className="pack-tile-icon">{pack.icon}</div>
                    <div className="pack-tile-name">{pack.name}</div>
                    <div className="pack-tile-desc">{pack.desc}</div>
                    <StatusChip tone={activePack?.id === pack.id ? "success" : "neutral"}>
                      {activePack?.id === pack.id ? "Selected" : `${pack.weeklyTarget} / week`}
                    </StatusChip>
                  </button>
                ))}
              </div>
              <div className="careplan-note">
                Current pack: <StatusChip tone={activePack ? "success" : "warning"}>{activePack ? activePack.name : "No pack assigned"}</StatusChip>
              </div>
            </div>

            <div className="pa-card">
              <h4 className="pac-title">✅ Pack Missions ({s.assignedGames.length})</h4>
              {s.assignedGames.length === 0 ? (
                <p className="pa-empty">No pack assigned yet. Choose a pack above to unlock the child’s missions.</p>
              ) : s.assignedGames.map(g => (
                <div key={g.id} className="pgame-row">
                  <span className="pgame-icon">{g.icon}</span>
                  <div className="pgame-info">
                    <strong>{g.name}</strong>
                    <span>Played {g.played}x · Best: {g.best || "—"} · {g.diff} · Assigned {g.assignedAt || "Today"}</span>
                  </div>
                  <AppButton variant="danger" className="btn-remove" onClick={() => removeGame(g)}>Remove</AppButton>
                </div>
              ))}
            </div>
            <div className="pa-card">
              <h4 className="pac-title">📚 Games in Current Pack</h4>
              <p className="pa-helper">{activePack ? `${activePack.name} is active for ${s.childName}.` : "Select a pack to see its games here."}</p>
              {s.availableGames.length === 0 ? (
                <p className="pa-empty">Pack missions will appear here once a pack is selected.</p>
              ) : s.availableGames.map(g => (
                <div key={g.id} className="pgame-row">
                  <span className="pgame-icon">{g.icon}</span>
                  <div className="pgame-info">
                    <strong>{g.name}</strong>
                    <span>{g.desc} · {g.diff}</span>
                  </div>
                  <StatusChip tone="info">Included</StatusChip>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "story" && (
          <>
            <h2 className="pg-title">📖 Weekly Health Story</h2>
            <WeeklyStory s={s} stage={stage} pillsDone={pillsDone} weeklyGameSessions={totalGamesPlayed} weeklyTarget={s.carePlan?.weeklyTarget || 5} variant="parent" />
          </>
        )}

        {tab === "rewards" && (
          <>
            {s.pendingApprovals.length > 0 && (
              <div className="pa-card highlight">
                <h4 className="pac-title">🔔 Pending Approvals</h4>
                {s.pendingApprovals.map(r => (
                  <div key={r.id} className="appr-row">
                    <span className="appr-info">{r.icon} {r.name}</span>
                    <div className="appr-btns">
                      <AppButton variant="success" className="btn-yes" onClick={() => approveReward(r, true)}>Approve</AppButton>
                      <AppButton variant="danger" className="btn-no" onClick={() => approveReward(r, false)}>Deny</AppButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="pa-card">
              <h4 className="pac-title">🎁 Reward Catalog</h4>
              <p className="pa-helper">{s.childName} currently has <strong>⭐ {s.totalPoints}</strong> points</p>
              {s.rewards.map(r => (
                <div key={r.id} className="pgame-row">
                  <span className="pgame-icon">{r.icon}</span>
                  <div className="pgame-info">
                    <strong>{r.name}</strong>
                    <span>Cost: ⭐ {r.cost} · {r.cat}</span>
                  </div>
                  <StatusChip tone={r.claimed ? "neutral" : "success"}>{r.claimed ? "Claimed" : "Available"}</StatusChip>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// ROLE SELECT LANDING
// ════════════════════════════════════════
function Landing({ onRole }) {
  const [hover, setHover] = useState(null);
  return (
    <div className="landing">
      <div className="land-bg">
        <div className="blob b1" /><div className="blob b2" /><div className="blob b3" /><div className="blob b4" />
      </div>
      <div className="land-inner">
        <div className="land-hero-wrap">
          <Hero hp={65} maxHP={100} size={130} />
        </div>
        <h1 className="land-title">Pill<span>Hero</span></h1>
        <p className="land-tag">Making medicine time an adventure!</p>
        <p className="land-sub">Game4Health Hackathon 2026</p>
        <div className="land-cards">
          <button className={`lc ${hover === "c" ? "lc-hover" : ""}`}
            onClick={() => onRole("child")} onMouseEnter={() => setHover("c")} onMouseLeave={() => setHover(null)}>
            <div className="lc-glow" style={{ background: "radial-gradient(circle, rgba(255,217,61,0.3) 0%, transparent 70%)" }} />
            <div className="lc-emoji">🧒</div>
            <h2>I'm a Kid</h2>
            <p>Feed your hero, play games, earn awesome rewards!</p>
            <div className="lc-arrow">→</div>
          </button>
          <button className={`lc ${hover === "p" ? "lc-hover" : ""}`}
            onClick={() => onRole("parent")} onMouseEnter={() => setHover("p")} onMouseLeave={() => setHover(null)}>
            <div className="lc-glow" style={{ background: "radial-gradient(circle, rgba(78,205,196,0.3) 0%, transparent 70%)" }} />
            <div className="lc-emoji">👨‍👩‍👧</div>
            <h2>I'm a Parent</h2>
            <p>Track pills, manage games & approve rewards</p>
            <div className="lc-arrow">→</div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════
const STORAGE_KEY = "pillhero.save";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { const parsed = JSON.parse(raw); return { ...INIT, ...parsed }; }
  } catch { /* ignore */ }
  return INIT;
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

export default function App() {
  const [role, setRole] = useState(null);
  const [s, set] = useState(loadState);
  const [dyslexiaMode, setDyslexiaMode] = useState(false);

  useEffect(() => { saveState(s); }, [s]);

  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Quicksand:wght@400;500;600;700&display=swap');

:root{
  --font-display:'Baloo 2',cursive;
  --font-body:'Quicksand',sans-serif;

  --space-1:4px;
  --space-2:8px;
  --space-3:12px;
  --space-4:16px;
  --space-5:20px;
  --space-6:24px;

  --radius-sm:10px;
  --radius-md:14px;
  --radius-lg:18px;
  --radius-xl:24px;

  --text-strong:#2D3436;
  --text-muted:#7F8C8D;
  --text-soft:#A9B0B3;

  --surface:#FFFFFF;
  --surface-soft:#F9FAFB;
  --surface-muted:#F5F7FA;
  --border:#E8EDF2;

  --brand:#2EC4B6;
  --brand-strong:#179D92;
  --success:#2FBF71;
  --warning:#E0A526;
  --danger:#E75B5B;
  --info:#63A9F4;

  --shadow-sm:0 6px 20px rgba(0,0,0,0.08);
  --shadow-md:0 12px 30px rgba(0,0,0,0.12);
}

*{margin:0;padding:0;box-sizing:border-box}
html{font-family:var(--font-body);-webkit-font-smoothing:antialiased;overflow:hidden;height:100%}
body{height:100%;color:var(--text-strong);background:var(--surface-muted);line-height:1.4}
h1,h2,h3,h4{font-family:var(--font-display)}
button{font-family:var(--font-body)}

button:focus-visible{
  outline:3px solid color-mix(in srgb,var(--brand) 45%,white);
  outline-offset:2px;
}

.app-root{height:100%}

.a11y-toggle{
  border:2px solid var(--app-border,#DCE3EA);
  background:var(--app-surface,#FFFFFF);
  color:var(--text-strong);
  padding:6px 10px;
  border-radius:999px;
  font-size:12px;
  font-weight:800;
  cursor:pointer;
  transition:all .2s;
}

.a11y-toggle:hover{
  border-color:var(--app-accent,var(--brand));
  color:var(--app-accent,var(--brand));
}

.a11y-toggle.a11y-on{
  background:color-mix(in srgb,var(--app-accent,var(--brand)) 16%,white);
  border-color:var(--app-accent,var(--brand));
  color:var(--app-accent,var(--brand));
}

.a11y-parent{
  background:rgba(255,255,255,0.14);
  border-color:rgba(255,255,255,0.5);
  color:#FFFFFF;
}

.a11y-parent:hover,
.a11y-parent.a11y-on{
  border-color:#FFFFFF;
  color:#FFFFFF;
  background:rgba(255,255,255,0.24);
}

.ui-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  border:none;
  border-radius:14px;
  font-weight:800;
  cursor:pointer;
  transition:transform .2s ease, box-shadow .2s ease, background .2s ease, color .2s ease;
}

.ui-btn:hover{transform:translateY(-1px)}
.ui-btn:disabled{opacity:.45;cursor:not-allowed;transform:none}

.ui-btn-md{padding:10px 14px;font-size:13px}
.ui-btn-sm{padding:7px 12px;font-size:12px;border-radius:12px}

.ui-btn-primary,.ui-btn-accent{background:linear-gradient(135deg,var(--app-accent,var(--brand)),var(--app-accent-strong,var(--brand-strong)));color:white;box-shadow:var(--shadow-sm)}
.ui-btn-primary:hover,.ui-btn-accent:hover{box-shadow:var(--shadow-md)}
.ui-btn-success{background:linear-gradient(135deg,var(--app-success),#249D5D);color:white}
.ui-btn-danger{background:linear-gradient(135deg,var(--app-danger),#C94B4B);color:white}
.ui-btn-reward{background:linear-gradient(135deg,#FFD93D,#F0C030);color:var(--text-strong)}

.ui-card{background:var(--app-surface,#FFFFFF);border:1px solid var(--app-border,#E8EDF2);border-radius:var(--radius-lg);}

.ui-chip{display:inline-flex;align-items:center;border-radius:999px;padding:3px 10px;font-size:11px;font-weight:800}
.ui-chip-neutral{background:var(--surface-muted);color:var(--text-muted)}
.ui-chip-success{background:#E8FFF1;color:var(--app-success)}
.ui-chip-warning{background:#FFF5DA;color:var(--app-warning)}
.ui-chip-danger{background:#FFE8E8;color:var(--app-danger)}
.ui-chip-info{background:#E8F4FF;color:var(--info)}

.ui-empty{
  text-align:center;
  padding:44px 20px;
  background:var(--surface);
  border-radius:20px;
  border:2px dashed var(--border);
}
.ui-empty-icon{font-size:56px;margin-bottom:8px}
.ui-empty h3{color:var(--text-strong);margin-bottom:4px}
.ui-empty p{color:var(--text-muted);font-size:14px}

.pa-right-actions{display:flex;align-items:center;gap:8px}

.app-root.dyslexia-mode{
  --font-body:'Quicksand',sans-serif;
}

.app-root.dyslexia-mode *:not(h1):not(h2):not(h3):not(h4){
  letter-spacing:.02em;
  line-height:1.55;
}

.app-root.dyslexia-mode .ch-name,
.app-root.dyslexia-mode .pa-title,
.app-root.dyslexia-mode .gl-name,
.app-root.dyslexia-mode .rw-name,
.app-root.dyslexia-mode .pac-title{
  letter-spacing:.01em;
}

.app-root.dyslexia-mode .pc-name,
.app-root.dyslexia-mode .gl-desc,
.app-root.dyslexia-mode .pa-helper,
.app-root.dyslexia-mode .act-text,
.app-root.dyslexia-mode .hsc-msg{
  font-size:1.02em;
}

.app-root.dyslexia-mode .gi-prompt{
  line-height:1.4;
  padding:0 10px;
}

.app-root.dyslexia-mode .pill-card,
.app-root.dyslexia-mode .gl-card,
.app-root.dyslexia-mode .rw-card,
.app-root.dyslexia-mode .pa-card{
  box-shadow:none;
}

/* ═══ Keyframes ═══ */
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes popIn{0%{transform:scale(0)}60%{transform:scale(1.12)}100%{transform:scale(1)}}
@keyframes megaBounce{0%,100%{transform:translateY(0) scale(1)}20%{transform:translateY(-20px) scale(1.08)}50%{transform:translateY(-5px) scale(1.02)}70%{transform:translateY(-10px) scale(1.04)}}
@keyframes sparkle{0%,100%{transform:translateY(0) scale(1);opacity:.6}50%{transform:translateY(-8px) scale(1.3);opacity:1}}
@keyframes confettiFall{0%{transform:translateY(-10px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
@keyframes wave{0%,100%{transform:rotate(0)}25%{transform:rotate(20deg)}75%{transform:rotate(-10deg)}}
@keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes barGrow{from{height:0}to{height:var(--h,100%)}}
@keyframes blobFloat{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,15px) scale(0.95)}}
@keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 rgba(78,205,196,0.3)}50%{box-shadow:0 0 0 12px rgba(78,205,196,0)}}
@keyframes armWaveL{0%,100%{transform:rotate(0)}50%{transform:rotate(-25deg)}}
@keyframes armWaveR{0%,100%{transform:rotate(0)}50%{transform:rotate(25deg)}}
@keyframes capeWave{0%,100%{transform:skewX(0)}50%{transform:skewX(3deg)}}

.hero-mega-bounce{animation:megaBounce 1.2s ease}
.sparkle-float{animation:sparkle 2s ease-in-out infinite}
.arm-l-wave{animation:armWaveL .6s ease infinite;transform-origin:-23px -4px}
.arm-r-wave{animation:armWaveR .6s ease infinite;transform-origin:23px -4px}
.cape-flow{animation:capeWave 2s ease-in-out infinite}
.pop-in{animation:popIn .4s ease-out}
.hero-wrap{display:flex;align-items:center;justify-content:center;flex-shrink:0}
.hero-pixel svg{image-rendering:pixelated}

/* ═══ Confetti ═══ */
.confetti-layer{position:fixed;inset:0;pointer-events:none;z-index:999;overflow:hidden}
.confetti-piece{position:absolute;top:-10px;border-radius:2px;animation:confettiFall ease-out forwards}

/* ═══ Landing ═══ */
.landing{height:100vh;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;background:#FFFAF0}
.land-bg{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.blob{position:absolute;border-radius:50%;filter:blur(60px);opacity:.5;animation:blobFloat 8s ease-in-out infinite}
.b1{width:350px;height:350px;background:#FFD93D;top:-100px;left:-80px;animation-delay:0s}
.b2{width:280px;height:280px;background:#74B9FF;bottom:-80px;right:-60px;animation-delay:2s}
.b3{width:200px;height:200px;background:#6BCB77;top:50%;left:60%;animation-delay:4s}
.b4{width:180px;height:180px;background:#FDA7DF;bottom:20%;left:10%;animation-delay:6s}
.land-inner{position:relative;z-index:2;text-align:center;padding:24px;max-width:520px;width:100%}
.land-hero-wrap{margin-bottom:8px;animation:fadeUp .6s ease}
.land-title{font-size:56px;font-weight:800;letter-spacing:-1px;line-height:1;animation:fadeUp .6s ease .1s both}
.land-title span{background:linear-gradient(135deg,#FF6B6B,#FFD93D,#6BCB77,#74B9FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.land-tag{color:#555;font-size:17px;font-weight:600;margin:6px 0 2px;animation:fadeUp .6s ease .2s both}
.land-sub{color:#aaa;font-size:13px;font-weight:600;margin-bottom:28px;animation:fadeUp .6s ease .25s both}
.land-cards{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;animation:fadeUp .6s ease .3s both}
.lc{position:relative;background:rgba(255,255,255,0.85);backdrop-filter:blur(20px);border:2px solid rgba(0,0,0,0.06);border-radius:24px;padding:28px 24px;width:220px;cursor:pointer;transition:all .35s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;align-items:center;gap:6px;overflow:hidden;font-family:'Quicksand',sans-serif}
.lc:hover{transform:translateY(-10px);border-color:rgba(0,0,0,0.1);box-shadow:0 20px 50px rgba(0,0,0,0.1)}
.lc-glow{position:absolute;inset:-40px;opacity:0;transition:opacity .4s}
.lc:hover .lc-glow{opacity:1}
.lc-emoji{font-size:48px;margin-bottom:4px}
.lc h2{font-size:20px;color:#2D3436}
.lc p{font-size:13px;color:#888;line-height:1.4}
.lc-arrow{font-size:20px;color:#4ECDC4;font-weight:800;opacity:0;transform:translateX(-8px);transition:all .3s}
.lc:hover .lc-arrow{opacity:1;transform:translateX(0)}

/* ═══ Child App ═══ */
.child-app{
  --app-bg:#FFF9EF;
  --app-surface:#FFFFFF;
  --app-border:#EFE7DC;
  --app-accent:var(--brand);
  --app-accent-strong:var(--brand-strong);
  --app-warning:var(--warning);
  --app-success:var(--success);
  --app-danger:var(--danger);
  height:100vh;display:flex;flex-direction:column;background:var(--app-bg);overflow:hidden
}
.ch-header{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:var(--app-surface);border-bottom:1px solid var(--app-border);flex-shrink:0}
.ch-left{display:flex;align-items:center;gap:10px}
.ch-avatar{font-size:32px;width:44px;height:44px;background:#FFF1D6;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center}
.ch-name{font-family:var(--font-display);font-size:19px;font-weight:700;color:var(--text-strong);line-height:1.1}
.ch-streak{font-size:12px;color:var(--app-danger);font-weight:700}
.ch-right{display:flex;align-items:center;gap:8px}
.ch-pts-pill{background:linear-gradient(135deg,#FFF3D6,#FFE7BF);padding:6px 14px;border-radius:var(--radius-md);font-size:15px;font-weight:800;color:var(--app-warning)}
.btn-icon-sm{background:none;border:none;font-size:18px;cursor:pointer;padding:6px;border-radius:10px;transition:background .2s}
.btn-icon-sm:hover{background:#f5f5f5}
.btn-icon-sm.inv{color:white;filter:brightness(0) invert(1)}
.btn-icon-sm.inv:hover{background:rgba(255,255,255,0.1)}

/* XP Bar */
.xp-strip{display:flex;align-items:center;gap:8px;padding:8px 18px;background:var(--app-surface);border-bottom:1px solid var(--app-border);flex-shrink:0}
.xp-lv{font-family:var(--font-display);font-weight:700;color:#6C5CE7;font-size:14px;min-width:36px}
.xp-track{flex:1;height:8px;background:#EEE8DE;border-radius:8px;overflow:hidden}
.xp-fill{height:100%;background:linear-gradient(90deg,#A29BFE,#6C5CE7);border-radius:8px;transition:width .8s ease}
.xp-nums{font-size:11px;color:var(--text-muted);font-weight:700;min-width:60px;text-align:right}

.ch-scroll{flex:1;overflow-y:auto;padding:16px 18px 100px;-webkit-overflow-scrolling:touch}

/* Hero Stage Card */
.hero-stage-card{display:flex;align-items:center;gap:12px;padding:20px;border-radius:24px;margin-bottom:18px;background:linear-gradient(135deg,color-mix(in srgb,var(--sc) 12%,white),color-mix(in srgb,var(--sc) 5%,white));border:2px solid color-mix(in srgb,var(--sc) 25%,white);animation:fadeUp .5s ease}
.hsc-info{flex:1;min-width:0}
.hsc-name{font-family:var(--font-display);font-size:20px;font-weight:700;color:var(--text-strong);display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.hsc-idx{font-size:11px;background:rgba(0,0,0,0.06);padding:2px 8px;border-radius:8px;font-family:'Quicksand',sans-serif;font-weight:700;color:#888}
.hp-outer{background:rgba(0,0,0,0.08);border-radius:10px;height:20px;overflow:hidden;margin:8px 0;position:relative}
.hp-inner{height:100%;border-radius:10px;background:linear-gradient(90deg,#FF6B6B,#FFD93D,#6BCB77);transition:width .8s ease;display:flex;align-items:center;justify-content:center;min-width:40px}
.hp-inner span{font-size:11px;font-weight:800;color:white;text-shadow:0 1px 3px rgba(0,0,0,0.25)}
.hsc-msg{font-size:13px;color:var(--text-muted);font-style:italic;margin-top:4px}
.hero-skins{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
.hs-chip{border:2px solid #DCE3EA;background:#fff;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:800;color:#4E5962;cursor:pointer;transition:all .2s}
.hs-chip:hover{border-color:#AFC4D5}
.hs-chip.hs-on{background:linear-gradient(135deg,#EEF8FF,#FFFFFF);border-color:#87B4D7;color:#1F4B70}

.voice-coach-card{margin:-6px 0 14px;padding:14px;border-radius:18px;border:2px solid #CFEAE3;background:linear-gradient(135deg,#ECFFF8,#FFFFFF);box-shadow:0 8px 20px rgba(24,153,137,0.08)}
.vc-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.vc-title{font-family:var(--font-display);font-size:18px;color:#166E65;line-height:1.1}
.vc-sub{font-size:12px;color:#56837D;margin-top:2px}
.vc-quote{margin-top:10px;padding:10px 12px;border-radius:12px;background:#FFFFFF;border:1px dashed #BFE3DA;font-size:13px;color:var(--text-strong);font-weight:700}
.vc-actions{margin-top:10px;display:flex;flex-wrap:wrap;gap:8px}
.vc-style-toggle{margin-top:10px;display:flex;gap:8px}
.vc-pill{border:2px solid #D8E8E4;background:#fff;border-radius:999px;padding:6px 12px;font-size:12px;font-weight:800;color:#356A63;cursor:pointer;transition:all .2s}
.vc-pill:hover{border-color:#9DD3C6}
.vc-pill.vc-pill-on{background:linear-gradient(135deg,#DFF9F2,#EEFFFA);border-color:#73CBB5;color:#175E55}

/* Sections */
.ch-section{margin-bottom:20px;animation:slideUp .5s ease both}
.ch-section:nth-child(2){animation-delay:.1s}
.ch-section:nth-child(3){animation-delay:.2s}
.mission-card{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 16px;background:linear-gradient(135deg,#E9FBFF,#F7FEFF);border:2px solid #CBEFF4;border-radius:16px;margin-bottom:12px}
.mission-title{font-size:12px;font-weight:800;color:#1D7C89;text-transform:uppercase;letter-spacing:.04em}
.mission-body{font-size:13px;color:var(--text-strong);margin-top:2px}
.chs-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.chs-head h3{font-size:17px;color:var(--text-strong)}
.chs-counter{background:var(--app-accent);color:white;padding:3px 12px;border-radius:var(--radius-sm);font-size:13px;font-weight:800}

.careplan-card{padding:14px 16px;background:linear-gradient(135deg,#EEF8FF,#FFFFFF);border:2px solid #D4E9F9;border-radius:16px}
.careplan-card.cp-empty{background:linear-gradient(135deg,#FFF8EA,#FFFFFF);border-color:#F4DDB0}
.cp-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}
.cp-head h3{font-size:16px;color:var(--text-strong)}
.cp-sub{font-size:13px;color:var(--text-muted);margin-bottom:8px}
.cp-track{width:100%;height:8px;border-radius:999px;background:#E9EEF3;overflow:hidden}
.cp-fill{height:100%;background:linear-gradient(90deg,#3DB6D1,#2390AB);transition:width .4s ease}
.cp-meta{margin-top:6px;font-size:12px;color:var(--text-muted);font-weight:700}
.careplan-inline{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 12px;font-size:12px;color:var(--text-muted);font-weight:700}

/* Pills Grid */
.pills-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.pill-card{background:var(--app-surface);border:2px solid var(--app-border);border-radius:var(--radius-lg);padding:14px;text-align:left;cursor:pointer;transition:all .3s;font-family:var(--font-body);animation:slideUp .4s ease both;position:relative;overflow:hidden}
.pill-card::before{content:'';position:absolute;top:0;left:0;width:4px;height:100%;background:var(--pc);border-radius:4px 0 0 4px}
.pill-card:not(.pill-done):hover{transform:translateY(-4px);box-shadow:0 8px 24px rgba(0,0,0,0.08);border-color:var(--pc)}
.pill-card:not(.pill-done):active{transform:scale(0.97)}
.pill-done{opacity:.55;cursor:default;background:var(--surface-soft)}
.pc-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.pc-icon{font-size:22px}
.pc-time{font-size:11px;color:var(--text-muted);font-weight:700;background:var(--surface-soft);padding:2px 8px;border-radius:8px}
.pc-name{font-weight:700;font-size:14px;color:var(--text-strong)}
.pc-dose{font-size:11px;color:var(--text-muted);margin:2px 0}
.pc-pts{font-size:12px;font-weight:800;color:var(--pc);margin-top:4px}

/* Quick Play */
.qp-scroll{display:flex;gap:10px;overflow-x:auto;padding-bottom:4px;-webkit-overflow-scrolling:touch}
.qp-card{flex-shrink:0;width:120px;background:var(--app-surface);border:2px solid var(--app-border);border-radius:var(--radius-lg);padding:16px 12px;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;transition:all .3s;font-family:var(--font-body)}
.qp-card:hover{border-color:var(--app-accent);transform:translateY(-4px);box-shadow:0 8px 20px rgba(46,196,182,0.2)}
.qp-icon{font-size:32px}
.qp-name{font-size:13px;font-weight:700;color:var(--text-strong)}
.qp-play{font-size:12px;font-weight:800;color:var(--app-accent)}

/* Achievements */
.ach-row{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px}
.ach-badge{flex-shrink:0;width:80px;text-align:center;padding:10px 6px;border-radius:14px;transition:all .3s}
.ach-on{background:linear-gradient(135deg,#FFF5E4,#FFE8CC);border:2px solid #FFD93D}
.ach-off{background:#f5f5f5;border:2px solid #e8e8e8;opacity:.5}
.ach-icon{font-size:24px;display:block}
.ach-name{font-size:10px;font-weight:700;color:#2D3436;display:block;margin-top:2px}

/* Games Page */
.pg-title{font-size:24px;margin-bottom:16px;color:#2D3436}
.empty-box{text-align:center;padding:50px 20px;background:var(--surface);border-radius:20px;border:2px dashed var(--border)}
.eb-icon{font-size:56px;margin-bottom:8px}
.empty-box h3{color:var(--text-strong);margin-bottom:4px}
.empty-box p{color:var(--text-muted);font-size:14px}
.weekly-story{display:flex;flex-direction:column;gap:14px}
.ws-hero{background:linear-gradient(135deg,#EEF6FF,#FFFFFF);border:2px solid #D7E6FF;border-radius:22px;padding:18px}
.ws-badge{display:inline-flex;align-items:center;padding:4px 10px;border-radius:999px;background:#E8F2FF;color:#2C6BBF;font-size:11px;font-weight:800;margin-bottom:10px}
.ws-hero h3{font-size:20px;color:var(--text-strong);margin-bottom:6px}
.ws-hero p{font-size:14px;color:var(--text-muted)}
.ws-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.ws-card{background:var(--surface);border:2px solid var(--border);border-radius:18px;padding:14px;display:flex;flex-direction:column;gap:4px}
.ws-kicker{font-size:11px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:.04em}
.ws-card strong{font-family:var(--font-display);font-size:22px;color:var(--text-strong)}
.ws-card span{font-size:13px;color:var(--text-muted)}
.ws-timeline{display:flex;flex-direction:column;gap:10px;padding:12px;border-radius:18px;background:#FBFCFE;border:1px solid var(--border)}
.ws-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)}
.ws-row:last-child{border-bottom:none}
.ws-row span:last-child{font-size:13px;color:var(--text-strong);text-align:right}
.ws-progress{padding:14px;border-radius:18px;background:linear-gradient(135deg,#FFF6D8,#FFFFFF);border:2px solid #F0DA8A}
.ws-progress-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-weight:800;color:var(--text-strong)}
.ws-track{height:10px;border-radius:999px;background:#EFE6C7;overflow:hidden}
.ws-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,#FFD93D,#E0A526);transition:width .4s ease}
.games-list{display:flex;flex-direction:column;gap:10px}
.gl-card{display:flex;align-items:center;gap:12px;background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:14px;animation:slideUp .4s ease both}
.gl-icon{font-size:36px;flex-shrink:0}
.gl-mid{flex:1;min-width:0}
.gl-name{font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--text-strong)}
.gl-meta{display:flex;gap:8px;font-size:11px;color:var(--text-muted);align-items:center;flex-wrap:wrap}
.diff-chip{padding:2px 8px;border-radius:6px;font-weight:800;font-size:10px}
[data-diff="Easy"]{background:#E8FFF0;color:#27AE60}
[data-diff="Medium"]{background:#FFF5E4;color:#D4A017}
[data-diff="Hard"]{background:#FFF0F0;color:#E74C3C}
.gl-desc{font-size:12px;color:#aaa;margin-top:2px}
.gl-play{width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,var(--app-accent),var(--app-accent-strong));color:white;border:none;font-size:18px;cursor:pointer;transition:transform .2s;flex-shrink:0;display:flex;align-items:center;justify-content:center}
.gl-play:hover{transform:scale(1.1)}

/* Mystic Woods */
.mystic-woods{background:linear-gradient(180deg,#F2FFF4 0%,#E7F6EA 42%,#D9EECF 100%);border:2px solid #B8D7B7;border-radius:24px;padding:16px;gap:12px;box-shadow:0 12px 30px rgba(79,132,64,0.12)}
.mystic-scene{position:relative;border-radius:20px;overflow:hidden;background:linear-gradient(180deg,#17352A 0%,#2E5F3D 45%,#79A85D 100%);padding:16px 14px 12px;min-height:140px;display:flex;flex-direction:column;justify-content:space-between}
.mystic-sky,.mystic-trees{display:flex;justify-content:space-between;align-items:center}
.mystic-sky span{font-size:18px;animation:sparkle 2.6s ease-in-out infinite}
.mystic-sky span:nth-child(2){animation-delay:.4s}
.mystic-sky span:nth-child(3){animation-delay:.8s}
.mystic-trees span{font-size:54px;filter:drop-shadow(0 6px 10px rgba(0,0,0,0.18))}
.mystic-prompt{font-size:14px;color:#24503A;font-weight:700;text-align:center;margin-top:-4px}
.mystic-options{display:flex;flex-direction:column;gap:8px}
.mystic-option{border:2px solid #AACF9E;background:linear-gradient(135deg,#FCFFFB,#EEF9E9);border-radius:16px;padding:12px 14px;font-size:14px;font-weight:800;color:#2D3436;cursor:pointer;transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease}
.mystic-option:hover{transform:translateY(-2px);border-color:#71B86C;box-shadow:0 8px 16px rgba(92,159,82,0.12)}
.mystic-right{border-color:#66C18C;background:linear-gradient(135deg,#EBFFF3,#FFFFFF)}
.mystic-wrong{border-color:#E49B9B;background:linear-gradient(135deg,#FFF0F0,#FFFFFF)}
.mystic-done{background:linear-gradient(180deg,#F4FFF7,#ECFAEE);border:2px solid #A8D7B0}

/* Rewards Page */
.rw-balance{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#FFF5E4,#FFE8CC);padding:18px 22px;border-radius:18px;margin-bottom:16px}
.rw-balance span:first-child{font-weight:700;color:#2D3436}
.rw-big{font-family:'Baloo 2',cursive;font-size:30px;color:#D4A017}
.reward-gate{padding:12px 14px;border-radius:14px;border:2px solid #E6EDF3;margin-bottom:12px;background:#FFF}
.reward-gate.rg-locked{background:linear-gradient(135deg,#FFF8EA,#FFFFFF);border-color:#F1D6A1}
.reward-gate.rg-open{background:linear-gradient(135deg,#EDFFF4,#FFFFFF);border-color:#BCE7CB}
.rg-title{font-size:13px;font-weight:800;color:var(--text-strong);margin-bottom:8px}
.rg-row{display:flex;gap:8px;flex-wrap:wrap}
.rg-note{margin-top:8px;font-size:12px;color:var(--text-muted);font-weight:700}
.rw-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.rw-card{background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:16px;text-align:center;transition:all .3s;animation:slideUp .4s ease both}
.rw-card:hover{border-color:#FFD93D}
.rw-afford{border-color:#d4edda}
.rw-afford:hover{border-color:#6BCB77;box-shadow:0 6px 20px rgba(107,203,119,0.15)}
.rw-claimed{opacity:.5}
.rw-icon{font-size:34px;display:block;margin-bottom:4px}
.rw-name{font-family:'Baloo 2',cursive;font-size:14px;color:#2D3436}
.rw-cost{font-size:13px;font-weight:800;color:#D4A017;margin:4px 0 8px}
.rw-btn{width:100%;padding:8px;border:none;border-radius:12px;font-weight:800;cursor:pointer;font-family:var(--font-body);font-size:12px;transition:all .2s;background:linear-gradient(135deg,#FFD93D,#F0C030);color:var(--text-strong)}
.rw-btn:disabled{opacity:.4;cursor:not-allowed;background:#e8e8e8;color:#999}
.rw-btn:not(:disabled):hover{transform:scale(1.03)}
.rw-status{font-size:12px;color:#6BCB77;font-weight:800}

/* Overlay / Popup */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
.popup{background:white;border-radius:28px;padding:36px;text-align:center;max-width:300px;width:100%;position:relative;overflow:hidden}
.popup-icon{font-size:48px;margin-bottom:8px}
.popup h3{font-size:20px;color:#2D3436}
.popup p{color:#666;font-size:14px;margin-top:6px}

/* Game Screen */
.game-screen{height:100vh;display:flex;flex-direction:column;background:#F0F7FF;overflow:hidden}
.gs-header{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:white;border-bottom:1px solid #e8f0fe;flex-shrink:0}
.gs-back{background:none;border:none;font-size:15px;font-weight:700;color:#4ECDC4;cursor:pointer;font-family:'Quicksand',sans-serif}
.gs-title{font-family:'Baloo 2',cursive;font-size:18px;color:#2D3436}
.gs-intro{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center}
.gsi-icon{font-size:72px;margin-bottom:12px;animation:popIn .5s ease}
.gs-intro h2{font-size:28px;color:#2D3436}
.gsi-desc{color:#888;margin:8px 0;font-size:15px}
.gsi-diff{padding:4px 16px;border-radius:10px;font-weight:800;font-size:13px;margin:8px 0}
.gsi-best{color:#D4A017;font-weight:700;margin-bottom:16px}
.btn-go{display:flex;align-items:center;gap:10px;background:linear-gradient(135deg,#4ECDC4,#38B2A8);color:white;border:none;padding:16px 40px;border-radius:18px;font-size:18px;font-weight:800;cursor:pointer;font-family:'Quicksand',sans-serif;transition:all .3s;animation:pulseGlow 2s infinite}
.btn-go:hover{transform:scale(1.05)}
.btn-go-arrow{font-size:22px}
.game-inner{flex:1;display:flex;flex-direction:column;align-items:center;padding:24px;overflow-y:auto}
.gi-progress{display:flex;gap:6px;margin-bottom:12px}
.gi-dot{width:10px;height:10px;border-radius:50%;background:#ddd}
.gi-done{background:#6BCB77}
.gi-now{background:#4ECDC4;transform:scale(1.4)}
.gi-stats{display:flex;gap:12px;margin-bottom:20px}
.gi-score{font-weight:800;color:#D4A017;font-size:16px}
.gi-combo{font-weight:800;color:#FF6B6B;font-size:16px;animation:popIn .3s ease}
.gi-prompt{font-size:22px;color:#2D3436;margin-bottom:28px;text-align:center}
.gi-options{display:flex;gap:20px;margin-bottom:20px}
.gi-card{width:130px;height:150px;background:white;border:3px solid #e0e0e0;border-radius:22px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .3s;font-family:'Baloo 2',cursive}
.gi-card:hover{border-color:#4ECDC4;transform:translateY(-8px);box-shadow:0 12px 30px rgba(0,0,0,0.1)}
.gi-letter{font-size:52px;font-weight:700;color:#2D3436}
.gi-correct{border-color:#6BCB77!important;background:#E8FFF0}
.gi-wrong{border-color:#FF6B6B!important;background:#FFF0F0;opacity:.5}
.gi-fb{padding:12px 24px;border-radius:14px;font-weight:800;font-size:17px;animation:popIn .3s ease}
.gi-fb.right{background:#E8FFF0;color:#27AE60}
.gi-fb.wrong{background:#FFF0F0;color:#E74C3C}
.game-done{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;position:relative}
.gd-emoji{font-size:72px;animation:popIn .5s ease}
.win-star{width:120px;height:120px;object-fit:contain;image-rendering:pixelated;animation:starBounce .8s cubic-bezier(.34,1.56,.64,1),starGlow 2s ease-in-out infinite;filter:drop-shadow(0 0 12px rgba(212,160,23,0.6))}
@keyframes starBounce{0%{transform:scale(0) rotate(-30deg);opacity:0}50%{transform:scale(1.3) rotate(10deg);opacity:1}100%{transform:scale(1) rotate(0deg)}}
@keyframes starGlow{0%,100%{filter:drop-shadow(0 0 12px rgba(212,160,23,0.6))}50%{filter:drop-shadow(0 0 24px rgba(255,217,61,0.9))}}
.game-done h2{font-size:30px;margin:8px 0}
.gd-score{font-family:'Baloo 2',cursive;font-size:42px;color:#D4A017}
.game-done p{color:#666;margin-top:4px}

/* Word Builder game */
.wb-hint{font-size:18px;color:#888;margin-bottom:20px;font-weight:600}
.wb-slots{display:flex;gap:10px;justify-content:center;margin-bottom:24px}
.wb-slot{width:56px;height:64px;border-radius:14px;border:3px dashed #ccc;display:flex;align-items:center;justify-content:center;font-family:'Baloo 2',cursive;font-size:32px;font-weight:700;color:#2D3436;transition:all .2s;cursor:pointer;background:white}
.wb-filled{border-style:solid;border-color:#74B9FF;background:#F0F7FF}
.wb-correct{border-color:#6BCB77!important;background:#E8FFF0!important}
.wb-wrong{border-color:#FF6B6B!important;background:#FFF0F0!important}
.wb-bank{display:flex;gap:10px;justify-content:center}
.wb-tile{width:56px;height:56px;border-radius:14px;border:none;background:linear-gradient(135deg,#74B9FF,#5BAEF7);color:white;font-family:'Baloo 2',cursive;font-size:28px;font-weight:700;cursor:pointer;transition:all .2s}
.wb-tile:hover{transform:scale(1.1)}
.wb-tile:active{transform:scale(0.95)}

/* Bottom Nav */
.ch-nav{position:fixed;bottom:0;left:0;right:0;background:white;border-top:1px solid #f0ebe4;display:flex;padding:6px 0 env(safe-area-inset-bottom,8px);z-index:50}
.ch-tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:1px;background:none;border:none;cursor:pointer;padding:8px;font-family:'Quicksand',sans-serif;transition:all .2s}
.cht-icon{font-size:22px;transition:transform .2s}
.cht-label{font-size:11px;font-weight:700;color:#bbb;transition:color .2s}
.ch-tab-on .cht-icon{transform:scale(1.2)}
.ch-tab-on .cht-label{color:var(--app-accent)}

/* ═══ Parent App ═══ */
.parent-app{
  --app-bg:#F3F5F9;
  --app-surface:#FFFFFF;
  --app-border:#E2E8F0;
  --app-accent:#2E9FB3;
  --app-accent-strong:#1F7C8C;
  --app-success:var(--success);
  --app-danger:var(--danger);
  height:100vh;display:flex;flex-direction:column;background:var(--app-bg);overflow:hidden
}
.pa-header{background:linear-gradient(135deg,#1F334A,#2A4462);padding:18px 20px;color:white;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
.pa-title{font-family:var(--font-display);font-size:20px}
.pa-sub{font-size:13px;opacity:.7;margin-top:2px}
.pa-tabs{display:flex;background:var(--app-surface);border-bottom:1px solid var(--app-border);flex-shrink:0}
.pa-tab{flex:1;padding:12px;background:none;border:none;border-bottom:3px solid transparent;font-family:var(--font-body);font-weight:700;color:var(--text-muted);cursor:pointer;font-size:13px;transition:all .2s}
.pa-tab-on{color:var(--app-accent);border-bottom-color:var(--app-accent)}
.pa-scroll{flex:1;overflow-y:auto;padding:16px 18px 24px;-webkit-overflow-scrolling:touch}

/* Stats Grid */
.pa-stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px}
.pa-stat{background:var(--app-surface);border-radius:16px;padding:14px 10px;text-align:center;border-left:4px solid var(--ac);animation:slideUp .4s ease both}
.pas-top{font-size:20px}
.pas-val{font-family:var(--font-display);font-size:22px;font-weight:700;color:var(--text-strong);line-height:1.1}
.pas-label{font-size:11px;color:var(--text-muted);font-weight:600}

/* Cards */
.pa-card{background:var(--app-surface);border-radius:var(--radius-lg);padding:18px;margin-bottom:14px;animation:slideUp .4s ease both}
.pa-card.highlight{border:2px solid #FFD93D;background:#FFFDF5}
.today-summary{border:2px solid var(--app-border)}
.today-summary.ts-attention{background:linear-gradient(135deg,#FFF8E8,#FFFFFF);border-color:#F0D48A}
.today-summary.ts-good{background:linear-gradient(135deg,#EFFFF7,#FFFFFF);border-color:#BDE8CC}
.pac-title{font-size:16px;color:var(--text-strong);margin-bottom:10px}
.ts-header{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:12px}
.ts-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.ts-item{padding:10px;border-radius:12px;background:rgba(255,255,255,0.75);border:1px solid var(--app-border)}
.ts-label{display:block;font-size:11px;color:var(--text-muted);font-weight:700;margin-bottom:4px;text-transform:uppercase;letter-spacing:.03em}
.ts-value{font-family:var(--font-display);font-size:22px;color:var(--text-strong)}
.pac-hrow{display:flex;justify-content:space-between;align-items:center}
.pac-hrow .pac-title{margin-bottom:0}
.pac-row{display:flex;align-items:center;gap:14px}
.pac-info{flex:1}
.pac-info h4{font-size:15px;color:var(--text-strong)}
.pac-bar-bg{background:var(--surface-muted);border-radius:8px;height:10px;overflow:hidden;margin:6px 0}
.pac-bar{height:100%;border-radius:8px;background:linear-gradient(90deg,#FF6B6B,#FFD93D,#6BCB77);transition:width .8s}
.pac-hp{font-size:12px;color:var(--text-muted)}

/* Chart */
.chart-row{display:flex;gap:6px;align-items:flex-end;height:120px;padding-top:10px}
.chart-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
.chart-bar-bg{width:100%;height:80px;background:var(--surface-muted);border-radius:8px;overflow:hidden;display:flex;align-items:flex-end}
.chart-bar{width:100%;background:linear-gradient(180deg,var(--app-accent),var(--app-accent-strong));border-radius:8px 8px 0 0;animation:barGrow .6s ease both}
.chart-label{font-size:10px;color:var(--text-muted);font-weight:700}
.chart-val{font-size:9px;color:#bbb}

/* Add Points */
.btn-mint{background:var(--app-accent);color:white;border:none;padding:7px 16px;border-radius:10px;font-weight:800;cursor:pointer;font-family:var(--font-body);font-size:13px;transition:all .2s}
.btn-mint:hover{background:var(--app-accent-strong)}
.btn-mint.full{width:100%;padding:12px;font-size:14px;border-radius:12px}
.addpts-box{margin-top:12px}
.addpts-chips{display:flex;gap:8px;margin-bottom:10px}
.addpts-chip{flex:1;padding:10px;border:2px solid var(--app-border);border-radius:12px;background:var(--app-surface);font-weight:800;cursor:pointer;font-family:var(--font-body);transition:all .2s;font-size:14px}
.apc-on{border-color:var(--app-accent);background:#E9FBFF;color:var(--app-accent)}

/* Activity */
.act-row{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--app-border)}
.act-row:last-child{border:none}
.act-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
[data-type="pill"]{background:#6BCB77}
[data-type="game"]{background:#74B9FF}
[data-type="streak"]{background:#FF6B6B}
[data-type="bonus"]{background:#FFD93D}
[data-type="pending"]{background:#95A5A6}
[data-type="denied"]{background:#E67E22}
.act-text{flex:1;font-size:13px;font-weight:600;color:var(--text-strong)}
.act-time{font-size:11px;color:var(--text-soft)}
.act-pts{font-size:12px;font-weight:800;color:var(--app-success)}

/* Parent game/reward rows */
.pgame-row{display:flex;align-items:center;gap:10px;padding:12px;background:var(--surface-soft);border-radius:12px;margin-bottom:8px}
.pgame-icon{font-size:28px;flex-shrink:0}
.pgame-info{flex:1;min-width:0}
.pgame-info strong{display:block;font-size:14px;color:var(--text-strong)}
.pgame-info span{font-size:12px;color:var(--text-muted)}
.btn-assign{background:#E9FBFF;color:var(--app-accent);border:2px solid var(--app-accent);padding:6px 14px;border-radius:10px;font-weight:800;cursor:pointer;font-family:var(--font-body);font-size:12px;transition:all .2s}
.btn-assign:hover{background:var(--app-accent);color:white}
.btn-remove{background:#FFF0F0;color:var(--app-danger);border:2px solid var(--app-danger);padding:6px 12px;border-radius:10px;font-weight:800;cursor:pointer;font-family:var(--font-body);font-size:12px;transition:all .2s}
.btn-remove:hover{background:var(--app-danger);color:white}
.pa-helper{font-size:13px;color:var(--text-muted);margin-bottom:10px}
.pa-empty{color:var(--text-soft);text-align:center;padding:16px}
.careplan-admin .target-chips{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}
.careplan-admin .target-chips .addpts-chip{flex:1;min-width:110px}
.careplan-note{margin-top:10px;font-size:13px;color:var(--text-muted);display:flex;align-items:center;gap:8px;font-weight:700}
.pack-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:10px}
.pack-tile{display:flex;flex-direction:column;align-items:flex-start;gap:6px;padding:14px;border:2px solid var(--app-border);border-radius:18px;background:linear-gradient(180deg,#FFFFFF,#F9FBFD);cursor:pointer;transition:all .2s;text-align:left}
.pack-tile:hover{transform:translateY(-2px);border-color:var(--pack-accent);box-shadow:var(--shadow-sm)}
.pack-tile-on{border-color:var(--pack-accent);background:color-mix(in srgb,var(--pack-accent) 10%,white)}
.pack-tile-icon{font-size:28px}
.pack-tile-name{font-family:var(--font-display);font-size:17px;color:var(--text-strong)}
.pack-tile-desc{font-size:12px;color:var(--text-muted);line-height:1.4}
.pack-card{padding:14px 16px;border-radius:18px;background:linear-gradient(135deg,#F8FCFF,#FFFFFF);border:2px solid #D9ECF8}
.pack-top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
.pack-label{font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:#7A91A4}
.pack-name{font-family:var(--font-display);font-size:20px;color:var(--text-strong);margin-top:2px}
.pack-desc{font-size:13px;color:var(--text-muted);margin-top:8px;line-height:1.5}
.pack-meta{display:flex;justify-content:space-between;gap:8px;margin-top:10px;font-size:12px;font-weight:700;color:var(--text-muted);flex-wrap:wrap}

/* Approvals */
.appr-row{display:flex;justify-content:space-between;align-items:center;padding:12px;background:rgba(255,217,61,0.1);border-radius:12px;margin-bottom:8px}
.appr-info{font-weight:700;font-size:14px}
.appr-cost{font-weight:400;color:#999;font-size:12px}
.appr-btns{display:flex;gap:6px}
.btn-yes{background:var(--app-success);color:white;border:none;padding:8px 14px;border-radius:10px;font-weight:800;cursor:pointer;font-family:var(--font-body);font-size:13px}
.btn-no{background:var(--app-danger);color:white;border:none;padding:8px 14px;border-radius:10px;font-weight:800;cursor:pointer;font-family:var(--font-body);font-size:13px}
.rw-st{font-size:12px;font-weight:700;color:var(--app-success)}
.rw-st-claimed{color:#999}

@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{
    animation-duration:.001ms !important;
    animation-iteration-count:1 !important;
    transition-duration:.001ms !important;
    scroll-behavior:auto !important;
  }
}

@media(max-width:480px){
  .land-title{font-size:42px}
  .land-cards{flex-direction:column;align-items:center}
  .hero-stage-card{flex-direction:column;text-align:center}
  .pills-grid{grid-template-columns:1fr}
  .rw-grid{grid-template-columns:1fr 1fr}
  .pa-stats{grid-template-columns:1fr 1fr}
  .careplan-inline{flex-direction:column;align-items:flex-start}
  .vc-head{flex-direction:column}
  .vc-actions{flex-direction:column}
  .vc-actions .ui-btn{width:100%}
  .pack-grid{grid-template-columns:1fr}
  .ws-grid{grid-template-columns:1fr}
  .ts-grid{grid-template-columns:1fr}
  .gi-card{width:110px;height:130px}
  .gi-letter{font-size:40px}
}
      `}</style>
      <div className={`app-root ${dyslexiaMode ? "dyslexia-mode" : ""}`}>
        {!role && <Landing onRole={setRole} />}
        {role === "child" && (
          <ChildApp
            s={s}
            set={set}
            logout={() => setRole(null)}
            dyslexiaMode={dyslexiaMode}
            onToggleDyslexiaMode={() => setDyslexiaMode(v => !v)}
          />
        )}
        {role === "parent" && (
          <ParentApp
            s={s}
            set={set}
            logout={() => setRole(null)}
            dyslexiaMode={dyslexiaMode}
            onToggleDyslexiaMode={() => setDyslexiaMode(v => !v)}
          />
        )}
      </div>
    </>
  );
}