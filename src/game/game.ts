import {
  BOARD_ROWS,
  drawBoard,
  getCanvasCoordinates,
  pointerWithinPlaySafeArea,
  TILE_HEIGHT,
  TILE_WIDTH,
  type Board,
} from "./board";
import {
  addZombies,
  createNormalZombie,
  drawZombie,
  removeOutOfHealthZombies,
  updateZombie,
  type Zombie,
} from "./entities/zombies";
import {
  addPlant,
  createPlant,
  drawPlant,
  PlantInfo,
  removeOutOfHealthPlants,
  updatePlant,
  type Plant,
} from "./entities/plants";
import {
  drawShot,
  removeOutOfZoneShots,
  updateShot,
  type Shot,
} from "./entities/shots";
import {
  createSeedSlotManager,
  drawSeedSlotManager,
  findSeedSlotWithinCoordinateX,
  pointerWithinSeedSlot,
  updateSeedSlotManager,
  type SeedSlotManager,
} from "./seed/seed-slot-manager";
import { closestLowerValue } from "@/utils/math";
import {
  addSun,
  collectSun,
  createSun,
  drawSun,
  findSunWithinCoordinates,
  updateSun,
  type Sun,
} from "./entities/sun";

export type Game = {
  lastTime: number;
  sunAmount: number;
  zombies: Zombie[];
  plants: Plant[];
  shots: Shot[];
  suns: Sun[];
  seedSlotManager: SeedSlotManager;
  sunRechargeTimer: number;
};

const DEFAULT_SUN_AMOUNT = 100;
const SUN_PRODUCTION = 25;
const SUN_RECHARGE_INTERVAL = 1000 * 24;

export function createGame(): Game {
  let zombies: Zombie[] = [];
  let plants: Plant[] = [];
  let shots: Shot[] = [];
  let suns: Sun[] = [];
  const seedSlotManager = createSeedSlotManager();

  zombies = addZombies(
    zombies,
    createNormalZombie({
      x: TILE_WIDTH * (BOARD_ROWS - 1),
      y: TILE_HEIGHT * 3,
    })
  );

  return {
    lastTime: 0,
    sunAmount: DEFAULT_SUN_AMOUNT,
    zombies,
    plants,
    shots,
    suns,
    seedSlotManager,
    sunRechargeTimer: 0,
  };
}

export function startGame(game: Game, board: Board) {
  const { canvas, ctx } = board;

  if (ctx !== null) {
    ctx.imageSmoothingEnabled = false;
  }

  canvas.addEventListener("pointerdown", (e) => {
    const { x, y } = getCanvasCoordinates(canvas, e);

    if (game.suns.length > 0) {
      if (pointerWithinPlaySafeArea(board, e)) {
        const toCollectSun = findSunWithinCoordinates(game.suns, x, y);

        if (toCollectSun !== undefined) {
          collectSun(toCollectSun, game);
          return;
        }
      }
    }
    if (pointerWithinSeedSlot(game.seedSlotManager, board, e)) {
      // FIXME: This logic is problematic
      const selectedSlotId = game.seedSlotManager.selectedSlot?.id;
      const seedSlot = findSeedSlotWithinCoordinateX(game.seedSlotManager, x);

      if (seedSlot === undefined) {
        return;
      }

      game.seedSlotManager.selectedSlot =
        seedSlot.id === selectedSlotId ? null : seedSlot;
    }
    if (game.seedSlotManager.selectedSlot !== null) {
      const withinPlaySafeArea = pointerWithinPlaySafeArea(board, e);

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

      if (game.sunAmount < plantCost) {
        return;
      }

      const plant = createPlant(plantType, closestX, closestY, game);

      if (plant !== null) {
        game.plants = addPlant(game.plants, plant);
      }

      game.seedSlotManager.selectedSlot.packet.cooldownTimerPaused = false;
      game.seedSlotManager.selectedSlot = null;
      game.sunAmount -= plantCost;
    }
  });

  requestAnimationFrame((currentTime) => animateGame(game, currentTime, board));
}

function drawGame(game: Game, board: Board) {
  const { canvas, ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBoard(board);

  for (const plant of game.plants) {
    drawPlant(plant, {
      board,
    });
  }
  for (const zombie of game.zombies) {
    drawZombie(zombie, {
      board,
    });
  }
  for (const shot of game.shots) {
    drawShot(shot, {
      board,
    });
  }
  for (const sun of game.suns) {
    drawSun(sun, board);
  }

  drawSeedSlotManager(game.seedSlotManager, board, game);
}

function updateGame(game: Game, deltaTime: number, board: Board) {
  updateSeedSlotManager(game.seedSlotManager, deltaTime, game);

  for (const zombie of game.zombies) {
    updateZombie(zombie, {
      deltaTime,
      game,
    });
  }
  for (const plant of game.plants) {
    updatePlant(plant, {
      deltaTime,
      game,
    });
  }
  for (const shot of game.shots) {
    updateShot(shot, {
      deltaTime,
      game,
    });
  }
  for (const sun of game.suns) {
    updateSun(sun, deltaTime);
  }

  game.zombies = removeOutOfHealthZombies(game.zombies);
  game.plants = removeOutOfHealthPlants(game.plants);
  game.shots = removeOutOfZoneShots(game.shots, board);

  game.sunRechargeTimer += deltaTime;

  if (game.sunRechargeTimer >= SUN_RECHARGE_INTERVAL) {
    game.suns = addSun(
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

function animateGame(game: Game, currentTime: number, board: Board) {
  const deltaTime = currentTime - game.lastTime;

  game.lastTime = currentTime;

  drawGame(game, board);
  updateGame(game, deltaTime, board);

  requestAnimationFrame((newCurrentTime) =>
    animateGame(game, newCurrentTime, board)
  );
}
