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

export type FlagZombie = {
  type: ZombieType.Flag;
} & BaseZombie;

type CreateFlagZombieOptions = Vector2;

const HEALTH = 190;
const DAMAGE = 25;
const SPEED = 25;
const DAMAGE_INTERVAL = 1000;

export function createFlagZombie(options: CreateFlagZombieOptions): FlagZombie {
  const { x, y } = options;
  return {
    type: ZombieType.Flag,
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

export function drawFlagZombie(
  flagZombie: FlagZombie,
  options: ZombieDrawOptions
) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  drawZombieRect(flagZombie, options);
  drawZombieType(flagZombie, options);
  drawHitbox(flagZombie.hitbox, board);
}

export function updateFlagZombie(
  flagZombie: FlagZombie,
  options: ZombieUpdateOptions
) {
  const { level, deltaTime } = options;
  const { plants } = level;

  let eatPlantId: string | null = null;

  const collisionPlant = plants.find((plant) => {
    return isHitboxColliding(flagZombie.hitbox, plant.hitbox);
  });

  if (collisionPlant !== undefined) {
    eatPlantId = collisionPlant.id;
  }

  if (flagZombie.state === ZombieState.Walking) {
    handleZombieDefaultMovement(flagZombie, options);

    const isPlantCollision = plants.some((plant) => {
      return isHitboxColliding(flagZombie.hitbox, plant.hitbox);
    });

    if (isPlantCollision) {
      flagZombie.state = ZombieState.Eating;
    }
  }
  if (flagZombie.state === ZombieState.Eating) {
    if (eatPlantId === null) {
      flagZombie.state = ZombieState.Walking;
    }
    if (flagZombie.damageTimer >= DAMAGE_INTERVAL && eatPlantId !== null) {
      const plant = findPlantById(plants, eatPlantId);

      if (plant !== undefined) {
        entityTakeDamage(plant, flagZombie.damage);
      }

      flagZombie.damageTimer = 0;
    }

    flagZombie.damageTimer += deltaTime;
  }

  syncZombieHitbox(flagZombie);
}
