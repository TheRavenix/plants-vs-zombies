import {
  BOARD_COLS,
  BOARD_ROWS,
  TILE_HEIGHT,
  TILE_WIDTH,
  type Board,
} from "../board";
import { GameScene, type GameContext } from "../game";
import { drawButton, isPointInRect, type Button } from "../helpers/canvas";

import type { Cleanup } from "../types/cleanup";
import type { Vector2 } from "../types/math";
import type { Drawable } from "../types/drawable";

export interface MainMenu extends Drawable {
  start(board: Board): Cleanup;
}

type Options = {
  ctx: GameContext;
};

const SPRITE_WIDTH = TILE_WIDTH;
const SPRITE_HEIGHT = TILE_HEIGHT;
const ZOMBIE_SYMBOL_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);
const PLANT_SYMBOL_IMAGE = new Image(SPRITE_WIDTH, SPRITE_HEIGHT);
const BUTTON_WIDTH = 150;
const BUTTON_HEIGHT = 60;

enum ButtonId {
  Play = "PLAY",
  Settings = "SETTINGS",
}

const buttons: Button[] = [
  {
    id: ButtonId.Play,
    x: 50,
    y: 50,
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    text: "Play",
    fill: {
      background: "#6e3112",
      stroke: "#95461b",
      text: "#ffffff",
    },
  },
  {
    id: ButtonId.Settings,
    x: 250,
    y: 250,
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    text: "Settings",
    fill: {
      background: "#6e3112",
      stroke: "#95461b",
      text: "#ffffff",
    },
  },
];

ZOMBIE_SYMBOL_IMAGE.src = "./zombie-symbol/Zombie_Symbol.png";
PLANT_SYMBOL_IMAGE.src = "./plant-symbol/Plant_Symbol.png";

export function createMainMenu(options: Options): MainMenu {
  const { ctx } = options;

  function draw(board: Board) {
    const { ctx } = board;

    if (ctx === null) {
      return;
    }

    for (let col = 0; col < BOARD_COLS; col++) {
      for (let row = 0; row < BOARD_ROWS; row++) {
        const img =
          (row + col) % 2 === 0 ? ZOMBIE_SYMBOL_IMAGE : PLANT_SYMBOL_IMAGE;

        ctx.drawImage(
          img,
          Math.round(col * SPRITE_WIDTH),
          Math.round(row * SPRITE_HEIGHT),
          SPRITE_WIDTH,
          SPRITE_HEIGHT,
        );
      }
    }
    for (const button of buttons) {
      drawButton(
        board,
        button.text,
        button.x,
        button.y,
        button.width,
        button.height,
        button.fill,
        button.font,
      );
    }
  }

  function start(board: Board) {
    const { canvas } = board;

    function handlePointerDownEvent(e: PointerEvent) {
      const coords = board.getCanvasCoordinates(e);
      const button = getClickedButton(coords);

      if (button !== undefined) {
        handleButtonClick(button.id, ctx);
      }
    }

    canvas.addEventListener("pointerdown", handlePointerDownEvent);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDownEvent);
    };
  }

  return {
    draw,
    start,
  };
}

function getClickedButton(coords: Vector2): Button | undefined {
  return buttons.find((button) => isPointInRect(coords, button));
}

function handleButtonClick(id: string, ctx: GameContext) {
  switch (id) {
    case ButtonId.Play:
      ctx.setScene(GameScene.Level);
      break;

    case ButtonId.Settings:
      break;
  }
}
