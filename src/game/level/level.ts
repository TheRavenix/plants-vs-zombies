import {
  BOARD_COLS,
  BOARD_ROWS,
  BOARD_WIDTH,
  TILE_HEIGHT,
  TILE_WIDTH,
  type Board,
} from "../board";
import { PlantInfo } from "../entities/plants";
import { createPlant } from "../entities/plants/service/create-plant";
import {
  createSeedSlotManager,
  type SeedSlotManager,
} from "../seed/seed-slot-manager";
import { createSun, type Sun } from "../entities/sun";
import { SeedPacketStatus, type SeedPacket } from "../seed";
import { closestLowerValue } from "@/utils/math";
import { drawButton, isPointInRect, type Button } from "../helpers/canvas";
import {
  createModal,
  getModalButtonRect,
  isPointerInModalCloseArea,
  type Modal,
} from "../modal";
import { GameScene, type GameContext } from "../game";
import {
  createLevelBlueprintManager,
  type LevelBlueprint,
  type LevelBlueprintManager,
} from "./level-blueprint-manager";

import type { Vector2 } from "../types/math";
import type { Cleanup } from "../types/cleanup";
import type { Drawable } from "../types/drawable";
import type { Updatable } from "../types/updatable";
import type { Zombie } from "../entities/zombies/types/zombie";
import type { Plant } from "../entities/plants/types/plant";
import type { Shot } from "../entities/shots/types/shot";

import levels from "./levels.json";

export interface Level extends Drawable, Updatable {
  readonly sunAmount: number;
  readonly zombies: Zombie[];
  readonly plants: Plant[];
  readonly shots: Shot[];
  readonly suns: Sun[];
  readonly seedSlotManager: SeedSlotManager;
  readonly sunRechargeTimer: number;
  readonly levelBlueprintManager: LevelBlueprintManager;
  readonly time: number;
  readonly gameOver: boolean;
  readonly rewardPacket: SeedPacket | null;
  readonly activeModal: Modal | null;
  readonly isPaused: boolean;
  start(board: Board): Cleanup;
  setSunAmount(amount: number): void;
  setActiveModal(modal: Modal | null): void;
  setIsPaused(paused: boolean): void;
  setRewardPacket(rewardPacket: SeedPacket | null): void;
  setGameOver(gameOver: boolean): void;
  addPlant(...plants: Plant[]): void;
  removePlantById(id: string): void;
  findPlantById(id: string): Plant | undefined;
  addZombie(...Zombies: Zombie[]): void;
  removeZombieById(id: string): void;
  findZombieById(id: string): Zombie | undefined;
  findZombiesWithinArea(x: number, y: number, tileRange?: number): Zombie[];
  addShot(...shots: Shot[]): void;
  removeShotById(id: string): void;
  findShotById(id: string): Shot | undefined;
  addSun(...suns: Sun[]): void;
  removeSunById(id: string): void;
  findSunById(id: string): Sun | undefined;
}

export interface LevelContext {
  setSunAmount(amount: number): void;
  setActiveModal(modal: Modal | null): void;
  setIsPaused(paused: boolean): void;
  setRewardPacket(rewardPacket: SeedPacket | null): void;
  setGameOver(gameOver: boolean): void;
  addPlant(...plants: Plant[]): void;
  removePlantById(id: string): void;
  findPlantById(id: string): Plant | undefined;
  addZombie(...Zombies: Zombie[]): void;
  removeZombieById(id: string): void;
  findZombieById(id: string): Zombie | undefined;
  findZombiesWithinArea(x: number, y: number, tileRange?: number): Zombie[];
  addShot(...shots: Shot[]): void;
  removeShotById(id: string): void;
  findShotById(id: string): Shot | undefined;
  addSun(...suns: Sun[]): void;
  removeSunById(id: string): void;
  findSunById(id: string): Sun | undefined;
  readonly sunAmount: number;
  readonly time: number;
  readonly gameOver: boolean;
  readonly rewardPacket: SeedPacket | null;
  readonly plants: ReadonlyArray<Plant>;
  readonly zombies: ReadonlyArray<Zombie>;
  readonly shots: ReadonlyArray<Shot>;
  readonly suns: ReadonlyArray<Sun>;
  readonly seedSlotManager: SeedSlotManager;
}

