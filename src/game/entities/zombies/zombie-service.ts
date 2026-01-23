import { TILE_HEIGHT, TILE_WIDTH, type Board } from "@/game/board";
import { createBasicZombie } from "./basic-zombie";
import { createFlagZombie } from "./flag-zombie";
import { drawText } from "@/game/helpers/canvas";
import { FontSize } from "@/game/constants/font";
import { ZombieType } from "./constants";

import type { Zombie } from "./types/zombie";
import type { Position } from "@/game/features/position";
import type { Size } from "@/game/features/size";
import type { Health } from "@/game/features/health";
import type { LevelContext } from "@/game/level";

export function createZombieId(): string {
  return `ZOMBIE-${crypto.randomUUID()}`;
}

export function drawZombieRect(position: Position, size: Size, board: Board) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.fillStyle = "#708090";
  ctx.fillRect(position.x, position.y, size.width, size.height);
  ctx.fill();
}

export function drawZombieType(
  type: ZombieType,
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

export function handleZombieDefaultMovement(
  position: Position,
  freezeAmount: number,
  speed: number,
  deltaTime: number,
) {
  const freezedSpeed = (speed * freezeAmount) / 100;

  position.setX(position.x - (speed - freezedSpeed) * (deltaTime / 1000));
}

export function createZombie(
  type: ZombieType,
  x: number,
  y: number,
  ctx: LevelContext,
): Zombie | null {
  let zombie: Zombie | null = null;

  switch (type) {
    case ZombieType.Basic:
      zombie = createBasicZombie({
        x,
        y,
        ctx,
      });
      break;

    case ZombieType.Flag:
      zombie = createFlagZombie({
        x,
        y,
        ctx,
      });
      break;
  }

  return zombie;
}

export function findZombiesWithinArea(
  zombies: Zombie[],
  x: number,
  y: number,
  tileRange?: number,
): Zombie[] {
  const tileRangeX =
    tileRange !== undefined ? TILE_WIDTH * tileRange : TILE_WIDTH;
  const tileRangeY =
    tileRange !== undefined ? TILE_HEIGHT * tileRange : TILE_HEIGHT;

  return zombies.filter((zombie) => {
    return (
      zombie.position.x >= x - tileRangeX &&
      zombie.position.x <= x + tileRangeX &&
      zombie.position.y >= y - tileRangeY &&
      zombie.position.y <= y + tileRangeY
    );
  });
}
