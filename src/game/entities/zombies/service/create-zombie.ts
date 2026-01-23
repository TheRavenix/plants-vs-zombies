import { ZombieType } from "../constants";
import { createBasicZombie } from "../basic-zombie";
import { createFlagZombie } from "../flag-zombie";

import type { Zombie } from "../types/zombie";
import type { LevelContext } from "@/game/level";

export function createZombie(
  type: ZombieType,
  x: number,
  y: number,
  ctx: LevelContext,
): Zombie | null {
  let zombie: Zombie | null = null;

  switch (type) {
    case ZombieType.Basic:
      zombie = createBasicZombie({
        x,
        y,
        ctx,
      });
      break;

    case ZombieType.Flag:
      zombie = createFlagZombie({
        x,
        y,
        ctx,
      });
      break;
  }

  return zombie;
}
