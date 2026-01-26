import {
  createZombieId,
  drawZombieRect,
  drawZombieType,
  handleZombieBehaviour,
} from "./service";
import {
  ZOMBIE_HEIGHT,
  ZOMBIE_WIDTH,
  ZombieState,
  ZombieType,
} from "./constants";
import { createPosition } from "@/game/features/position";
import { createSize } from "@/game/features/size";
import { createHealth } from "@/game/entities/features/health";
import { createHitbox } from "@/game/entities/features/hitbox";

import type { BaseZombie, ZombieOptions } from "./types";
import type { Board } from "@/game/board";
import type { Plant } from "../plants/types/plant";

export interface BasicZombie extends BaseZombie {
  readonly type: ZombieType.Basic;
}

type Options = ZombieOptions;

const TYPE = ZombieType.Basic as const;
const HEALTH = 190;
const DAMAGE = 25;
const SPEED = 15;
const DAMAGE_INTERVAL = 1000;

export function createBasicZombie(options: Options): BasicZombie {
  const { store } = options;
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
    hitbox.position.set(position.x, position.y);

    handleZombieBehaviour(
      hitbox,
      position,
      freezeAmount,
      speed,
      state,
      damageTimer,
      DAMAGE_INTERVAL,
      store,
      deltaTime,
      onEatPlant,
      setState,
      setDamageTimer,
    );
  }

  function onEatPlant(plant: Plant) {
    plant.health.takeDamage(damage);
  }

  function setState(newState: ZombieState) {
    state = newState;
  }

  function setDamageTimer(timer: number) {
    damageTimer = timer;
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
