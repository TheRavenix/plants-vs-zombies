import {
  BOARD_COLS,
  BOARD_ROWS,
  getCanvasCoordinates,
  TILE_HEIGHT,
  TILE_WIDTH,
  type Board,
} from "../board";
import { GameScene, setGameScene, type Game } from "../game";
import { drawButton, type Button } from "../helpers/canvas";

import type { Cleanup } from "../types/cleanup";
import type { Vector2 } from "../types/math";

export type MainMenu = {};

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

const buttons: Button<ButtonId>[] = [
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

export function createMainMenu(): MainMenu {
  return {};
}

export function startMainMenu(
  _mainMenu: MainMenu,
  board: Board,
  game: Game
): Cleanup {
  const { canvas } = board;

  function handlePointerDownEvent(e: PointerEvent) {
    const coords = getCanvasCoordinates(canvas, e);
    const button = getClickedButton(coords);

    if (button !== undefined) {
      handleButtonClick(button.id, game, board);
    }
  }

  canvas.addEventListener("pointerdown", handlePointerDownEvent);

  return () => {
    canvas.removeEventListener("pointerdown", handlePointerDownEvent);
  };
}

export function drawMainMenu(_mainMenu: MainMenu, board: Board) {
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
        SPRITE_HEIGHT
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
      button.font
    );
  }
}

function getClickedButton(coords: Vector2): Button<ButtonId> | undefined {
  return buttons.find(
    (button) =>
      coords.x >= button.x &&
      coords.x <= button.x + button.width &&
      coords.y >= button.y &&
      coords.y <= button.y + button.height
  );
}

function handleButtonClick(id: ButtonId, game: Game, board: Board) {
  switch (id) {
    case ButtonId.Play:
      setGameScene(game, GameScene.Level, board);
      break;

    case ButtonId.Settings:
      break;
  }
}
