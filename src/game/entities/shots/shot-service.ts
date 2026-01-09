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
import { drawText } from "@/game/helpers/canvas";
import { FontSize } from "@/game/constants/font";
import { ShotDirection, ShotType } from "./constants";

import type {
  BaseShot,
  Shot,
  ShotDrawOptions,
  ShotUpdateOptions,
} from "./types";

export function createShotId(): string {
  return `SHOT-${crypto.randomUUID()}`;
}

export function drawShotRect(shot: BaseShot, options: ShotDrawOptions) {
  const { ctx } = options.board;

  if (ctx === null) {
    return;
  }

  ctx.fillStyle = shot.fillStyle;
  ctx.fillRect(shot.x, shot.y, shot.width, shot.height);
  ctx.fill();
}

export function drawShotType(shot: Shot, options: ShotDrawOptions) {
  const { ctx } = options.board;

  if (ctx === null) {
    return;
  }

  drawText(
    options.board,
    shot.type,
    shot.x,
    shot.y + shot.height / 2,
    "#ffffff",
    {
      fontSize: FontSize.Xs,
    }
  );
}

export function syncShotHitbox(shot: BaseShot) {
  shot.hitbox.x = shot.x;
  shot.hitbox.y = shot.y;
}

export function handleShotDirection(shot: BaseShot, speed: number) {
  switch (shot.direction) {
    case ShotDirection.Right:
      shot.x += speed;
      break;

    case ShotDirection.UpRight:
      shot.x += speed;
      shot.y -= speed;
      break;

    case ShotDirection.DownRight:
      shot.x += speed;
      shot.y += speed;
      break;

    default:
      shot.x += speed;
  }
}

export function drawShot(shot: Shot, options: ShotDrawOptions) {
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

export function updateShot(shot: Shot, options: ShotUpdateOptions) {
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

export function addShot(shots: Shot[], shot: Shot): Shot[] {
  return [...shots, shot];
}

export function addShots(shots: Shot[], ...toAdd: Shot[]): Shot[] {
  return [...shots, ...toAdd];
}

export function removeShotById(shots: Shot[], id: string): Shot[] {
  return shots.filter((shot) => shot.id !== id);
}

export function findShotById(shots: Shot[], id: string): Shot | undefined {
  return shots.find((shot) => shot.id === id);
}

export function removeOutOfZoneShots(shots: Shot[], board: Board): Shot[] {
  const { canvas } = board;

  return shots.filter((shot) => {
    return (
      shot.x - TILE_WIDTH < canvas.width &&
      shot.y - TILE_HEIGHT < canvas.height &&
      shot.y + TILE_HEIGHT > 0
    );
  });
}

export function removeInactiveShots(shots: Shot[]): Shot[] {
  return shots.filter((shot) => shot.active);
}
