import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  TILE_HEIGHT,
  TILE_WIDTH,
} from "@/game/board";
import { drawPeashot, updatePeashot } from "./peashot";

import { ShotType } from "./constants";

import type { Shot, ShotDrawOptions, ShotUpdateOptions } from "./types";

function drawShot(shot: Shot, options: ShotDrawOptions) {
  switch (shot.type) {
    case ShotType.Peashot:
      drawPeashot(shot, options);
      break;
  }
}

function updateShot(shot: Shot, options: ShotUpdateOptions) {
  switch (shot.type) {
    case ShotType.Peashot:
      updatePeashot(shot, options);
      break;
  }
}

function addShot(shots: Shot[], shot: Shot): Shot[] {
  return [...shots, shot];
}

function addShots(shots: Shot[], ...toAdd: Shot[]): Shot[] {
  return [...shots, ...toAdd];
}

function removeShotById(shots: Shot[], id: string): Shot[] {
  return shots.filter((shot) => shot.id !== id);
}

function findShotById(shots: Shot[], id: string): Shot | undefined {
  return shots.find((shot) => shot.id === id);
}

function removeOutOfZoneShots(shots: Shot[]): Shot[] {
  return shots.filter((shot) => {
    return (
      shot.x - TILE_WIDTH < BOARD_WIDTH &&
      shot.y - TILE_HEIGHT < BOARD_HEIGHT &&
      shot.y + TILE_HEIGHT > 0
    );
  });
}

const shotActions = {
  drawShot,
  updateShot,
  addShot,
  addShots,
  removeShotById,
  findShotById,
  removeOutOfZoneShots,
} as const;

export { shotActions };
