type Board = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
};

type CreateBoardOptions = {
  root?: Element | null;
  center?: boolean;
};

const BOARD_BACKGROUND = "#212121";
const TILE_WIDTH = 96;
const TILE_HEIGHT = 96;
const BOARD_ROWS = 10;
const BOARD_COLS = 5;
const BOARD_WIDTH = BOARD_ROWS * TILE_WIDTH;
const BOARD_HEIGHT = BOARD_COLS * TILE_HEIGHT;

function createBoard(options?: CreateBoardOptions): Board {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = BOARD_WIDTH;
  canvas.height = BOARD_HEIGHT;
  canvas.style.backgroundColor = BOARD_BACKGROUND;

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

  return {
    canvas,
    ctx,
  };
}

function drawTileStroke(board: Board) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      ctx.strokeRect(
        row * TILE_WIDTH,
        col * TILE_HEIGHT,
        TILE_WIDTH,
        TILE_HEIGHT
      );
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
    }
  }
}

const boardActions = {
  createBoard,
  drawTileStroke,
} as const;

export {
  boardActions,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  BOARD_ROWS,
  BOARD_COLS,
  TILE_WIDTH,
  TILE_HEIGHT,
};
export type { Board };
