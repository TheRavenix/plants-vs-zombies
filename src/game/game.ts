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
    createFlagZombie({
      x: TILE_WIDTH * (BOARD_ROWS - 1),
      y: TILE_HEIGHT,
    }),
    createFlagZombie({
      x: TILE_WIDTH * (BOARD_ROWS - 2),
      y: TILE_HEIGHT * 2,
    }),
    createFlagZombie({
      x: TILE_WIDTH * (BOARD_ROWS - 1),
      y: TILE_HEIGHT * 3,
    }),
    createNormalZombie({
      x: TILE_WIDTH * (BOARD_ROWS - 1),
      y: TILE_HEIGHT * 2,
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

    if (
      seedSlotContainerActions.pointerWithinSeedSlot(
        game.seedSlotContainer,
        board,
        e
      )
    ) {
      const activeSlotId = game.seedSlotContainer.activeSlot?.id;
      const seedSlot = game.seedSlotContainer.slots.find((slot) => {
        return x >= slot.packet.x && x <= slot.packet.x + slot.packet.width;
      });

      if (seedSlot === undefined) {
        return;
      }

      game.seedSlotContainer.activeSlot =
        seedSlot.id === activeSlotId ? null : seedSlot;
    }
    if (game.seedSlotContainer.activeSlot !== null) {
      const withinPlaySafeArea = boardActions.pointerWithinPlaySafeArea(
        board,
        e
      );

      if (!withinPlaySafeArea) {
        return;
      }

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
