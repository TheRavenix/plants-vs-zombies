import type { Vector2 } from "../types/math";

type TilePosition = Vector2;

export interface Board {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D | null;
  readonly tilePosList: TilePosition[];
  getCanvasCoordinates(event: PointerEvent): Vector2;
  isPointerInPlaySafeArea(event: PointerEvent): boolean;
}

type Options = {
  root?: Element | null;
  center?: boolean;
};

export const TILE_WIDTH = 96;
export const TILE_HEIGHT = 96;
export const BOARD_ROWS = 6;
export const BOARD_COLS = 10;
export const BOARD_WIDTH = BOARD_COLS * TILE_WIDTH;
export const BOARD_HEIGHT = BOARD_ROWS * TILE_HEIGHT;

export function createBoard(options?: Options): Board {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const tilePosList: TilePosition[] = [];
  const pixelifyFont = new FontFace(
    "Pixelify",
    "url(https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap)",
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

  for (let col = 0; col < BOARD_COLS; col++) {
    for (let row = 0; row < BOARD_ROWS; row++) {
      tilePosList.push({
        x: col * TILE_WIDTH,
        y: row * TILE_HEIGHT,
      });
    }
  }

  function getCanvasCoordinates(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect();

    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function isPointerInPlaySafeArea(event: PointerEvent) {
    const { x, y } = getCanvasCoordinates(event);

    return x >= TILE_WIDTH && y >= TILE_HEIGHT;
  }

  return {
    get canvas() {
      return canvas;
    },
    get ctx() {
      return ctx;
    },
    get tilePosList() {
      return tilePosList;
    },
    getCanvasCoordinates,
    isPointerInPlaySafeArea,
  };
}