type Options = {
  gameContext: GameContext;
  board: Board;
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

export function createLevel(options: Options): Level {
  const { gameContext, board } = options;
  let sunAmount = DEFAULT_SUN_AMOUNT;
  let zombies: Zombie[] = [];
  let plants: Plant[] = [];
  let shots: Shot[] = [];
  let suns: Sun[] = [];

  let sunRechargeTimer = 0;
  let time = 0;
  let gameOver = false;
  let rewardPacket: SeedPacket | null = null;
  let activeModal: Modal | null = null;
  let isPaused = false;

  const levelContext: LevelContext = {
    get sunAmount() {
      return sunAmount;
    },
    get time() {
      return time;
    },
    get rewardPacket() {
      return rewardPacket;
    },
    get gameOver() {
      return gameOver;
    },
    get zombies() {
      return zombies;
    },
    get plants() {
      return plants;
    },
    get shots() {
      return shots;
    },
    get suns() {
      return suns;
    },
    get seedSlotManager() {
      return seedSlotManager;
    },
    setSunAmount,
    setActiveModal,
    setIsPaused,
    setRewardPacket,
    setGameOver,
    addPlant,
    removePlantById,
    findPlantById,
    addZombie,
    removeZombieById,
    findZombieById,
    findZombiesWithinArea,
    addShot,
    removeShotById,
    findShotById,
    addSun,
    findSunById,
    removeSunById,
  };

  // FIXME:
  let seedSlotManager = createSeedSlotManager({
    ctx: levelContext,
  });

  const levelBlueprintManager = createLevelBlueprintManager({
    levelBlueprint: levels[0] as LevelBlueprint,
    ctx: levelContext,
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
    for (const plant of plants) {
      plant.draw(board);
    }
    for (const zombie of zombies) {
      zombie.draw(board);
    }
    for (const shot of shots) {
      shot.draw(board);
    }
    for (const sun of suns) {
      sun.draw(board);
    }

    seedSlotManager.draw(board);

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

    if (rewardPacket !== null) {
      rewardPacket.draw(board);
    }
    if (activeModal !== null) {
      activeModal.draw(board);
    }
  }

  function update(deltaTime: number) {
    if (activeModal !== null) {
      activeModal.update(deltaTime);
    }

    if (isPaused) {
      return;
    }

    time += deltaTime;

    levelBlueprintManager.update(deltaTime);
    seedSlotManager.update(deltaTime);

    for (const zombie of zombies) {
      zombie.update(deltaTime);
    }
    for (const plant of plants) {
      plant.update(deltaTime);
    }
    for (const shot of shots) {
      shot.update(deltaTime);
    }
    for (const sun of suns) {
      sun.update(deltaTime);
    }

    zombies = removeDeadZombies(zombies);
    plants = removeDeadPlants(plants);
    shots = removeOutOfZoneShots(shots, board);
    shots = removeInactiveShots(shots);

    sunRechargeTimer += deltaTime;

    if (sunRechargeTimer >= SUN_RECHARGE_INTERVAL) {
      addSun(
        createSun({
          x: TILE_WIDTH,
          y: TILE_HEIGHT,
          amount: SUN_PRODUCTION,
        }),
      );
      sunRechargeTimer = 0;
    }

    if (rewardPacket !== null) {
      rewardPacket.update(deltaTime);
    }
    if (activeModal !== null) {
      isPaused = true;
    }

    // FOR TESTING ONLY
    // TODO: Remove Dangerous Code
    gameOver = zombies.some((zombie) => zombie.position.x < TILE_WIDTH);
  }

  function start(board: Board) {
    const { canvas, ctx } = board;

    if (ctx !== null) {
      ctx.imageSmoothingEnabled = false;
    }

    levelBlueprintManager.start();

    function handlePointerDownEvent(e: PointerEvent) {
      const coords = board.getCanvasCoordinates(e);

      if (activeModal !== null) {
        if (isPointerInModalCloseArea(activeModal, board, e)) {
          activeModal = null;
          isPaused = false;
          return;
        }

        const modalButton = activeModal.buttons.find((_, index) =>
          isPointInRect(
            coords,
            getModalButtonRect(index, activeModal!.buttons),
          ),
        );

        if (modalButton !== undefined) {
          handleModalButtonClick(modalButton.id, gameContext, levelContext);
        }
      }
      if (isPaused) {
        return;
      }
      if (
        rewardPacket !== null &&
        isPointInRect(coords, {
          x: rewardPacket.position.x,
          y: rewardPacket.position.y,
          width: rewardPacket.size.width,
          height: rewardPacket.size.height,
        })
      ) {
        const modal = createModal({
          title: "Reward",
          description: rewardPacket.plantType,
          buttons: [
            {
              id: ModalButtonId.Continue,
              text: "Continue",
            },
          ],
        });
        setActiveModal(modal);
        return;
      }
      if (!gameOver) {
        handleSunCollect(levelContext, board, e, coords);
        handleSeedSlotSelect(seedSlotManager, coords);
        handlePlacePlant(levelContext, board, e, coords);
      }

      const button = buttons.find((btn) => isPointInRect(coords, btn));

      if (button !== undefined) {
        handleButtonClick(button.id, levelContext);
      }
    }

    canvas.addEventListener("pointerdown", handlePointerDownEvent);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDownEvent);
    };
  }

  function setSunAmount(newSunAmount: number) {
    sunAmount = newSunAmount;
  }

  function setActiveModal(newActiveModal: Modal | null) {
    activeModal = newActiveModal;
  }

  function setIsPaused(newIsPaused: boolean) {
    isPaused = newIsPaused;
  }

  function setRewardPacket(newRewardPacket: SeedPacket | null) {
    rewardPacket = newRewardPacket;
  }

  function setGameOver(newGameOver: boolean) {
    gameOver = newGameOver;
  }

  function addPlant(...newPlants: Plant[]) {
    plants.push(...newPlants);
  }

  function removePlantById(id: string) {
    plants = plants.filter((plant) => plant.id !== id);
  }

  function findPlantById(id: string) {
    return plants.find((plant) => plant.id === id);
  }

  function addZombie(...newZombies: Zombie[]) {
    zombies.push(...newZombies);
  }

  function removeZombieById(id: string) {
    zombies = zombies.filter((zombie) => zombie.id !== id);
  }

  function findZombieById(id: string) {
    return zombies.find((zombie) => zombie.id === id);
  }

  function findZombiesWithinArea(x: number, y: number, tileRange?: number) {
    const tileRangeX =
      tileRange !== undefined ? TILE_WIDTH * tileRange : TILE_WIDTH;
    const tileRangeY =
      tileRange !== undefined ? TILE_HEIGHT * tileRange : TILE_HEIGHT;

    return zombies.filter((zombie) => {
      return (
        zombie.position.x >= x - tileRangeX &&
        zombie.position.x <= x + tileRangeX &&
        zombie.position.y >= y - tileRangeY &&
        zombie.position.y <= y + tileRangeY
      );
    });
  }

  function addShot(...newShots: Shot[]) {
    shots.push(...newShots);
  }

  function removeShotById(id: string) {
    shots = shots.filter((shot) => shot.id !== id);
  }

  function findShotById(id: string) {
    return shots.find((shot) => shot.id === id);
  }

  function addSun(...newSuns: Sun[]) {
    suns.push(...newSuns);
  }

  function removeSunById(id: string) {
    suns = suns.filter((sun) => sun.id !== id);
  }

  function findSunById(id: string) {
    return suns.find((sun) => sun.id === id);
  }

  return {
    get sunAmount() {
      return sunAmount;
    },
    get zombies() {
      return zombies;
    },
    get plants() {
      return plants;
    },
    get shots() {
      return shots;
    },
    get suns() {
      return suns;
    },
    get seedSlotManager() {
      return seedSlotManager;
    },
    get sunRechargeTimer() {
      return sunRechargeTimer;
    },
    get time() {
      return time;
    },
    get levelBlueprintManager() {
      return levelBlueprintManager;
    },
    get gameOver() {
      return gameOver;
    },
    get rewardPacket() {
      return rewardPacket;
    },
    get activeModal() {
      return activeModal;
    },
    get isPaused() {
      return isPaused;
    },
    draw,
    update,
    start,
    setSunAmount,
    setActiveModal,
    setIsPaused,
    setRewardPacket,
    setGameOver,
    addPlant,
    removePlantById,
    findPlantById,
    addZombie,
    removeZombieById,
    findZombieById,
    findZombiesWithinArea,
    addShot,
    removeShotById,
    findShotById,
    addSun,
    findSunById,
    removeSunById,
  };
}

