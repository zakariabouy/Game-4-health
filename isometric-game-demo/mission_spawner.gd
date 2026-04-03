# mission_spawner.gd — Spawns floating-arrow MissionSpots on the map
# SETUP: Add a Node2D named "MissionSpawner" to your dungeon scene. Attach this script.
#        It will auto-create mission markers wherever GameManager says there are active missions.
extends Node2D

const MissionSpotScript = preload("res://mission_spot.gd")

var spot_nodes: Array[Node] = []

func _ready() -> void:
	GameManager.missions_updated.connect(_rebuild_spots)
	# Build initial spots after a frame so the scene tree is ready
	call_deferred("_rebuild_spots")

func _rebuild_spots() -> void:
	# Clear old markers
	for node in spot_nodes:
		if is_instance_valid(node):
			node.queue_free()
	spot_nodes.clear()

	var missions = GameManager.active_missions
	var slots = GameManager.spawn_slots

	for i in range(missions.size()):
		if i >= slots.size():
			break  # no more slots available

		var data = missions[i]
		var spot = Area2D.new()
		spot.set_script(MissionSpotScript)
		spot.setup(data, slots[i])
		# Enable collision with CharacterBody2D
		spot.collision_layer = 0
		spot.collision_mask = 1
		add_child(spot)
		spot_nodes.append(spot)
