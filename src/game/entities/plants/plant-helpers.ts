import { canvasActions } from "@/game/helpers/canvas";
import { FontSize } from "@/game/constants/font";

import type { BasePlant, Plant, PlantDrawOptions } from "./types";

function createPlantId(): string {
  return `PLANT-${crypto.randomUUID()}`;
}

type DrawPlantRectOptions = {
  fillStyle?: string;
} & PlantDrawOptions;

function drawPlantRect(plant: BasePlant, options: DrawPlantRectOptions) {
  const { ctx } = options.board;

  if (ctx === null) {
    return;
  }

  const fillStyle = options?.fillStyle ?? "#A0B09A";

  ctx.fillStyle = fillStyle;
  ctx.fillRect(plant.x, plant.y, plant.width, plant.height);
  ctx.fill();
}

function drawPlantType(plant: Plant, options: PlantDrawOptions) {
  const { ctx } = options.board;

  if (ctx === null) {
    return;
  }

  canvasActions.drawText(
    options.board,
    `${plant.type} ${plant.toughness}`,
    plant.x,
    plant.y + plant.height / 2,
    "#000000",
    {
      fontSize: FontSize.Xs,
    }
  );
}

function syncPlantHitbox(plant: BasePlant) {
  plant.hitbox.x = plant.x;
  plant.hitbox.y = plant.y;
}

export const plantHelpers = {
  createPlantId,
  drawPlantRect,
  drawPlantType,
  syncPlantHitbox,
} as const;
