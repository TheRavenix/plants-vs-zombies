import type { ZombieDrawOptions, ZombieUpdateOptions } from "./types";

const zombieHelpers = {
  createZombieId,
  drawZombieRect,
  drawZombieType,
  syncZombieHitbox,
  handleZombieDefaultMovement,
} as const;

function createZombieId(): string {
  return `ZOMBIE-${crypto.randomUUID()}`;
}

function drawZombieRect({ board, zombie }: ZombieDrawOptions) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.fillStyle = "#708090";
  ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
  ctx.fill();
}

function drawZombieType({ board, zombie }: ZombieDrawOptions) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.fillStyle = "#000000";
  ctx.fillText(
    `${zombie.type} ${zombie.health}`,
    zombie.x,
    zombie.y + zombie.height / 2
  );
}

function handleZombieDefaultMovement({
  deltaTime,
  zombie,
}: ZombieUpdateOptions) {
  zombie.x -= zombie.speed * (deltaTime / 1000);
}

function syncZombieHitbox({ zombie }: ZombieUpdateOptions) {
  zombie.hitbox.x = zombie.x;
  zombie.hitbox.y = zombie.y;
}

export { zombieHelpers };
