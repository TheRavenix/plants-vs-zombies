import {
  BOARD_COLS,
  BOARD_ROWS,
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
import { plantActions, type Plant } from "./entities/plants";
import { shotActions, type Shot } from "./entities/shots";
import {
  SEED_PACKET_DEFAULT_Y,
  seedSlotContainerActions,
  type SeedSlotContainer,
} from "./seed-slot-container";

import { closestLowerValue } from "@/utils/math";

type Game = {
  lastTime: number;
  sun: number;
  zombies: Zombie[];
  plants: Plant[];
  shots: Shot[];
  seedSlotContainer: SeedSlotContainer;
};

function createGame(): Game {
  let zombies: Zombie[] = [];
  let plants: Plant[] = [];
  let shots: Shot[] = [];
  const seedSlotContainer = seedSlotContainerActions.createSeedSlotContainer();

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
      x: TILE_WIDTH * (BOARD_ROWS - 1),
      y: TILE_HEIGHT,
    }),
    createFlagZombie({
      x: TILE_WIDTH * (BOARD_ROWS - 1),
      y: TILE_HEIGHT * (BOARD_COLS - 1),
    })
  );

  return {
    lastTime: 0,
    sun: 0,
    zombies,
    plants,
    shots,
    seedSlotContainer,
  };
}

function startGame(game: Game, board: Board) {
  const { canvas, ctx } = board;

  if (ctx !== null) {
    ctx.imageSmoothingEnabled = false;
  }

  game.seedSlotContainer.game = game;

  canvas.addEventListener("pointerdown", (e) => {
    const { x, y } = boardActions.getCanvasCoordinates(canvas, e);

    if (game.seedSlotContainer.activeSlot !== null) {
      if (x >= TILE_WIDTH && y >= TILE_HEIGHT) {
        const closestX = closestLowerValue(
          x,
          board.tilePosList.map((tilePos) => tilePos.x)
        );
        const closestY = closestLowerValue(
          y,
          board.tilePosList.map((tilePos) => tilePos.y)
        );

        const plantExist = game.plants.find((plant) => {
          return (
            plant.x >= closestX &&
            plant.x <= closestX + TILE_WIDTH &&
            plant.y >= closestY &&
            plant.y <= closestY + TILE_HEIGHT
          );
        });

        if (plantExist !== undefined) {
          return;
        }

        const plant = plantActions.createPlant(
          game.seedSlotContainer.activeSlot.packet.type,
          closestX,
          closestY
        );

        if (plant !== null) {
          game.plants = plantActions.addPlant(game.plants, plant);
        }

        game.seedSlotContainer.activeSlot = null;
        game.seedSlotContainer.slots.forEach((slot2) => {
          slot2.packet.y = SEED_PACKET_DEFAULT_Y;
        });
      }
    }
    if (seedSlotContainerActions.x(game.seedSlotContainer, board, e)) {
      game.seedSlotContainer.slots.forEach((slot) => {
        if (x >= slot.x && x <= slot.x + slot.width) {
          game.seedSlotContainer.slots.forEach((slot2) => {
            slot2.packet.y = SEED_PACKET_DEFAULT_Y;
          });

          game.seedSlotContainer.activeSlot = slot;
          game.seedSlotContainer.activeSlot.packet.y -= 4;
        }
      });
    }
  });

  requestAnimationFrame((currentTime) => animate(currentTime, game, board));
}

function draw(game: Game, board: Board) {
  const { canvas, ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  boardActions.drawBoardGraphics(board);

  for (const plant of game.plants) {
    plantActions.drawPlant(plant, {
      board,
    });
  }
  for (const zombie of game.zombies) {
    zombieActions.drawZombie(zombie, {
      board,
    });
  }
  for (const shot of game.shots) {
    shotActions.drawShot(shot, {
      board,
    });
  }

  seedSlotContainerActions.drawSeedSlotContainer(game.seedSlotContainer, board);
}

function update(deltaTime: number, game: Game, board: Board) {
  seedSlotContainerActions.updateSeedSlotContainer(game.seedSlotContainer);

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
  game.shots = shotActions.removeOutOfZoneShots(game.shots, board);
}

function animate(currentTime: number, game: Game, board: Board) {
  const deltaTime = currentTime - game.lastTime;

  game.lastTime = currentTime;

  draw(game, board);
  update(deltaTime, game, board);

  requestAnimationFrame((newCurrentTime) =>
    animate(newCurrentTime, game, board)
  );
}

const gameActions = {
  createGame,
  startGame,
} as const;

export { gameActions };
export type { Game };
