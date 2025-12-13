import {
  drawNormalZombie,
  normalZombieTakeDamage,
  updateNormalZombie,
} from "./normal-zombie";
import {
  drawFlagZombie,
  flagZombieTakeDamage,
  updateFlagZombie,
} from "./flag-zombie";

import { ZombieType } from "./constants";

import type {
  Zombie,
  ZombieDrawOptions,
  ZombieTakeDamageOptions,
  ZombieUpdateOptions,
} from "./types";

function drawZombie(zombie: Zombie, options: ZombieDrawOptions) {
  switch (zombie.type) {
    case ZombieType.Normal:
      drawNormalZombie(zombie, options);
      break;

    case ZombieType.Flag:
      drawFlagZombie(zombie, options);
      break;
  }
}

function updateZombie(zombie: Zombie, options: ZombieUpdateOptions) {
  switch (zombie.type) {
    case ZombieType.Normal:
      updateNormalZombie(zombie, options);
      break;

    case ZombieType.Flag:
      updateFlagZombie(zombie, options);
      break;
  }
}

function zombieTakeDamage(zombie: Zombie, options: ZombieTakeDamageOptions) {
  switch (zombie.type) {
    case ZombieType.Normal:
      normalZombieTakeDamage(zombie, options);
      break;

    case ZombieType.Flag:
      flagZombieTakeDamage(zombie, options);
      break;
  }
}

function addZombie(zombies: Zombie[], zombie: Zombie): Zombie[] {
  return [...zombies, zombie];
}

function addZombies(zombies: Zombie[], ...toAdd: Zombie[]): Zombie[] {
  return [...zombies, ...toAdd];
}

function removeZombieById(zombies: Zombie[], id: string): Zombie[] {
  return zombies.filter((zombie) => zombie.id !== id);
}

function findZombieById(zombies: Zombie[], id: string): Zombie | undefined {
  return zombies.find((zombie) => zombie.id === id);
}

function removeOutOfHealthZombies(zombies: Zombie[]): Zombie[] {
  return zombies.filter((zombie) => zombie.health > 0);
}

export const zombieActions = {
  drawZombie,
  updateZombie,
  zombieTakeDamage,
  addZombie,
  addZombies,
  removeZombieById,
  findZombieById,
  removeOutOfHealthZombies,
} as const;
