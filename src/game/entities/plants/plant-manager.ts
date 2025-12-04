import type { Plant } from "./types";

type PlantManager = {
  get plants(): Plant[];
  addPlant(plant: Plant): void;
  addPlants(...plants: Plant[]): void;
};

function createPlantManager(): PlantManager {
  const plants: Plant[] = [];

  return {
    get plants() {
      return plants;
    },
    addPlant: (plant) => addPlant(plants, plant),
    addPlants: (...pList) => {
      for (const plant of pList) {
        addPlant(plants, plant);
      }
    },
  };
}

function addPlant(plants: Plant[], plant: Plant) {
  plants.push(plant);
}

export { createPlantManager };
export type { PlantManager };
