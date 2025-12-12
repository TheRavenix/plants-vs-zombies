import {
  createZombieId,
  drawZombieName,
  drawZombieRect,
  handleZombieDefaultMovement,
  syncZombieHitbox,
} from "./helpers";
import { createHitbox, isHitboxColliding } from "@/game/helpers/hitbox";

import {
  ZOMBIE_HEIGHT,
  ZOMBIE_WIDTH,
  ZombieName,
  ZombieStateName,
} from "./constants";

import { type Vector2 } from "@/game/utils/vector";
import type {
  Zombie,
  ZombieDrawOptions,
  ZombieState,
  ZombieTakeDamageOptions,
  ZombieUpdateOptions,
} from "./types";

type NormalZombieState = ZombieState;

type NormalZombie = Zombie<NormalZombieState>;

type CreateNormalZombieOptions = Vector2;

const NORMAL_ZOMBIE_HEALTH = 190;
const NORMAL_ZOMBIE_DAMAGE = 25;
const NORMAL_ZOMBIE_SPEED = 15;
const NORMAL_ZOMBIE_DAMAGE_INTERVAL = 1000;

function createNormalZombie(options: CreateNormalZombieOptions): NormalZombie {
  const { x, y } = options;
  const state: NormalZombieState = {
    name: ZombieName.Normal,
    id: createZombieId(),
    stateName: ZombieStateName.Walking,
    x,
    y,
    width: ZOMBIE_WIDTH,
    height: ZOMBIE_HEIGHT,
    health: NORMAL_ZOMBIE_HEALTH,
    damage: NORMAL_ZOMBIE_DAMAGE,
    speed: NORMAL_ZOMBIE_SPEED,
    hitbox: createHitbox({
      x,
      y,
      width: ZOMBIE_WIDTH,
      height: ZOMBIE_HEIGHT,
    }),
    damageTimer: 0,
  };

  return {
    get state() {
      return state;
    },
    draw,
    update,
    takeDamage,
  };
}

function draw(options: ZombieDrawOptions<NormalZombieState>) {
  const { state, board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  drawZombieRect(options);
  drawZombieName(options);

  state.hitbox.draw(state.hitbox, board);
}

function update(options: ZombieUpdateOptions<NormalZombieState>) {
  const { state, game, deltaTime } = options;

  let eatPlantId: string | null = null;

  for (const plant of game.plantManager.plants) {
    if (isHitboxColliding(state.hitbox, plant.state.hitbox)) {
      eatPlantId = plant.state.id;
      break;
    }
  }
  if (state.stateName === ZombieStateName.Walking) {
    handleZombieDefaultMovement(options);

    for (const plant of game.plantManager.plants) {
      if (isHitboxColliding(state.hitbox, plant.state.hitbox)) {
        state.stateName = ZombieStateName.Eating;
        break;
      }
    }
  }
  if (state.stateName === ZombieStateName.Eating) {
    if (eatPlantId === null) {
      state.stateName = ZombieStateName.Walking;
    }
    if (
      state.damageTimer >= NORMAL_ZOMBIE_DAMAGE_INTERVAL &&
      eatPlantId !== null
    ) {
      const plant = game.plantManager.findPlantById(eatPlantId);

      if (plant !== undefined) {
        plant.takeDamage({
          damage: NORMAL_ZOMBIE_DAMAGE,
          state: plant.state,
        });
      }

      state.damageTimer = 0;
    }

    state.damageTimer += deltaTime;
  }
  if (state.health <= 0) {
    game.zombieManager.removeZombieById(state.id);
  }

  syncZombieHitbox(options);
}

function takeDamage(options: ZombieTakeDamageOptions<NormalZombieState>) {
  const { state, damage } = options;

  state.health -= damage;
}

export { createNormalZombie };
