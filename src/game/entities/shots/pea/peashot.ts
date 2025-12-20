import { shotHelpers } from "../shot-helpers";
import { zombieActions } from "../../zombies";
import { shotActions } from "../shot-actions";
import { hitboxActions } from "@/game/helpers/hitbox";

import { SHOT_HEIGHT, SHOT_WIDTH, ShotDirection, ShotType } from "../constants";

import type { BaseShot, ShotDrawOptions, ShotUpdateOptions } from "../types";
import type { Vector2 } from "@/game/types/vector";

type Peashot = {
  type: ShotType.Peashot;
} & BaseShot;

type CreatePeashotOptions = {
  direction?: ShotDirection;
} & Vector2;

const DAMAGE = 20;
const SPEED = 150;

function createPeashot(options: CreatePeashotOptions): Peashot {
  const { x, y, direction = ShotDirection.Right } = options;
  return {
    type: ShotType.Peashot,
    id: shotHelpers.createShotId(),
    x,
    y,
    width: SHOT_WIDTH,
    height: SHOT_HEIGHT,
    damage: DAMAGE,
    speed: SPEED,
    fillStyle: "#A0B09A",
    hitbox: {
      x,
      y,
      width: SHOT_WIDTH,
      height: SHOT_HEIGHT,
    },
    direction,
  };
}

function drawPeashot(peashot: Peashot, options: ShotDrawOptions) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  shotHelpers.drawShotRect(peashot, options);

  hitboxActions.draw(peashot.hitbox, board);
}

function updatePeashot(peashot: Peashot, options: ShotUpdateOptions) {
  const { deltaTime, game } = options;
  const { zombies } = game;
  const speed = peashot.speed * (deltaTime / 1000);

  shotHelpers.handleShotDirection(peashot, speed);

  let deleteZombieId: string | null = null;

  const collisionZombie = zombies.find((zombie) => {
    return hitboxActions.isColliding(peashot.hitbox, zombie.hitbox);
  });

  if (collisionZombie !== undefined) {
    deleteZombieId = collisionZombie.id;
  }
  if (deleteZombieId !== null) {
    const zombie = zombieActions.findZombieById(zombies, deleteZombieId);

    if (zombie !== undefined) {
      zombieActions.zombieTakeDamage(zombie, {
        damage: peashot.damage,
      });
      game.shots = shotActions.removeShotById(game.shots, peashot.id);

      deleteZombieId = null;
    }
  }

  shotHelpers.syncShotHitbox(peashot);
}

export { createPeashot, drawPeashot, updatePeashot };
export type { Peashot };
