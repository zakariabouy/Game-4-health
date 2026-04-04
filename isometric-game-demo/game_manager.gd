# game_manager.gd — Autoload Singleton
# SETUP: Project → Project Settings → Autoload → Add this script as "GameManager"
extends Node

# ─── Signals ───
signal missions_updated
signal mission_interact(mission_data: Dictionary)
signal mission_completed(mission_id: String)
signal player_freeze(frozen: bool)

# ─── All therapy games (NO pills — pills are handled in the React dashboard) ───
var ALL_MISSIONS: Dictionary = {
	# ── Dyslexia Pack ──
	"g1": { "id": "g1", "name": "Letter Flip",      "cat": "dyslexia", "icon": "🔤", "desc": "Spot the correct letter among mirror images!", "color": Color(0.455, 0.725, 1.0) },
	"g2": { "id": "g2", "name": "Word Builder",     "cat": "dyslexia", "icon": "🧩", "desc": "Unscramble letters to build the right word!",  "color": Color(0.455, 0.725, 1.0) },
	"g3": { "id": "g3", "name": "Syllable Stomp",   "cat": "dyslexia", "icon": "👣", "desc": "Break words into syllable parts!",             "color": Color(0.455, 0.725, 1.0) },
	"g6": { "id": "g6", "name": "Mirror Letters",   "cat": "dyslexia", "icon": "🪞", "desc": "Spot the reversed letters!",                   "color": Color(0.455, 0.725, 1.0) },
	# ── ADHD Pack ──
	"a1": { "id": "a1", "name": "Focus Sprint",     "cat": "adhd",     "icon": "🎯", "desc": "Find the target shape before time runs out!",  "color": Color(1.0, 0.702, 0.278) },
	"a2": { "id": "a2", "name": "Impulse Pause",    "cat": "adhd",     "icon": "⏸️", "desc": "Wait for the right moment to act!",            "color": Color(1.0, 0.702, 0.278) },
	"a3": { "id": "a3", "name": "Memory Dash",      "cat": "adhd",     "icon": "🧠", "desc": "Repeat the pattern fast!",                     "color": Color(1.0, 0.702, 0.278) },
	"a4": { "id": "a4", "name": "Calm Countdown",   "cat": "adhd",     "icon": "🌬️", "desc": "Slow breathing challenge!",                   "color": Color(1.0, 0.702, 0.278) },
	# ── Autism Pack ──
	"u1": { "id": "u1", "name": "Routine Builder",  "cat": "autism",   "icon": "🗓️", "desc": "Put daily steps in the right order!",          "color": Color(0.635, 0.608, 0.996) },
	"u2": { "id": "u2", "name": "Emotion Match",    "cat": "autism",   "icon": "🙂", "desc": "Match faces to the feelings they show!",       "color": Color(0.635, 0.608, 0.996) },
	"u3": { "id": "u3", "name": "Calm Corner",      "cat": "autism",   "icon": "🫧", "desc": "Breathing and calming practice!",              "color": Color(0.635, 0.608, 0.996) },
	"u4": { "id": "u4", "name": "Social Sequence",  "cat": "autism",   "icon": "🗣️", "desc": "Choose the next social step!",                "color": Color(0.635, 0.608, 0.996) },
	# ── Anxiety Pack ──
	"mw1": { "id": "mw1", "name": "Mystic Woods",    "cat": "anxiety",  "icon": "🌲", "desc": "Follow the calm forest path and collect glowing spirits!", "color": Color(0.420, 0.796, 0.467) },
	"n1": { "id": "n1", "name": "Breath Bubble",    "cat": "anxiety",  "icon": "💨", "desc": "Breathe in and out with the bubble!",          "color": Color(0.420, 0.796, 0.467) },
	"n2": { "id": "n2", "name": "Worry Drop",       "cat": "anxiety",  "icon": "🍃", "desc": "Let worries float gently away!",               "color": Color(0.420, 0.796, 0.467) },
	"n3": { "id": "n3", "name": "Brave Steps",      "cat": "anxiety",  "icon": "👣", "desc": "Pick the calm next step!",                     "color": Color(0.420, 0.796, 0.467) },
	"n4": { "id": "n4", "name": "Safe Space",       "cat": "anxiety",  "icon": "🏡", "desc": "Build a comfort routine!",                     "color": Color(0.420, 0.796, 0.467) },
}

# ─── Packs: parent picks one of these from the React dashboard ───
var PACKS: Dictionary = {
	"dyslexia": ["g1", "g2", "g3", "g6"],
	"adhd":     ["a1", "a2", "a3", "a4"],
	"autism":   ["u1", "u2", "u3", "u4"],
	"anxiety":  ["mw1", "n1", "n2", "n3", "n4"],
}

# ─── State ───
var active_missions: Array[Dictionary] = []
var completed_ids: Array[String] = []
var total_score: int = 0

# ─── Spawn points for arrows (2 slots — on the carpets) ───
var spawn_slots: Array[Vector2] = [
	Vector2(392, 717),   # Carpet 1
	Vector2(54, 112),    # Carpet 2
]

func _ready() -> void:
	# Default: parent assigned anxiety pack → Mystic Woods shows as the first arrow
	# In a real build, load this from a save file written by the parent dashboard.
	assign_pack("anxiety")  # Change to "dyslexia", "adhd", "autism" to test different packs

# ─── Called when parent picks a pack ───
func assign_pack(pack_id: String) -> void:
	var ids = PACKS.get(pack_id, [])
	# Only first 2 games — matching our 2 carpet slots
	set_active_missions(ids.slice(0, 2))

# ─── Set which game IDs are active (up to number of spawn slots) ───
func set_active_missions(ids: Array) -> void:
	active_missions.clear()
	for id in ids:
		if id in ALL_MISSIONS and id not in completed_ids:
			active_missions.append(ALL_MISSIONS[id])
	missions_updated.emit()

# ─── Player walks up and presses E ───
func request_interact(mission_data: Dictionary) -> void:
	player_freeze.emit(true)
	mission_interact.emit(mission_data)

# ─── Kid finishes a game → remove only that one arrow ───
func complete(mission_id: String) -> void:
	if mission_id not in completed_ids:
		completed_ids.append(mission_id)
		total_score += 10
	active_missions = active_missions.filter(func(m): return m["id"] != mission_id)
	mission_completed.emit(mission_id)
	player_freeze.emit(false)

func cancel_interact() -> void:
	player_freeze.emit(false)

func is_done(mission_id: String) -> bool:
	return mission_id in completed_ids
