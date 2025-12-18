import type { Hitbox } from "@/game/helpers/hitbox";
import type { ZombieState } from "../constants";
import type { Vector2 } from "@/game/types/vector";
import type { Size } from "@/game/types/size";
import type { Board } from "@/game/board";
import type { Game } from "@/game/game";

export type BaseZombie = {
  id: string;
  state: ZombieState;
  health: number;
  damage: number;
  speed: number;
  hitbox: Hitbox;
  damageTimer: number;
} & Vector2 &
  Size;

export type ZombieDrawOptions = {
  board: Board;
};

export type ZombieUpdateOptions = {
  deltaTime: number;
  game: Game;
};

export type ZombieTakeDamageOptions = {
  damage: number;
};
