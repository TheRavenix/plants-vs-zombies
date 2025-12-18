import type { Hitbox } from "@/game/helpers/hitbox";
import type { ShotDirection } from "../constants";
import type { Vector2 } from "@/game/types/vector";
import type { Size } from "@/game/types/size";
import type { Board } from "@/game/board";
import type { Game } from "@/game/game";

export type BaseShot = {
  id: string;
  damage: number;
  speed: number;
  hitbox: Hitbox;
  fillStyle: string;
  direction?: ShotDirection;
} & Vector2 &
  Size;

export type ShotDrawOptions = {
  board: Board;
};

export type ShotUpdateOptions = {
  deltaTime: number;
  game: Game;
};
