import { findZombiesWithinArea } from "../../../zombies";
import { createShotId } from "../../service";
import { ShotDirection, ShotType } from "../../constants";
import { createPosition } from "@/game/features/position";
import { createSize } from "@/game/features/size";
import { createHitbox } from "@/game/entities/features/hitbox";
import { getOrLoadImage } from "@/game/assets";

import type { BaseShot, ShotOptions } from "../../types";
import type { Board } from "@/game/board";
import type { Zombie } from "../../../zombies/types/zombie";

export interface RicochetPeashot extends BaseShot {
  readonly type: ShotType.RicochetPeashot;
  readonly bounceTimes: number;
  readonly lastHitZombieId: string | null;
}

type Options = {
  findZombieById(id: string): Zombie | undefined;
} & ShotOptions;

const TYPE = ShotType.RicochetPeashot as const;
const DAMAGE = 20;
const SPEED = 150;
const SPRITE_WIDTH = 24;
const SPRITE_HEIGHT = 24;
const BOUNCE_TIMES = 1;
const SPRITE_PATH = "./shots/pea/peashot/Peashot.png";
const SPRITE_IMAGE_SX = 11;
const SPRITE_IMAGE_SY = 11;
const SPRITE_IMAGE_SW = 9;
const SPRITE_IMAGE_SH = 9;

export function createRicochetPeashot(options: Options): RicochetPeashot {
  const { getZombies, findZombieById } = options;
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
  let bounceTimes = 0;
  let lastHitZombieId: string | null = null;
  let direction: ShotDirection | undefined = undefined;

  function draw(board: Board) {
    const { ctx } = board;

    if (ctx === null) {
      return;
    }

    ctx.drawImage(
      getOrLoadImage(SPRITE_PATH),
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

  // TODO: Minimize this code
  function update(deltaTime: number) {
    const finalSpeed = speed * (deltaTime / 1000);

    hitbox.position.set(position.x, position.y);

    if (bounceTimes >= BOUNCE_TIMES) {
      active = false;
    }
    if (lastHitZombieId !== null) {
      if (bounceTimes >= BOUNCE_TIMES) {
        return;
      }

      let filteredZombies = getZombies();
      const lastHitZombie = findZombieById(lastHitZombieId);

      if (lastHitZombie !== undefined) {
        filteredZombies = findZombiesWithinArea(
          lastHitZombie.position.x,
          lastHitZombie.position.y,
          getZombies,
        );

        const filteredZombiesNoLastHit = filteredZombies.filter(
          (zombie) => zombie.id !== lastHitZombie.id,
        );

        if (filteredZombiesNoLastHit.length > 0) {
          filteredZombies = filteredZombies.filter(
            (zombie) => zombie.id !== lastHitZombie.id,
          );
        }
      } else {
        const zombiesWithinArea = findZombiesWithinArea(
          position.x,
          position.y,
          () => filteredZombies,
        );

        if (zombiesWithinArea.length <= 0) {
          active = false;
          return;
        }
      }

      if (filteredZombies.length > 0) {
        let closestZombie = filteredZombies[0];
        let minDistance = Infinity;

        for (const zombie of filteredZombies) {
          const dx = zombie.position.x - position.x;
          const dy = zombie.position.y - position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < minDistance) {
            minDistance = distance;
            closestZombie = zombie;
          }
        }

        if (Math.abs(position.x - closestZombie.position.x) > finalSpeed) {
          position.setX(
            position.x + position.x > closestZombie.position.x
              ? -finalSpeed
              : finalSpeed,
          );
        }
        if (Math.abs(position.y - closestZombie.position.y) > finalSpeed) {
          position.setY(
            position.y + position.y > closestZombie.position.y
              ? -finalSpeed
              : finalSpeed,
          );
        }
      }

      let deleteZombieId: string | null = null;
      const collisionZombie = filteredZombies.find((zombie) => {
        return hitbox.isColliding(zombie.hitbox);
      });

      if (collisionZombie !== undefined) {
        deleteZombieId = collisionZombie.id;
      }
      if (deleteZombieId !== null) {
        const zombie = findZombieById(deleteZombieId);

        if (zombie !== undefined) {
          zombie.health.takeDamage(damage);

          bounceTimes += 1;
          lastHitZombieId = zombie.id;

          deleteZombieId = null;
        }
      }
    } else {
      position.setX(position.x + finalSpeed);

      let deleteZombieId: string | null = null;

      const collisionZombie = getZombies().find((zombie) => {
        return hitbox.isColliding(zombie.hitbox);
      });

      if (collisionZombie !== undefined) {
        deleteZombieId = collisionZombie.id;
      }
      if (deleteZombieId !== null) {
        const zombie = findZombieById(deleteZombieId);

        if (zombie !== undefined) {
          zombie.health.takeDamage(damage);

          lastHitZombieId = zombie.id;

          deleteZombieId = null;
        }
      }
    }
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
    get bounceTimes() {
      return bounceTimes;
    },
    get lastHitZombieId() {
      return lastHitZombieId;
    },
    draw,
    update,
  };
}
