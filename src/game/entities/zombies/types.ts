import type { Vector2 } from "@/game/types/vector";
import type { ZombieState, ZombieType } from "./constants";
import type { Board } from "@/game/board";
import type { Hitbox } from "@/game/helpers/hitbox";
import type { Size } from "@/game/types/size";
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

// TODO: Move Custom Zombies to their own files
// TODO: Keep in mind the a => b and b => a effect (dependant)
export type NormalZombie = {
  type: ZombieType.Normal;
} & BaseZombie;

export type FlagZombie = {
  type: ZombieType.Flag;
} & BaseZombie;

export type Zombie = NormalZombie | FlagZombie;

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
