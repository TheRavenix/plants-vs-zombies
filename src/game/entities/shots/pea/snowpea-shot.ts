import {
  createShotId,
  handleShotDirection,
  handleShotZombieCollision,
} from "../service";
import { ShotDirection, ShotType } from "../constants";
import { createPosition } from "@/game/features/position";
import { createSize } from "@/game/features/size";
import { createHitbox } from "@/game/entities/features/hitbox";

import type { BaseShot, ShotOptions } from "../types";
import type { Board } from "@/game/board";
import type { Zombie } from "../../zombies/types/zombie";

export interface SnowpeaShot extends BaseShot {
  readonly type: ShotType.SnowpeaShot;
}

type Options = ShotOptions;

const TYPE = ShotType.SnowpeaShot as const;
const DAMAGE = 20;
const SPEED = 150;
const FREEZE_AMOUNT = 10;
const SPRITE_WIDTH = 24;
const SPRITE_HEIGHT = 24;
const SPRITE_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);
const SPRITE_IMAGE_SX = 11;
const SPRITE_IMAGE_SY = 11;
const SPRITE_IMAGE_SW = 9;
const SPRITE_IMAGE_SH = 9;

SPRITE_IMAGE.src = "./shots/pea/snowpea-shot/SnowpeaShot.png";

export function createSnowpeaShot(options: Options): SnowpeaShot {
  const { store } = options;
  const id = createShotId();
  const position = createPosition({
    x: options.x,
    y: options.y,
  });
  const size = createSize({
    width: SPRITE_WIDTH,
    height: SPRITE_HEIGHT,
  });
  const hitbox = createHitbox({
    x: position.x,
    y: position.y,
    width: size.width,
    height: size.height,
  });
  let damage = DAMAGE;
  let active = true;
  let speed = SPEED;
  let direction = options.direction || ShotDirection.Right;

  function draw(board: Board) {
    const { ctx } = board;

    if (ctx === null) {
      return;
    }

    ctx.drawImage(
      SPRITE_IMAGE,
      SPRITE_IMAGE_SX,
      SPRITE_IMAGE_SY,
      SPRITE_IMAGE_SW,
      SPRITE_IMAGE_SH,
      Math.round(position.x),
      Math.round(position.y),
      size.width,
      size.height,
    );
    hitbox.draw(board);
  }

  function update(deltaTime: number) {
    hitbox.position.set(position.x, position.y);

    handleShotDirection(direction, position, speed, deltaTime);
    handleShotZombieCollision(hitbox, store, onZombieHit, setActive);
  }

  function onZombieHit(zombie: Zombie) {
    if (zombie.freezeAmount < 100) {
      zombie.setFreezeAmount(zombie.freezeAmount + FREEZE_AMOUNT);
    }

    zombie.health.takeDamage(damage);
  }

  function setActive(newActive: boolean) {
    active = newActive;
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
    get hitbox() {
      return hitbox;
    },
    get damage() {
      return damage;
    },
    get speed() {
      return speed;
    },
    get active() {
      return active;
    },
    get direction() {
      return direction;
    },
    draw,
    update,
  };
}
