import {
  createLevel,
  createLevelBlueprintManager,
  drawLevel,
  startLevel,
  startLevelBlueprintManager,
  updateLevel,
  updateLevelBlueprintManager,
  type Level,
  type LevelBlueprint,
} from "./level";
import {
  createMainMenu,
  drawMainMenu,
  startMainMenu,
  type MainMenu,
} from "./main-menu";

import type { Board } from "./board";
import type { Cleanup } from "./types/cleanup";

import levels from "./level/levels.json";

export type Game = {
  lastTime: number;
  mainMenu: MainMenu;
  level: Level;
  scene: GameScene;
  activeCleanup: Cleanup | null;
};

export enum GameScene {
  MainMenu = "MAIN_MENU",
  Level = "LEVEL",
}

export function createGame(): Game {
  const mainMenu = createMainMenu();
  const levelBlueprintManager = createLevelBlueprintManager({
    levelBlueprint: levels[0] as LevelBlueprint,
  });
  const level = createLevel({ levelBlueprintManager });

  return {
    lastTime: 0,
    mainMenu,
    level,
    scene: GameScene.Level,
    activeCleanup: null,
  };
}

export function startGame(game: Game, board: Board) {
  const { ctx } = board;

  if (ctx !== null) {
    ctx.imageSmoothingEnabled = false;
  }

  startScene(game, board);

  requestAnimationFrame((currentTime) => animateGame(game, currentTime, board));
}

function drawGame(game: Game, board: Board) {
  const { canvas, ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  switch (game.scene) {
    case GameScene.MainMenu:
      drawMainMenu(game.mainMenu, board);
      break;

    case GameScene.Level:
      drawLevel(game.level, board);
      break;
  }
}

function updateGame(game: Game, deltaTime: number, board: Board) {
  switch (game.scene) {
    case GameScene.MainMenu:
      break;

    case GameScene.Level:
      updateLevel(game.level, deltaTime, board);
      updateLevelBlueprintManager(
        game.level.levelBlueprintManager,
        deltaTime,
        game.level
      );
      break;
  }
}

function animateGame(game: Game, currentTime: number, board: Board) {
  const deltaTime = currentTime - game.lastTime;

  game.lastTime = currentTime;

  drawGame(game, board);
  updateGame(game, deltaTime, board);

  requestAnimationFrame((newCurrentTime) =>
    animateGame(game, newCurrentTime, board)
  );
}

function startScene(game: Game, board: Board) {
  if (game.activeCleanup !== null) {
    game.activeCleanup();
  }

  switch (game.scene) {
    case GameScene.MainMenu:
      game.activeCleanup = startMainMenu(game.mainMenu, board, game);
      break;

    case GameScene.Level:
      game.activeCleanup = startLevel(game.level, board, game);
      startLevelBlueprintManager(game.level.levelBlueprintManager, game.level);
      break;
  }
}

export function setGameScene(game: Game, scene: GameScene, board: Board) {
  game.scene = scene;

  startScene(game, board);
}
