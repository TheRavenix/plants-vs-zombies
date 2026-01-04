import type { Board } from "../board";
import type { Size } from "../types/size";
import type { Vector2 } from "../types/vector";

export type Hitbox = Vector2 & Size;

export function drawHitbox(hitbox: Hitbox, board: Board) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.strokeStyle = "transparent";
  // ctx.strokeStyle = "red";
  ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
  ctx.stroke();
}

export function isHitboxColliding(a: Hitbox, b: Hitbox): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
