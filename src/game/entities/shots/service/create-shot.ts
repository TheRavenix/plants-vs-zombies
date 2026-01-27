import { ShotDirection, ShotType } from "../constants";
import {
  createFirepeaShot,
  createPeashot,
  createRicochetPeashot,
  createSnowpeaShot,
} from "../pea";
import { createPuffShroomshot } from "../shroom";

import type { LevelStore } from "@/game/level";
import type { Shot } from "../types/shot";

export function createShot(
  type: ShotType,
  x: number,
  y: number,
  store: LevelStore,
  direction?: ShotDirection,
): Shot | null {
  const { state, actions } = store;
  let shot: Shot | null = null;

  switch (type) {
    case ShotType.Peashot:
      shot = createPeashot({
        x,
        y,
        direction,
        getZombies: () => state.zombies,
      });

      break;

    case ShotType.SnowpeaShot:
      shot = createSnowpeaShot({
        x,
        y,
        direction,
        getZombies: () => state.zombies,
      });
      break;

    case ShotType.FirepeaShot:
      shot = createFirepeaShot({
        x,
        y,
        direction,
        getZombies: () => state.zombies,
      });
      break;

    case ShotType.RicochetPeashot:
      shot = createRicochetPeashot({
        x,
        y,
        getZombies: () => state.zombies,
        findZombieById: actions.findZombieById,
      });
      break;

    case ShotType.PuffShroomshot:
      shot = createPuffShroomshot({
        x,
        y,
        direction,
        getZombies: () => state.zombies,
      });
      break;
  }

  return shot;
}
