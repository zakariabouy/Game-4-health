# game_manager.gd — Autoload Singleton
# SETUP: Project → Project Settings → Autoload → Add this script as "GameManager"
extends Node

# ─── Signals ───
signal missions_updated                            # fired when active_missions changes
signal mission_interact(mission_data: Dictionary)  # player wants to start a mission
signal mission_completed(mission_id: String)       # mission finished, award points
signal player_freeze(frozen: bool)                 # tell the player to stop/resume

# ─── All possible missions (parent picks from these) ───
# Each key matches a game id from the React PACK_LIBRARY.
var ALL_MISSIONS: Dictionary = {
	# ── Dyslexia ──
	"g1": { "id": "g1", "name": "Letter Flip",      "cat": "dyslexia",   "icon": "🔤", "desc": "Spot the correct letter among mirror images!", "color": Color(0.455, 0.725, 1.0) },
	"g2": { "id": "g2", "name": "Word Builder",     "cat": "dyslexia",   "icon": "🧩", "desc": "Unscramble letters to build the right word!",  "color": Color(0.455, 0.725, 1.0) },
	"g3": { "id": "g3", "name": "Syllable Stomp",   "cat": "dyslexia",   "icon": "👣", "desc": "Break words into their syllable parts!",       "color": Color(0.455, 0.725, 1.0) },
	# ── ADHD ──
	"a1": { "id": "a1", "name": "Focus Sprint",     "cat": "adhd",       "icon": "🎯", "desc": "Find the target shape before time runs out!",  "color": Color(1.0, 0.702, 0.278) },
	"a2": { "id": "a2", "name": "Impulse Pause",    "cat": "adhd",       "icon": "⏸️", "desc": "Wait for the right moment to act!",            "color": Color(1.0, 0.702, 0.278) },
	# ── Autism ──
	"u1": { "id": "u1", "name": "Routine Builder",  "cat": "autism",     "icon": "🗓️", "desc": "Put daily steps in the right order!",          "color": Color(0.635, 0.608, 0.996) },
	"u2": { "id": "u2", "name": "Emotion Match",    "cat": "autism",     "icon": "🙂", "desc": "Match faces to the feelings they show!",       "color": Color(0.635, 0.608, 0.996) },
	# ── Anxiety ──
	"n1": { "id": "n1", "name": "Breath Bubble",    "cat": "anxiety",    "icon": "💨", "desc": "Breathe in and out with the bubble!",          "color": Color(0.420, 0.796, 0.467) },
	"n2": { "id": "n2", "name": "Worry Drop",       "cat": "anxiety",    "icon": "🍃", "desc": "Let worries float gently away!",               "color": Color(0.420, 0.796, 0.467) },
	# ── Medication / Pills ──
	"m1": { "id": "m1", "name": "Dose Dodge",       "cat": "medication", "icon": "💊", "desc": "Match the right pill to the right time!",      "color": Color(1.0, 0.851, 0.239) },
	"m2": { "id": "m2", "name": "Reminder Run",     "cat": "medication", "icon": "⏰", "desc": "Follow the medicine schedule!",                "color": Color(1.0, 0.851, 0.239) },
}

# ─── State ───
# The missions the parent has chosen. Array of mission dicts from ALL_MISSIONS.
var active_missions: Array[Dictionary] = []
# Which missions the kid already completed this session.
var completed_ids: Array[String] = []
var total_score: int = 0

# ─── Spawn points for mission markers (world positions) ───
# We place up to 4 markers at pre-defined spots in the dungeon.
# These are the open floor areas visible in the map.
var spawn_slots: Array[Vector2] = [
	Vector2(388, 720),   # first arrow — bottom rug area
	Vector2(55, 119),    # second arrow — top-left rug area
]

func _ready() -> void:
	# Start with an example: parent assigned "Letter Flip" + "Dose Dodge"
	# In a real build you'd load this from a save file or HTTP call.
	set_active_missions(["g1", "m1"])

# ─── Called by parent dashboard (or a config file) ───
func set_active_missions(ids: Array) -> void:
	active_missions.clear()
	for id in ids:
		if id in ALL_MISSIONS and id not in completed_ids:
			active_missions.append(ALL_MISSIONS[id])
	missions_updated.emit()

# ─── Called when kid walks up and presses interact ───
func request_interact(mission_data: Dictionary) -> void:
	player_freeze.emit(true)
	mission_interact.emit(mission_data)

# ─── Called when the kid finishes (or closes) the popup game ───
func complete(mission_id: String) -> void:
	if mission_id not in completed_ids:
		completed_ids.append(mission_id)
		total_score += 10
	# Remove from active list
	active_missions = active_missions.filter(func(m): return m["id"] != mission_id)
	mission_completed.emit(mission_id)
	player_freeze.emit(false)
	missions_updated.emit()

func cancel_interact() -> void:
	player_freeze.emit(false)

func is_done(mission_id: String) -> bool:
	return mission_id in completed_ids
