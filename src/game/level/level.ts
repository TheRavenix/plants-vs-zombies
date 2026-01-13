import {
  BOARD_COLS,
  BOARD_ROWS,
  BOARD_WIDTH,
  getCanvasCoordinates,
  isPointerInPlaySafeArea,
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
  updateSeedSlotManager,
  type SeedSlotManager,
} from "../seed/seed-slot-manager";
import {
  addSun,
  collectSun,
  createSun,
  drawSun,
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
import { drawButton, isPointInRect, type Button } from "../helpers/canvas";
import {
  createModal,
  drawModal,
  getModalButtonRect,
  isPointerInModalCloseArea,
  updateModal,
  type Modal,
} from "../modal";

import type { Vector2 } from "../types/math";
import type { Cleanup } from "../types/cleanup";
import type { LevelBlueprintManager } from "./level-blueprint-manager";
import { GameScene, setGameScene, type Game } from "../game";

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
  activeModal: Modal | null;
  isPaused: boolean;
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

enum ModalButtonId {
  ExitToMap = "EXIT_TO_MAP",
  Restart = "RESTART",
  Resume = "RESUME",
  Continue = "CONTINUE",
}

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
    activeModal: null,
    isPaused: false,
  };
}

export function startLevel(level: Level, board: Board, game: Game): Cleanup {
  const { canvas, ctx } = board;

  if (ctx !== null) {
    ctx.imageSmoothingEnabled = false;
  }

  function handlePointerDownEvent(e: PointerEvent) {
    const coords = getCanvasCoordinates(canvas, e);

    if (level.activeModal !== null) {
      if (isPointerInModalCloseArea(level.activeModal, board, e)) {
        setActiveModal(level, null);
        return;
      }

      const modalButton = level.activeModal.buttons.find((_, index) =>
        isPointInRect(
          coords,
          getModalButtonRect(index, level.activeModal!.buttons)
        )
      );

      if (modalButton !== undefined) {
        handleModalButtonClick(modalButton.id, game, board);
      }
    }
    if (level.isPaused) {
      return;
    }
    if (
      level.rewardPacket !== null &&
      isPointInRect(coords, level.rewardPacket)
    ) {
      const modal = createModal({
        title: "Reward",
        description: level.rewardPacket.plantType,
        buttons: [
          {
            id: ModalButtonId.Continue,
            text: "Continue",
          },
        ],
      });
      setActiveModal(level, modal);
      return;
    }
    if (!level.gameOver) {
      handleSunCollect(level, board, e, coords);
      handleSeedSlotSelect(level.seedSlotManager, coords);
      handlePlacePlant(level, board, e, coords);
    }

    const button = buttons.find((btn) => isPointInRect(coords, btn));

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

  if (level.activeModal !== null) {
    drawModal(level.activeModal, board);
  }
}

export function updateLevel(level: Level, deltaTime: number, board: Board) {
  if (level.activeModal !== null) {
    updateModal(level.activeModal, deltaTime);
  }

  if (level.isPaused) {
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

  if (level.activeModal !== null) {
    level.isPaused = true;
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
  if (!isPointerInPlaySafeArea(board, e)) {
    return;
  }

  const toCollectSun = suns.find((sun) => isPointInRect(coords, sun));

  if (toCollectSun === undefined) {
    return;
  }

  collectSun(toCollectSun, level);
}

function handleSeedSlotSelect(
  seedSlotManager: SeedSlotManager,
  coords: Vector2
) {
  if (!isPointInRect(coords, seedSlotManager)) {
    return;
  }

  // FIXME: This logic is problematic
  const selectedSlotId = seedSlotManager.selectedSlot?.id;
  const seedSlot = seedSlotManager.slots.find((slot) =>
    isPointInRect(coords, slot.packet)
  );

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

  const inPlaySafeArea = isPointerInPlaySafeArea(board, e);

  if (!inPlaySafeArea) {
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

function handleButtonClick(id: string, game: Game) {
  switch (id) {
    case ButtonId.Menu:
      const modal = createModal({
        title: "Game Paused",
        description: "Click To Resume Game",
        buttons: [
          {
            id: ModalButtonId.ExitToMap,
            text: "Exit To Map",
          },
          {
            id: ModalButtonId.Restart,
            text: "Restart",
          },
          {
            id: ModalButtonId.Resume,
            text: "Resume",
          },
        ],
      });
      setActiveModal(game.level, modal);
      break;
  }
}

function handleModalButtonClick(id: string, game: Game, board: Board) {
  switch (id) {
    case ModalButtonId.ExitToMap:
      setGameScene(game, GameScene.MainMenu, board);
      break;

    case ModalButtonId.Resume:
      setActiveModal(game.level, null);
      break;
  }
}

function setActiveModal(level: Level, modal: Modal | null) {
  level.activeModal = modal;
  level.isPaused = level.activeModal !== null;
}
