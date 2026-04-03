// ════════════════════════════════════════
// PILLHERO — Voice Coach Service
// Cartoonish kid-friendly TTS via browser speechSynthesis
// Designed to be pluggable: swap generateLine() for LLM API later
// ════════════════════════════════════════

// ─── Contextual Line Templates ───
// Each trigger type has multiple variants so it never sounds repetitive.
// Use {childName}, {pillName}, {score}, {streak}, {stage} as placeholders.

const LINES = {
  greeting: [
    "Hey {childName}! Ready for an awesome health adventure today?",
    "Welcome back, champion! Your hero missed you!",
    "Hey there superstar! Let's make today amazing!",
    "Yo {childName}! Your hero is pumped to see you!",
  ],
  pill_reminder: [
    "Hey {childName}, it's time for {pillName}! Let's power up your hero!",
    "Mission alert! {pillName} is ready! Your hero needs the boost!",
    "Time for {pillName}! Let's keep that streak going, champion!",
    "Your hero is calling! Take {pillName} and watch the magic happen!",
  ],
  pill_taken: [
    "Boom! {pillName} done! Your hero just got a power surge!",
    "Amazing job! {pillName} complete! Feel that hero energy!",
    "Yes! Medicine mission accomplished! You're incredible, {childName}!",
    "Kapow! {pillName} taken! Your hero is glowing with power!",
    "Woo hoo! That's how champions do it! {pillName} crushed!",
  ],
  all_pills_done: [
    "LEGENDARY! All pills taken today! Your hero is at full power!",
    "Perfect medicine day! You are absolutely UNSTOPPABLE, {childName}!",
    "Wow wow wow! Every single pill done! Hero power is maxed out!",
  ],
  game_start: [
    "Let's crush this mission! Show me what you've got, champion!",
    "Game time! Your hero believes in you! Let's do this!",
    "Ready, set, GO! Time to earn some epic points!",
    "Alright {childName}, focus up! This is YOUR moment!",
  ],
  game_win_high: [
    "INCREDIBLE! That was your best score EVER! You're a legend!",
    "Whoa! {score} points?! That's absolutely EPIC, {childName}!",
    "Mind blown! You just crushed it! Your hero is SO proud!",
    "AMAZING! Top score! You're officially a gaming superstar!",
  ],
  game_win_normal: [
    "Great work finishing that mission! Your hero got stronger!",
    "Nice job, {childName}! Every mission makes your hero grow!",
    "Well done! {score} points earned! Keep up the awesome work!",
    "Mission complete! You're making real progress, champion!",
  ],
  reward_claimed: [
    "Awesome reward pick! Your parent will approve it super soon!",
    "Great choice! You totally earned that, champion!",
    "Reward requested! You worked hard for this one, {childName}!",
  ],
  streak_milestone: [
    "{streak} days in a row! You're building a superpower routine!",
    "Streak power! {streak} days strong! Your hero is thriving!",
    "Unstoppable! {streak} day streak! That's real champion energy!",
  ],
  hero_evolved: [
    "Your hero just evolved to {stage}! Look how strong you are!",
    "EVOLUTION! Your hero reached {stage} stage! So cool!",
    "Whoa! {stage} unlocked! Your hero is transforming, {childName}!",
  ],
  idle_nudge: [
    "Hey champion, your hero is waiting for you!",
    "Psst, {childName}! There are missions to complete!",
    "Your hero misses you! Come check on your health journey!",
    "Don't forget, your hero needs your help today!",
  ],
};

// ─── Voice Tuning Presets ───
// Carefully tuned for a cartoonish, friendly, kid-appealing voice

const VOICE_PRESETS = {
  gentle: {
    rate: 0.95,     // Slightly slower — calm and reassuring
    pitch: 1.35,    // Higher than normal — friendly and warm
    volume: 0.9,
  },
  energetic: {
    rate: 1.08,     // A bit faster — excited energy
    pitch: 1.5,     // Noticeably higher — cartoonish and fun
    volume: 1.0,
  },
};

// ─── State ───
let _enabled = true;
let _autoReminders = true;
let _style = "gentle";     // "gentle" | "energetic"
let _voiceReady = false;
let _selectedVoice = null;
let _lastSpokenLine = "";

// ─── Initialization ───

function init() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    _voiceReady = false;
    return;
  }

  _voiceReady = true;
  _loadPrefs();
  _pickBestVoice();

  // Voices may load asynchronously
  const synth = window.speechSynthesis;
  if (typeof synth.addEventListener === "function") {
    synth.addEventListener("voiceschanged", _pickBestVoice);
  } else {
    synth.onvoiceschanged = _pickBestVoice;
  }
}

