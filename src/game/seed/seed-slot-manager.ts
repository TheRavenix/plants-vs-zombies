import { BOARD_ROWS, TILE_HEIGHT, TILE_WIDTH, type Board } from "../board";
import { PlantInfo } from "../entities/plants";
import { drawSunImage } from "../entities/sun";
import {
  createSeedPacket,
  SEED_PACKET_ACTIVE_Y,
  SEED_PACKET_MARGIN_LEFT,
  SeedPacketStatus,
  type SeedPacket,
} from "./seed-packet";
import { drawCenteredText } from "../helpers/canvas";
import { FontSize } from "../constants/font";
import { createPosition, type Position } from "../features/position";
import { createSize, type Size } from "../features/size";
import { PlantType } from "../entities/plants/constants/plant-type";

import type { Rect } from "../types/math";
import type { Drawable } from "../types/drawable";
import type { Updatable } from "../types/updatable";

// TODO: Rect type shouldn't be used here
export type SeedSlot = {
  id: string;
  packet: SeedPacket;
} & Rect;

export interface SeedSlotManager extends Drawable, Updatable {
  readonly position: Position;
  readonly size: Size;
  readonly slots: SeedSlot[];
  readonly selectedSlot: SeedSlot | null;
  setSelectedSlot(slot: SeedSlot | null): void;
}

type Options = {
  getSunAmount(): number;
};

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

export function createSeedSlotManager(options: Options): SeedSlotManager {
  const { getSunAmount } = options;
  const position = createPosition({
    x: 0,
    y: SEED_SLOT_OFFSET_Y,
  });
  const size = createSize({
    width: TILE_WIDTH * BOARD_ROWS,
    height: SEED_SLOT_HEIGHT,
  });
  const slots: SeedSlot[] = [];
  let selectedSlot: SeedSlot | null = null;

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
    },
    {
      id: createSeedSlotId(),
      x: TILE_WIDTH + SEED_SLOT_WIDTH * 4,
      y: SEED_SLOT_OFFSET_Y,
      width: SEED_SLOT_WIDTH,
      height: SEED_SLOT_HEIGHT,
      packet: createSeedPacket({
        plantType: PlantType.CherryBomb,
        x: TILE_WIDTH + SEED_SLOT_WIDTH * 4 + SEED_PACKET_MARGIN_LEFT,
        y: SEED_SLOT_OFFSET_Y + SEED_PACKET_ACTIVE_Y,
      }),
    },
  );

  function draw(board: Board) {
    const { ctx } = board;

    if (ctx === null) {
      return;
    }

    ctx.fillStyle = "transparent";
    // ctx.fillStyle = "red";
    ctx.fillRect(position.x, position.y, size.width, size.height);
    ctx.fill();

    ctx.drawImage(
      SEED_SLOT_FULL_IMAGE,
      Math.round(SEED_SLOT_OFFSET_X + SEED_PACKET_MARGIN_LEFT / 2),
      Math.round(SEED_SLOT_OFFSET_Y),
      SEED_SLOT_WIDTH - SEED_PACKET_MARGIN_LEFT,
      SEED_SLOT_HEIGHT,
    );

    drawSunImage(
      {
        x: SEED_SLOT_OFFSET_X + SEED_PACKET_MARGIN_LEFT / 2 + 20,
        y: SEED_SLOT_OFFSET_Y + 4,
        width: 40,
        height: 40,
      },
      board,
    );
    drawCenteredText(
      board,
      getSunAmount().toString(),
      SEED_SLOT_OFFSET_X + SEED_PACKET_MARGIN_LEFT / 2 + SEED_SLOT_WIDTH / 2,
      SEED_SLOT_OFFSET_Y + SEED_SLOT_HEIGHT / 1.25,
      "#ffffff",
      {
        fontSize: FontSize.TwoXl,
      },
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

  function update(deltaTime: number) {
    handleSeedPacketStatus(selectedSlot, slots, getSunAmount());
    handleSeedPacketCooldown(slots, deltaTime);

    for (const slot of slots) {
      slot.packet.update(deltaTime);
    }
  }

  function setSelectedSlot(slot: SeedSlot | null) {
    selectedSlot = slot;
  }

  return {
    get position() {
      return position;
    },
    get size() {
      return size;
    },
    get slots() {
      return slots;
    },
    get selectedSlot() {
      return selectedSlot;
    },
    draw,
    update,
    setSelectedSlot,
  };
}

function createSeedSlotId(): string {
  return `SEED_SLOT-${crypto.randomUUID()}`;
}

function drawSeedSlot(
  slot: SeedSlot,
  board: Board,
  spriteImage: HTMLImageElement,
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
    slot.height,
  );
  slot.packet.draw(board);
}

function handleSeedPacketStatus(
  selectedSlot: SeedSlot | null,
  slots: SeedSlot[],
  sunAmount: number,
) {
  for (const slot of slots) {
    const packet = slot.packet;

    if (selectedSlot !== null) {
      if (packet.status === SeedPacketStatus.Disabled) {
        continue;
      }
      if (slot.id === selectedSlot.id) {
        packet.setStatus(SeedPacketStatus.Selected);
      } else {
        packet.setStatus(SeedPacketStatus.Active);
      }
    } else {
      const plantSunCost = PlantInfo[packet.plantType].SunCost;

      if (sunAmount < plantSunCost) {
        packet.setStatus(SeedPacketStatus.Disabled);
      } else {
        packet.setStatus(SeedPacketStatus.Active);
      }
    }
  }
}

function handleSeedPacketCooldown(slots: SeedSlot[], deltaTime: number) {
  for (const slot of slots) {
    const packet = slot.packet;

    if (packet.cooldownTimerPaused) {
      continue;
    }

    packet.setCooldownTimer(packet.cooldownTimer + deltaTime);

    if (packet.cooldownTimer < PlantInfo[packet.plantType].Cooldown) {
      packet.setStatus(SeedPacketStatus.Disabled);
    } else {
      packet.setCooldownTimerPaused(true);
      packet.setCooldownTimer(0);
    }
  }
}
