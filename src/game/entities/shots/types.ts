import type { Board } from "@/game/board";
import type { Game } from "@/game/game";
import type { Hitbox } from "@/game/helpers/hitbox";
import type { Size } from "@/game/types/size";
import type { Vector2 } from "@/game/types/vector";
import type { ShotType } from "./constants";

export type Shot = {
  type: ShotType;
  id: string;
  damage: number;
  speed: number;
  hitbox: Hitbox;
  fillStyle: string;
} & Vector2 &
  Size;

export type ShotDrawOptions<S extends Shot = Shot> = {
  shot: S;
  board: Board;
};

export type ShotUpdateOptions<S extends Shot = Shot> = {
  deltaTime: number;
  shot: S;
  game: Game;
};
