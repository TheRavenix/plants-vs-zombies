import type { Hitbox } from "@/game/features/hitbox";
import type { ZombieState } from "../constants";
import type { Size } from "@/game/features/size";
import type { Position } from "@/game/features/position";
import type { Health } from "@/game/features/health";
import type { Drawable } from "@/game/types/drawable";
import type { Updatable } from "@/game/types/updatable";

export interface BaseZombie extends Drawable, Updatable {
  readonly id: string;
  readonly position: Position;
  readonly size: Size;
  readonly health: Health;
  readonly hitbox: Hitbox;
  readonly state: ZombieState;
  readonly damage: number;
  readonly speed: number;
  readonly damageTimer: number;
  readonly freezeAmount: number;
  setFreezeAmount(freezeAmount: number): void;
}
