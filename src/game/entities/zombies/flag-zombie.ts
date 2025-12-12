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

type FlagZombieState = ZombieState;

type FlagZombie = Zombie<FlagZombieState>;

type CreateFlagZombieOptions = Vector2;

const FLAG_ZOMBIE_HEALTH = 190;
const FLAG_ZOMBIE_DAMAGE = 25;
const FLAG_ZOMBIE_SPEED = 25;
const FLAG_ZOMBIE_DAMAGE_INTERVAL = 1000;

function createFlagZombie(options: CreateFlagZombieOptions): FlagZombie {
  const { x, y } = options;
  const state: FlagZombieState = {
    name: ZombieName.Flag,
    id: createZombieId(),
    stateName: ZombieStateName.Walking,
    x,
    y,
    width: ZOMBIE_WIDTH,
    height: ZOMBIE_HEIGHT,
    health: FLAG_ZOMBIE_HEALTH,
    damage: FLAG_ZOMBIE_DAMAGE,
    speed: FLAG_ZOMBIE_SPEED,
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

function draw(options: ZombieDrawOptions<FlagZombieState>) {
  const { state, board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  drawZombieRect(options);
  drawZombieName(options);

  state.hitbox.draw(state.hitbox, board);
}

function update(options: ZombieUpdateOptions<FlagZombieState>) {
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
      state.damageTimer >= FLAG_ZOMBIE_DAMAGE_INTERVAL &&
      eatPlantId !== null
    ) {
      const plant = game.plantManager.findPlantById(eatPlantId);

      if (plant !== undefined) {
        plant.takeDamage({
          damage: FLAG_ZOMBIE_DAMAGE,
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

function takeDamage(options: ZombieTakeDamageOptions<FlagZombieState>) {
  const { state, damage } = options;

  state.health -= damage;
}

export { createFlagZombie };
