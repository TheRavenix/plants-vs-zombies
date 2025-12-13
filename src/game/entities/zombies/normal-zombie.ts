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
  NormalZombie,
  ZombieDrawOptions,
  ZombieTakeDamageOptions,
  ZombieUpdateOptions,
} from "./types";
import { hitboxActions } from "@/game/helpers/hitbox";

type CreateNormalZombieOptions = Vector2;

const HEALTH = 190;
const DAMAGE = 25;
const SPEED = 15;
const DAMAGE_INTERVAL = 1000;

function createNormalZombie(options: CreateNormalZombieOptions): NormalZombie {
  const { x, y } = options;
  return {
    type: ZombieType.Normal,
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

function drawNormalZombie(
  normalZombie: NormalZombie,
  options: ZombieDrawOptions
) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  zombieHelpers.drawZombieRect(normalZombie, options);
  zombieHelpers.drawZombieType(normalZombie, options);

  hitboxActions.draw(normalZombie.hitbox, board);
}

function updateNormalZombie(
  normalZombie: NormalZombie,
  options: ZombieUpdateOptions
) {
  const { game, deltaTime } = options;
  const { plants } = game;

  let eatPlantId: string | null = null;

  const collisionPlant = plants.find((plant) => {
    return hitboxActions.isColliding(normalZombie.hitbox, plant.hitbox);
  });

  if (collisionPlant !== undefined) {
    eatPlantId = collisionPlant.id;
  }

  if (normalZombie.state === ZombieState.Walking) {
    zombieHelpers.handleZombieDefaultMovement(normalZombie, options);

    const isPlantCollision = plants.some((plant) => {
      return hitboxActions.isColliding(normalZombie.hitbox, plant.hitbox);
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
      const plant = plantActions.findPlantById(plants, eatPlantId);

      if (plant !== undefined) {
        plantActions.plantTakeDamage(plant, {
          damage: normalZombie.damage,
        });
      }

      normalZombie.damageTimer = 0;
    }

    normalZombie.damageTimer += deltaTime;
  }

  zombieHelpers.syncZombieHitbox(normalZombie);
}

function normalZombieTakeDamage(
  normalZombie: NormalZombie,
  options: ZombieTakeDamageOptions
) {
  const { damage } = options;

  normalZombie.health -= damage;
}

export {
  createNormalZombie,
  drawNormalZombie,
  updateNormalZombie,
  normalZombieTakeDamage,
};
