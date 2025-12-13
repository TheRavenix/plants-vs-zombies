import type { PlantDrawOptions, PlantUpdateOptions } from "./types";

const plantHelpers = {
  createPlantId,
  drawPlantRect,
  drawPlantType,
  syncPlantHitbox,
} as const;

function createPlantId(): string {
  return `PLANT-${crypto.randomUUID()}`;
}

function drawPlantRect({ board, plant }: PlantDrawOptions) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.fillStyle = "#A0B09A";
  ctx.fillRect(plant.x, plant.y, plant.width, plant.height);
  ctx.fill();
}

function drawPlantType({ board, plant }: PlantDrawOptions) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.fillStyle = "#000000";
  ctx.fillText(
    `${plant.type} ${plant.toughness}`,
    plant.x,
    plant.y + plant.height / 2
  );
}

function syncPlantHitbox({ plant }: PlantUpdateOptions) {
  plant.hitbox.x = plant.x;
  plant.hitbox.y = plant.y;
}

export { plantHelpers };
