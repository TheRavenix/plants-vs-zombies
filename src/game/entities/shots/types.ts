import type { Board } from "@/game/board";
import type { Game } from "@/game/game";
import type { Hitbox } from "@/game/helpers/hitbox";
import type { Size } from "@/game/types/size";
import type { Vector2 } from "@/game/types/vector";
import type { ShotDirection, ShotType } from "./constants";

export type BaseShot = {
  id: string;
  damage: number;
  speed: number;
  hitbox: Hitbox;
  fillStyle: string;
  direction?: ShotDirection;
} & Vector2 &
  Size;

// TODO: Move Custom Shots to their own files
// TODO: Keep in mind the a => b and b => a effect (dependant)
export type Peashot = {
  type: ShotType.Peashot;
} & BaseShot;

export type Shot = Peashot;

export type ShotDrawOptions = {
  board: Board;
};

export type ShotUpdateOptions = {
  deltaTime: number;
  game: Game;
};
