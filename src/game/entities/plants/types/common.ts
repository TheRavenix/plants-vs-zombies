import type { Hitbox } from "@/game/entities/features/hitbox";
import type { Position } from "@/game/features/position";
import type { Size } from "@/game/features/size";
import type { Health } from "@/game/entities/features/health";
import type { Drawable } from "@/game/types/drawable";
import type { Updatable } from "@/game/types/updatable";
import type { Vector2 } from "@/game/types/math";
import type { LevelStore } from "@/game/level";

export interface BasePlant extends Drawable, Updatable {
  readonly id: string;
  readonly position: Position;
  readonly size: Size;
  readonly health: Health;
  readonly hitbox: Hitbox;
  readonly sunCost: number;
}

export type PlantInfoType = Readonly<{
  SunCost: number;
  SpriteImage: HTMLImageElement;
  Cooldown: number;
}>;

export type PlantOptions = {
  store: LevelStore;
} & Vector2;
