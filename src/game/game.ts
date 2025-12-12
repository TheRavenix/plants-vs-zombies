import {
  BOARD_COLS,
  BOARD_HEIGHT,
  BOARD_ROWS,
  BOARD_WIDTH,
  TILE_HEIGHT,
  TILE_WIDTH,
  type Board,
} from "./board";
import {
  createFlagZombie,
  createNormalZombie,
  createZombieManager,
  type ZombieManager,
} from "./entities/zombies";
import {
  createPeashooter,
  createPlantManager,
  createRepeater,
  createSunflower,
  type PlantManager,
} from "./entities/plants";
import { createShotManager, type ShotManager } from "./entities/shots";

type Game = {
  lastTime: number;
  sun: number;
  zombieManager: ZombieManager;
  plantManager: PlantManager;
  shotManager: ShotManager;
  start(game: Game, board: Board): void;
};

function createGame(): Game {
  const zombieManager = createZombieManager();
  const plantManager = createPlantManager();
  const shotManager = createShotManager();

  zombieManager.addZombies(
    createNormalZombie({
      x: TILE_WIDTH * (BOARD_ROWS - 1),
      y: TILE_HEIGHT * 2,
    }),
    createNormalZombie({
      x: TILE_WIDTH * (BOARD_ROWS + 1),
      y: TILE_HEIGHT * 2,
    }),
    createNormalZombie({
      x: TILE_WIDTH * 4,
      y: 0,
    }),
    createFlagZombie({
      x: TILE_WIDTH * (BOARD_ROWS - 1),
      y: TILE_HEIGHT * (BOARD_COLS - 1),
    })
  );
  plantManager.addPlants(
    createSunflower({
      x: 0,
      y: 0,
    }),
    createSunflower({
      x: TILE_WIDTH,
      y: 0,
    }),
    createSunflower({
      x: TILE_WIDTH * 2,
      y: 0,
    }),
    createPeashooter({
      x: 0,
      y: TILE_HEIGHT * 2,
    }),
    createPeashooter({
      x: TILE_WIDTH,
      y: TILE_HEIGHT * 2,
    }),
    createRepeater({
      x: 0,
      y: TILE_HEIGHT * (BOARD_COLS - 1),
    })
  );

  return {
    lastTime: 0,
    sun: 0,
    zombieManager,
    plantManager,
    shotManager,
    start,
  };
}

function start(game: Game, board: Board) {
  requestAnimationFrame((currentTime) => animate(currentTime, game, board));
}

function draw(game: Game, board: Board) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

  board.drawTileStroke(board);

  ctx.fillStyle = "#ffffff";
  ctx.fillText(
    `SUN: ${game.sun}`,
    BOARD_WIDTH - TILE_WIDTH / 2,
    TILE_HEIGHT / 2
  );

  for (const zombie of game.zombieManager.zombies) {
    zombie.draw({
      state: zombie.state,
      board,
    });
  }
  for (const plant of game.plantManager.plants) {
    plant.draw({
      state: plant.state,
      board,
    });
  }
  for (const shot of game.shotManager.shots) {
    shot.draw({
      state: shot.state,
      board,
    });
  }
}

function update(deltaTime: number, game: Game) {
  for (const zombie of game.zombieManager.zombies) {
    zombie.update({
      deltaTime,
      state: zombie.state,
      game,
    });
  }
  for (const plant of game.plantManager.plants) {
    plant.update({
      deltaTime: deltaTime,
      state: plant.state,
      game,
    });
  }
  for (const shot of game.shotManager.shots) {
    shot.update({
      deltaTime: deltaTime,
      state: shot.state,
      game,
    });
  }
}

function animate(currentTime: number, game: Game, board: Board) {
  const deltaTime = currentTime - game.lastTime;

  game.lastTime = currentTime;

  draw(game, board);
  update(deltaTime, game);

  requestAnimationFrame((newCurrentTime) =>
    animate(newCurrentTime, game, board)
  );
}

export { createGame };
export type { Game };
