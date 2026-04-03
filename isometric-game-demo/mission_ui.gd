# mission_ui.gd — Full-screen popup when kid interacts with a mission spot
# This builds its own UI from code. Attach to a CanvasLayer node named "MissionUI".
# SETUP: Add a CanvasLayer named "MissionUI" to your dungeon scene. Attach this script.
#        Optionally add an AudioStreamPlayer child named "SFX" with a success jingle.
extends CanvasLayer

var current_mission: Dictionary = {}

# UI nodes (created in code)
var overlay: ColorRect
var panel: PanelContainer
var icon_label: Label
var title_label: Label
var desc_label: Label
var play_btn: Button
var close_btn: Button
var done_panel: PanelContainer
var done_label: Label

func _ready() -> void:
	layer = 10  # draw above everything

	# ── Dark overlay ──
	overlay = ColorRect.new()
	overlay.color = Color(0, 0, 0, 0.6)
	overlay.anchor_right = 1.0
	overlay.anchor_bottom = 1.0
	overlay.visible = false
	add_child(overlay)

	# ── Main popup panel ──
	panel = PanelContainer.new()
	panel.custom_minimum_size = Vector2(360, 260)
	panel.anchor_left = 0.5
	panel.anchor_top = 0.5
	panel.anchor_right = 0.5
	panel.anchor_bottom = 0.5
	panel.offset_left = -180
	panel.offset_top = -130
	panel.offset_right = 180
	panel.offset_bottom = 130
	panel.visible = false

	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.12, 0.14, 0.18, 0.95)
	style.corner_radius_top_left = 20
	style.corner_radius_top_right = 20
	style.corner_radius_bottom_left = 20
	style.corner_radius_bottom_right = 20
	style.content_margin_left = 24
	style.content_margin_right = 24
	style.content_margin_top = 20
	style.content_margin_bottom = 20
	style.border_width_left = 2
	style.border_width_right = 2
	style.border_width_top = 2
	style.border_width_bottom = 2
	style.border_color = Color(0.3, 0.7, 0.9, 0.5)
	panel.add_theme_stylebox_override("panel", style)
	add_child(panel)

	var vbox = VBoxContainer.new()
	vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	vbox.add_theme_constant_override("separation", 10)
	panel.add_child(vbox)

	# Icon
	icon_label = Label.new()
	icon_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	icon_label.add_theme_font_size_override("font_size", 48)
	vbox.add_child(icon_label)

	# Title
	title_label = Label.new()
	title_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title_label.add_theme_font_size_override("font_size", 22)
	title_label.add_theme_color_override("font_color", Color.WHITE)
	vbox.add_child(title_label)

	# Description
	desc_label = Label.new()
	desc_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	desc_label.add_theme_font_size_override("font_size", 14)
	desc_label.add_theme_color_override("font_color", Color(0.7, 0.75, 0.8))
	desc_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	vbox.add_child(desc_label)

	# Spacer
	var spacer = Control.new()
	spacer.custom_minimum_size = Vector2(0, 6)
	vbox.add_child(spacer)

	# Buttons row
	var btn_row = HBoxContainer.new()
	btn_row.alignment = BoxContainer.ALIGNMENT_CENTER
	btn_row.add_theme_constant_override("separation", 12)
	vbox.add_child(btn_row)

	play_btn = Button.new()
	play_btn.text = "▶  Let's Play!"
	play_btn.custom_minimum_size = Vector2(140, 44)
	var play_style = StyleBoxFlat.new()
	play_style.bg_color = Color(0.18, 0.77, 0.71)
	play_style.corner_radius_top_left = 12
	play_style.corner_radius_top_right = 12
	play_style.corner_radius_bottom_left = 12
	play_style.corner_radius_bottom_right = 12
	play_btn.add_theme_stylebox_override("normal", play_style)
	var play_hover = play_style.duplicate()
	play_hover.bg_color = Color(0.22, 0.85, 0.78)
	play_btn.add_theme_stylebox_override("hover", play_hover)
	play_btn.add_theme_color_override("font_color", Color.WHITE)
	play_btn.add_theme_font_size_override("font_size", 15)
	play_btn.pressed.connect(_on_play_pressed)
	btn_row.add_child(play_btn)

	close_btn = Button.new()
	close_btn.text = "✕  Not Now"
	close_btn.custom_minimum_size = Vector2(120, 44)
	var close_style = StyleBoxFlat.new()
	close_style.bg_color = Color(0.25, 0.27, 0.32)
	close_style.corner_radius_top_left = 12
	close_style.corner_radius_top_right = 12
	close_style.corner_radius_bottom_left = 12
	close_style.corner_radius_bottom_right = 12
	close_btn.add_theme_stylebox_override("normal", close_style)
	var close_hover = close_style.duplicate()
	close_hover.bg_color = Color(0.35, 0.37, 0.42)
	close_btn.add_theme_stylebox_override("hover", close_hover)
	close_btn.add_theme_color_override("font_color", Color(0.7, 0.7, 0.7))
	close_btn.add_theme_font_size_override("font_size", 14)
	close_btn.pressed.connect(_on_close_pressed)
	btn_row.add_child(close_btn)

	# ── "Mission Complete!" panel ──
	done_panel = PanelContainer.new()
	done_panel.custom_minimum_size = Vector2(300, 120)
	done_panel.anchor_left = 0.5
	done_panel.anchor_top = 0.5
	done_panel.anchor_right = 0.5
	done_panel.anchor_bottom = 0.5
	done_panel.offset_left = -150
	done_panel.offset_top = -60
	done_panel.offset_right = 150
	done_panel.offset_bottom = 60
	done_panel.visible = false
	var done_style = StyleBoxFlat.new()
	done_style.bg_color = Color(0.1, 0.55, 0.35, 0.95)
	done_style.corner_radius_top_left = 18
	done_style.corner_radius_top_right = 18
	done_style.corner_radius_bottom_left = 18
	done_style.corner_radius_bottom_right = 18
	done_panel.add_theme_stylebox_override("panel", done_style)
	add_child(done_panel)

	done_label = Label.new()
	done_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	done_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	done_label.add_theme_font_size_override("font_size", 24)
	done_label.add_theme_color_override("font_color", Color.WHITE)
	done_panel.add_child(done_label)

	# ── Connect to GameManager signals ──
	GameManager.mission_interact.connect(_on_mission_interact)
	GameManager.mission_completed.connect(_on_mission_completed)

