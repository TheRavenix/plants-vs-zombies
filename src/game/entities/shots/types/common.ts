import type { Hitbox } from "@/game/helpers/hitbox";
import type { ShotDirection } from "../constants";
import type { Rect } from "@/game/types/math";
import type { Board } from "@/game/board";
import type { Level } from "@/game/level";

export type BaseShot = {
  id: string;
  damage: number;
  speed: number;
  hitbox: Hitbox;
  fillStyle: string;
  direction?: ShotDirection;
  active: boolean;
} & Rect;

export type ShotDrawOptions = {
  board: Board;
};

export type ShotUpdateOptions = {
  deltaTime: number;
  level: Level;
};