function handleSunCollect(
  ctx: LevelContext,
  board: Board,
  e: PointerEvent,
  coords: Vector2,
) {
  const { suns } = ctx;

  if (suns.length <= 0) {
    return;
  }
  if (!board.isPointerInPlaySafeArea(e)) {
    return;
  }

  const sun = suns.find((sun) =>
    isPointInRect(coords, {
      x: sun.position.x,
      y: sun.position.y,
      width: sun.size.width,
      height: sun.size.height,
    }),
  );

  if (sun === undefined) {
    return;
  }

  ctx.setSunAmount(ctx.sunAmount + sun.amount);
  ctx.removeSunById(sun.id);
}

function handleSeedSlotSelect(
  seedSlotManager: SeedSlotManager,
  coords: Vector2,
) {
  if (
    !isPointInRect(coords, {
      x: seedSlotManager.position.x,
      y: seedSlotManager.position.y,
      width: seedSlotManager.size.width,
      height: seedSlotManager.size.height,
    })
  ) {
    return;
  }

  // FIXME: This logic is problematic
  const selectedSlotId = seedSlotManager.selectedSlot?.id;
  const seedSlot = seedSlotManager.slots.find((slot) =>
    isPointInRect(coords, slot),
  );

  if (seedSlot === undefined) {
    return;
  }
  if (seedSlot.id === selectedSlotId) {
    seedSlotManager.setSelectedSlot(null);
  } else {
    seedSlotManager.setSelectedSlot(seedSlot);
  }
}

