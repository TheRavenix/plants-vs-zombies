import { zombieHelpers } from "./zombie-helpers";

import {
  ZOMBIE_HEIGHT,
  ZOMBIE_WIDTH,
  ZombieState,
  ZombieType,
} from "./constants";
import { plantActions } from "../plants";

import { type Vector2 } from "@/game/types/vector";
import type {
  FlagZombie,
  ZombieDrawOptions,
  ZombieTakeDamageOptions,
  ZombieUpdateOptions,
} from "./types";
import { hitboxActions } from "@/game/helpers/hitbox";

type CreateFlagZombieOptions = Vector2;

const HEALTH = 190;
const DAMAGE = 25;
const SPEED = 25;
const DAMAGE_INTERVAL = 1000;

function createFlagZombie(options: CreateFlagZombieOptions): FlagZombie {
  const { x, y } = options;
  return {
    type: ZombieType.Flag,
    id: zombieHelpers.createZombieId(),
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
  };
}

function drawFlagZombie(flagZombie: FlagZombie, options: ZombieDrawOptions) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  zombieHelpers.drawZombieRect(flagZombie, options);
  zombieHelpers.drawZombieType(flagZombie, options);

  hitboxActions.draw(flagZombie.hitbox, board);
}

function updateFlagZombie(
  flagZombie: FlagZombie,
  options: ZombieUpdateOptions
) {
  const { game, deltaTime } = options;
  const { plants } = game;

  let eatPlantId: string | null = null;

  const collisionPlant = plants.find((plant) => {
    return hitboxActions.isColliding(flagZombie.hitbox, plant.hitbox);
  });

  if (collisionPlant !== undefined) {
    eatPlantId = collisionPlant.id;
  }

  if (flagZombie.state === ZombieState.Walking) {
    zombieHelpers.handleZombieDefaultMovement(flagZombie, options);

    const isPlantCollision = plants.some((plant) => {
      return hitboxActions.isColliding(flagZombie.hitbox, plant.hitbox);
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
      const plant = plantActions.findPlantById(plants, eatPlantId);

      if (plant !== undefined) {
        plantActions.plantTakeDamage(plant, {
          damage: flagZombie.damage,
        });
      }

      flagZombie.damageTimer = 0;
    }

    flagZombie.damageTimer += deltaTime;
  }

  zombieHelpers.syncZombieHitbox(flagZombie);
}

function flagZombieTakeDamage(
  flagZombie: FlagZombie,
  options: ZombieTakeDamageOptions
) {
  const { damage } = options;

  flagZombie.health -= damage;
}

export {
  createFlagZombie,
  drawFlagZombie,
  updateFlagZombie,
  flagZombieTakeDamage,
};
