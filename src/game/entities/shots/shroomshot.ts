import { shotHelpers } from "./shot-helpers";
import { zombieActions } from "./../zombies";
import { shotActions } from "./shot-actions";
import { hitboxActions } from "@/game/helpers/hitbox";

import { SHOT_HEIGHT, SHOT_WIDTH, ShotDirection, ShotType } from "./constants";

import type { BaseShot, ShotDrawOptions, ShotUpdateOptions } from "./types";
import type { Vector2 } from "@/game/types/vector";

type Shroomshot = {
  type: ShotType.Shroomshot;
} & BaseShot;

type CreateShroomshotOptions = {
  direction?: ShotDirection;
} & Vector2;

const DAMAGE = 20;
const SPEED = 150;

function createShroomshot(options: CreateShroomshotOptions): Shroomshot {
  const { x, y, direction = ShotDirection.Right } = options;
  return {
    type: ShotType.Shroomshot,
    id: shotHelpers.createShotId(),
    x,
    y,
    width: SHOT_WIDTH,
    height: SHOT_HEIGHT,
    damage: DAMAGE,
    speed: SPEED,
    fillStyle: "#E6E6FA",
    hitbox: {
      x,
      y,
      width: SHOT_WIDTH,
      height: SHOT_HEIGHT,
    },
    direction,
  };
}

function drawShroomshot(Shroomshot: Shroomshot, options: ShotDrawOptions) {
  const { board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  shotHelpers.drawShotRect(Shroomshot, options);

  hitboxActions.draw(Shroomshot.hitbox, board);
}

function updateShroomshot(Shroomshot: Shroomshot, options: ShotUpdateOptions) {
  const { deltaTime, game } = options;
  const { zombies } = game;
  const speed = Shroomshot.speed * (deltaTime / 1000);

  shotHelpers.handleShotDirection(Shroomshot, speed);

  let deleteZombieId: string | null = null;

  const collisionZombie = zombies.find((zombie) => {
    return hitboxActions.isColliding(Shroomshot.hitbox, zombie.hitbox);
  });

  if (collisionZombie !== undefined) {
    deleteZombieId = collisionZombie.id;
  }
  if (deleteZombieId !== null) {
    const zombie = zombieActions.findZombieById(zombies, deleteZombieId);

    if (zombie !== undefined) {
      zombieActions.zombieTakeDamage(zombie, {
        damage: Shroomshot.damage,
      });
      game.shots = shotActions.removeShotById(game.shots, Shroomshot.id);

      deleteZombieId = null;
    }
  }

  shotHelpers.syncShotHitbox(Shroomshot);
}

export { createShroomshot, drawShroomshot, updateShroomshot };
export type { Shroomshot };
