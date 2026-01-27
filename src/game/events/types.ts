import type { ShotDirection, ShotType } from "../entities/shots";

export type SpawnShotEventPayload = {
  type: ShotType;
  x: number;
  y: number;
  direction?: ShotDirection;
};

export type SpawnShotEvent = {
  type: "SPAWN_SHOT";
  payload: SpawnShotEventPayload;
};

export type SpawnSunEventPayload = {
  x: number;
  y: number;
  amount: number;
};

export type SpawnSunEvent = {
  type: "SPAWN_SUN";
  payload: SpawnSunEventPayload;
};

export type DespawnEventPayload = {
  id: string;
};

export type DespawnShotEvent = {
  type: "DESPAWN_SHOT";
  payload: DespawnEventPayload;
};

export type GameEvent = SpawnShotEvent | SpawnSunEvent | DespawnShotEvent;
