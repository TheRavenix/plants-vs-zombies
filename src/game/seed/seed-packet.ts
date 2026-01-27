import { PlantInfo } from "../entities/plants";
import { drawSunImage } from "../entities/sun";
import { drawCenteredText } from "../helpers/canvas";
import { createPosition, type Position } from "../features/position";
import { createSize, type Size } from "../features/size";
import { getOrLoadImage } from "../assets";

import type { Board } from "../board";
import type { Vector2 } from "../types/math";
import type { Drawable } from "../types/drawable";
import type { Updatable } from "../types/updatable";
import type { PlantType } from "../entities/plants/constants/plant-type";

export interface SeedPacket extends Drawable, Updatable {
  readonly position: Position;
  readonly size: Size;
  readonly plantType: PlantType;
  readonly status: SeedPacketStatus;
  readonly spriteImage: HTMLImageElement;
  readonly cooldownTimer: number;
  readonly cooldownTimerPaused: boolean;
  setStatus(status: SeedPacketStatus): void;
  setCooldownTimer(timer: number): void;
  setCooldownTimerPaused(isPaused: boolean): void;
}

type Options = {
  plantType: PlantType;
  status?: SeedPacketStatus;
} & Vector2;

export const SEED_PACKET_MARGIN_LEFT = 8;
const SEED_PACKET_WIDTH = 72;
const SEED_PACKET_HEIGHT = 72;
export const SEED_PACKET_ACTIVE_Y = 4;
const SEED_PACKET_IMAGE = new Image(SEED_PACKET_WIDTH, SEED_PACKET_HEIGHT);
const SELECTED_SEED_PACKET_IMAGE = new Image(
  SEED_PACKET_WIDTH,
  SEED_PACKET_HEIGHT,
);
const DISABLED_SEED_PACKET_IMAGE = new Image(
  SEED_PACKET_WIDTH,
  SEED_PACKET_HEIGHT,
);

export enum SeedPacketStatus {
  Active = "ACTIVE",
  Disabled = "DISABLED",
  Selected = "SELECTED",
}

SEED_PACKET_IMAGE.src = "./seed/seed-packet/Seed_Packet.png";
SELECTED_SEED_PACKET_IMAGE.src = "./seed/seed-packet/Selected_Seed_Packet.png";
DISABLED_SEED_PACKET_IMAGE.src = "./seed/seed-packet/Disabled_Seed_Packet.png";

export function createSeedPacket(options: Options): SeedPacket {
  const position = createPosition({
    x: options.x,
    y: options.y,
  });
  const size = createSize({
    width: SEED_PACKET_WIDTH,
    height: SEED_PACKET_HEIGHT,
  });
  let plantType = options.plantType;
  let status = options.status ? options.status : SeedPacketStatus.Active;
  let spriteImage = SEED_PACKET_IMAGE;
  let cooldownTimer = 0;
  let cooldownTimerPaused = true;

  function draw(board: Board) {
    const { ctx } = board;

    if (ctx === null) {
      return;
    }

    const plantInfo = PlantInfo[plantType];
    const isSelected = status === SeedPacketStatus.Selected;

    ctx.drawImage(
      spriteImage,
      Math.round(position.x),
      Math.round(isSelected ? position.y - SEED_PACKET_ACTIVE_Y : position.y),
      size.width,
      size.height,
    );
    ctx.drawImage(
      getOrLoadImage(plantInfo.SpritePath),
      Math.round(position.x + size.width / 4),
      Math.round(
        isSelected
          ? position.y + SEED_PACKET_ACTIVE_Y
          : position.y + SEED_PACKET_ACTIVE_Y * 2,
      ),
      size.width / 2,
      size.height / 2,
    );
    drawSunImage(
      {
        x: position.x + size.width - 22,
        y: isSelected
          ? position.y - SEED_PACKET_ACTIVE_Y + size.height - 20
          : position.y + size.height - 20,
        width: 16,
        height: 16,
      },
      board,
    );
    drawCenteredText(
      board,
      plantInfo.SunCost.toString(),
      position.x + size.width / 2,
      isSelected
        ? position.y - SEED_PACKET_ACTIVE_Y + size.height - 10
        : position.y + size.height - 10,
      isSelected ? "#ffffff" : "#000000",
    );
  }

  function update(_deltaTime: number) {
    switch (status) {
      case SeedPacketStatus.Active:
        spriteImage = SEED_PACKET_IMAGE;
        break;

      case SeedPacketStatus.Disabled:
        spriteImage = DISABLED_SEED_PACKET_IMAGE;
        break;

      case SeedPacketStatus.Selected:
        spriteImage = SELECTED_SEED_PACKET_IMAGE;
        break;
    }
  }

  function setStatus(newStatus: SeedPacketStatus) {
    status = newStatus;
  }

  function setCooldownTimer(timer: number) {
    cooldownTimer = timer;
  }

  function setCooldownTimerPaused(isPaused: boolean) {
    cooldownTimerPaused = isPaused;
  }

  return {
    get position() {
      return position;
    },
    get size() {
      return size;
    },
    get plantType() {
      return plantType;
    },
    get status() {
      return status;
    },
    get spriteImage() {
      return spriteImage;
    },
    get cooldownTimer() {
      return cooldownTimer;
    },
    get cooldownTimerPaused() {
      return cooldownTimerPaused;
    },
    draw,
    update,
    setStatus,
    setCooldownTimer,
    setCooldownTimerPaused,
  };
}
