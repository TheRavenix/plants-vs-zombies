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

import { type Vector2 } from "@/game/types/vector";
import type {
  BaseZombie,
  ZombieDrawOptions,
  ZombieUpdateOptions,
} from "./types";

export type NormalZombie = {
  type: ZombieType.Normal;
} & BaseZombie;

type CreateNormalZombieOptions = Vector2;

const HEALTH = 190;
const DAMAGE = 25;
const SPEED = 15;
const DAMAGE_INTERVAL = 1000;

export function createNormalZombie(
  options: CreateNormalZombieOptions
): NormalZombie {
  const { x, y } = options;
  return {
    type: ZombieType.Normal,
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

export function drawNormalZombie(
  normalZombie: NormalZombie,
  options: ZombieDrawOptions
) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  drawZombieRect(normalZombie, options);
  drawZombieType(normalZombie, options);
  drawHitbox(normalZombie.hitbox, board);
}

export function updateNormalZombie(
  normalZombie: NormalZombie,
  options: ZombieUpdateOptions
) {
  const { game, deltaTime } = options;
  const { plants } = game;

  let eatPlantId: string | null = null;

  const collisionPlant = plants.find((plant) => {
    return isHitboxColliding(normalZombie.hitbox, plant.hitbox);
  });

  if (collisionPlant !== undefined) {
    eatPlantId = collisionPlant.id;
  }

  if (normalZombie.state === ZombieState.Walking) {
    handleZombieDefaultMovement(normalZombie, options);

    const isPlantCollision = plants.some((plant) => {
      return isHitboxColliding(normalZombie.hitbox, plant.hitbox);
    });

    if (isPlantCollision) {
      normalZombie.state = ZombieState.Eating;
    }
  }
  if (normalZombie.state === ZombieState.Eating) {
    if (eatPlantId === null) {
      normalZombie.state = ZombieState.Walking;
    }
    if (normalZombie.damageTimer >= DAMAGE_INTERVAL && eatPlantId !== null) {
      const plant = findPlantById(plants, eatPlantId);

      if (plant !== undefined) {
        entityTakeDamage(plant, normalZombie.damage);
      }

      normalZombie.damageTimer = 0;
    }

    normalZombie.damageTimer += deltaTime;
  }

  syncZombieHitbox(normalZombie);
}
