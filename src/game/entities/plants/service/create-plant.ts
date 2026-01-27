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

import type { Plant } from "../types/plant";
import type { LevelStore } from "@/game/level";

export function createPlant(
  type: PlantType,
  x: number,
  y: number,
  store: LevelStore,
): Plant | null {
  const { state } = store;
  let plant: Plant | null = null;

  switch (type) {
    case PlantType.Peashooter:
      plant = createPeashooter({
        x,
        y,
        getZombies: () => state.zombies,
      });
      break;

    case PlantType.Sunflower:
      plant = createSunflower({
        x,
        y,
      });
      break;

    case PlantType.Repeater:
      plant = createRepeater({
        x,
        y,
        getZombies: () => state.zombies,
      });
      break;

    case PlantType.Threepeater:
      plant = createThreepeater({
        x,
        y,
        getZombies: () => state.zombies,
      });
      break;

    case PlantType.Snowpea:
      plant = createSnowpea({
        x,
        y,
        getZombies: () => state.zombies,
      });
      break;

    case PlantType.Firepea:
      plant = createFirepea({
        x,
        y,
        getZombies: () => state.zombies,
      });
      break;

    case PlantType.WallNut:
      plant = createWallNut({
        x,
        y,
      });
      break;

    case PlantType.Torchwood:
      plant = createTorchwood({
        x,
        y,
        getShots: () => state.shots,
      });
      break;

    case PlantType.Puffshroom:
      plant = createPuffshroom({
        x,
        y,
        getZombies: () => state.zombies,
      });
      break;

    case PlantType.Sunshroom:
      plant = createSunshroom({
        x,
        y,
      });
      break;
  }

  return plant;
}
