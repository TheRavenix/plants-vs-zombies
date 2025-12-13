import type { Board } from "../board";
import type { Size } from "../types/size";
import type { Vector2 } from "../types/vector";

type Hitbox = Vector2 & Size;

const hitboxActions = {
  draw,
  isColliding,
} as const;

function draw(hitbox: Hitbox, board: Board) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.strokeStyle = "red";
  ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
  ctx.stroke();
}

function isColliding(a: Hitbox, b: Hitbox): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export { hitboxActions };
export type { Hitbox };