function _loadPrefs() {
  try {
    const e = localStorage.getItem("pillhero.voice.enabled");
    if (e !== null) _enabled = JSON.parse(e);
    const a = localStorage.getItem("pillhero.voice.auto");
    if (a !== null) _autoReminders = JSON.parse(a);
    const s = localStorage.getItem("pillhero.voice.style");
    if (s) _style = s;
  } catch { /* ignore */ }
}

function _savePrefs() {
  try {
    localStorage.setItem("pillhero.voice.enabled", JSON.stringify(_enabled));
    localStorage.setItem("pillhero.voice.auto", JSON.stringify(_autoReminders));
    localStorage.setItem("pillhero.voice.style", _style);
  } catch { /* ignore */ }
}

function _pickBestVoice() {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  if (!voices.length) return;

  // Priority: find a friendly English female voice
  // These tend to sound best at higher pitch for cartoonish effect
  const priorities = [
    // High-quality expressive voices (Windows/Mac/Chrome)
    v => /en/i.test(v.lang) && /zira|samantha|aria|jenny|ava|karen|fiona|moira/i.test(v.name),
    // Any female-sounding English voice
    v => /en(-|_)(us|gb|au)/i.test(v.lang) && /female|woman/i.test(v.name),
    // Google's voices (Chrome) — tend to be good quality
    v => /en(-|_)us/i.test(v.lang) && /google/i.test(v.name),
    // Any English US voice
    v => /en(-|_)us/i.test(v.lang),
    // Any English voice at all
    v => /en/i.test(v.lang),
  ];

  for (const test of priorities) {
    const match = voices.find(test);
    if (match) {
      _selectedVoice = match;
      return;
    }
  }

  // Fallback: first available voice
  _selectedVoice = voices[0] || null;
}

// ─── Line Generation ───

function _fillTemplate(template, context = {}) {
  let line = template;
  for (const [key, value] of Object.entries(context)) {
    line = line.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
  }
  return line;
}

function _pickLine(trigger, context = {}) {
  const variants = LINES[trigger];
  if (!variants || !variants.length) return null;

  // Pick a random variant, avoiding the last spoken line
  let attempts = 0;
  let line;
  do {
    line = variants[Math.floor(Math.random() * variants.length)];
    attempts++;
  } while (line === _lastSpokenLine && variants.length > 1 && attempts < 5);

  _lastSpokenLine = line;
  return _fillTemplate(line, context);
}

// ─── Public: Generate a contextual line ───
// This is the function you'd swap for an LLM API call in the future
function generateLine(trigger, context = {}) {
  return _pickLine(trigger, context);
}

// ─── Public: Speak ───

function speak(trigger, context = {}, priority = "normal") {
  if (!_enabled || !_voiceReady) return;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const line = generateLine(trigger, context);
  if (!line) return;

  const synth = window.speechSynthesis;
  const preset = VOICE_PRESETS[_style] || VOICE_PRESETS.gentle;

  // High priority: cancel any currently speaking
  if (priority === "high") {
    synth.cancel();
  }

  const utter = new SpeechSynthesisUtterance(line);
  utter.lang = "en-US";
  utter.rate = preset.rate;
  utter.pitch = preset.pitch;
  utter.volume = preset.volume;

  if (_selectedVoice) {
    utter.voice = _selectedVoice;
  }

  synth.speak(utter);
  return line; // Return the generated text for speech bubble display etc
}

// ─── Public: Speak a raw string (for custom one-offs) ───

function speakRaw(text, priority = "normal") {
  if (!_enabled || !_voiceReady) return;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const synth = window.speechSynthesis;
  const preset = VOICE_PRESETS[_style] || VOICE_PRESETS.gentle;

  if (priority === "high") synth.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = preset.rate;
  utter.pitch = preset.pitch;
  utter.volume = preset.volume;
  if (_selectedVoice) utter.voice = _selectedVoice;

  synth.speak(utter);
}

// ─── Public: Getters / Setters ───

function setEnabled(val) {
  _enabled = !!val;
  if (!_enabled && typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  _savePrefs();
}
function getEnabled() { return _enabled; }

function setAutoReminders(val) { _autoReminders = !!val; _savePrefs(); }
function getAutoReminders() { return _autoReminders; }

function setStyle(val) {
  if (val === "gentle" || val === "energetic") {
    _style = val;
    _savePrefs();
  }
}
function getStyle() { return _style; }

function isReady() { return _voiceReady; }

function cleanup() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

// ─── Export ───

const voiceService = {
  init,
  speak,
  speakRaw,
  generateLine,
  setEnabled,
  getEnabled,
  setAutoReminders,
  getAutoReminders,
  setStyle,
  getStyle,
  isReady,
  cleanup,
  VOICE_PRESETS,
  LINES,
};

export default voiceService;
