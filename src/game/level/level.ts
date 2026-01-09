import {
  BOARD_COLS,
  BOARD_ROWS,
  BOARD_WIDTH,
  getCanvasCoordinates,
  pointerWithinPlaySafeArea,
  TILE_HEIGHT,
  TILE_WIDTH,
  type Board,
} from "../board";
import {
  drawZombie,
  removeOutOfHealthZombies,
  updateZombie,
  type Zombie,
} from "../entities/zombies";
import {
  addPlant,
  createPlant,
  drawPlant,
  PlantInfo,
  removeOutOfHealthPlants,
  updatePlant,
  type Plant,
} from "../entities/plants";
import {
  drawShot,
  removeInactiveShots,
  removeOutOfZoneShots,
  updateShot,
  type Shot,
} from "../entities/shots";
import {
  createSeedSlotManager,
  drawSeedSlotManager,
  findSeedSlotWithinCoordinateX,
  pointerWithinSeedSlot,
  updateSeedSlotManager,
  type SeedSlotManager,
} from "../seed/seed-slot-manager";
import {
  addSun,
  collectSun,
  createSun,
  drawSun,
  findSunWithinCoordinates,
  updateSun,
  type Sun,
} from "../entities/sun";
import {
  drawSeedPacket,
  SeedPacketStatus,
  updateSeedPacket,
  type SeedPacket,
} from "../seed";
import { closestLowerValue } from "@/utils/math";
import { drawButton, type Button } from "../helpers/canvas";
import {
  createModal,
  drawModal,
  removeInactiveModals,
  updateModal,
  type Modal,
} from "../modal";

import type { Vector2 } from "../types/vector";
import type { Cleanup } from "../types/cleanup";
import type { LevelBlueprintManager } from "./level-blueprint-manager";
import type { Game } from "../game";

export type Level = {
  sunAmount: number;
  zombies: Zombie[];
  plants: Plant[];
  shots: Shot[];
  suns: Sun[];
  seedSlotManager: SeedSlotManager;
  sunRechargeTimer: number;
  levelBlueprintManager: LevelBlueprintManager;
  time: number;
  gameOver: boolean;
  rewardPacket: SeedPacket | null;
  modals: Modal[];
};

type CreateLevelOptions = {
  levelBlueprintManager: LevelBlueprintManager;
};

const DEFAULT_SUN_AMOUNT = 100;
const SUN_PRODUCTION = 25;
const SUN_RECHARGE_INTERVAL = 1000 * 24;
const GRASS_IMAGE = new Image(TILE_WIDTH, TILE_HEIGHT);
const GRASS_2_IMAGE = new Image(TILE_WIDTH, TILE_HEIGHT);
const WALL_IMAGE = new Image(TILE_WIDTH, TILE_HEIGHT);

enum ButtonId {
  Menu = "MENU",
}

const buttons: Button<ButtonId>[] = [
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

function hasActiveModals(level: Level): boolean {
  return level.modals.some((modal) => modal.active);
}

export function createLevel(options: CreateLevelOptions): Level {
  return {
    sunAmount: DEFAULT_SUN_AMOUNT,
    zombies: [],
    plants: [],
    shots: [],
    suns: [],
    seedSlotManager: createSeedSlotManager(),
    sunRechargeTimer: 0,
    time: 0,
    levelBlueprintManager: options.levelBlueprintManager,
    gameOver: false,
    rewardPacket: null,
    modals: [],
  };
}

export function startLevel(level: Level, board: Board, game: Game): Cleanup {
  const { canvas, ctx } = board;

  if (ctx !== null) {
    ctx.imageSmoothingEnabled = false;
  }

  function handlePointerDownEvent(e: PointerEvent) {
    const coords = getCanvasCoordinates(canvas, e);

    if (hasActiveModals(level)) {
      return;
    }
    if (!level.gameOver) {
      handleSunCollect(level, board, e, coords);
      handleSeedSlotSelect(level.seedSlotManager, board, e, coords);
      handlePlacePlant(level, board, e, coords);
    }

    const button = getClickedButton(coords);

    if (button !== undefined) {
      handleButtonClick(button.id, game);
    }
  }

  canvas.addEventListener("pointerdown", handlePointerDownEvent);

  return () => {
    canvas.removeEventListener("pointerdown", handlePointerDownEvent);
  };
}

export function drawLevel(level: Level, board: Board) {
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
        TILE_HEIGHT
      );
    }
  }
  for (const plant of level.plants) {
    drawPlant(plant, {
      board,
    });
  }
  for (const zombie of level.zombies) {
    drawZombie(zombie, {
      board,
    });
  }
  for (const shot of level.shots) {
    drawShot(shot, {
      board,
    });
  }
  for (const sun of level.suns) {
    drawSun(sun, board);
  }

  drawSeedSlotManager(level.seedSlotManager, board, level);

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

  if (level.rewardPacket !== null) {
    drawSeedPacket(level.rewardPacket, board);
  }

  for (const modal of level.modals) {
    drawModal(modal, board);
  }
}

