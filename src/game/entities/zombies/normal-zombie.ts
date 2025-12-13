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
  Zombie,
  ZombieDrawOptions,
  ZombieTakeDamageOptions,
  ZombieUpdateOptions,
} from "./types";
import { hitboxActions } from "@/game/helpers/hitbox";

type NormalZombie = Zombie;

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

function drawNormalZombie(options: ZombieDrawOptions<NormalZombie>) {
  const { zombie, board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  zombieHelpers.drawZombieRect(options);
  zombieHelpers.drawZombieType(options);

  hitboxActions.draw(zombie.hitbox, board);
}

function updateNormalZombie(options: ZombieUpdateOptions<NormalZombie>) {
  const { zombie, game, deltaTime } = options;
  const { plants } = game;

  let eatPlantId: string | null = null;

  const collisionPlant = plants.find((plant) => {
    return hitboxActions.isColliding(zombie.hitbox, plant.hitbox);
  });

  if (collisionPlant !== undefined) {
    eatPlantId = collisionPlant.id;
  }

  if (zombie.state === ZombieState.Walking) {
    zombieHelpers.handleZombieDefaultMovement(options);

    const isPlantCollision = plants.some((plant) => {
      return hitboxActions.isColliding(zombie.hitbox, plant.hitbox);
    });

    if (isPlantCollision) {
      zombie.state = ZombieState.Eating;
    }
  }
  if (zombie.state === ZombieState.Eating) {
    if (eatPlantId === null) {
      zombie.state = ZombieState.Walking;
    }
    if (zombie.damageTimer >= DAMAGE_INTERVAL && eatPlantId !== null) {
      const plant = plantActions.findPlantById(plants, eatPlantId);

      if (plant !== undefined) {
        plantActions.plantTakeDamage({
          damage: zombie.damage,
          plant,
        });
      }

      zombie.damageTimer = 0;
    }

    zombie.damageTimer += deltaTime;
  }

  zombieHelpers.syncZombieHitbox(options);
}

function normalZombieTakeDamage(
  options: ZombieTakeDamageOptions<NormalZombie>
) {
  const { zombie, damage } = options;

  zombie.health -= damage;
}

export {
  createNormalZombie,
  drawNormalZombie,
  updateNormalZombie,
  normalZombieTakeDamage,
};
export type { NormalZombie };
