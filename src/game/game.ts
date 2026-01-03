import {
  BOARD_ROWS,
  boardActions,
  TILE_HEIGHT,
  TILE_WIDTH,
  type Board,
} from "./board";
import {
  createNormalZombie,
  zombieActions,
  type Zombie,
} from "./entities/zombies";
import { plantActions, PlantInfo, type Plant } from "./entities/plants";
import { shotActions, type Shot } from "./entities/shots";
import {
  seedSlotManagerActions,
  type SeedSlotManager,
} from "./seed/seed-slot-manager";

import { closestLowerValue } from "@/utils/math";
import {
  createSun,
  drawSun,
  sunActions,
  updateSun,
  type Sun,
} from "./entities/sun";

type Game = {
  lastTime: number;
  sun: number;
  zombies: Zombie[];
  plants: Plant[];
  shots: Shot[];
  suns: Sun[];
  seedSlotManager: SeedSlotManager;
  sunRechargeTimer: number;
};

const DEFAULT_SUN = 100;
const SUN_PRODUCTION = 25;
const SUN_RECHARGE_INTERVAL = 1000 * 24;

function createGame(): Game {
  let zombies: Zombie[] = [];
  let plants: Plant[] = [];
  let shots: Shot[] = [];
  let suns: Sun[] = [];
  const seedSlotManager = seedSlotManagerActions.createSeedSlotManager();

  zombies = zombieActions.addZombies(
    zombies,
    createNormalZombie({
      x: TILE_WIDTH * (BOARD_ROWS - 1),
      y: TILE_HEIGHT * 3,
    })
  );

  return {
    lastTime: 0,
    sun: DEFAULT_SUN,
    zombies,
    plants,
    shots,
    suns,
    seedSlotManager,
    sunRechargeTimer: 0,
  };
}

function startGame(game: Game, board: Board) {
  const { canvas, ctx } = board;

  if (ctx !== null) {
    ctx.imageSmoothingEnabled = false;
  }

  canvas.addEventListener("pointerdown", (e) => {
    const { x, y } = boardActions.getCanvasCoordinates(canvas, e);

    if (game.suns.length > 0) {
      if (boardActions.pointerWithinPlaySafeArea(board, e)) {
        const toCollectSun = sunActions.findSunWithinCoordinates(
          game.suns,
          x,
          y
        );

        if (toCollectSun !== undefined) {
          sunActions.collectSun(toCollectSun, game);
        }
      }
    }
    if (
      seedSlotManagerActions.pointerWithinSeedSlot(
        game.seedSlotManager,
        board,
        e
      )
    ) {
      // FIXME: This logic is problematic
      const selectedSlotId = game.seedSlotManager.selectedSlot?.id;
      const seedSlot = seedSlotManagerActions.findSeedSlotWithinCoordinateX(
        game.seedSlotManager,
        x
      );

      if (seedSlot === undefined) {
        return;
      }

      game.seedSlotManager.selectedSlot =
        seedSlot.id === selectedSlotId ? null : seedSlot;
    }
    if (game.seedSlotManager.selectedSlot !== null) {
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
      const closestPlant = game.plants.find((plant) => {
        return (
          plant.x >= closestX &&
          plant.x <= closestX + TILE_WIDTH &&
          plant.y >= closestY &&
          plant.y <= closestY + TILE_HEIGHT
        );
      });

      if (closestPlant !== undefined) {
        return;
      }

      const plantType = game.seedSlotManager.selectedSlot.packet.plantType;
      const plantCost = PlantInfo[plantType].SunCost;

      if (game.sun < plantCost) {
        return;
      }

      const plant = plantActions.createPlant(
        plantType,
        closestX,
        closestY,
        game
      );

      if (plant !== null) {
        game.plants = plantActions.addPlant(game.plants, plant);
      }

      game.seedSlotManager.selectedSlot.packet.cooldownTimerPaused = false;
      game.seedSlotManager.selectedSlot = null;
      game.sun -= plantCost;
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
  for (const sun of game.suns) {
    drawSun(sun, board);
  }

  seedSlotManagerActions.drawSeedSlotManager(game.seedSlotManager, board, game);
}

function update(deltaTime: number, game: Game, board: Board) {
  seedSlotManagerActions.updateSeedSlotManager(
    game.seedSlotManager,
    deltaTime,
    game
  );

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
  for (const sun of game.suns) {
    updateSun(sun, deltaTime);
  }

  game.zombies = zombieActions.removeOutOfHealthZombies(game.zombies);
  game.plants = plantActions.removeOutOfToughnessPlants(game.plants);
  game.shots = shotActions.removeOutOfZoneShots(game.shots, board);

  game.sunRechargeTimer += deltaTime;

  if (game.sunRechargeTimer >= SUN_RECHARGE_INTERVAL) {
    game.suns = sunActions.addSun(
      game.suns,
      createSun({
        x: TILE_WIDTH,
        y: TILE_HEIGHT,
        amount: SUN_PRODUCTION,
      })
    );
    game.sunRechargeTimer = 0;
  }
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
