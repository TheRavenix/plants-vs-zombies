import { shotHelpers } from "../shot-helpers";
import { zombieActions, type Zombie } from "../../zombies";
import { shotActions } from "../shot-actions";
import { hitboxActions } from "@/game/helpers/hitbox";

import { ShotType } from "../constants";

import type { BaseShot, ShotDrawOptions, ShotUpdateOptions } from "../types";
import type { Vector2 } from "@/game/types/vector";

type RicochetPeashot = {
  type: ShotType.RicochetPeashot;
  bounceTimes: number;
  lastHitZombieId: string | null;
} & BaseShot;

type CreateRicochetPeashotOptions = Vector2;

const DAMAGE = 20;
const SPEED = 150;
const SPRITE_WIDTH = 24;
const SPRITE_HEIGHT = 24;
const BOUNCE_TIMES = 1;
const SPRITE_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);
const SPRITE_IMAGE_SX = 11;
const SPRITE_IMAGE_SY = 11;
const SPRITE_IMAGE_SW = 9;
const SPRITE_IMAGE_SH = 9;

SPRITE_IMAGE.src = "./shots/pea/peashot/Peashot.png";

function createRicochetPeashot(
  options: CreateRicochetPeashotOptions
): RicochetPeashot {
  const { x, y } = options;
  return {
    type: ShotType.RicochetPeashot,
    id: shotHelpers.createShotId(),
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
    direction: undefined,
    bounceTimes: 0,
    lastHitZombieId: null,
  };
}

function drawRicochetPeashot(
  ricochetpeashot: RicochetPeashot,
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
    Math.round(ricochetpeashot.x),
    Math.round(ricochetpeashot.y),
    ricochetpeashot.width,
    ricochetpeashot.height
  );

  hitboxActions.draw(ricochetpeashot.hitbox, board);
}

function updateRicochetPeashot(
  ricochetpeashot: RicochetPeashot,
  options: ShotUpdateOptions
) {
  const { deltaTime, game } = options;
  const { zombies } = game;
  const speed = ricochetpeashot.speed * (deltaTime / 1000);

  if (ricochetpeashot.bounceTimes >= BOUNCE_TIMES) {
    game.shots = shotActions.removeShotById(game.shots, ricochetpeashot.id);
  }
  if (ricochetpeashot.lastHitZombieId !== null) {
    if (ricochetpeashot.bounceTimes >= BOUNCE_TIMES) {
      return;
    }

    let filteredZombies: Zombie[] = zombies;
    const lastHitZombie = zombieActions.findZombieById(
      zombies,
      ricochetpeashot.lastHitZombieId
    );

    if (lastHitZombie !== undefined) {
      filteredZombies = zombieActions.findZombiesWithinArea(
        zombies,
        lastHitZombie.x,
        lastHitZombie.y
      );

      const filteredZombiesNoLastHit = filteredZombies.filter(
        (zombie) => zombie.id !== lastHitZombie.id
      );

      if (filteredZombiesNoLastHit.length > 0) {
        filteredZombies = filteredZombies.filter(
          (zombie) => zombie.id !== lastHitZombie.id
        );
      }
    } else {
      const zombiesWithinArea = zombieActions.findZombiesWithinArea(
        filteredZombies,
        ricochetpeashot.x,
        ricochetpeashot.y
      );

      if (zombiesWithinArea.length <= 0) {
        game.shots = shotActions.removeShotById(game.shots, ricochetpeashot.id);
        return;
      }
    }

    if (filteredZombies.length > 0) {
      let closestZombie = filteredZombies[0];
      let minDistance = Infinity;

      for (const zombie of filteredZombies) {
        const dx = zombie.x - ricochetpeashot.x;
        const dy = zombie.y - ricochetpeashot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance) {
          minDistance = distance;
          closestZombie = zombie;
        }
      }

      if (Math.abs(ricochetpeashot.x - closestZombie.x) > speed) {
        ricochetpeashot.x +=
          ricochetpeashot.x > closestZombie.x ? -speed : speed;
      }
      if (Math.abs(ricochetpeashot.y - closestZombie.y) > speed) {
        ricochetpeashot.y +=
          ricochetpeashot.y > closestZombie.y ? -speed : speed;
      }
    }

    let deleteZombieId: string | null = null;
    const collisionZombie = filteredZombies.find((zombie) => {
      return hitboxActions.isColliding(ricochetpeashot.hitbox, zombie.hitbox);
    });

    if (collisionZombie !== undefined) {
      deleteZombieId = collisionZombie.id;
    }
    if (deleteZombieId !== null) {
      const zombie = zombieActions.findZombieById(
        filteredZombies,
        deleteZombieId
      );

      if (zombie !== undefined) {
        zombieActions.zombieTakeDamage(zombie, {
          damage: ricochetpeashot.damage,
        });

        ricochetpeashot.bounceTimes += 1;
        ricochetpeashot.lastHitZombieId = zombie.id;

        deleteZombieId = null;
      }
    }
  } else {
    ricochetpeashot.x += speed;

    let deleteZombieId: string | null = null;

    const collisionZombie = zombies.find((zombie) => {
      return hitboxActions.isColliding(ricochetpeashot.hitbox, zombie.hitbox);
    });

    if (collisionZombie !== undefined) {
      deleteZombieId = collisionZombie.id;
    }
    if (deleteZombieId !== null) {
      const zombie = zombieActions.findZombieById(zombies, deleteZombieId);

      if (zombie !== undefined) {
        zombieActions.zombieTakeDamage(zombie, {
          damage: ricochetpeashot.damage,
        });

        ricochetpeashot.lastHitZombieId = zombie.id;

        deleteZombieId = null;
      }
    }
  }

  shotHelpers.syncShotHitbox(ricochetpeashot);
}

export { createRicochetPeashot, drawRicochetPeashot, updateRicochetPeashot };
export type { RicochetPeashot };
