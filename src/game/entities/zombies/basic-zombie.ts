import {
  createZombieId,
  drawZombieRect,
  drawZombieType,
  handleZombieDefaultMovement,
  syncZombieHitbox,
} from "./zombie-service";
import { drawHitbox, isHitboxColliding } from "@/game/helpers/hitbox";
import { findPlantById } from "../plants";
import { entityTakeDamage } from "../entity-service";
import {
  ZOMBIE_HEIGHT,
  ZOMBIE_WIDTH,
  ZombieState,
  ZombieType,
} from "./constants";

import { type Vector2 } from "@/game/types/math";
import type {
  BaseZombie,
  ZombieDrawOptions,
  ZombieUpdateOptions,
} from "./types";

export type BasicZombie = {
  type: ZombieType.Basic;
} & BaseZombie;

type CreateBasicZombieOptions = Vector2;

const HEALTH = 190;
const DAMAGE = 25;
const SPEED = 15;
const DAMAGE_INTERVAL = 1000;

export function createBasicZombie(
  options: CreateBasicZombieOptions
): BasicZombie {
  const { x, y } = options;
  return {
    type: ZombieType.Basic,
    id: createZombieId(),
    state: ZombieState.Walking,
    x,
    y,
    width: ZOMBIE_WIDTH,
    height: ZOMBIE_HEIGHT,
    health: HEALTH,
    damage: DAMAGE,
    speed: SPEED,
    hitbox: {
      x,
      y,
      width: ZOMBIE_WIDTH,
      height: ZOMBIE_HEIGHT,
    },
    damageTimer: 0,
    freezeAmount: 0,
  };
}

export function drawBasicZombie(
  basicZombie: BasicZombie,
  options: ZombieDrawOptions
) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  drawZombieRect(basicZombie, options);
  drawZombieType(basicZombie, options);
  drawHitbox(basicZombie.hitbox, board);
}

export function updateBasicZombie(
  basicZombie: BasicZombie,
  options: ZombieUpdateOptions
) {
  const { level, deltaTime } = options;
  const { plants } = level;

  let eatPlantId: string | null = null;

  const collisionPlant = plants.find((plant) => {
    return isHitboxColliding(basicZombie.hitbox, plant.hitbox);
  });

  if (collisionPlant !== undefined) {
    eatPlantId = collisionPlant.id;
  }

  if (basicZombie.state === ZombieState.Walking) {
    handleZombieDefaultMovement(basicZombie, options);

    const isPlantCollision = plants.some((plant) => {
      return isHitboxColliding(basicZombie.hitbox, plant.hitbox);
    });

    if (isPlantCollision) {
      basicZombie.state = ZombieState.Eating;
    }
  }
  if (basicZombie.state === ZombieState.Eating) {
    if (eatPlantId === null) {
      basicZombie.state = ZombieState.Walking;
    }
    if (basicZombie.damageTimer >= DAMAGE_INTERVAL && eatPlantId !== null) {
      const plant = findPlantById(plants, eatPlantId);

      if (plant !== undefined) {
        entityTakeDamage(plant, basicZombie.damage);
      }

      basicZombie.damageTimer = 0;
    }

    basicZombie.damageTimer += deltaTime;
  }

  syncZombieHitbox(basicZombie);
}
