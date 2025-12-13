import type { Vector2 } from "@/game/types/vector";
import type { ZombieState, ZombieType } from "./constants";
import type { Board } from "@/game/board";
import type { Hitbox } from "@/game/helpers/hitbox";
import type { Size } from "@/game/types/size";
import type { Game } from "@/game/game";
import type { NormalZombie } from "./normal-zombie";
import type { FlagZombie } from "./flag-zombie";

export type Zombie = {
  type: ZombieType;
  id: string;
  state: ZombieState;
  health: number;
  damage: number;
  speed: number;
  hitbox: Hitbox;
  damageTimer: number;
} & Vector2 &
  Size;

export type AnyZombie = NormalZombie | FlagZombie;

export type ZombieDrawOptions<Z extends Zombie = Zombie> = {
  zombie: Z;
  board: Board;
};

export type ZombieUpdateOptions<Z extends Zombie = Zombie> = {
  deltaTime: number;
  zombie: Z;
  game: Game;
};

export type ZombieTakeDamageOptions<Z extends Zombie = Zombie> = {
  damage: number;
  zombie: Z;
};
