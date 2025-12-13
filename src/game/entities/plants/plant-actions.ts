import {
  drawSunflower,
  sunflowerTakeDamage,
  updateSunflower,
} from "./sunflower";
import {
  drawPeashooter,
  drawRepeater,
  drawThreepeater,
  peashooterTakeDamage,
  repeaterTakeDamage,
  threepeaterTakeDamage,
  updatePeashooter,
  updateRepeater,
  updateThreepeater,
} from "./pea";

import { PlantType } from "./constants";

import type {
  Plant,
  PlantDrawOptions,
  PlantTakeDamageOptions,
  PlantUpdateOptions,
} from "./types";

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
