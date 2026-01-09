import { createSunflower, drawSunflower, updateSunflower } from "./sunflower";
import {
  createFirepea,
  createPeashooter,
  createRepeater,
  createSnowpea,
  createThreepeater,
  drawFirepea,
  drawPeashooter,
  drawRepeater,
  drawSnowpea,
  drawThreepeater,
  updateFirepea,
  updatePeashooter,
  updateRepeater,
  updateSnowpea,
  updateThreepeater,
} from "./pea";
import { createWallNut, drawWallNut, updateWallNut } from "./wall-nut";
import {
  createPuffshroom,
  createSunshroom,
  drawPuffshroom,
  drawSunshroom,
  updatePuffshroom,
  updateSunshroom,
} from "./shroom";
import { createTorchwood, drawTorchwood, updateTorchwood } from "./torchwood";
import { drawText } from "@/game/helpers/canvas";
import { PlantType } from "./constants";
import { FontSize } from "@/game/constants/font";

import type {
  BasePlant,
  Plant,
  PlantDrawOptions,
  PlantUpdateOptions,
} from "./types";
import type { Level } from "@/game/level";

type DrawPlantRectOptions = {
  fillStyle?: string;
} & PlantDrawOptions;

export function createPlantId(): string {
  return `PLANT-${crypto.randomUUID()}`;
}

export function drawPlantRect(plant: BasePlant, options: DrawPlantRectOptions) {
  const { ctx } = options.board;

  if (ctx === null) {
    return;
  }

  const fillStyle = options?.fillStyle ?? "#A0B09A";

  ctx.fillStyle = fillStyle;
  ctx.fillRect(plant.x, plant.y, plant.width, plant.height);
  ctx.fill();
}

export function drawPlantType(plant: Plant, options: PlantDrawOptions) {
  const { ctx } = options.board;

  if (ctx === null) {
    return;
  }

  drawText(
    options.board,
    `${plant.type} ${plant.health}`,
    plant.x,
    plant.y + plant.height / 2,
    "#000000",
    {
      fontSize: FontSize.Xs,
    }
  );
}

export function syncPlantHitbox(plant: BasePlant) {
  plant.hitbox.x = plant.x;
  plant.hitbox.y = plant.y;
}

export function drawPlant(plant: Plant, options: PlantDrawOptions) {
  switch (plant.type) {
    case PlantType.Sunflower:
      drawSunflower(plant, options);
      break;

    case PlantType.Peashooter:
      drawPeashooter(plant, options);
      break;

    case PlantType.Repeater:
      drawRepeater(plant, options);
      break;

    case PlantType.Threepeater:
      drawThreepeater(plant, options);
      break;

    case PlantType.Snowpea:
      drawSnowpea(plant, options);
      break;

    case PlantType.WallNut:
      drawWallNut(plant, options);
      break;

    case PlantType.Puffshroom:
      drawPuffshroom(plant, options);
      break;

    case PlantType.Sunshroom:
      drawSunshroom(plant, options);
      break;

    case PlantType.Torchwood:
      drawTorchwood(plant, options);
      break;

    case PlantType.Firepea:
      drawFirepea(plant, options);
      break;
  }
}

export function updatePlant(plant: Plant, options: PlantUpdateOptions) {
  switch (plant.type) {
    case PlantType.Sunflower:
      updateSunflower(plant, options);
      break;

    case PlantType.Peashooter:
      updatePeashooter(plant, options);
      break;

    case PlantType.Repeater:
      updateRepeater(plant, options);
      break;

    case PlantType.Threepeater:
      updateThreepeater(plant, options);
      break;

    case PlantType.Snowpea:
      updateSnowpea(plant, options);
      break;

    case PlantType.WallNut:
      updateWallNut(plant, options);
      break;

    case PlantType.Puffshroom:
      updatePuffshroom(plant, options);
      break;

    case PlantType.Sunshroom:
      updateSunshroom(plant, options);
      break;

    case PlantType.Torchwood:
      updateTorchwood(plant, options);
      break;

    case PlantType.Firepea:
      updateFirepea(plant, options);
      break;
  }
}

export function createPlant(
  type: PlantType,
  x: number,
  y: number,
  level: Level
): Plant | null {
  let plant: Plant | null = null;

  switch (type) {
    case PlantType.Peashooter:
      plant = createPeashooter({
        x,
        y,
      });
      break;

    case PlantType.Sunflower:
      plant = createSunflower({
        x,
        y,
        level,
      });
      break;

    case PlantType.Repeater:
      plant = createRepeater({
        x,
        y,
      });
      break;

    case PlantType.Threepeater:
      plant = createThreepeater({
        x,
        y,
      });
      break;

    case PlantType.Snowpea:
      plant = createSnowpea({
        x,
        y,
      });
      break;

    case PlantType.Firepea:
      plant = createFirepea({
        x,
        y,
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
      });
      break;

    case PlantType.Puffshroom:
      plant = createPuffshroom({
        x,
        y,
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

export function addPlant(plants: Plant[], plant: Plant): Plant[] {
  return [...plants, plant];
}

export function addPlants(plants: Plant[], ...toAdd: Plant[]): Plant[] {
  return [...plants, ...toAdd];
}

export function removePlantById(plants: Plant[], id: string): Plant[] {
  return plants.filter((plant) => plant.id !== id);
}

export function findPlantById(plants: Plant[], id: string): Plant | undefined {
  return plants.find((plant) => plant.id === id);
}

export function removeOutOfHealthPlants(plants: Plant[]): Plant[] {
  return plants.filter((plant) => plant.health > 0);
}
