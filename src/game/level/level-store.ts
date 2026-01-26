import { TILE_HEIGHT, TILE_WIDTH } from "../board";
import { createTimer, type Timer } from "../entities/features/timer";
import { createSun, type Sun } from "../entities/sun";
import {
  createSeedSlotManager,
  type SeedPacket,
  type SeedSlotManager,
} from "../seed";

import type { Plant } from "../entities/plants/types/plant";
import type { Shot } from "../entities/shots/types/shot";
import type { Zombie } from "../entities/zombies/types/zombie";
import type { Modal } from "../modal";

export interface LevelStoreState {
  readonly sunAmount: number;
  readonly zombies: Zombie[];
  readonly plants: Plant[];
  readonly shots: Shot[];
  readonly suns: Sun[];
  readonly seedSlotManager: SeedSlotManager;
  readonly sunRechargeTimer: Timer;
  readonly time: number;
  readonly gameOver: boolean;
  readonly rewardPacket: SeedPacket | null;
  readonly activeModal: Modal | null;
  readonly isPaused: boolean;
}

export interface LevelStoreActions {
  setSunAmount(amount: number): void;
  setActiveModal(modal: Modal | null): void;
  setIsPaused(paused: boolean): void;
  setRewardPacket(rewardPacket: SeedPacket | null): void;
  setGameOver(gameOver: boolean): void;
  setTime(time: number): void;
  setPlants(plants: Plant[]): void;
  setZombies(zombies: Zombie[]): void;
  setShots(shots: Shot[]): void;
  setSuns(suns: Sun[]): void;
  addPlant(...plants: Plant[]): void;
  removePlantById(id: string): void;
  findPlantById(id: string): Plant | undefined;
  addZombie(...Zombies: Zombie[]): void;
  removeZombieById(id: string): void;
  findZombieById(id: string): Zombie | undefined;
  addShot(...shots: Shot[]): void;
  removeShotById(id: string): void;
  findShotById(id: string): Shot | undefined;
  addSun(...suns: Sun[]): void;
  removeSunById(id: string): void;
  findSunById(id: string): Sun | undefined;
}

export interface LevelStore {
  readonly state: LevelStoreState;
  readonly actions: LevelStoreActions;
}

const DEFAULT_SUN_AMOUNT = 100;
const SUN_PRODUCTION = 25;
const SUN_RECHARGE_INTERVAL = 1000 * 24;

export function createLevelStore(): LevelStore {
  let state!: LevelStoreState;
  let actions!: LevelStoreActions;
  let store!: LevelStore;
  let sunAmount = DEFAULT_SUN_AMOUNT;
  let zombies: Zombie[] = [];
  let plants: Plant[] = [];
  let shots: Shot[] = [];
  let suns: Sun[] = [];
  let time = 0;
  let gameOver = false;
  let rewardPacket: SeedPacket | null = null;
  let activeModal: Modal | null = null;
  let isPaused = false;
  const seedSlotManager = createSeedSlotManager({
    getSunAmount() {
      return sunAmount;
    },
  });
  const sunRechargeTimer = createTimer({
    maxTime: SUN_RECHARGE_INTERVAL,
    onReady() {
      addSun(
        createSun({
          x: TILE_WIDTH,
          y: TILE_HEIGHT,
          amount: SUN_PRODUCTION,
        }),
      );
    },
  });

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

  function setTime(newTime: number) {
    time = newTime;
  }

  function setPlants(newPlants: Plant[]) {
    plants = newPlants;
  }

  function setZombies(newZombies: Zombie[]) {
    zombies = newZombies;
  }

  function setShots(newShots: Shot[]) {
    shots = newShots;
  }

  function setSuns(newSuns: Sun[]) {
    suns = newSuns;
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

  state = {
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
    get activeModal() {
      return activeModal;
    },
    get isPaused() {
      return isPaused;
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
  };

  actions = {
    setSunAmount,
    setActiveModal,
    setIsPaused,
    setRewardPacket,
    setGameOver,
    setTime,
    setPlants,
    setZombies,
    setShots,
    setSuns,
    addPlant,
    removePlantById,
    findPlantById,
    addZombie,
    removeZombieById,
    findZombieById,
    addShot,
    removeShotById,
    findShotById,
    addSun,
    findSunById,
    removeSunById,
  };

  store = {
    get state() {
      return state;
    },
    get actions() {
      return actions;
    },
  };

  return store;
}
