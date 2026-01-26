import { ShotDirection, ShotType } from "../constants";
import {
  createFirepeaShot,
  createPeashot,
  createRicochetPeashot,
  createSnowpeaShot,
} from "../pea";
import { createShroomshot } from "../shroomshot";

import type { LevelStore } from "@/game/level";
import type { Shot } from "../types/shot";

export function createShot(
  type: ShotType,
  x: number,
  y: number,
  store: LevelStore,
  direction?: ShotDirection,
): Shot | null {
  let shot: Shot | null = null;

  switch (type) {
    case ShotType.Peashot:
      shot = createPeashot({
        x,
        y,
        direction,
        store,
      });
      break;

    case ShotType.SnowpeaShot:
      shot = createSnowpeaShot({
        x,
        y,
        direction,
        store,
      });
      break;

    case ShotType.FirepeaShot:
      shot = createFirepeaShot({
        x,
        y,
        direction,
        store,
      });
      break;

    case ShotType.RicochetPeashot:
      shot = createRicochetPeashot({
        x,
        y,
        store,
      });
      break;

    case ShotType.Shroomshot:
      shot = createShroomshot({
        x,
        y,
        store,
      });
      break;
  }

  return shot;
}
