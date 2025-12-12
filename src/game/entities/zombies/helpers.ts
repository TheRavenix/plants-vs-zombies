import type { ZombieDrawOptions, ZombieUpdateOptions } from "./types";

export function createZombieId(): string {
  return `ZOMBIE-${crypto.randomUUID()}`;
}

export function drawZombieRect({ board, state }: ZombieDrawOptions) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.fillStyle = "#708090";
  ctx.fillRect(state.x, state.y, state.width, state.height);
  ctx.fill();
}

export function drawZombieName({ board, state }: ZombieDrawOptions) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.fillStyle = "#000000";
  ctx.fillText(
    `${state.name} ${state.health}`,
    state.x,
    state.y + state.height / 2
  );
}

export function handleZombieDefaultMovement({
  deltaTime,
  state,
}: ZombieUpdateOptions) {
  state.x -= state.speed * (deltaTime / 1000);
}

export function syncZombieHitbox({ state }: ZombieUpdateOptions) {
  state.hitbox.x = state.x;
  state.hitbox.y = state.y;
}
