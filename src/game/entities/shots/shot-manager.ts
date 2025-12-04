import type { Shot } from "./types";

type ShotManager = {
  get shots(): Shot[];
  addShot(shot: Shot): void;
  addShots(...shots: Shot[]): void;
  removeShotById(id: string): void;
};

function createShotManager(): ShotManager {
  let shots: Shot[] = [];

  return {
    get shots() {
      return shots;
    },
    addShot: (shot) => addShot(shots, shot),
    addShots: (...sList) => {
      for (const shot of sList) {
        addShot(shots, shot);
      }
    },
    removeShotById: (id) => {
      shots = removeShotById(shots, id);
    },
  };
}

function addShot(shots: Shot[], shot: Shot) {
  shots.push(shot);
}

function removeShotById(shots: Shot[], id: string): Shot[] {
  return shots.filter((shot) => shot.state.id !== id);
}

export { createShotManager };
export type { ShotManager };
