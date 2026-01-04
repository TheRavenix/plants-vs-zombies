import { drawHitbox, isHitboxColliding } from "@/game/helpers/hitbox";
import {
  createShotId,
  handleShotDirection,
  removeShotById,
  syncShotHitbox,
} from "../shot-service";
import { findZombieById } from "../../zombies";
import { entityTakeDamage } from "../../entity-service";
import { ShotDirection, ShotType } from "../constants";

import type { BaseShot, ShotDrawOptions, ShotUpdateOptions } from "../types";
import type { Vector2 } from "@/game/types/vector";

export type Peashot = {
  type: ShotType.Peashot;
} & BaseShot;

type CreatePeashotOptions = {
  direction?: ShotDirection;
} & Vector2;

const DAMAGE = 20;
const SPEED = 150;
const SPRITE_WIDTH = 24;
const SPRITE_HEIGHT = 24;
const SPRITE_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);
const SPRITE_IMAGE_SX = 11;
const SPRITE_IMAGE_SY = 11;
const SPRITE_IMAGE_SW = 9;
const SPRITE_IMAGE_SH = 9;

SPRITE_IMAGE.src = "./shots/pea/peashot/Peashot.png";

export function createPeashot(options: CreatePeashotOptions): Peashot {
  const { x, y, direction = ShotDirection.Right } = options;
  return {
    type: ShotType.Peashot,
    id: createShotId(),
    x,
    y,
    width: SPRITE_HEIGHT,
    height: SPRITE_HEIGHT,
    damage: DAMAGE,
    speed: SPEED,
    fillStyle: "#A0B09A",
    hitbox: {
      x,
      y,
      width: SPRITE_WIDTH,
      height: SPRITE_HEIGHT,
    },
    direction,
  };
}

export function drawPeashot(peashot: Peashot, options: ShotDrawOptions) {
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
    Math.round(peashot.x),
    Math.round(peashot.y),
    peashot.width,
    peashot.height
  );

  drawHitbox(peashot.hitbox, board);
}

export function updatePeashot(peashot: Peashot, options: ShotUpdateOptions) {
  const { deltaTime, game } = options;
  const { zombies } = game;
  const speed = peashot.speed * (deltaTime / 1000);

  handleShotDirection(peashot, speed);

  let deleteZombieId: string | null = null;

  const collisionZombie = zombies.find((zombie) => {
    return isHitboxColliding(peashot.hitbox, zombie.hitbox);
  });

  if (collisionZombie !== undefined) {
    deleteZombieId = collisionZombie.id;
  }
  if (deleteZombieId !== null) {
    const zombie = findZombieById(zombies, deleteZombieId);

    if (zombie !== undefined) {
      entityTakeDamage(zombie, peashot.damage);
      game.shots = removeShotById(game.shots, peashot.id);

      deleteZombieId = null;
    }
  }

  syncShotHitbox(peashot);
}
