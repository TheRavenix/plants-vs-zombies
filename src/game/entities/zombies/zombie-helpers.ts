import type { Zombie, ZombieDrawOptions, ZombieUpdateOptions } from "./types";

function createZombieId(): string {
  return `ZOMBIE-${crypto.randomUUID()}`;
}

function drawZombieRect(zombie: Zombie, options: ZombieDrawOptions) {
  const { ctx } = options.board;

  if (ctx === null) {
    return;
  }

  ctx.fillStyle = "#708090";
  ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
  ctx.fill();
}

function drawZombieType(zombie: Zombie, options: ZombieDrawOptions) {
  const { ctx } = options.board;

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

function handleZombieDefaultMovement(
  zombie: Zombie,
  options: ZombieUpdateOptions
) {
  zombie.x -= zombie.speed * (options.deltaTime / 1000);
}

function syncZombieHitbox(zombie: Zombie) {
  zombie.hitbox.x = zombie.x;
  zombie.hitbox.y = zombie.y;
}

export const zombieHelpers = {
  createZombieId,
  drawZombieRect,
  drawZombieType,
  syncZombieHitbox,
  handleZombieDefaultMovement,
} as const;
