import { TILE_HEIGHT, TILE_WIDTH, type Board } from "@/game/board";
import {
  drawFirepeaShot,
  drawPeashot,
  drawRicochetPeashot,
  drawSnowpeaShot,
  updateFirepeaShot,
  updatePeashot,
  updateRicochetPeashot,
  updateSnowpeaShot,
} from "./pea";
import { drawShroomshot, updateShroomshot } from "./shroomshot";

import { ShotType } from "./constants";

import type { Shot, ShotDrawOptions, ShotUpdateOptions } from "./types";

function drawShot(shot: Shot, options: ShotDrawOptions) {
  switch (shot.type) {
    case ShotType.Peashot:
      drawPeashot(shot, options);
      break;

    case ShotType.SnowpeaShot:
      drawSnowpeaShot(shot, options);
      break;

    case ShotType.Shroomshot:
      drawShroomshot(shot, options);
      break;

    case ShotType.FirepeaShot:
      drawFirepeaShot(shot, options);
      break;

    case ShotType.RicochetPeashot:
      drawRicochetPeashot(shot, options);
      break;
  }
}

function updateShot(shot: Shot, options: ShotUpdateOptions) {
  switch (shot.type) {
    case ShotType.Peashot:
      updatePeashot(shot, options);
      break;

    case ShotType.SnowpeaShot:
      updateSnowpeaShot(shot, options);
      break;

    case ShotType.Shroomshot:
      updateShroomshot(shot, options);
      break;

    case ShotType.FirepeaShot:
      updateFirepeaShot(shot, options);
      break;

    case ShotType.RicochetPeashot:
      updateRicochetPeashot(shot, options);
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

function removeOutOfZoneShots(shots: Shot[], board: Board): Shot[] {
  const { canvas } = board;

  return shots.filter((shot) => {
    return (
      shot.x - TILE_WIDTH < canvas.width &&
      shot.y - TILE_HEIGHT < canvas.height &&
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
