import type { Hitbox } from "@/game/entities/features/hitbox";
import type { ShotDirection } from "../constants";
import type { Size } from "@/game/features/size";
import type { Position } from "@/game/features/position";
import type { Drawable } from "@/game/types/drawable";
import type { Updatable } from "@/game/types/updatable";
import type { Vector2 } from "@/game/types/math";
import type { LevelStore } from "@/game/level";

export interface BaseShot extends Drawable, Updatable {
  readonly id: string;
  readonly position: Position;
  readonly size: Size;
  readonly hitbox: Hitbox;
  readonly damage: number;
  readonly speed: number;
  readonly direction?: ShotDirection;
  readonly active: boolean;
}

export type ShotOptions = {
  direction?: ShotDirection;
  store: LevelStore;
} & Vector2;
