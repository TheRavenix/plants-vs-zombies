import type { Hitbox } from "@/game/entities/features/hitbox";
import type { Position } from "@/game/features/position";
import type { Size } from "@/game/features/size";
import type { Health } from "@/game/entities/features/health";
import type { Drawable } from "@/game/types/drawable";
import type { Updatable } from "@/game/types/updatable";
import type { Vector2 } from "@/game/types/math";
import type { LevelEvent } from "@/game/level/events/types";
import type { Zombie } from "../../zombies/types/zombie";
import type { Shooter } from "../features/shooter";

export interface BasePlant extends Drawable, Updatable<LevelEvent[]> {
  readonly id: string;
  readonly position: Position;
  readonly size: Size;
  readonly health: Health;
  readonly hitbox: Hitbox;
  readonly sunCost: number;
}

export interface ShooterPlant extends BasePlant {
  readonly shooter: Shooter;
}

export type PlantInfoType = Readonly<{
  SunCost: number;
  SpritePath: string;
  Cooldown: number;
}>;

export type PlantOptions = {} & Vector2;

export type GetZombiesOptions = {
  getZombies(): Zombie[];
};

export type ShooterPlantOptions = {
  getZombies(): Zombie[];
} & Vector2;
