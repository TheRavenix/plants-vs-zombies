import type { Hitbox } from "@/game/helpers/hitbox";
import type { ZombieState } from "../constants";
import type { Vector2 } from "@/game/types/vector";
import type { Size } from "@/game/types/size";
import type { Board } from "@/game/board";
import type { HasHealth } from "../../types";
import type { Level } from "@/game/level";

export type BaseZombie = {
  id: string;
  state: ZombieState;
  damage: number;
  speed: number;
  hitbox: Hitbox;
  damageTimer: number;
  freezeAmount: number;
} & Vector2 &
  Size &
  HasHealth;

export type ZombieDrawOptions = {
  board: Board;
};

export type ZombieUpdateOptions = {
  deltaTime: number;
  level: Level;
};

export type ZombieTakeDamageOptions = {
  damage: number;
};
