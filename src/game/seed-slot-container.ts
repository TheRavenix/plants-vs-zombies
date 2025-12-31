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
  id: string;
  packet: SeedPacket;
} & Vector2 &
  Size;

type SeedSlotContainer = {
  game: Game | null;
  slots: SeedSlot[];
  activeSlot: SeedSlot | null;
} & Vector2 &
  Size;

const SEED_PACKET_MARGIN_LEFT = 8;
const SEED_SLOT_WIDTH = 80 + SEED_PACKET_MARGIN_LEFT;
const SEED_SLOT_HEIGHT = 80;
const SEED_SLOT_OFFSET_Y = (TILE_HEIGHT - SEED_SLOT_HEIGHT) / 2;
const SEED_SLOT_OFFSET_X = (TILE_WIDTH - SEED_SLOT_WIDTH) / 2;
// const MAX_SLOTS = 10;
const SEED_PACKET_WIDTH = 72;
const SEED_PACKET_HEIGHT = 72;
const SEED_PACKET_ACTIVE_Y = 4;
const SEED_SLOT_FULL_IMAGE = new Image(SEED_SLOT_WIDTH, SEED_SLOT_HEIGHT);
const SEED_SLOT_OPEN_IMAGE = new Image(SEED_SLOT_WIDTH, SEED_SLOT_HEIGHT);
const SEED_SLOT_CENTER_IMAGE = new Image(SEED_SLOT_WIDTH, SEED_SLOT_HEIGHT);
const SEED_SLOT_CLOSE_IMAGE = new Image(SEED_SLOT_WIDTH, SEED_SLOT_HEIGHT);
const SEED_PACKET_IMAGE = new Image(SEED_SLOT_WIDTH, SEED_SLOT_HEIGHT);
const ACTIVE_SEED_PACKET_IMAGE = new Image(SEED_SLOT_WIDTH, SEED_SLOT_HEIGHT);

SEED_SLOT_FULL_IMAGE.src = "./seed/seed-slot/Seed_Slot_Full.png";
SEED_SLOT_OPEN_IMAGE.src = "./seed/seed-slot/Seed_Slot_Open.png";
SEED_SLOT_CENTER_IMAGE.src = "./seed/seed-slot/Seed_Slot_Center.png";
SEED_SLOT_CLOSE_IMAGE.src = "./seed/seed-slot/Seed_Slot_Close.png";
SEED_PACKET_IMAGE.src = "./seed/seed-packet/Seed_Packet.png";
ACTIVE_SEED_PACKET_IMAGE.src = "./seed/seed-packet/Active_Seed_Packet.png";

function createSeedSlotId(): string {
  return `SEED_SLOT-${crypto.randomUUID()}`;
}

function drawSeedSlot(
  slot: SeedSlot,
  board: Board,
  seedSlotContainer: SeedSlotContainer,
  spriteImage: HTMLImageElement
) {
  const { ctx } = board;
  const { packet } = slot;
  let isActiveSlot = false;

  if (ctx === null) {
    return;
  }

  if (seedSlotContainer.activeSlot !== null) {
    isActiveSlot = slot.id === seedSlotContainer.activeSlot.id;
  }

  ctx.drawImage(
    spriteImage,
    Math.round(slot.x),
    Math.round(slot.y),
    slot.width,
    slot.height
  );
  ctx.drawImage(
    isActiveSlot ? ACTIVE_SEED_PACKET_IMAGE : SEED_PACKET_IMAGE,
    Math.round(packet.x),
    Math.round(isActiveSlot ? packet.y - SEED_PACKET_ACTIVE_Y : packet.y),
    packet.width,
    packet.height
  );
  ctx.drawImage(
    PlantSpriteImage[packet.type],
    Math.round(packet.x + SEED_PACKET_WIDTH / 2 / 2),
    Math.round(
      isActiveSlot
        ? packet.y + SEED_PACKET_ACTIVE_Y
        : packet.y + SEED_PACKET_ACTIVE_Y * 2
    ),
    packet.width / 2,
    packet.height / 2
  );
}

