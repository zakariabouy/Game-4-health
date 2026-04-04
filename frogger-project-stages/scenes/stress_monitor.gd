extends Node

## Connects to ESP32 EMG WebSocket and updates the stress bar.
## ESP32 sends raw EMG values as plain text (e.g., "1823").

# --- Capybara UI References & Settings ---
var capybara_popup: Node = null
var stress_threshold := 0.85
var is_calming_down := false

# --- Sensor Variables ---
var socket: WebSocketPeer = null
var esp32_url := "ws://192.168.1.100:81"
var connected := false
var sensor_stress := 0.0

# Calibration: adjust these by watching ESP32 Serial Monitor
var emg_baseline := 300
var emg_max := 2500

func _ready() -> void:
	# Find CapybaraPopup safely
	var game = get_tree().current_scene
	if game and game.has_node("CanvasLayer/CapybaraPopup"):
		capybara_popup = game.get_node("CanvasLayer/CapybaraPopup")
		if capybara_popup.has_node("ResumeButton"):
			capybara_popup.get_node("ResumeButton").pressed.connect(resume_game)

	# Setup EMG Config
	var config_path = "res://emg_config.txt"
	if FileAccess.file_exists(config_path):
		var f = FileAccess.open(config_path, FileAccess.READ)
		var ip = f.get_line().strip_edges()
		f.close()
		if ip != "":
			esp32_url = "ws://" + ip + ":81"

	# Connect WebSocket
	socket = WebSocketPeer.new()
	print("[EMG] Connecting to: ", esp32_url)
	var err = socket.connect_to_url(esp32_url)
	if err != OK:
		print("[EMG] Connection failed: ", err)

func _process(_delta: float) -> void:
	if socket == null:
		return

	socket.poll()
	var state = socket.get_ready_state()

	if state == WebSocketPeer.STATE_OPEN:
		if not connected:
			connected = true
			print("[EMG] Connected to ESP32!")

		while socket.get_available_packet_count() > 0:
			var packet = socket.get_packet()
			var text = packet.get_string_from_utf8().strip_edges()
			if text.is_valid_int():
				var raw = int(text)
				sensor_stress = clamp(float(raw - emg_baseline) / float(emg_max - emg_baseline), 0.0, 1.0)

				if capybara_popup and sensor_stress >= stress_threshold and not is_calming_down and not get_tree().paused:
					trigger_calm_down()

	elif state == WebSocketPeer.STATE_CLOSED:
		if connected:
			connected = false
			print("[EMG] Disconnected. Reconnecting in 2s...")
			await get_tree().create_timer(2.0).timeout
			socket = WebSocketPeer.new()
			socket.connect_to_url(esp32_url)

	var game = get_tree().current_scene
	if game and game.has_method("set_sensor_stress"):
		game.set_sensor_stress(sensor_stress)

func trigger_calm_down():
	if capybara_popup == null:
		return
	is_calming_down = true
	get_tree().paused = true
	capybara_popup.visible = true
	if capybara_popup.has_node("AnimationPlayer"):
		capybara_popup.get_node("AnimationPlayer").play("breathe")

func resume_game():
	if capybara_popup == null:
		return
	is_calming_down = false
	get_tree().paused = false
	capybara_popup.visible = false
	if capybara_popup.has_node("AnimationPlayer"):
		capybara_popup.get_node("AnimationPlayer").stop()
