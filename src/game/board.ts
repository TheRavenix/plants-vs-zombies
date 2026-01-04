import type { Vector2 } from "./types/vector";

type TilePosition = Vector2;

export type Board = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  tilePosList: TilePosition[];
};

type CreateBoardOptions = {
  root?: Element | null;
  center?: boolean;
};

export const TILE_WIDTH = 96;
export const TILE_HEIGHT = 96;
export const BOARD_ROWS = 10;
export const BOARD_COLS = 6;
const BOARD_WIDTH = BOARD_ROWS * TILE_WIDTH;
const BOARD_HEIGHT = BOARD_COLS * TILE_HEIGHT;
const GRASS_IMAGE = new Image(TILE_WIDTH, TILE_HEIGHT);
const WALL_IMAGE = new Image(TILE_WIDTH, TILE_HEIGHT);

GRASS_IMAGE.src = "./grass/Grass.png";
WALL_IMAGE.src = "./wall/Wall.png";

export function createBoard(options?: CreateBoardOptions): Board {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const tilePosList: TilePosition[] = [];

  const pixelifyFont = new FontFace(
    "Pixelify",
    "url(https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap)"
  );

  pixelifyFont
    .load()
    .then((loadedFont) => {
      document.fonts.add(loadedFont);
    })
    .catch((error) => {
      console.error("Font failed to load:", error);
    });

  canvas.width = BOARD_WIDTH;
  canvas.height = BOARD_HEIGHT;
  canvas.style.touchAction = "none";

  if (options !== undefined) {
    if (options.root !== undefined && options.root !== null) {
      options.root.appendChild(canvas);
    }
    if (options.center !== undefined && options.center) {
      canvas.style.position = "absolute";
      canvas.style.top = "50%";
      canvas.style.left = "50%";
      canvas.style.transform = "translate(-50%, -50%)";
    }
  }

  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      tilePosList.push({
        x: row * TILE_WIDTH,
        y: col * TILE_HEIGHT,
      });
    }
  }

  return {
    canvas,
    ctx,
    tilePosList,
  };
}

export function drawBoard(board: Board) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      if (row === 0 || col === 0) {
        ctx.drawImage(
          WALL_IMAGE,
          Math.round(row * TILE_WIDTH),
          Math.round(col * TILE_HEIGHT),
          TILE_WIDTH,
          TILE_HEIGHT
        );
        continue;
      }

      ctx.drawImage(
        GRASS_IMAGE,
        Math.round(row * TILE_WIDTH),
        Math.round(col * TILE_HEIGHT),
        TILE_WIDTH,
        TILE_HEIGHT
      );
    }
  }
}

export function getCanvasCoordinates(
  canvas: HTMLCanvasElement,
  event: PointerEvent
): Vector2 {
  const rect = canvas.getBoundingClientRect();

  return {
    x: (event.clientX - rect.left) * (canvas.width / rect.width),
    y: (event.clientY - rect.top) * (canvas.height / rect.height),
  };
}

export function pointerWithinPlaySafeArea(
  board: Board,
  event: PointerEvent
): boolean {
  const { canvas } = board;
  const { x, y } = getCanvasCoordinates(canvas, event);

  return x >= TILE_WIDTH && y >= TILE_HEIGHT;
}
