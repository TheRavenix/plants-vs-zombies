import type { Board } from "@/game/board";
import type { Level } from "@/game/level";
import type { Rect, Vector2 } from "@/game/types/math";

export type Sun = {
  id: string;
  amount: number;
} & Rect;

type CreateSunOptions = {
  amount: number;
} & Vector2;

export const SUN_SPRITE_WIDTH = 32;
export const SUN_SPRITE_HEIGHT = 32;
const SPRITE_IMAGE = new Image(SUN_SPRITE_WIDTH, SUN_SPRITE_HEIGHT);
const SPRITE_IMAGE_SX = 7;
const SPRITE_IMAGE_SY = 7;
const SPRITE_IMAGE_SW = 17;
const SPRITE_IMAGE_SH = 17;

SPRITE_IMAGE.src = "./sun/Sun.png";

function createSunId(): string {
  return `SUN-${crypto.randomUUID()}`;
}

export function createSun(options: CreateSunOptions): Sun {
  return {
    id: createSunId(),
    amount: options.amount,
    x: options.x,
    y: options.y,
    width: SUN_SPRITE_WIDTH,
    height: SUN_SPRITE_HEIGHT,
  };
}

export function drawSunImage(rect: Rect, board: Board) {
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
    Math.round(rect.x),
    Math.round(rect.y),
    rect.width,
    rect.height
  );
}

export function drawSun(sun: Sun, board: Board) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  drawSunImage(sun, board);
}

export function updateSun(_sun: Sun, _deltaTime: number) {}

export function addSun(suns: Sun[], sun: Sun): Sun[] {
  return [...suns, sun];
}

export function removeSunById(suns: Sun[], id: string): Sun[] {
  return suns.filter((sun) => sun.id !== id);
}

export function findSunById(suns: Sun[], id: string): Sun | undefined {
  return suns.find((sun) => sun.id === id);
}

export function collectSun(sun: Sun, level: Level) {
  level.sunAmount += sun.amount;
  level.suns = removeSunById(level.suns, sun.id);
}
