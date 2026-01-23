import { createLevel, type Level } from "./level";
import { createMainMenu, type MainMenu } from "./main-menu";

import type { Board } from "./board";
import type { Cleanup } from "./types/cleanup";
import type { Startable } from "./types/startable";

export interface Game extends Startable {
  readonly lastTime: number;
  readonly mainMenu: MainMenu;
  readonly level: Level;
  readonly scene: GameScene;
  activeCleanup: Cleanup | null;
  setScene(scene: GameScene): void;
}

export interface GameContext {
  setScene(scene: GameScene): void;
}

type Options = {
  board: Board;
};

export enum GameScene {
  MainMenu = "MAIN_MENU",
  Level = "LEVEL",
}

export function createGame(options: Options): Game {
  const { board } = options;
  let lastTime = 0;
  let scene = GameScene.Level;
  let activeCleanup: Cleanup | null = null;

  const gameContext: GameContext = {
    setScene,
  };

  const level = createLevel({ gameContext, board });
  const mainMenu = createMainMenu({
    ctx: gameContext,
  });

  function draw(board: Board) {
    const { canvas, ctx } = board;

    if (ctx === null) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (scene) {
      case GameScene.MainMenu:
        mainMenu.draw(board);
        break;

      case GameScene.Level:
        level.draw(board);
        break;
    }
  }

  function update(deltaTime: number) {
    switch (scene) {
      case GameScene.MainMenu:
        break;

      case GameScene.Level:
        level.update(deltaTime);
        break;
    }
  }

  function animate(currentTime: number) {
    const deltaTime = currentTime - lastTime;

    lastTime = currentTime;

    draw(board);
    update(deltaTime);

    requestAnimationFrame((newCurrentTime) => animate(newCurrentTime));
  }

  function startScene() {
    if (activeCleanup !== null) {
      activeCleanup();
    }

    switch (scene) {
      case GameScene.MainMenu:
        activeCleanup = mainMenu.start(board);
        break;

      case GameScene.Level:
        activeCleanup = level.start(board);
        break;
    }
  }

  function start() {
    const { ctx } = board;

    if (ctx !== null) {
      ctx.imageSmoothingEnabled = false;
    }

    startScene();

    requestAnimationFrame((currentTime) => animate(currentTime));
  }

  function setScene(newScene: GameScene) {
    scene = newScene;

    startScene();
  }

  return {
    get lastTime() {
      return lastTime;
    },
    get mainMenu() {
      return mainMenu;
    },
    get level() {
      return level;
    },
    get scene() {
      return scene;
    },
    get activeCleanup() {
      return activeCleanup;
    },
    start,
    setScene,
  };
}
