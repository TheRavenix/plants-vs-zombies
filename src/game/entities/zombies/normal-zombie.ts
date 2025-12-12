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

type NormalZombieState = ZombieState;

type NormalZombie = Zombie<NormalZombieState>;

type CreateNormalZombieOptions = Vector2;

const NORMAL_ZOMBIE_HEALTH = 190;
const NORMAL_ZOMBIE_DAMAGE = 100;
const NORMAL_ZOMBIE_SPEED = 15;

function createNormalZombie(options: CreateNormalZombieOptions): NormalZombie {
  const { x, y } = options;
  const state: NormalZombieState = {
    name: ZombieName.Normal,
    id: createZombieId(),
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
  const { state, zombieManager } = options;

  handleZombieDefaultMovement(options);
  syncZombieHitbox(options);

  if (state.health <= 0) {
    zombieManager.removeZombieById(state.id);
  }
}

function takeDamage(options: ZombieTakeDamageOptions<NormalZombieState>) {
  const { state, damage } = options;

  state.health -= damage;
}

export { createNormalZombie };
