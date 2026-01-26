import { ZombieType } from "../constants";
import { createBasicZombie } from "../basic-zombie";
import { createFlagZombie } from "../flag-zombie";

import type { Zombie } from "../types/zombie";
import type { LevelStore } from "@/game/level";

export function createZombie(
  type: ZombieType,
  x: number,
  y: number,
  store: LevelStore,
): Zombie | null {
  let zombie: Zombie | null = null;

  switch (type) {
    case ZombieType.Basic:
      zombie = createBasicZombie({
        x,
        y,
        store,
      });
      break;

    case ZombieType.Flag:
      zombie = createFlagZombie({
        x,
        y,
        store,
      });
      break;
  }

  return zombie;
}
