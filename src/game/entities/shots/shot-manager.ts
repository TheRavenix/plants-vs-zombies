import type { Shot } from "./types";

type ShotManager = {
  shots: Shot[];
  addShot(shot: Shot): void;
  addShots(...shots: Shot[]): void;
};

function createShotManager(): ShotManager {
  const shots: Shot[] = [];

  return {
    shots,
    addShot: (shot) => addShot(shots, shot),
    addShots: (...sList) => {
      for (const shot of sList) {
        addShot(shots, shot);
      }
    },
  };
}

function addShot(shots: Shot[], shot: Shot) {
  shots.push(shot);
}

export { createShotManager };
export type { ShotManager };
