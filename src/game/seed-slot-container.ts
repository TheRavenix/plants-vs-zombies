import {
  BOARD_ROWS,
  boardActions,
  TILE_HEIGHT,
  TILE_WIDTH,
  type Board,
} from "./board";
import { PlantSpriteImage, PlantType } from "./entities/plants";

import type { Game } from "./game";
import type { Size } from "./types/size";
import type { Vector2 } from "./types/vector";

type SeedPacket = {
  type: PlantType;
} & Vector2 &
  Size;

type SeedSlot = {
  name: string;
  packet: SeedPacket;
} & Vector2 &
  Size;

type SeedSlotContainer = {
  game: Game | null;
  slots: SeedSlot[];
  activeSlot: SeedSlot | null;
} & Vector2 &
  Size;

const SLOT_WIDTH = 80;
const SLOT_HEIGHT = 80;
const SLOT_OFFSET_Y = (TILE_HEIGHT - SLOT_HEIGHT) / 2;
const SLOT_OFFSET_X = (TILE_WIDTH - SLOT_WIDTH) / 2;
// const MAX_SLOTS = 10;
const SEED_PACKET_WIDTH = 72;
const SEED_PACKET_HEIGHT = 72;
// const SEED_PACKET_OFFSET_X = (SLOT_WIDTH - SEED_PACKET_WIDTH) / 2;
const SEED_PACKET_OFFSET_Y = (SLOT_HEIGHT - SEED_PACKET_HEIGHT) / 2;
const SEED_PACKET_DEFAULT_Y = SLOT_OFFSET_Y + SEED_PACKET_OFFSET_Y;
const SEED_SLOT_FULL_IMAGE = new Image(SLOT_WIDTH, SLOT_HEIGHT);
const SEED_SLOT_OPEN_IMAGE = new Image(SLOT_WIDTH, SLOT_HEIGHT);
const SEED_SLOT_CENTER_IMAGE = new Image(SLOT_WIDTH, SLOT_HEIGHT);
const SEED_SLOT_CLOSE_IMAGE = new Image(SLOT_WIDTH, SLOT_HEIGHT);
const SEED_PACKET_IMAGE = new Image(SLOT_WIDTH, SLOT_HEIGHT);

SEED_SLOT_FULL_IMAGE.src = "./seed/seed-slot/Seed_Slot_Full.png";
SEED_SLOT_OPEN_IMAGE.src = "./seed/seed-slot/Seed_Slot_Open.png";
SEED_SLOT_CENTER_IMAGE.src = "./seed/seed-slot/Seed_Slot_Center.png";
SEED_SLOT_CLOSE_IMAGE.src = "./seed/seed-slot/Seed_Slot_Close.png";
SEED_PACKET_IMAGE.src = "./seed/seed-packet/Seed_Packet.png";

function drawSeedSlot(
  slot: SeedSlot,
  board: Board,
  spriteImage: HTMLImageElement
) {
  const { ctx } = board;
  const { packet } = slot;

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
  ctx.drawImage(
    SEED_PACKET_IMAGE,
    Math.round(packet.x),
    Math.round(packet.y),
    packet.width,
    packet.height
  );
  ctx.drawImage(
    PlantSpriteImage[packet.type],
    Math.round(packet.x),
    Math.round(packet.y),
    packet.width / 2,
    packet.height / 2
  );
}

function createSeedSlotContainer(): SeedSlotContainer {
  const slots: SeedSlot[] = [];

  slots.push(
    {
      name: "Slot 1",
      x: TILE_WIDTH,
      y: SLOT_OFFSET_Y,
      width: SLOT_WIDTH,
      height: SLOT_HEIGHT,
      packet: {
        type: PlantType.Peashooter,
        x: TILE_WIDTH,
        y: SEED_PACKET_DEFAULT_Y,
        width: SEED_PACKET_WIDTH,
        height: SEED_PACKET_HEIGHT,
      },
    },
    {
      name: "Slot 2",
      x: TILE_WIDTH + SLOT_WIDTH,
      y: SLOT_OFFSET_Y,
      width: SLOT_WIDTH,
      height: SLOT_HEIGHT,
      packet: {
        type: PlantType.Snowpea,
        x: TILE_WIDTH + SLOT_WIDTH,
        y: SEED_PACKET_DEFAULT_Y,
        width: SEED_PACKET_WIDTH,
        height: SEED_PACKET_HEIGHT,
      },
    },
    {
      name: "Slot 3",
      x: TILE_WIDTH + SLOT_WIDTH * 2,
      y: SLOT_OFFSET_Y,
      width: SLOT_WIDTH,
      height: SLOT_HEIGHT,
      packet: {
        type: PlantType.Torchwood,
        x: TILE_WIDTH + SLOT_WIDTH * 2,
        y: SEED_PACKET_DEFAULT_Y,
        width: SEED_PACKET_WIDTH,
        height: SEED_PACKET_HEIGHT,
      },
    }
  );

  return {
    game: null,
    x: 0,
    y: SLOT_OFFSET_Y,
    width: TILE_WIDTH * BOARD_ROWS,
    height: SLOT_HEIGHT,
    slots,
    activeSlot: null,
  };
}

function drawSeedSlotContainer(
  seedSlotContainer: SeedSlotContainer,
  board: Board
) {
  const { x, y, width, height, slots } = seedSlotContainer;
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
    Math.round(SLOT_OFFSET_X),
    Math.round(SLOT_OFFSET_Y),
    SLOT_WIDTH,
    SLOT_HEIGHT
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

function updateSeedSlotContainer(_seedSlotContainer: SeedSlotContainer) {}

function x(
  seedSlotContainer: SeedSlotContainer,
  board: Board,
  event: PointerEvent
): boolean {
  const { canvas } = board;
  const { x, y } = boardActions.getCanvasCoordinates(canvas, event);

  return (
    y >= SLOT_OFFSET_Y &&
    y <= SLOT_OFFSET_Y + SLOT_HEIGHT &&
    x >= TILE_WIDTH &&
    x <= seedSlotContainer.width
  );
}

const seedSlotContainerActions = {
  createSeedSlotContainer,
  drawSeedSlotContainer,
  updateSeedSlotContainer,
  x,
};

export { seedSlotContainerActions, SEED_PACKET_DEFAULT_Y };
export type { SeedSlotContainer };
