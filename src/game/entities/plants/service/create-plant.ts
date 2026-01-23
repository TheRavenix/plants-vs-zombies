import { createSunflower } from "../sunflower";
import {
  createFirepea,
  createPeashooter,
  createRepeater,
  createSnowpea,
  createThreepeater,
} from "../pea";
import { createWallNut } from "../wall-nut";
import { createPuffshroom, createSunshroom } from "../shroom";
import { createTorchwood } from "../torchwood";
import { PlantType } from "../constants/plant-type";

import type { LevelContext } from "@/game/level";
import type { Plant } from "../types/plant";

export function createPlant(
  type: PlantType,
  x: number,
  y: number,
  ctx: LevelContext,
): Plant | null {
  let plant: Plant | null = null;

  switch (type) {
    case PlantType.Peashooter:
      plant = createPeashooter({
        x,
        y,
        ctx,
      });
      break;

    case PlantType.Sunflower:
      plant = createSunflower({
        x,
        y,
        ctx,
      });
      break;

    case PlantType.Repeater:
      plant = createRepeater({
        x,
        y,
        ctx,
      });
      break;

    case PlantType.Threepeater:
      plant = createThreepeater({
        x,
        y,
        ctx,
      });
      break;

    case PlantType.Snowpea:
      plant = createSnowpea({
        x,
        y,
        ctx,
      });
      break;

    case PlantType.Firepea:
      plant = createFirepea({
        x,
        y,
        ctx,
      });
      break;

    case PlantType.WallNut:
      plant = createWallNut({
        x,
        y,
        ctx,
      });
      break;

    case PlantType.Torchwood:
      plant = createTorchwood({
        x,
        y,
        ctx,
      });
      break;

    case PlantType.Puffshroom:
      plant = createPuffshroom({
        x,
        y,
        ctx,
      });
      break;

    case PlantType.Sunshroom:
      plant = createSunshroom({
        x,
        y,
        ctx,
      });
      break;
  }

  return plant;
}
