import {
  drawSunflower,
  sunflowerTakeDamage,
  updateSunflower,
  type Sunflower,
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
  type Peashooter,
  type Repeater,
  type Threepeater,
} from "./pea";

import { PlantType } from "./constants";

import type {
  Plant,
  PlantDrawOptions,
  PlantTakeDamageOptions,
  PlantUpdateOptions,
} from "./types";

const plantActions = {
  drawPlant,
  updatePlant,
  plantTakeDamage,
  addPlant,
  addPlants,
  removePlantById,
  findPlantById,
  removeOutOfToughnessPlants,
} as const;

function drawPlant(options: PlantDrawOptions) {
  const { plant } = options;

  switch (plant.type) {
    case PlantType.Sunflower:
      drawSunflower(options as PlantDrawOptions<Sunflower>);
      break;

    case PlantType.Peashooter:
      drawPeashooter(options as PlantDrawOptions<Peashooter>);
      break;

    case PlantType.Repeater:
      drawRepeater(options as PlantDrawOptions<Repeater>);
      break;

    case PlantType.Threepeater:
      drawThreepeater(options as PlantDrawOptions<Threepeater>);
      break;
  }
}

function updatePlant(options: PlantUpdateOptions) {
  const { plant } = options;

  switch (plant.type) {
    case PlantType.Sunflower:
      updateSunflower(options as PlantUpdateOptions<Sunflower>);
      break;

    case PlantType.Peashooter:
      updatePeashooter(options as PlantUpdateOptions<Peashooter>);
      break;

    case PlantType.Repeater:
      updateRepeater(options as PlantUpdateOptions<Repeater>);
      break;

    case PlantType.Threepeater:
      updateThreepeater(options as PlantUpdateOptions<Threepeater>);
      break;
  }
}

function plantTakeDamage(options: PlantTakeDamageOptions) {
  const { plant } = options;

  switch (plant.type) {
    case PlantType.Sunflower:
      sunflowerTakeDamage(options as PlantTakeDamageOptions<Sunflower>);
      break;

    case PlantType.Peashooter:
      peashooterTakeDamage(options as PlantTakeDamageOptions<Peashooter>);
      break;

    case PlantType.Repeater:
      repeaterTakeDamage(options as PlantTakeDamageOptions<Repeater>);
      break;

    case PlantType.Threepeater:
      threepeaterTakeDamage(options as PlantTakeDamageOptions<Threepeater>);
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

export { plantActions };
