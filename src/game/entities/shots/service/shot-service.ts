import { drawText } from "@/game/helpers/canvas";
import { FontSize } from "@/game/constants/font";
import { ShotDirection, ShotType } from "../constants";

import type { Position } from "@/game/features/position";
import type { Size } from "@/game/features/size";
import type { Board } from "@/game/board";

export function createShotId(): string {
  return `SHOT-${crypto.randomUUID()}`;
}

export function drawShotRect(
  position: Position,
  size: Size,
  fillStyle: string,
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

export function drawShotType(
  type: ShotType,
  position: Position,
  size: Size,
  board: Board,
) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  drawText(board, type, position.x, position.y + size.height / 2, "#ffffff", {
    fontSize: FontSize.Xs,
  });
}

export function handleShotDirection(
  direction: ShotDirection,
  position: Position,
  speed: number,
  deltaTime: number,
) {
  const finalSpeed = speed * (deltaTime / 1000);

  switch (direction) {
    case ShotDirection.Right:
      position.setX(position.x + finalSpeed);
      break;

    case ShotDirection.UpRight:
      position.set(position.x + finalSpeed, position.y - finalSpeed);
      break;

    case ShotDirection.DownRight:
      position.set(position.x + finalSpeed, position.y + finalSpeed);
      break;

    default:
      position.setX(position.x + finalSpeed);
  }
}
