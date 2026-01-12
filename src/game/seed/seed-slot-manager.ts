import { BOARD_ROWS, TILE_HEIGHT, TILE_WIDTH, type Board } from "../board";
import { PlantInfo, PlantType } from "../entities/plants";
import { drawSunImage } from "../entities/sun";
import {
  createSeedPacket,
  drawSeedPacket,
  SEED_PACKET_ACTIVE_Y,
  SEED_PACKET_MARGIN_LEFT,
  SeedPacketStatus,
  updateSeedPacket,
  type SeedPacket,
} from "./seed-packet";
import { drawCenteredText } from "../helpers/canvas";
import { FontSize } from "../constants/font";

import type { Rect } from "../types/math";
import type { Level } from "../level";

export type SeedSlot = {
  id: string;
  packet: SeedPacket;
} & Rect;

export type SeedSlotManager = {
  slots: SeedSlot[];
  selectedSlot: SeedSlot | null;
} & Rect;

const SEED_SLOT_WIDTH = 80 + SEED_PACKET_MARGIN_LEFT;
const SEED_SLOT_HEIGHT = 80;
const SEED_SLOT_OFFSET_Y = (TILE_HEIGHT - SEED_SLOT_HEIGHT) / 2;
const SEED_SLOT_OFFSET_X = (TILE_WIDTH - SEED_SLOT_WIDTH) / 2;
const SEED_SLOT_FULL_IMAGE = new Image(SEED_SLOT_WIDTH, SEED_SLOT_HEIGHT);
const SEED_SLOT_OPEN_IMAGE = new Image(SEED_SLOT_WIDTH, SEED_SLOT_HEIGHT);
const SEED_SLOT_CENTER_IMAGE = new Image(SEED_SLOT_WIDTH, SEED_SLOT_HEIGHT);
const SEED_SLOT_CLOSE_IMAGE = new Image(SEED_SLOT_WIDTH, SEED_SLOT_HEIGHT);

SEED_SLOT_FULL_IMAGE.src = "./seed/seed-slot/Seed_Slot_Full.png";
SEED_SLOT_OPEN_IMAGE.src = "./seed/seed-slot/Seed_Slot_Open.png";
SEED_SLOT_CENTER_IMAGE.src = "./seed/seed-slot/Seed_Slot_Center.png";
SEED_SLOT_CLOSE_IMAGE.src = "./seed/seed-slot/Seed_Slot_Close.png";

function createSeedSlotId(): string {
  return `SEED_SLOT-${crypto.randomUUID()}`;
}

export function drawSeedSlot(
  slot: SeedSlot,
  board: Board,
  spriteImage: HTMLImageElement
) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.drawImage(
    spriteImage,
    Math.round(slot.x),
    Math.round(slot.y),
    slot.width,
    slot.height
  );
  drawSeedPacket(slot.packet, board);
}

export function createSeedSlotManager(): SeedSlotManager {
  const slots: SeedSlot[] = [];

  slots.push(
    {
      id: createSeedSlotId(),
      x: TILE_WIDTH,
      y: SEED_SLOT_OFFSET_Y,
      width: SEED_SLOT_WIDTH,
      height: SEED_SLOT_HEIGHT,
      packet: createSeedPacket({
        plantType: PlantType.Peashooter,
        x: TILE_WIDTH + SEED_PACKET_MARGIN_LEFT,
        y: SEED_SLOT_OFFSET_Y + SEED_PACKET_ACTIVE_Y,
      }),
    },
    {
      id: createSeedSlotId(),
      x: TILE_WIDTH + SEED_SLOT_WIDTH,
      y: SEED_SLOT_OFFSET_Y,
      width: SEED_SLOT_WIDTH,
      height: SEED_SLOT_HEIGHT,
      packet: createSeedPacket({
        plantType: PlantType.Snowpea,
        x: TILE_WIDTH + SEED_SLOT_WIDTH + SEED_PACKET_MARGIN_LEFT,
        y: SEED_SLOT_OFFSET_Y + SEED_PACKET_ACTIVE_Y,
      }),
    },
    {
      id: createSeedSlotId(),
      x: TILE_WIDTH + SEED_SLOT_WIDTH * 2,
      y: SEED_SLOT_OFFSET_Y,
      width: SEED_SLOT_WIDTH,
      height: SEED_SLOT_HEIGHT,
      packet: createSeedPacket({
        plantType: PlantType.Firepea,
        x: TILE_WIDTH + SEED_SLOT_WIDTH * 2 + SEED_PACKET_MARGIN_LEFT,
        y: SEED_SLOT_OFFSET_Y + SEED_PACKET_ACTIVE_Y,
      }),
    },
    {
      id: createSeedSlotId(),
      x: TILE_WIDTH + SEED_SLOT_WIDTH * 3,
      y: SEED_SLOT_OFFSET_Y,
      width: SEED_SLOT_WIDTH,
      height: SEED_SLOT_HEIGHT,
      packet: createSeedPacket({
        plantType: PlantType.Sunflower,
        x: TILE_WIDTH + SEED_SLOT_WIDTH * 3 + SEED_PACKET_MARGIN_LEFT,
        y: SEED_SLOT_OFFSET_Y + SEED_PACKET_ACTIVE_Y,
      }),
    }
  );

  return {
    x: 0,
    y: SEED_SLOT_OFFSET_Y,
    width: TILE_WIDTH * BOARD_ROWS,
    height: SEED_SLOT_HEIGHT,
    slots,
    selectedSlot: null,
  };
}

