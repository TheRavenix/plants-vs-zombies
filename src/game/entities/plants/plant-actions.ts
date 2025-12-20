import {
  drawSunflower,
  sunflowerTakeDamage,
  updateSunflower,
} from "./sunflower";
import {
  drawPeashooter,
  drawRepeater,
  drawSnowpea,
  drawThreepeater,
  peashooterTakeDamage,
  repeaterTakeDamage,
  snowpeaTakeDamage,
  threepeaterTakeDamage,
  updatePeashooter,
  updateRepeater,
  updateSnowpea,
  updateThreepeater,
} from "./pea";
import { drawWallNut, updateWallNut, wallNutTakeDamage } from "./wall-nut";

import { PlantType } from "./constants";

import type {
  Plant,
  PlantDrawOptions,
  PlantTakeDamageOptions,
  PlantUpdateOptions,
} from "./types";
import {
  drawPuffshroom,
  puffshroomTakeDamage,
  updatePuffshroom,
} from "./shroom";

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
  }
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
  addPlant,
  addPlants,
  removePlantById,
  findPlantById,
  removeOutOfToughnessPlants,
} as const;
