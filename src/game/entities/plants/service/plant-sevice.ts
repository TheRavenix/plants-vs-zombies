import { drawText } from "@/game/helpers/canvas";
import { PlantType } from "../constants/plant-type";
import { FontSize } from "@/game/constants/font";

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
