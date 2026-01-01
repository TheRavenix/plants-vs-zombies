import {
  createSunflower,
  drawSunflower,
  sunflowerTakeDamage,
  updateSunflower,
} from "./sunflower";
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
  firepeaTakeDamage,
  peashooterTakeDamage,
  repeaterTakeDamage,
  snowpeaTakeDamage,
  threepeaterTakeDamage,
  updateFirepea,
  updatePeashooter,
  updateRepeater,
  updateSnowpea,
  updateThreepeater,
} from "./pea";
import {
  createWallNut,
  drawWallNut,
  updateWallNut,
  wallNutTakeDamage,
} from "./wall-nut";
import {
  createPuffshroom,
  createSunshroom,
  drawPuffshroom,
  drawSunshroom,
  puffshroomTakeDamage,
  sunshroomTakeDamage,
  updatePuffshroom,
  updateSunshroom,
} from "./shroom";
import {
  createTorchwood,
  drawTorchwood,
  torchwoodTakeDamage,
  updateTorchwood,
} from "./torchwood";

import { PlantType } from "./constants";

import type {
  Plant,
  PlantDrawOptions,
  PlantTakeDamageOptions,
  PlantUpdateOptions,
} from "./types";
import type { Game } from "@/game/game";

function drawPlant(plant: Plant, options: PlantDrawOptions) {
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

function updatePlant(plant: Plant, options: PlantUpdateOptions) {
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

function plantTakeDamage(plant: Plant, options: PlantTakeDamageOptions) {
  switch (plant.type) {
    case PlantType.Sunflower:
      sunflowerTakeDamage(plant, options);
      break;

    case PlantType.Peashooter:
      peashooterTakeDamage(plant, options);
      break;

    case PlantType.Repeater:
      repeaterTakeDamage(plant, options);
      break;

    case PlantType.Threepeater:
      threepeaterTakeDamage(plant, options);
      break;

    case PlantType.Snowpea:
      snowpeaTakeDamage(plant, options);
      break;

    case PlantType.WallNut:
      wallNutTakeDamage(plant, options);
      break;

    case PlantType.Puffshroom:
      puffshroomTakeDamage(plant, options);
      break;

    case PlantType.Sunshroom:
      sunshroomTakeDamage(plant, options);
      break;

    case PlantType.Torchwood:
      torchwoodTakeDamage(plant, options);
      break;

    case PlantType.Firepea:
      firepeaTakeDamage(plant, options);
      break;
  }
}

function createPlant(
  type: PlantType,
  x: number,
  y: number,
  game: Game
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
        game,
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

function addPlant(plants: Plant[], plant: Plant): Plant[] {
  return [...plants, plant];
}

function addPlants(plants: Plant[], ...toAdd: Plant[]): Plant[] {
  return [...plants, ...toAdd];
}

function removePlantById(plants: Plant[], id: string): Plant[] {
  return plants.filter((plant) => plant.id !== id);
}

function findPlantById(plants: Plant[], id: string): Plant | undefined {
  return plants.find((plant) => plant.id === id);
}

function removeOutOfToughnessPlants(plants: Plant[]): Plant[] {
  return plants.filter((plant) => plant.toughness > 0);
}

export const plantActions = {
  drawPlant,
  updatePlant,
  plantTakeDamage,
  createPlant,
  addPlant,
  addPlants,
  removePlantById,
  findPlantById,
  removeOutOfToughnessPlants,
} as const;
