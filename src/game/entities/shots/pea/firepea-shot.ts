import { shotHelpers } from "../shot-helpers";
import { zombieActions } from "../../zombies";
import { shotActions } from "../shot-actions";
import { hitboxActions } from "@/game/helpers/hitbox";

import { SHOT_HEIGHT, SHOT_WIDTH, ShotDirection, ShotType } from "../constants";

import type { BaseShot, ShotDrawOptions, ShotUpdateOptions } from "../types";
import type { Vector2 } from "@/game/types/vector";

type FirepeaShot = {
  type: ShotType.FirepeaShot;
} & BaseShot;

type CreateFirepeaShotOptions = {
  direction?: ShotDirection;
} & Vector2;

const DAMAGE = 40;
const SPEED = 150;
const SPRITE_WIDTH = 32;
const SPRITE_HEIGHT = 32;
const SPRITE_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);
const SPRITE_IMAGE_SX = 11;
const SPRITE_IMAGE_SY = 11;
const SPRITE_IMAGE_SW = 9;
const SPRITE_IMAGE_SH = 9;

SPRITE_IMAGE.src = "./shots/pea/firepea-shot/FirepeaShot.png";

function createFirepeaShot(options: CreateFirepeaShotOptions): FirepeaShot {
  const { x, y, direction = ShotDirection.Right } = options;
  return {
    type: ShotType.FirepeaShot,
    id: shotHelpers.createShotId(),
    x,
    y,
    width: SHOT_WIDTH,
    height: SHOT_HEIGHT,
    damage: DAMAGE,
    speed: SPEED,
    fillStyle: "#CE2029",
    hitbox: {
      x,
      y,
      width: SHOT_WIDTH,
      height: SHOT_HEIGHT,
    },
    direction,
  };
}

function drawFirepeaShot(firepeaShot: FirepeaShot, options: ShotDrawOptions) {
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

  hitboxActions.draw(firepeaShot.hitbox, board);
}

function updateFirepeaShot(
  firepeaShot: FirepeaShot,
  options: ShotUpdateOptions
) {
  const { deltaTime, game } = options;
  const { zombies } = game;
  const speed = firepeaShot.speed * (deltaTime / 1000);

  shotHelpers.handleShotDirection(firepeaShot, speed);

  let deleteZombieId: string | null = null;

  const collisionZombie = zombies.find((zombie) => {
    return hitboxActions.isColliding(firepeaShot.hitbox, zombie.hitbox);
  });

  if (collisionZombie !== undefined) {
    deleteZombieId = collisionZombie.id;
  }
  if (deleteZombieId !== null) {
    const zombie = zombieActions.findZombieById(zombies, deleteZombieId);

    if (zombie !== undefined) {
      zombieActions.zombieTakeDamage(zombie, {
        damage: firepeaShot.damage,
      });
      game.shots = shotActions.removeShotById(game.shots, firepeaShot.id);

      deleteZombieId = null;
    }
  }

  shotHelpers.syncShotHitbox(firepeaShot);
}

export { createFirepeaShot, drawFirepeaShot, updateFirepeaShot };
export type { FirepeaShot };
