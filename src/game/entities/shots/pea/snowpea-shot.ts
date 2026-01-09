import { drawHitbox, isHitboxColliding } from "@/game/helpers/hitbox";
import {
  createShotId,
  handleShotDirection,
  syncShotHitbox,
} from "../shot-service";
import { findZombieById } from "../../zombies";
import { entityTakeDamage } from "../../entity-service";
import { ShotDirection, ShotType } from "../constants";

import type { BaseShot, ShotDrawOptions, ShotUpdateOptions } from "../types";
import type { Vector2 } from "@/game/types/vector";

export type SnowpeaShot = {
  type: ShotType.SnowpeaShot;
} & BaseShot;

type CreateSnowpeaShotOptions = {
  direction?: ShotDirection;
} & Vector2;

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

export function createSnowpeaShot(
  options: CreateSnowpeaShotOptions
): SnowpeaShot {
  const { x, y, direction = ShotDirection.Right } = options;
  return {
    type: ShotType.SnowpeaShot,
    id: createShotId(),
    x,
    y,
    width: SPRITE_WIDTH,
    height: SPRITE_HEIGHT,
    damage: DAMAGE,
    speed: SPEED,
    fillStyle: "#aec6cf",
    hitbox: {
      x,
      y,
      width: SPRITE_WIDTH,
      height: SPRITE_HEIGHT,
    },
    direction,
    active: true,
  };
}

export function drawSnowpeaShot(
  snowpeaShot: SnowpeaShot,
  options: ShotDrawOptions
) {
  const { board } = options;
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
    Math.round(snowpeaShot.x),
    Math.round(snowpeaShot.y),
    snowpeaShot.width,
    snowpeaShot.height
  );

  drawHitbox(snowpeaShot.hitbox, board);
}

export function updateSnowpeaShot(
  snowpeaShot: SnowpeaShot,
  options: ShotUpdateOptions
) {
  const { deltaTime, level } = options;
  const { zombies } = level;
  const speed = snowpeaShot.speed * (deltaTime / 1000);

  handleShotDirection(snowpeaShot, speed);

  let deleteZombieId: string | null = null;

  const collisionZombie = zombies.find((zombie) => {
    return isHitboxColliding(snowpeaShot.hitbox, zombie.hitbox);
  });

  if (collisionZombie !== undefined) {
    deleteZombieId = collisionZombie.id;
  }
  if (deleteZombieId !== null) {
    const zombie = findZombieById(zombies, deleteZombieId);

    if (zombie !== undefined) {
      if (zombie.freezeAmount < 100) {
        zombie.freezeAmount += FREEZE_AMOUNT;
      }

      entityTakeDamage(zombie, snowpeaShot.damage);

      snowpeaShot.active = false;
      deleteZombieId = null;
    }
  }

  syncShotHitbox(snowpeaShot);
}
