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

export type FirepeaShot = {
  type: ShotType.FirepeaShot;
} & BaseShot;

type CreateFirepeaShotOptions = {
  direction?: ShotDirection;
} & Vector2;

const DAMAGE = 40;
const SPEED = 150;
const SPRITE_WIDTH = 24;
const SPRITE_HEIGHT = 24;
const SPRITE_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);
const SPRITE_IMAGE_SX = 11;
const SPRITE_IMAGE_SY = 11;
const SPRITE_IMAGE_SW = 9;
const SPRITE_IMAGE_SH = 9;

SPRITE_IMAGE.src = "./shots/pea/firepea-shot/FirepeaShot.png";

export function createFirepeaShot(
  options: CreateFirepeaShotOptions
): FirepeaShot {
  const { x, y, direction = ShotDirection.Right } = options;
  return {
    type: ShotType.FirepeaShot,
    id: createShotId(),
    x,
    y,
    width: SPRITE_WIDTH,
    height: SPRITE_HEIGHT,
    damage: DAMAGE,
    speed: SPEED,
    fillStyle: "#CE2029",
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

export function drawFirepeaShot(
  firepeaShot: FirepeaShot,
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
    Math.round(firepeaShot.x),
    Math.round(firepeaShot.y),
    firepeaShot.width,
    firepeaShot.height
  );

  drawHitbox(firepeaShot.hitbox, board);
}

export function updateFirepeaShot(
  firepeaShot: FirepeaShot,
  options: ShotUpdateOptions
) {
  const { deltaTime, level } = options;
  const { zombies } = level;
  const speed = firepeaShot.speed * (deltaTime / 1000);

  handleShotDirection(firepeaShot, speed);

  let deleteZombieId: string | null = null;

  const collisionZombie = zombies.find((zombie) => {
    return isHitboxColliding(firepeaShot.hitbox, zombie.hitbox);
  });

  if (collisionZombie !== undefined) {
    deleteZombieId = collisionZombie.id;
  }
  if (deleteZombieId !== null) {
    const zombie = findZombieById(zombies, deleteZombieId);

    if (zombie !== undefined) {
      entityTakeDamage(zombie, firepeaShot.damage);

      firepeaShot.active = false;
      deleteZombieId = null;
    }
  }

  syncShotHitbox(firepeaShot);
}