function createSeedSlotContainer(): SeedSlotContainer {
  const slots: SeedSlot[] = [];

  slots.push(
    {
      id: createSeedSlotId(),
      x: TILE_WIDTH,
      y: SEED_SLOT_OFFSET_Y,
      width: SEED_SLOT_WIDTH,
      height: SEED_SLOT_HEIGHT,
      packet: {
        type: PlantType.Repeater,
        x: TILE_WIDTH + SEED_PACKET_MARGIN_LEFT,
        y: SEED_SLOT_OFFSET_Y + SEED_PACKET_ACTIVE_Y,
        width: SEED_PACKET_WIDTH,
        height: SEED_PACKET_HEIGHT,
      },
    },
    {
      id: createSeedSlotId(),
      x: TILE_WIDTH + SEED_SLOT_WIDTH,
      y: SEED_SLOT_OFFSET_Y,
      width: SEED_SLOT_WIDTH,
      height: SEED_SLOT_HEIGHT,
      packet: {
        type: PlantType.Snowpea,
        x: TILE_WIDTH + SEED_SLOT_WIDTH + SEED_PACKET_MARGIN_LEFT,
        y: SEED_SLOT_OFFSET_Y + SEED_PACKET_ACTIVE_Y,
        width: SEED_PACKET_WIDTH,
        height: SEED_PACKET_HEIGHT,
      },
    },
    {
      id: createSeedSlotId(),
      x: TILE_WIDTH + SEED_SLOT_WIDTH * 2,
      y: SEED_SLOT_OFFSET_Y,
      width: SEED_SLOT_WIDTH,
      height: SEED_SLOT_HEIGHT,
      packet: {
        type: PlantType.Threepeater,
        x: TILE_WIDTH + SEED_SLOT_WIDTH * 2 + SEED_PACKET_MARGIN_LEFT,
        y: SEED_SLOT_OFFSET_Y + SEED_PACKET_ACTIVE_Y,
        width: SEED_PACKET_WIDTH,
        height: SEED_PACKET_HEIGHT,
      },
    }
  );

  return {
    game: null,
    x: 0,
    y: SEED_SLOT_OFFSET_Y,
    width: TILE_WIDTH * BOARD_ROWS,
    height: SEED_SLOT_HEIGHT,
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
    Math.round(SEED_SLOT_OFFSET_X + SEED_PACKET_MARGIN_LEFT / 2),
    Math.round(SEED_SLOT_OFFSET_Y),
    SEED_SLOT_WIDTH - SEED_PACKET_MARGIN_LEFT,
    SEED_SLOT_HEIGHT
  );

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];

    if (i === 0) {
      drawSeedSlot(slot, board, seedSlotContainer, SEED_SLOT_OPEN_IMAGE);
      continue;
    }
    if (i === slots.length - 1) {
      drawSeedSlot(slot, board, seedSlotContainer, SEED_SLOT_CLOSE_IMAGE);
      continue;
    }

    drawSeedSlot(slot, board, seedSlotContainer, SEED_SLOT_CENTER_IMAGE);
  }
}

function updateSeedSlotContainer(_seedSlotContainer: SeedSlotContainer) {}

function pointerWithinSeedSlot(
  seedSlotContainer: SeedSlotContainer,
  board: Board,
  event: PointerEvent
): boolean {
  const { canvas } = board;
  const { x, y } = boardActions.getCanvasCoordinates(canvas, event);

  return (
    y >= SEED_SLOT_OFFSET_Y &&
    y <= SEED_SLOT_OFFSET_Y + SEED_SLOT_HEIGHT &&
    x >= TILE_WIDTH &&
    x <= seedSlotContainer.width
  );
}

const seedSlotContainerActions = {
  createSeedSlotContainer,
  drawSeedSlotContainer,
  updateSeedSlotContainer,
  pointerWithinSeedSlot,
};

export { seedSlotContainerActions };
export type { SeedSlotContainer };
