import { TILE_HEIGHT, TILE_WIDTH } from "@/game/board";
import { drawNormalZombie, updateNormalZombie } from "./normal-zombie";
import { drawFlagZombie, updateFlagZombie } from "./flag-zombie";
import { drawText } from "@/game/helpers/canvas";
import { FontSize } from "@/game/constants/font";
import { ZombieType } from "./constants";

import type {
  BaseZombie,
  Zombie,
  ZombieDrawOptions,
  ZombieUpdateOptions,
} from "./types";

export function createZombieId(): string {
  return `ZOMBIE-${crypto.randomUUID()}`;
}

export function drawZombieRect(zombie: BaseZombie, options: ZombieDrawOptions) {
  const { ctx } = options.board;

  if (ctx === null) {
    return;
  }

  ctx.fillStyle = "#708090";
  ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
  ctx.fill();
}

export function drawZombieType(zombie: Zombie, options: ZombieDrawOptions) {
  const { ctx } = options.board;

  if (ctx === null) {
    return;
  }

  drawText(
    options.board,
    `${zombie.type} ${zombie.health}`,
    zombie.x,
    zombie.y + zombie.height / 2,
    "#000000",
    {
      fontSize: FontSize.Xs,
    }
  );
}

export function handleZombieDefaultMovement(
  zombie: BaseZombie,
  options: ZombieUpdateOptions
) {
  const { speed, freezeAmount } = zombie;
  const freezedSpeed = (speed * freezeAmount) / 100;
  zombie.x -= (speed - freezedSpeed) * (options.deltaTime / 1000);
}

export function syncZombieHitbox(zombie: BaseZombie) {
  zombie.hitbox.x = zombie.x;
  zombie.hitbox.y = zombie.y;
}

export function drawZombie(zombie: Zombie, options: ZombieDrawOptions) {
  switch (zombie.type) {
    case ZombieType.Normal:
      drawNormalZombie(zombie, options);
      break;

    case ZombieType.Flag:
      drawFlagZombie(zombie, options);
      break;
  }
}

export function updateZombie(zombie: Zombie, options: ZombieUpdateOptions) {
  switch (zombie.type) {
    case ZombieType.Normal:
      updateNormalZombie(zombie, options);
      break;

    case ZombieType.Flag:
      updateFlagZombie(zombie, options);
      break;
  }
}

export function addZombie(zombies: Zombie[], zombie: Zombie): Zombie[] {
  return [...zombies, zombie];
}

export function addZombies(zombies: Zombie[], ...toAdd: Zombie[]): Zombie[] {
  return [...zombies, ...toAdd];
}

export function removeZombieById(zombies: Zombie[], id: string): Zombie[] {
  return zombies.filter((zombie) => zombie.id !== id);
}

export function findZombieById(
  zombies: Zombie[],
  id: string
): Zombie | undefined {
  return zombies.find((zombie) => zombie.id === id);
}

export function removeOutOfHealthZombies(zombies: Zombie[]): Zombie[] {
  return zombies.filter((zombie) => zombie.health > 0);
}

export function findZombiesWithinArea(
  zombies: Zombie[],
  x: number,
  y: number,
  tileRange?: number
): Zombie[] {
  const tileRangeX =
    tileRange !== undefined ? TILE_WIDTH * tileRange : TILE_WIDTH;
  const tileRangeY =
    tileRange !== undefined ? TILE_HEIGHT * tileRange : TILE_HEIGHT;

  return zombies.filter((zombie) => {
    return (
      zombie.x >= x - tileRangeX &&
      zombie.x <= x + tileRangeX &&
      zombie.y >= y - tileRangeY &&
      zombie.y <= y + tileRangeY
    );
  });
}
