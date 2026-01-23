import { ShotDirection, ShotType } from "../constants";
import {
  createFirepeaShot,
  createPeashot,
  createRicochetPeashot,
  createSnowpeaShot,
} from "../pea";
import { createShroomshot } from "../shroomshot";

import type { LevelContext } from "@/game/level";
import type { Shot } from "../types/shot";

export function createShot(
  type: ShotType,
  x: number,
  y: number,
  ctx: LevelContext,
  direction?: ShotDirection,
): Shot | null {
  let shot: Shot | null = null;

  switch (type) {
    case ShotType.Peashot:
      shot = createPeashot({
        x,
        y,
        direction,
        ctx,
      });
      break;

    case ShotType.SnowpeaShot:
      shot = createSnowpeaShot({
        x,
        y,
        direction,
        ctx,
      });
      break;

    case ShotType.FirepeaShot:
      shot = createFirepeaShot({
        x,
        y,
        direction,
        ctx,
      });
      break;

    case ShotType.RicochetPeashot:
      shot = createRicochetPeashot({
        x,
        y,
        ctx,
      });
      break;

    case ShotType.Shroomshot:
      shot = createShroomshot({
        x,
        y,
        ctx,
      });
      break;
  }

  return shot;
}
