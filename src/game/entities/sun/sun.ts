import { createPosition, type Position } from "@/game/features/position";
import { createSize, type Size } from "@/game/features/size";
import { getOrLoadImage } from "@/game/assets";

import type { Board } from "@/game/board";
import type { Drawable } from "@/game/types/drawable";
import type { Updatable } from "@/game/types/updatable";
import type { Rect, Vector2 } from "@/game/types/math";

export interface Sun extends Drawable, Updatable {
  readonly id: string;
  readonly position: Position;
  readonly size: Size;
  readonly amount: number;
}

type Options = {
  amount: number;
} & Vector2;

export const SUN_SPRITE_WIDTH = 32;
export const SUN_SPRITE_HEIGHT = 32;
const SPRITE_PATH = "./sun/Sun.png";
const SPRITE_IMAGE_SX = 7;
const SPRITE_IMAGE_SY = 7;
const SPRITE_IMAGE_SW = 17;
const SPRITE_IMAGE_SH = 17;

export function createSun(options: Options): Sun {
  const id = createSunId();
  const position = createPosition({
    x: options.x,
    y: options.y,
  });
  const size = createSize({
    width: SUN_SPRITE_WIDTH,
    height: SUN_SPRITE_HEIGHT,
  });
  let amount = options.amount;

  function draw(board: Board) {
    const { ctx } = board;

    if (ctx === null) {
      return;
    }

    drawSunImage(
      {
        x: position.x,
        y: position.y,
        width: size.width,
        height: size.height,
      },
      board,
    );
  }

  function update(_deltaTime: number) {}

  return {
    get id() {
      return id;
    },
    get position() {
      return position;
    },
    get size() {
      return size;
    },
    get amount() {
      return amount;
    },
    draw,
    update,
  };
}

function createSunId(): string {
  return `SUN-${crypto.randomUUID()}`;
}

export function drawSunImage(rect: Rect, board: Board) {
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
    Math.round(rect.x),
    Math.round(rect.y),
    rect.width,
    rect.height,
  );
}