export function updateLevel(level: Level, deltaTime: number, board: Board) {
  for (const modal of level.modals) {
    updateModal(modal, deltaTime);
  }

  level.modals = removeInactiveModals(level.modals);

  if (hasActiveModals(level)) {
    return;
  }

  level.time += deltaTime;

  updateSeedSlotManager(level.seedSlotManager, deltaTime, level);

  for (const zombie of level.zombies) {
    updateZombie(zombie, {
      deltaTime,
      level,
    });
  }
  for (const plant of level.plants) {
    updatePlant(plant, {
      deltaTime,
      level,
    });
  }
  for (const shot of level.shots) {
    updateShot(shot, {
      deltaTime,
      level,
    });
  }
  for (const sun of level.suns) {
    updateSun(sun, deltaTime);
  }

  level.zombies = removeOutOfHealthZombies(level.zombies);
  level.plants = removeOutOfHealthPlants(level.plants);
  level.shots = removeOutOfZoneShots(level.shots, board);
  level.shots = removeInactiveShots(level.shots);

  level.sunRechargeTimer += deltaTime;

  if (level.sunRechargeTimer >= SUN_RECHARGE_INTERVAL) {
    level.suns = addSun(
      level.suns,
      createSun({
        x: TILE_WIDTH,
        y: TILE_HEIGHT,
        amount: SUN_PRODUCTION,
      })
    );
    level.sunRechargeTimer = 0;
  }

  if (level.rewardPacket !== null) {
    updateSeedPacket(level.rewardPacket, deltaTime);
  }

  // FOR TESTING ONLY
  // TODO: Remove Dangerous Code
  level.gameOver = level.zombies.some((zombie) => zombie.x < TILE_WIDTH);
}

function handleSunCollect(
  level: Level,
  board: Board,
  e: PointerEvent,
  coords: Vector2
) {
  const { suns } = level;

  if (suns.length <= 0) {
    return;
  }
  if (!pointerWithinPlaySafeArea(board, e)) {
    return;
  }

  const toCollectSun = findSunWithinCoordinates(suns, coords.x, coords.y);

  if (toCollectSun === undefined) {
    return;
  }

  collectSun(toCollectSun, level);
}

function handleSeedSlotSelect(
  seedSlotManager: SeedSlotManager,
  board: Board,
  e: PointerEvent,
  coords: Vector2
) {
  if (!pointerWithinSeedSlot(seedSlotManager, board, e)) {
    return;
  }

  // FIXME: This logic is problematic
  const selectedSlotId = seedSlotManager.selectedSlot?.id;
  const seedSlot = findSeedSlotWithinCoordinateX(seedSlotManager, coords.x);

  if (seedSlot === undefined) {
    return;
  }
  if (seedSlot.id === selectedSlotId) {
    seedSlotManager.selectedSlot = null;
  } else {
    seedSlotManager.selectedSlot = seedSlot;
  }
}

function handlePlacePlant(
  level: Level,
  board: Board,
  e: PointerEvent,
  coords: Vector2
) {
  const { seedSlotManager } = level;

  if (seedSlotManager.selectedSlot === null) {
    return;
  }

  const withinPlaySafeArea = pointerWithinPlaySafeArea(board, e);

  if (!withinPlaySafeArea) {
    return;
  }
  if (
    seedSlotManager.selectedSlot.packet.status === SeedPacketStatus.Disabled
  ) {
    return;
  }

  const closestX = closestLowerValue(
    coords.x,
    board.tilePosList.map((tilePos) => tilePos.x)
  );
  const closestY = closestLowerValue(
    coords.y,
    board.tilePosList.map((tilePos) => tilePos.y)
  );
  const closestPlant = level.plants.find((plant) => {
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

  const plantType = seedSlotManager.selectedSlot.packet.plantType;
  const plantCost = PlantInfo[plantType].SunCost;

  if (level.sunAmount < plantCost) {
    return;
  }

  const plant = createPlant(plantType, closestX, closestY, level);

  if (plant !== null) {
    level.plants = addPlant(level.plants, plant);
  }

  seedSlotManager.selectedSlot.packet.cooldownTimerPaused = false;
  seedSlotManager.selectedSlot = null;
  level.sunAmount -= plantCost;
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

function handleButtonClick(id: ButtonId, game: Game) {
  switch (id) {
    case ButtonId.Menu:
      const modal = createModal({
        title: "Modal",
        description: "Description",
        actions: [],
      });
      game.level.modals.push(modal);
      setTimeout(() => {
        modal.active = false;
      }, 2500);
      break;
  }
}
