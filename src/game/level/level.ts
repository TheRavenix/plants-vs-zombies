import {
  BOARD_COLS,
  BOARD_ROWS,
  BOARD_WIDTH,
  TILE_HEIGHT,
  TILE_WIDTH,
  type Board,
} from "../board";
import { drawButton, type Button } from "../helpers/canvas";
import {
  createLevelBlueprintManager,
  type LevelBlueprint,
} from "./level-blueprint-manager";
import { createLevelStore, type LevelStore } from "./level-store";
import { createLevelEventHandler } from "./level-event-handler";

import type { Cleanup } from "../types/cleanup";
import type { Drawable } from "../types/drawable";
import type { Updatable } from "../types/updatable";
import type { Zombie } from "../entities/zombies/types/zombie";
import type { Plant } from "../entities/plants/types/plant";
import type { Shot } from "../entities/shots/types/shot";
import type { GameContext } from "../game";

import levels from "./levels.json";

export interface Level extends Drawable, Updatable {
  readonly store: LevelStore;
  start(board: Board): Cleanup;
}

type Options = {
  gameContext: GameContext;
  board: Board;
};

const GRASS_IMAGE = new Image(TILE_WIDTH, TILE_HEIGHT);
const GRASS_2_IMAGE = new Image(TILE_WIDTH, TILE_HEIGHT);
const WALL_IMAGE = new Image(TILE_WIDTH, TILE_HEIGHT);

enum ButtonId {
  Menu = "MENU",
}

// enum ModalButtonId {
//   ExitToMap = "EXIT_TO_MAP",
//   Restart = "RESTART",
//   Resume = "RESUME",
//   Continue = "CONTINUE",
// }

const buttons: Button[] = [
  {
    id: ButtonId.Menu,
    x: BOARD_WIDTH - 75,
    y: TILE_HEIGHT / 4,
    width: 50,
    height: 50,
    text: "Menu",
    fill: {
      background: "#6e3112",
      stroke: "#95461b",
      text: "#ffffff",
    },
  },
];

GRASS_IMAGE.src = "./grass/Grass.png";
GRASS_2_IMAGE.src = "./grass/Grass_2.png";
WALL_IMAGE.src = "./wall/Wall.png";

export function createLevel(options: Options): Level {
  const { gameContext, board } = options;
  const store = createLevelStore();
  const { state, actions } = store;
  const blueprintManager = createLevelBlueprintManager({
    blueprint: levels[0] as LevelBlueprint,
    store,
  });
  const eventHandler = createLevelEventHandler({
    gameContext,
    buttons,
    store,
  });

  function draw(board: Board) {
    const { ctx } = board;

    if (ctx === null) {
      return;
    }

    for (let col = 0; col < BOARD_COLS; col++) {
      for (let row = 0; row < BOARD_ROWS; row++) {
        let img: HTMLImageElement;

        if (col === 0 || row === 0) {
          img = WALL_IMAGE;
        } else {
          img = (row + col) % 2 === 0 ? GRASS_IMAGE : GRASS_2_IMAGE;
        }

        ctx.drawImage(
          img,
          Math.round(col * TILE_WIDTH),
          Math.round(row * TILE_HEIGHT),
          TILE_WIDTH,
          TILE_HEIGHT,
        );
      }
    }
    for (const plant of state.plants) {
      plant.draw(board);
    }
    for (const zombie of state.zombies) {
      zombie.draw(board);
    }
    for (const shot of state.shots) {
      shot.draw(board);
    }
    for (const sun of state.suns) {
      sun.draw(board);
    }

    state.seedSlotManager.draw(board);

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

    if (state.rewardPacket !== null) {
      state.rewardPacket.draw(board);
    }
    if (state.activeModal !== null) {
      state.activeModal.draw(board);
    }
  }

  function update(deltaTime: number) {
    if (state.activeModal !== null) {
      state.activeModal.update(deltaTime);
    }

    if (state.isPaused) {
      return;
    }

    actions.setTime(state.time + deltaTime);
    blueprintManager.update(deltaTime);
    state.sunRechargeTimer.update(deltaTime);
    state.seedSlotManager.update(deltaTime);

    for (const zombie of state.zombies) {
      zombie.update(deltaTime);
    }
    for (const plant of state.plants) {
      plant.update(deltaTime);
    }
    for (const shot of state.shots) {
      shot.update(deltaTime);
    }
    for (const sun of state.suns) {
      sun.update(deltaTime);
    }

    // TODO: Find a better way to write these
    // I mean this is updating the arrays on every frame so it's expensive
    actions.setPlants(removeDeadPlants(state.plants));
    actions.setZombies(removeDeadZombies(state.zombies));
    actions.setShots(removeOutOfZoneShots(state.shots, board));
    actions.setShots(removeInactiveShots(state.shots));

    if (state.rewardPacket !== null) {
      state.rewardPacket.update(deltaTime);
    }
    if (state.activeModal !== null) {
      actions.setIsPaused(true);
    }

    // FOR TESTING ONLY
    // FIXME: Remove Dangerous Code
    actions.setGameOver(
      state.zombies.some((zombie) => zombie.position.x < TILE_WIDTH),
    );
  }

  function start(board: Board) {
    const { ctx } = board;

    if (ctx !== null) {
      ctx.imageSmoothingEnabled = false;
    }

    blueprintManager.start();
    const eventHandlerCleanup = eventHandler.start(board);

    return () => {
      eventHandlerCleanup();
    };
  }

  return {
    get store() {
      return store;
    },
    draw,
    update,
    start,
  };
}

function removeDeadPlants(plants: Plant[]): Plant[] {
  return plants.filter((plant) => !plant.health.isDead());
}

function removeDeadZombies(zombies: Zombie[]): Zombie[] {
  return zombies.filter((zombie) => !zombie.health.isDead());
}

function removeOutOfZoneShots(shots: Shot[], board: Board): Shot[] {
  const { canvas } = board;

  return shots.filter((shot) => {
    return (
      shot.position.x - TILE_WIDTH < canvas.width &&
      shot.position.y - TILE_HEIGHT < canvas.height &&
      shot.position.y + TILE_HEIGHT > 0
    );
  });
}

function removeInactiveShots(shots: Shot[]): Shot[] {
  return shots.filter((shot) => shot.active);
}
