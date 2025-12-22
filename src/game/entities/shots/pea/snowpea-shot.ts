import { shotHelpers } from "../shot-helpers";
import { zombieActions } from "../../zombies";
import { shotActions } from "../shot-actions";
import { hitboxActions } from "@/game/helpers/hitbox";

import { ShotDirection, ShotType } from "../constants";

import type { BaseShot, ShotDrawOptions, ShotUpdateOptions } from "../types";
import type { Vector2 } from "@/game/types/vector";

type SnowpeaShot = {
  type: ShotType.SnowpeaShot;
} & BaseShot;

type CreateSnowpeaShotOptions = {
  direction?: ShotDirection;
} & Vector2;

const DAMAGE = 20;
const SPEED = 150;
const FREEZE_AMOUNT = 10;
const SPRITE_WIDTH = 32;
const SPRITE_HEIGHT = 32;
const SPRITE_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);
const SPRITE_IMAGE_SX = 11;
const SPRITE_IMAGE_SY = 11;
const SPRITE_IMAGE_SW = 9;
const SPRITE_IMAGE_SH = 9;

SPRITE_IMAGE.src = "./shots/pea/snowpea-shot/SnowpeaShot.png";

function createSnowpeaShot(options: CreateSnowpeaShotOptions): SnowpeaShot {
  const { x, y, direction = ShotDirection.Right } = options;
  return {
    type: ShotType.SnowpeaShot,
    id: shotHelpers.createShotId(),
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
  };
}

function drawSnowpeaShot(snowpeaShot: SnowpeaShot, options: ShotDrawOptions) {
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

  hitboxActions.draw(snowpeaShot.hitbox, board);
}

function updateSnowpeaShot(
  snowpeaShot: SnowpeaShot,
  options: ShotUpdateOptions
) {
  const { deltaTime, game } = options;
  const { zombies } = game;
  const speed = snowpeaShot.speed * (deltaTime / 1000);

  shotHelpers.handleShotDirection(snowpeaShot, speed);

  let deleteZombieId: string | null = null;

  const collisionZombie = zombies.find((zombie) => {
    return hitboxActions.isColliding(snowpeaShot.hitbox, zombie.hitbox);
  });

  if (collisionZombie !== undefined) {
    deleteZombieId = collisionZombie.id;
  }
  if (deleteZombieId !== null) {
    const zombie = zombieActions.findZombieById(zombies, deleteZombieId);

    if (zombie !== undefined) {
      if (zombie.freezeAmount < 100) {
        zombie.freezeAmount += FREEZE_AMOUNT;
      }

      zombieActions.zombieTakeDamage(zombie, {
        damage: snowpeaShot.damage,
      });

      game.shots = shotActions.removeShotById(game.shots, snowpeaShot.id);
      deleteZombieId = null;
    }
  }

  shotHelpers.syncShotHitbox(snowpeaShot);
}

export { createSnowpeaShot, drawSnowpeaShot, updateSnowpeaShot };
export type { SnowpeaShot };
