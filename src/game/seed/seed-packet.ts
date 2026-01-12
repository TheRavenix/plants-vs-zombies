import { PlantInfo, type PlantType } from "../entities/plants";
import { drawSunImage } from "../entities/sun";
import { drawCenteredText } from "../helpers/canvas";

import type { Board } from "../board";
import type { Vector2, Rect } from "../types/math";

export type SeedPacket = {
  plantType: PlantType;
  status: SeedPacketStatus;
  spriteImage: HTMLImageElement;
  cooldownTimer: number;
  cooldownTimerPaused: boolean;
} & Rect;

type CreateSeedPacketOptions = {
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
  SEED_PACKET_HEIGHT
);
const DISABLED_SEED_PACKET_IMAGE = new Image(
  SEED_PACKET_WIDTH,
  SEED_PACKET_HEIGHT
);

export enum SeedPacketStatus {
  Active = "ACTIVE",
  Disabled = "DISABLED",
  Selected = "SELECTED",
}

SEED_PACKET_IMAGE.src = "./seed/seed-packet/Seed_Packet.png";
SELECTED_SEED_PACKET_IMAGE.src = "./seed/seed-packet/Selected_Seed_Packet.png";
DISABLED_SEED_PACKET_IMAGE.src = "./seed/seed-packet/Disabled_Seed_Packet.png";

export function createSeedPacket(options: CreateSeedPacketOptions): SeedPacket {
  const status = options.status ? options.status : SeedPacketStatus.Active;

  return {
    plantType: options.plantType,
    status,
    spriteImage: SEED_PACKET_IMAGE,
    x: options.x,
    y: options.y,
    width: SEED_PACKET_WIDTH,
    height: SEED_PACKET_HEIGHT,
    cooldownTimer: 0,
    cooldownTimerPaused: true,
  };
}

export function drawSeedPacket(packet: SeedPacket, board: Board) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  const plantInfo = PlantInfo[packet.plantType];
  const isSelected = packet.status === SeedPacketStatus.Selected;

  ctx.drawImage(
    packet.spriteImage,
    Math.round(packet.x),
    Math.round(isSelected ? packet.y - SEED_PACKET_ACTIVE_Y : packet.y),
    packet.width,
    packet.height
  );
  ctx.drawImage(
    plantInfo.SpriteImage,
    Math.round(packet.x + packet.width / 4),
    Math.round(
      isSelected
        ? packet.y + SEED_PACKET_ACTIVE_Y
        : packet.y + SEED_PACKET_ACTIVE_Y * 2
    ),
    packet.width / 2,
    packet.height / 2
  );
  drawSunImage(
    {
      x: packet.x + packet.width - 22,
      y: isSelected
        ? packet.y - SEED_PACKET_ACTIVE_Y + packet.height - 20
        : packet.y + packet.height - 20,
      width: 16,
      height: 16,
    },
    board
  );
  drawCenteredText(
    board,
    plantInfo.SunCost.toString(),
    packet.x + packet.width / 2,
    isSelected
      ? packet.y - SEED_PACKET_ACTIVE_Y + packet.height - 10
      : packet.y + packet.height - 10,
    isSelected ? "#ffffff" : "#000000"
  );
}

export function updateSeedPacket(packet: SeedPacket, _deltaTime: number) {
  switch (packet.status) {
    case SeedPacketStatus.Active:
      packet.spriteImage = SEED_PACKET_IMAGE;
      break;

    case SeedPacketStatus.Disabled:
      packet.spriteImage = DISABLED_SEED_PACKET_IMAGE;
      break;

    case SeedPacketStatus.Selected:
      packet.spriteImage = SELECTED_SEED_PACKET_IMAGE;
      break;
  }
}
