import type { Board } from "@/game/board";
import type { Game } from "@/game/game";
import type { Hitbox } from "@/game/helpers/hitbox";
import type { Size } from "@/game/utils/size";
import type { Vector2 } from "@/game/utils/vector";
import type { ShotName } from "./constants";

export type ShotState = {
  name: ShotName;
  id: string;
  damage: number;
  speed: number;
  get hitbox(): Hitbox;
  fillStyle: string;
} & Vector2 &
  Size;

export type Shot<S extends ShotState = ShotState> = {
  get state(): S;
  draw(options: ShotDrawOptions): void;
  update(options: ShotUpdateOptions): void;
};

export type ShotDrawOptions<S extends ShotState = ShotState> = {
  get state(): S;
  board: Board;
};

export type ShotUpdateOptions<S extends ShotState = ShotState> = {
  deltaTime: number;
  get state(): S;
  get game(): Game;
};
