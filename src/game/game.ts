import {
  BOARD_COLS,
  BOARD_HEIGHT,
  BOARD_ROWS,
  BOARD_WIDTH,
  boardActions,
  TILE_HEIGHT,
  TILE_WIDTH,
  type Board,
} from "./board";
import {
  createFlagZombie,
  createNormalZombie,
  zombieActions,
  type Zombie,
} from "./entities/zombies";
import {
  createPeashooter,
  createSunflower,
  createThreepeater,
  plantActions,
  type Plant,
} from "./entities/plants";
import { shotActions, type Shot } from "./entities/shots";

type Game = {
  lastTime: number;
  sun: number;
  zombies: Zombie[];
  plants: Plant[];
  shots: Shot[];
};

const gameActions = {
  createGame,
  startGame,
} as const;

function createGame(): Game {
  let zombies: Zombie[] = [];
  let plants: Plant[] = [];
  let shots: Shot[] = [];

  zombies = zombieActions.addZombies(
    zombies,
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
  plants = plantActions.addPlants(
    plants,
    createThreepeater({
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
    createThreepeater({
      x: TILE_WIDTH,
      y: TILE_HEIGHT * 2,
    }),
    createThreepeater({
      x: 0,
      y: TILE_HEIGHT * (BOARD_COLS - 1),
    })
  );

  return {
    lastTime: 0,
    sun: 0,
    zombies,
    plants,
    shots,
  };
}

function startGame(game: Game, board: Board) {
  requestAnimationFrame((currentTime) => animate(currentTime, game, board));
}

function draw(game: Game, board: Board) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

  boardActions.drawTileStroke(board);

  ctx.fillStyle = "#ffffff";
  ctx.fillText(
    `SUN: ${game.sun}`,
    BOARD_WIDTH - TILE_WIDTH / 2,
    TILE_HEIGHT / 2
  );

  for (const zombie of game.zombies) {
    zombieActions.drawZombie(zombie, {
      board,
    });
  }
  for (const plant of game.plants) {
    plantActions.drawPlant(plant, {
      board,
    });
  }
  for (const shot of game.shots) {
    shotActions.drawShot(shot, {
      board,
    });
  }
}

function update(deltaTime: number, game: Game) {
  for (const zombie of game.zombies) {
    zombieActions.updateZombie(zombie, {
      deltaTime,
      game,
    });
  }
  for (const plant of game.plants) {
    plantActions.updatePlant(plant, {
      deltaTime,
      game,
    });
  }
  for (const shot of game.shots) {
    shotActions.updateShot(shot, {
      deltaTime,
      game,
    });
  }

  game.zombies = zombieActions.removeOutOfHealthZombies(game.zombies);
  game.plants = plantActions.removeOutOfToughnessPlants(game.plants);
  game.shots = shotActions.removeOutOfZoneShots(game.shots);
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

export { gameActions };
export type { Game };