export function drawSeedSlotManager(
  seedSlotManager: SeedSlotManager,
  board: Board,
  level: Level
) {
  const { x, y, width, height, slots } = seedSlotManager;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.fillStyle = "transparent";
  // ctx.fillStyle = "red";
  ctx.fillRect(x, y, width, height);
  ctx.fill();

  ctx.drawImage(
    SEED_SLOT_FULL_IMAGE,
    Math.round(SEED_SLOT_OFFSET_X + SEED_PACKET_MARGIN_LEFT / 2),
    Math.round(SEED_SLOT_OFFSET_Y),
    SEED_SLOT_WIDTH - SEED_PACKET_MARGIN_LEFT,
    SEED_SLOT_HEIGHT
  );

  drawSunImage(
    {
      x: SEED_SLOT_OFFSET_X + SEED_PACKET_MARGIN_LEFT / 2 + 20,
      y: SEED_SLOT_OFFSET_Y + 4,
      width: 40,
      height: 40,
    },
    board
  );
  drawCenteredText(
    board,
    level.sunAmount.toString(),
    SEED_SLOT_OFFSET_X + SEED_PACKET_MARGIN_LEFT / 2 + SEED_SLOT_WIDTH / 2,
    SEED_SLOT_OFFSET_Y + SEED_SLOT_HEIGHT / 1.25,
    "#ffffff",
    {
      fontSize: FontSize.TwoXl,
    }
  );

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];

    if (i === 0) {
      drawSeedSlot(slot, board, SEED_SLOT_OPEN_IMAGE);
      continue;
    }
    if (i === slots.length - 1) {
      drawSeedSlot(slot, board, SEED_SLOT_CLOSE_IMAGE);
      continue;
    }

    drawSeedSlot(slot, board, SEED_SLOT_CENTER_IMAGE);
  }
}

export function updateSeedSlotManager(
  seedSlotManager: SeedSlotManager,
  deltaTime: number,
  level: Level
) {
  handleSeedPacketStatus(level);
  handleSeedPacketCooldown(seedSlotManager, deltaTime);

  for (const slot of seedSlotManager.slots) {
    updateSeedPacket(slot.packet, deltaTime);
  }
}

function handleSeedPacketStatus(level: Level) {
  const selectedSlot = level.seedSlotManager.selectedSlot;

  for (const slot of level.seedSlotManager.slots) {
    const packet = slot.packet;

    if (selectedSlot !== null) {
      if (packet.status === SeedPacketStatus.Disabled) {
        continue;
      }
      if (slot.id === selectedSlot.id) {
        packet.status = SeedPacketStatus.Selected;
      } else {
        packet.status = SeedPacketStatus.Active;
      }
    } else {
      const plantSunCost = PlantInfo[packet.plantType].SunCost;

      if (level.sunAmount < plantSunCost) {
        packet.status = SeedPacketStatus.Disabled;
      } else {
        packet.status = SeedPacketStatus.Active;
      }
    }
  }
}

function handleSeedPacketCooldown(
  seedSlotManager: SeedSlotManager,
  deltaTime: number
) {
  for (const slot of seedSlotManager.slots) {
    const packet = slot.packet;

    if (packet.cooldownTimerPaused) {
      continue;
    }

    packet.cooldownTimer += deltaTime;

    if (packet.cooldownTimer < PlantInfo[packet.plantType].Cooldown) {
      packet.status = SeedPacketStatus.Disabled;
    } else {
      packet.cooldownTimerPaused = true;
      packet.cooldownTimer = 0;
    }
  }
}
