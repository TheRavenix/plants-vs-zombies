import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  TILE_HEIGHT,
  TILE_WIDTH,
} from "@/game/board";
import type { Shot } from "./types";

type ShotManager = {
  get shots(): Shot[];
  addShot(shot: Shot): void;
  addShots(...shots: Shot[]): void;
  removeShotById(id: string): void;
  removeOutOfZoneShots(): void;
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
    removeOutOfZoneShots: () => {
      shots = removeOutOfZoneShots(shots);
    },
  };
}

function addShot(shots: Shot[], shot: Shot) {
  shots.push(shot);
}

function removeShotById(shots: Shot[], id: string): Shot[] {
  return shots.filter((shot) => shot.state.id !== id);
}

function removeOutOfZoneShots(shots: Shot[]): Shot[] {
  return shots.filter((shot) => {
    const { x, y } = shot.state;
    return (
      x - TILE_WIDTH < BOARD_WIDTH &&
      y - TILE_HEIGHT < BOARD_HEIGHT &&
      y + TILE_HEIGHT > 0
    );
  });
}

export { createShotManager };
export type { ShotManager };
