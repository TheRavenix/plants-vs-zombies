import type { Hitbox } from "@/game/helpers/hitbox";
import type { ShotDirection } from "../constants";
import type { Vector2 } from "@/game/types/vector";
import type { Size } from "@/game/types/size";
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
} & Vector2 &
  Size;

export type ShotDrawOptions = {
  board: Board;
};

export type ShotUpdateOptions = {
  deltaTime: number;
  level: Level;
};
