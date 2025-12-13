import type { ShotDrawOptions, ShotUpdateOptions } from "./types";

const shotHelpers = {
  createShotId,
  drawShotRect,
  drawShotType,
  syncShotHitbox,
} as const;

function createShotId(): string {
  return `SHOT-${crypto.randomUUID()}`;
}

function drawShotRect({ board, shot }: ShotDrawOptions) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.fillStyle = shot.fillStyle;
  ctx.fillRect(shot.x, shot.y, shot.width, shot.height);
  ctx.fill();
}

function drawShotType({ board, shot }: ShotDrawOptions) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillText(shot.type, shot.x, shot.y + shot.height / 2);
}

function syncShotHitbox({ shot }: ShotUpdateOptions) {
  shot.hitbox.x = shot.x;
  shot.hitbox.y = shot.y;
}

export { shotHelpers };
