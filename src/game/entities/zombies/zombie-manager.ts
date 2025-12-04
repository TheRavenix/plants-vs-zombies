import type { Zombie } from "./types";

type ZombieManager = {
  get zombies(): Zombie[];
  addZombie(zombie: Zombie): void;
  addZombies(...zombies: Zombie[]): void;
  removeZombieById(id: string): void;
  findZombieById(id: string): Zombie | undefined;
};

function createZombieManager(): ZombieManager {
  let zombies: Zombie[] = [];

  return {
    get zombies() {
      return zombies;
    },
    addZombie: (zombie) => addZombie(zombies, zombie),
    addZombies: (...zList) => {
      for (const zombie of zList) {
        addZombie(zombies, zombie);
      }
    },
    removeZombieById: (id) => {
      zombies = removeZombieById(zombies, id);
    },
    findZombieById: (id) => {
      return findZombieById(zombies, id);
    },
  };
}

function addZombie(zombies: Zombie[], zombie: Zombie) {
  zombies.push(zombie);
}

function removeZombieById(zombies: Zombie[], id: string): Zombie[] {
  return zombies.filter((zombie) => zombie.state.id !== id);
}

function findZombieById(zombies: Zombie[], id: string): Zombie | undefined {
  return zombies.find((z) => z.state.id === id);
}

export { createZombieManager };
export type { ZombieManager };
