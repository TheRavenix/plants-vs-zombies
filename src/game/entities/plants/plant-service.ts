import { createSunflower } from "./sunflower";
import {
  createFirepea,
  createPeashooter,
  createRepeater,
  createSnowpea,
  createThreepeater,
} from "./pea";
import { createWallNut } from "./wall-nut";
import { createPuffshroom, createSunshroom } from "./shroom";
import { createTorchwood } from "./torchwood";
import { drawText } from "@/game/helpers/canvas";
import { PlantType } from "./constants/plant-type";
import { FontSize } from "@/game/constants/font";

import type { Plant } from "./types/plant";
import type { LevelContext } from "@/game/level";
import type { Board } from "@/game/board";
import type { Position } from "@/game/features/position";
import type { Health } from "@/game/features/health";
import type { Size } from "@/game/features/size";

export function createPlantId(): string {
  return `PLANT-${crypto.randomUUID()}`;
}

export function drawPlantRect(
  position: Position,
  size: Size,
  fillStyle = "#A0B09A",
  board: Board,
) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.fillStyle = fillStyle;
  ctx.fillRect(position.x, position.y, size.width, size.height);
  ctx.fill();
}

export function drawPlantType(
  type: PlantType,
  position: Position,
  size: Size,
  health: Health,
  board: Board,
) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  drawText(
    board,
    `${type} ${health.hp}`,
    position.x,
    position.y + size.height / 2,
    "#000000",
    {
      fontSize: FontSize.Xs,
    },
  );
}

export function createPlant(
  type: PlantType,
  x: number,
  y: number,
  ctx: LevelContext,
): Plant | null {
  let plant: Plant | null = null;

  switch (type) {
    case PlantType.Peashooter:
      plant = createPeashooter({
        x,
        y,
        ctx,
      });
      break;

    case PlantType.Sunflower:
      plant = createSunflower({
        x,
        y,
        ctx,
      });
      break;

    case PlantType.Repeater:
      plant = createRepeater({
        x,
        y,
        ctx,
      });
      break;

    case PlantType.Threepeater:
      plant = createThreepeater({
        x,
        y,
        ctx,
      });
      break;

    case PlantType.Snowpea:
      plant = createSnowpea({
        x,
        y,
        ctx,
      });
      break;

    case PlantType.Firepea:
      plant = createFirepea({
        x,
        y,
        ctx,
      });
      break;

    case PlantType.WallNut:
      plant = createWallNut({
        x,
        y,
        ctx,
      });
      break;

    case PlantType.Torchwood:
      plant = createTorchwood({
        x,
        y,
        ctx,
      });
      break;

    case PlantType.Puffshroom:
      plant = createPuffshroom({
        x,
        y,
        ctx,
      });
      break;

    case PlantType.Sunshroom:
      plant = createSunshroom({
        x,
        y,
        ctx,
      });
      break;
  }

  return plant;
}
