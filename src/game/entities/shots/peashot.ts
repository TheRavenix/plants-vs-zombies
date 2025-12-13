import { shotHelpers } from "./shot-helpers";

import { SHOT_HEIGHT, SHOT_WIDTH, ShotType } from "./constants";
import { zombieActions } from "../zombies";
import { shotActions } from "./shot-actions";
import { hitboxActions } from "@/game/helpers/hitbox";

import type { Shot, ShotDrawOptions, ShotUpdateOptions } from "./types";
import type { Vector2 } from "@/game/types/vector";

type Peashot = {
  direction?: PeashotDirection;
} & Shot;

type CreatePeashotOptions = {
  direction?: PeashotDirection;
} & Vector2;

const DAMAGE = 15;
const SPEED = 150;

const PeashotDirection = {
  Right: "RIGHT",
  UpRight: "UP_RIGHT",
  DownRight: "DOWN_RIGHT",
} as const;
type PeashotDirection =
  (typeof PeashotDirection)[keyof typeof PeashotDirection];

function createPeashot(options: CreatePeashotOptions): Peashot {
  const { x, y, direction = PeashotDirection.Right } = options;
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

function drawPeashot(options: ShotDrawOptions<Peashot>) {
  const { shot, board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  shotHelpers.drawShotRect(options);

  hitboxActions.draw(shot.hitbox, board);
}

function updatePeashot(options: ShotUpdateOptions<Peashot>) {
  const { deltaTime, shot, game } = options;
  const { zombies } = game;
  const speed = shot.speed * (deltaTime / 1000);

  switch (shot.direction) {
    case PeashotDirection.Right:
      shot.x += speed;
      break;

    case PeashotDirection.UpRight:
      shot.x += speed;
      shot.y -= speed;
      break;

    case PeashotDirection.DownRight:
      shot.x += speed;
      shot.y += speed;
      break;

    default:
      shot.x += speed;
  }

  let deleteZombieId: string | null = null;

  const collisionZombie = zombies.find((zombie) => {
    return hitboxActions.isColliding(shot.hitbox, zombie.hitbox);
  });

  if (collisionZombie !== undefined) {
    deleteZombieId = collisionZombie.id;
  }
  if (deleteZombieId !== null) {
    const zombie = zombieActions.findZombieById(zombies, deleteZombieId);

    if (zombie === undefined) {
      return;
    }

    zombieActions.zombieTakeDamage({
      zombie,
      damage: shot.damage,
    });
    game.shots = shotActions.removeShotById(game.shots, shot.id);

    deleteZombieId = null;
  }

  shotHelpers.syncShotHitbox(options);
}

export { createPeashot, drawPeashot, updatePeashot };
export { PeashotDirection };
export type { Peashot };
