import type { Shot, ShotDrawOptions } from "./types";

function createShotId(): string {
  return `SHOT-${crypto.randomUUID()}`;
}

function drawShotRect(shot: Shot, options: ShotDrawOptions) {
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

  ctx.fillStyle = "#ffffff";
  ctx.fillText(shot.type, shot.x, shot.y + shot.height / 2);
}

function syncShotHitbox(shot: Shot) {
  shot.hitbox.x = shot.x;
  shot.hitbox.y = shot.y;
}

export const shotHelpers = {
  createShotId,
  drawShotRect,
  drawShotType,
  syncShotHitbox,
} as const;
