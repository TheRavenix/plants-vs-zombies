import type { Hitbox } from "@/game/helpers/hitbox";
import type { ZombieState } from "../constants";
import type { Rect } from "@/game/types/math";
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
} & Rect &
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
