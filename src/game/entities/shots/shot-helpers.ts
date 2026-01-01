import { canvasActions } from "@/game/helpers/canvas";
import { ShotDirection } from "./constants";
import { FontSize } from "@/game/constants/font";

import type { BaseShot, Shot, ShotDrawOptions } from "./types";

function createShotId(): string {
  return `SHOT-${crypto.randomUUID()}`;
}

function drawShotRect(shot: BaseShot, options: ShotDrawOptions) {
  const { ctx } = options.board;

  if (ctx === null) {
    return;
  }

  ctx.fillStyle = shot.fillStyle;
  ctx.fillRect(shot.x, shot.y, shot.width, shot.height);
  ctx.fill();
}

function drawShotType(shot: Shot, options: ShotDrawOptions) {
  const { ctx } = options.board;

  if (ctx === null) {
    return;
  }

  canvasActions.drawText(
    options.board,
    shot.type,
    shot.x,
    shot.y + shot.height / 2,
    "#ffffff",
    {
      fontSize: FontSize.Xs,
    }
  );
}

function syncShotHitbox(shot: BaseShot) {
  shot.hitbox.x = shot.x;
  shot.hitbox.y = shot.y;
}

function handleShotDirection(shot: BaseShot, speed: number) {
  switch (shot.direction) {
    case ShotDirection.Right:
      shot.x += speed;
      break;

    case ShotDirection.UpRight:
      shot.x += speed;
      shot.y -= speed;
      break;

    case ShotDirection.DownRight:
      shot.x += speed;
      shot.y += speed;
      break;

    default:
      shot.x += speed;
  }
}

export const shotHelpers = {
  createShotId,
  drawShotRect,
  drawShotType,
  syncShotHitbox,
  handleShotDirection,
} as const;
