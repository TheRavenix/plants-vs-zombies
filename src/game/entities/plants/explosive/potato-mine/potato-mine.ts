import { createPlantId, drawPlantRect, drawPlantType } from "../../service";
import { PlantType } from "../../constants/plant-type";
import { createHitbox } from "@/game/entities/features/hitbox";
import { createPosition } from "@/game/features/position";
import { createSize } from "@/game/features/size";
import { createHealth } from "@/game/entities/features/health";
import { TILE_HEIGHT, TILE_WIDTH, type Board } from "@/game/board";

import type {
  BasePlant,
  GetZombiesOptions,
  PlantInfoType,
  PlantOptions,
} from "../../types";
import type { LevelEvent } from "@/game/level/events/types";

export interface PotatoMine extends BasePlant {
  type: PlantType.PotatoMine;
}

type Options = PlantOptions & GetZombiesOptions;

const TYPE = PlantType.PotatoMine as const;
const HEALTH = 100;
const SUNCOST = 0;
const COOLDOWN = 0;
const SPRITE_WIDTH = 64;
const SPRITE_HEIGHT = 64;
const OFFSET_X = (TILE_WIDTH - SPRITE_WIDTH) / 2;
const OFFSET_Y = (TILE_HEIGHT - SPRITE_HEIGHT) / 2;
const SPRITE_PATH = "";

export const PotatoMineInfo: PlantInfoType = {
  SunCost: SUNCOST,
  SpritePath: SPRITE_PATH,
  Cooldown: COOLDOWN,
};

export function createPotatoMine(options: Options): PotatoMine {
  const id = createPlantId();
  const position = createPosition({
    x: options.x + OFFSET_X,
    y: options.y + OFFSET_Y,
  });
  const size = createSize({
    width: SPRITE_WIDTH,
    height: SPRITE_HEIGHT,
  });
  const health = createHealth({
    hp: HEALTH,
  });
  const hitbox = createHitbox({
    x: position.x,
    y: position.y,
    width: size.width,
    height: size.height,
  });

  function draw(board: Board) {
    const { ctx } = board;

    if (ctx === null) {
      return;
    }

    drawPlantRect(position, size, "yellow", board);
    drawPlantType(TYPE, position, size, health, board);

    hitbox.draw(board);
  }

  function update(_deltaTime: number) {
    const events: LevelEvent[] = [];

    hitbox.position.set(position.x, position.y);

    return events;
  }

  return {
    get type() {
      return TYPE;
    },
    get id() {
      return id;
    },
    get position() {
      return position;
    },
    get size() {
      return size;
    },
    get health() {
      return health;
    },
    get sunCost() {
      return SUNCOST;
    },
    get hitbox() {
      return hitbox;
    },
    draw,
    update,
  };
}
