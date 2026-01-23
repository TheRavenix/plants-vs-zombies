import { createShotId, drawShotRect, handleShotDirection } from "./service";
import { SHOT_HEIGHT, SHOT_WIDTH, ShotDirection, ShotType } from "./constants";
import { createPosition } from "@/game/features/position";
import { createSize } from "@/game/features/size";
import { createHitbox } from "@/game/features/hitbox";

import type { BaseShot } from "./types";
import type { Vector2 } from "@/game/types/math";
import type { LevelContext } from "@/game/level";
import type { Board } from "@/game/board";

export interface Shroomshot extends BaseShot {
  readonly type: ShotType.Shroomshot;
}

type Options = {
  direction?: ShotDirection;
  ctx: LevelContext;
} & Vector2;

const TYPE = ShotType.Shroomshot as const;
const DAMAGE = 20;
const SPEED = 150;

export function createShroomshot(options: Options): Shroomshot {
  const { ctx } = options;
  const id = createShotId();
  const position = createPosition({
    x: options.x,
    y: options.y,
  });
  const size = createSize({
    width: SHOT_WIDTH,
    height: SHOT_HEIGHT,
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
  let direction = options.direction || ShotDirection.Right;

  function draw(board: Board) {
    const { ctx } = board;

    if (ctx === null) {
      return;
    }

    drawShotRect(position, size, "#000000", board);
    hitbox.draw(board);
  }

  function update(deltaTime: number) {
    handleShotDirection(direction, position, speed, deltaTime);

    let deleteZombieId: string | null = null;

    const collisionZombie = ctx.zombies.find((zombie) => {
      return hitbox.isColliding(zombie.hitbox);
    });

    if (collisionZombie !== undefined) {
      deleteZombieId = collisionZombie.id;
    }
    if (deleteZombieId !== null) {
      const zombie = ctx.findZombieById(deleteZombieId);

      if (zombie !== undefined) {
        zombie.health.takeDamage(damage);

        active = false;
        deleteZombieId = null;
      }
    }

    hitbox.position.set(position.x, position.y);
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
    draw,
    update,
  };
}
