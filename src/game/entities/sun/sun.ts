import type { Board } from "@/game/board";
import type { Size } from "@/game/types/size";
import type { Vector2 } from "@/game/types/vector";

type Sun = Vector2 & Size;

const SUN_SPRITE_WIDTH = 32;
const SUN_SPRITE_HEIGHT = 32;
const SPRITE_IMAGE = new Image(SUN_SPRITE_WIDTH, SUN_SPRITE_HEIGHT);
const SPRITE_IMAGE_SX = 7;
const SPRITE_IMAGE_SY = 7;
const SPRITE_IMAGE_SW = 17;
const SPRITE_IMAGE_SH = 17;

SPRITE_IMAGE.src = "./sun/Sun.png";

function drawSunImage(sun: Sun, board: Board) {
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
    Math.round(sun.x),
    Math.round(sun.y),
    sun.width,
    sun.height
  );
}

export { drawSunImage };
export { SUN_SPRITE_WIDTH, SUN_SPRITE_HEIGHT };
