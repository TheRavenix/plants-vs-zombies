import type { Board } from "@/game/board";
import type { Hitbox } from "@/game/helpers/hitbox";
import type { Size } from "@/game/types/size";
import type { Vector2 } from "@/game/types/vector";
import type { HasHealth } from "../../types";
import type { Level } from "@/game/level";

export type BasePlant = {
  id: string;
  sunCost: number;
  hitbox: Hitbox;
} & Vector2 &
  Size &
  HasHealth;

export type PlantDrawOptions = {
  board: Board;
};

export type PlantUpdateOptions = {
  deltaTime: number;
  level: Level;
};

export type PlantTakeDamageOptions = {
  damage: number;
};

export type PlantInfoType = Readonly<{
  SunCost: number;
  SpriteImage: HTMLImageElement;
  Cooldown: number;
}>;
