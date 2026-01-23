import { createPosition, type Position } from "./position";
import { createSize, type Size } from "./size";

import type { Board } from "../board";
import type { Drawable } from "../types/drawable";

export interface Hitbox extends Drawable {
  readonly position: Position;
  readonly size: Size;
  isColliding(target: Hitbox): boolean;
}

type Options = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function createHitbox(options: Options): Hitbox {
  const position = createPosition({
    x: options.x,
    y: options.y,
  });
  const size = createSize({
    width: options.width,
    height: options.height,
  });

  function draw(board: Board) {
    const { ctx } = board;

    if (ctx === null) {
      return;
    }

    // ctx.strokeStyle = "transparent";
    ctx.strokeStyle = "red";
    ctx.strokeRect(position.x, position.y, size.width, size.height);
    ctx.stroke();
  }

  function isColliding(target: Hitbox): boolean {
    return (
      position.x < target.position.x + target.size.width &&
      position.x + size.width > target.position.x &&
      position.y < target.position.y + target.size.height &&
      position.y + size.height > target.position.y
    );
  }

  return {
    position,
    size,
    draw,
    isColliding,
  };
}
