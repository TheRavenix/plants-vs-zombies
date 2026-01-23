import {
  createZombieId,
  drawZombieRect,
  drawZombieType,
  handleZombieDefaultMovement,
} from "./zombie-service";
import {
  ZOMBIE_HEIGHT,
  ZOMBIE_WIDTH,
  ZombieState,
  ZombieType,
} from "./constants";
import { createPosition } from "@/game/features/position";
import { createSize } from "@/game/features/size";
import { createHealth } from "@/game/features/health";
import { createHitbox } from "@/game/features/hitbox";

import type { Vector2 } from "@/game/types/math";
import type { BaseZombie } from "./types";
import type { LevelContext } from "@/game/level";
import type { Board } from "@/game/board";

export interface BasicZombie extends BaseZombie {
  readonly type: ZombieType.Basic;
}

type Options = {
  ctx: LevelContext;
} & Vector2;

const TYPE = ZombieType.Basic as const;
const HEALTH = 190;
const DAMAGE = 25;
const SPEED = 15;
const DAMAGE_INTERVAL = 1000;

export function createBasicZombie(options: Options): BasicZombie {
  const { ctx } = options;
  const id = createZombieId();
  const position = createPosition({
    x: options.x,
    y: options.y,
  });
  const size = createSize({
    width: ZOMBIE_WIDTH,
    height: ZOMBIE_HEIGHT,
  });
  const health = createHealth({
    hp: HEALTH,
  });
  const hitbox = createHitbox({
    x: position.x,
    y: position.y,
    width: size.width,
    height: size.height,
  });
  let state = ZombieState.Walking;
  let damage = DAMAGE;
  let speed = SPEED;
  let damageTimer = 0;
  let freezeAmount = 0;

  function draw(board: Board) {
    const { ctx } = board;

    if (ctx === null) {
      return;
    }

    drawZombieRect(position, size, board);
    drawZombieType(TYPE, position, size, health, board);

    hitbox.draw(board);
  }

  function update(deltaTime: number) {
    let eatPlantId: string | null = null;

    const collisionPlant = ctx.plants.find((plant) => {
      return hitbox.isColliding(plant.hitbox);
    });

    if (collisionPlant !== undefined) {
      eatPlantId = collisionPlant.id;
    }

    if (state === ZombieState.Walking) {
      handleZombieDefaultMovement(position, freezeAmount, speed, deltaTime);

      const isPlantCollision = ctx.plants.some((plant) => {
        return hitbox.isColliding(plant.hitbox);
      });

      if (isPlantCollision) {
        state = ZombieState.Eating;
      }
    }
    if (state === ZombieState.Eating) {
      if (eatPlantId === null) {
        state = ZombieState.Walking;
      }
      if (damageTimer >= DAMAGE_INTERVAL && eatPlantId !== null) {
        const plant = ctx.findPlantById(eatPlantId);

        if (plant !== undefined) {
          plant.health.takeDamage(damage);
        }

        damageTimer = 0;
      }

      damageTimer += deltaTime;
    }

    hitbox.position.set(position.x, position.y);
  }

  return {
    get type() {
      return TYPE;
    },
    get id() {
      return id;
    },
    get position() {
      return position;
    },
    get size() {
      return size;
    },
    get health() {
      return health;
    },
    get hitbox() {
      return hitbox;
    },
    get state() {
      return state;
    },
    get damage() {
      return damage;
    },
    get speed() {
      return speed;
    },
    get damageTimer() {
      return damageTimer;
    },
    get freezeAmount() {
      return freezeAmount;
    },
    draw,
    update,
    setFreezeAmount(newFreezeAmount) {
      freezeAmount = newFreezeAmount;
    },
  };
}
