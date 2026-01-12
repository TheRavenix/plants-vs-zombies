import { drawHitbox, isHitboxColliding } from "@/game/helpers/hitbox";
import {
  createShotId,
  drawShotRect,
  handleShotDirection,
  syncShotHitbox,
} from "./shot-service";
import { findZombieById } from "../zombies";
import { entityTakeDamage } from "../entity-service";
import { SHOT_HEIGHT, SHOT_WIDTH, ShotDirection, ShotType } from "./constants";

import type { BaseShot, ShotDrawOptions, ShotUpdateOptions } from "./types";
import type { Vector2 } from "@/game/types/math";

export type Shroomshot = {
  type: ShotType.Shroomshot;
} & BaseShot;

type CreateShroomshotOptions = {
  direction?: ShotDirection;
} & Vector2;

const DAMAGE = 20;
const SPEED = 150;

export function createShroomshot(options: CreateShroomshotOptions): Shroomshot {
  const { x, y, direction = ShotDirection.Right } = options;
  return {
    type: ShotType.Shroomshot,
    id: createShotId(),
    x,
    y,
    width: SHOT_WIDTH,
    height: SHOT_HEIGHT,
    damage: DAMAGE,
    speed: SPEED,
    fillStyle: "#E6E6FA",
    hitbox: {
      x,
      y,
      width: SHOT_WIDTH,
      height: SHOT_HEIGHT,
    },
    direction,
    active: true,
  };
}

export function drawShroomshot(
  shroomshot: Shroomshot,
  options: ShotDrawOptions
) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  drawShotRect(shroomshot, options);
  drawHitbox(shroomshot.hitbox, board);
}

export function updateShroomshot(
  shroomshot: Shroomshot,
  options: ShotUpdateOptions
) {
  const { deltaTime, level } = options;
  const { zombies } = level;
  const speed = shroomshot.speed * (deltaTime / 1000);

  handleShotDirection(shroomshot, speed);

  let deleteZombieId: string | null = null;

  const collisionZombie = zombies.find((zombie) => {
    return isHitboxColliding(shroomshot.hitbox, zombie.hitbox);
  });

  if (collisionZombie !== undefined) {
    deleteZombieId = collisionZombie.id;
  }
  if (deleteZombieId !== null) {
    const zombie = findZombieById(zombies, deleteZombieId);

    if (zombie !== undefined) {
      entityTakeDamage(zombie, shroomshot.damage);

      shroomshot.active = false;
      deleteZombieId = null;
    }
  }

  syncShotHitbox(shroomshot);
}
