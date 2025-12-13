import {
  drawNormalZombie,
  normalZombieTakeDamage,
  updateNormalZombie,
  type NormalZombie,
} from "./normal-zombie";
import {
  drawFlagZombie,
  flagZombieTakeDamage,
  updateFlagZombie,
  type FlagZombie,
} from "./flag-zombie";

import { ZombieType } from "./constants";

import type {
  Zombie,
  ZombieDrawOptions,
  ZombieTakeDamageOptions,
  ZombieUpdateOptions,
} from "./types";

const zombieActions = {
  drawZombie,
  updateZombie,
  zombieTakeDamage,
  addZombie,
  addZombies,
  removeZombieById,
  findZombieById,
  removeOutOfHealthZombies,
} as const;

function drawZombie(options: ZombieDrawOptions) {
  const { zombie } = options;

  switch (zombie.type) {
    case ZombieType.Normal:
      drawNormalZombie(options as ZombieDrawOptions<NormalZombie>);
      break;

    case ZombieType.Flag:
      drawFlagZombie(options as ZombieDrawOptions<FlagZombie>);
      break;
  }
}

function updateZombie(options: ZombieUpdateOptions) {
  const { zombie } = options;

  switch (zombie.type) {
    case ZombieType.Normal:
      updateNormalZombie(options as ZombieUpdateOptions<NormalZombie>);
      break;

    case ZombieType.Flag:
      updateFlagZombie(options as ZombieUpdateOptions<FlagZombie>);
      break;
  }
}

function zombieTakeDamage(options: ZombieTakeDamageOptions) {
  const { zombie } = options;

  switch (zombie.type) {
    case ZombieType.Normal:
      normalZombieTakeDamage(options as ZombieTakeDamageOptions<NormalZombie>);
      break;

    case ZombieType.Flag:
      flagZombieTakeDamage(options as ZombieTakeDamageOptions<FlagZombie>);
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

export { zombieActions };
