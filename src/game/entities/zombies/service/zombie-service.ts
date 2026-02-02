import { TILE_HEIGHT, TILE_WIDTH, type Board } from "@/game/board";
import { drawText } from "@/game/helpers/canvas";
import { FontSize } from "@/game/constants/font";
import { ZombieState, type ZombieType } from "../constants";
import { findFirstCollision } from "../../helpers/collision";

import type { Position } from "@/game/features/position";
import type { Size } from "@/game/features/size";
import type { Health } from "@/game/entities/features/health";
import type { Zombie } from "../types/zombie";
import type { Plant } from "../../plants/types/plant";
import type { Hitbox } from "../../features/hitbox";

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

export function handleZombieBehaviour(
  hitbox: Hitbox,
  position: Position,
  freezeAmount: number,
  speed: number,
  state: ZombieState,
  damageTimer: number,
  damageInterval: number,
  deltaTime: number,
  getPlants: () => Plant[],
  onEatPlant: (plant: Plant) => void,
  setState: (state: ZombieState) => void,
  setDamageTimer: (timer: number) => void,
) {
  setDamageTimer(damageTimer + deltaTime);

  const collisionPlant = findFirstCollision<Plant>(
    hitbox,
    getPlants(),
    (plant) => plant.hitbox,
  );

  if (state === ZombieState.Walking) {
    handleZombieDefaultMovement(position, freezeAmount, speed, deltaTime);

    if (collisionPlant !== undefined) {
      setState(ZombieState.Eating);
    }
  }
  if (state === ZombieState.Eating) {
    if (collisionPlant === undefined) {
      setState(ZombieState.Walking);
    }
    if (damageTimer >= damageInterval && collisionPlant !== undefined) {
      onEatPlant(collisionPlant);
      setDamageTimer(0);
    }
  }
}

export function findZombiesWithinArea(
  x: number,
  y: number,
  getZombies: () => Zombie[],
  tileRange?: number,
): Zombie[] {
  const tileRangeX =
    tileRange !== undefined ? TILE_WIDTH * tileRange : TILE_WIDTH;
  const tileRangeY =
    tileRange !== undefined ? TILE_HEIGHT * tileRange : TILE_HEIGHT;

  return getZombies().filter((zombie) => {
    return (
      zombie.position.x >= x - tileRangeX &&
      zombie.position.x <= x + tileRangeX &&
      zombie.position.y >= y - tileRangeY &&
      zombie.position.y <= y + tileRangeY
    );
  });
}
