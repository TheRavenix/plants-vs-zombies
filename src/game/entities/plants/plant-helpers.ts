import type { Plant, PlantDrawOptions } from "./types";

function createPlantId(): string {
  return `PLANT-${crypto.randomUUID()}`;
}

function drawPlantRect(plant: Plant, options: PlantDrawOptions) {
  const { ctx } = options.board;

  if (ctx === null) {
    return;
  }

  ctx.fillStyle = "#A0B09A";
  ctx.fillRect(plant.x, plant.y, plant.width, plant.height);
  ctx.fill();
}

function drawPlantType(plant: Plant, options: PlantDrawOptions) {
  const { ctx } = options.board;

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

function syncPlantHitbox(plant: Plant) {
  plant.hitbox.x = plant.x;
  plant.hitbox.y = plant.y;
}

export const plantHelpers = {
  createPlantId,
  drawPlantRect,
  drawPlantType,
  syncPlantHitbox,
} as const;
