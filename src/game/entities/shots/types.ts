import type { Board } from "@/game/board";
import type { Hitbox } from "@/game/helpers/hitbox";
import type { Size } from "@/game/utils/size";
import type { Vector2 } from "@/game/utils/vector";

export type ShotState = {
  id: string;
  damage: number;
  speed: number;
  hitbox: Hitbox;
} & Vector2 &
  Size;

export type Shot<S extends ShotState = ShotState> = {
  state: S;
  draw(options: ShotDrawOptions): void;
  update(options: ShotUpdateOptions): void;
};

export type ShotDrawOptions<S extends ShotState = ShotState> = {
  state: S;
  board: Board;
};

export type ShotUpdateOptions<S extends ShotState = ShotState> = {
  deltaTime: number;
  state: S;
};