func _on_mission_interact(data: Dictionary) -> void:
	current_mission = data
	icon_label.text = data.get("icon", "?")
	title_label.text = data.get("name", "Mission")
	desc_label.text = data.get("desc", "Complete this mission!")
	overlay.visible = true
	panel.visible = true

func _on_close_pressed() -> void:
	overlay.visible = false
	panel.visible = false
	current_mission = {}
	GameManager.cancel_interact()

func _on_play_pressed() -> void:
	# Hide the popup — in a real build this would open the actual mini-game scene.
	# For the hackathon demo we simulate a short "playing" delay then mark complete.
	overlay.visible = false
	panel.visible = false

	# ──────────────────────────────────────────────
	# OPTION A (quick demo): simulate playing and auto-complete after 2 seconds
	# OPTION B (real): change scene to a mini-game scene, then call GameManager.complete()
	# We ship Option A so the demo works out of the box.
	# ──────────────────────────────────────────────
	var id = current_mission.get("id", "")
	await get_tree().create_timer(0.3).timeout  # tiny pause
	_show_complete_banner(current_mission.get("name", "Mission"))
	GameManager.complete(id)

func _on_mission_completed(_id: String) -> void:
	# Play SFX if present
	var sfx = get_node_or_null("SFX")
	if sfx and sfx is AudioStreamPlayer and sfx.stream:
		sfx.play()

func _show_complete_banner(mission_name: String) -> void:
	done_label.text = "✅  " + mission_name + " Complete!\n+10 ⭐"
	done_panel.visible = true
	overlay.visible = true
	await get_tree().create_timer(1.8).timeout
	done_panel.visible = false
	overlay.visible = false
