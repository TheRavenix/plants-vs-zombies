import type { ShotDrawOptions, ShotUpdateOptions } from "./types";

export function createShotId(): string {
  return `SHOT-${crypto.randomUUID()}`;
}

export function drawShotRect({ board, state }: ShotDrawOptions) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.fillStyle = state.fillStyle;
  ctx.fillRect(state.x, state.y, state.width, state.height);
  ctx.fill();
}

export function drawShotName({ board, state }: ShotDrawOptions) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillText(state.name, state.x, state.y + state.height / 2);
}

export function syncShotHitbox({ state }: ShotUpdateOptions) {
  state.hitbox.x = state.x;
  state.hitbox.y = state.y;
}
