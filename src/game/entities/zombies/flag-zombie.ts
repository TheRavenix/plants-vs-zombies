import {
  createZombieId,
  drawZombieName,
  drawZombieRect,
  handleZombieDefaultMovement,
  syncZombieHitbox,
} from "./helpers";
import { createHitbox } from "@/game/helpers/hitbox";

import { ZOMBIE_HEIGHT, ZOMBIE_WIDTH, ZombieName } from "./constants";

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
const FLAG_ZOMBIE_DAMAGE = 100;
const FLAG_ZOMBIE_SPEED = 25;

function createFlagZombie(options: CreateFlagZombieOptions): FlagZombie {
  const { x, y } = options;
  const state: FlagZombieState = {
    name: ZombieName.Flag,
    id: createZombieId(),
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
  const { state, zombieManager } = options;

  handleZombieDefaultMovement(options);
  syncZombieHitbox(options);

  if (state.health <= 0) {
    zombieManager.removeZombieById(state.id);
  }
}

function takeDamage(options: ZombieTakeDamageOptions<FlagZombieState>) {
  const { state, damage } = options;

  state.health -= damage;
}

export { createFlagZombie };
