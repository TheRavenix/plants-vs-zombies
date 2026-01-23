import { createShotId, handleShotDirection } from "../service";
import { ShotDirection, ShotType } from "../constants";
import { createPosition } from "@/game/features/position";
import { createSize } from "@/game/features/size";
import { createHitbox } from "@/game/features/hitbox";

import type { BaseShot } from "../types";
import type { Vector2 } from "@/game/types/math";
import type { LevelContext } from "@/game/level";
import type { Board } from "@/game/board";

export interface Peashot extends BaseShot {
  readonly type: ShotType.Peashot;
}

type Options = {
  direction?: ShotDirection;
  ctx: LevelContext;
} & Vector2;

const TYPE = ShotType.Peashot as const;
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

export function createPeashot(options: Options): Peashot {
  const { ctx } = options;
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
  let direction = options.direction || ShotDirection.Right;

  function draw(board: Board) {
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
      Math.round(position.x),
      Math.round(position.y),
      size.width,
      size.height,
    );
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
