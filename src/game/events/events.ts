import type {
  DespawnEventPayload,
  DespawnShotEvent,
  SpawnShotEvent,
  SpawnShotEventPayload,
  SpawnSunEvent,
  SpawnSunEventPayload,
} from "./types";

export function createSpawnShotEvent(
  payload: SpawnShotEventPayload,
): SpawnShotEvent {
  return {
    type: "SPAWN_SHOT",
    payload,
  };
}

export function createSpawnSunEvent(
  payload: SpawnSunEventPayload,
): SpawnSunEvent {
  return {
    type: "SPAWN_SUN",
    payload,
  };
}

export function createDespawnShotEvent(
  payload: DespawnEventPayload,
): DespawnShotEvent {
  return {
    type: "DESPAWN_SHOT",
    payload,
  };
}