function handlePlacePlant(
  ctx: LevelContext,
  board: Board,
  e: PointerEvent,
  coords: Vector2,
) {
  const { seedSlotManager } = ctx;
  const { selectedSlot } = seedSlotManager;

  if (selectedSlot === null) {
    return;
  }

  const inPlaySafeArea = board.isPointerInPlaySafeArea(e);

  if (!inPlaySafeArea) {
    return;
  }
  if (selectedSlot.packet.status === SeedPacketStatus.Disabled) {
    return;
  }

  const closestX = closestLowerValue(
    coords.x,
    board.tilePosList.map((tilePos) => tilePos.x),
  );
  const closestY = closestLowerValue(
    coords.y,
    board.tilePosList.map((tilePos) => tilePos.y),
  );
  const closestPlant = ctx.plants.find((plant) => {
    return (
      plant.position.x >= closestX &&
      plant.position.x <= closestX + TILE_WIDTH &&
      plant.position.y >= closestY &&
      plant.position.y <= closestY + TILE_HEIGHT
    );
  });

  if (closestPlant !== undefined) {
    return;
  }

  const plantType = selectedSlot.packet.plantType;
  const plantCost = PlantInfo[plantType].SunCost;

  if (ctx.sunAmount < plantCost) {
    return;
  }

  const plant = createPlant(plantType, closestX, closestY, ctx);

  if (plant !== null) {
    ctx.addPlant(plant);
  }

  selectedSlot.packet.setCooldownTimerPaused(false);
  seedSlotManager.setSelectedSlot(null);
  ctx.setSunAmount(ctx.sunAmount - plantCost);
}

function handleButtonClick(id: string, ctx: LevelContext) {
  switch (id) {
    case ButtonId.Menu:
      const modal = createModal({
        title: "Game Paused",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro sequi voluptatibus quasi expedita veniam explicabo optio impedit, repudiandae doloremque enim hic placeat eos. Mollitia ullam quasi molestias voluptates consectetur ratione.",
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
      ctx.setActiveModal(modal);
      ctx.setIsPaused(true);
      break;
  }
}

function handleModalButtonClick(
  id: string,
  gameContext: GameContext,
  levelContext: LevelContext,
) {
  switch (id) {
    case ModalButtonId.ExitToMap:
      gameContext.setScene(GameScene.MainMenu);
      break;

    case ModalButtonId.Resume:
      levelContext.setActiveModal(null);
      levelContext.setIsPaused(false);
      break;
  }
}

function removeDeadZombies(zombies: Zombie[]): Zombie[] {
  return zombies.filter((zombie) => !zombie.health.isDead());
}

function removeDeadPlants(plants: Plant[]): Plant[] {
  return plants.filter((plant) => !plant.health.isDead());
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
