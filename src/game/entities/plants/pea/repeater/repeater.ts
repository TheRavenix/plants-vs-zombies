import { TILE_HEIGHT, TILE_WIDTH, type Board } from "@/game/board";
import { createPlantId } from "../../service";
import { PlantType } from "../../constants/plant-type";
import { createHitbox } from "@/game/entities/features/hitbox";
import { createPosition } from "@/game/features/position";
import { createSize } from "@/game/features/size";
import { createHealth } from "@/game/entities/features/health";
import { createShooter } from "../../features/shooter";
import { getOrLoadImage } from "@/game/assets";
import { ShotType } from "@/game/entities/shots";
import { createSpawnShotEvent } from "@/game/events";

import type {
  PlantInfoType,
  ShooterPlantOptions,
  ShooterPlant,
} from "../../types";
import type { GameEvent } from "@/game/events/types";

export interface Repeater extends ShooterPlant {
  readonly type: PlantType.Repeater;
}

type Options = ShooterPlantOptions;

const TYPE = PlantType.Repeater as const;
const HEALTH = 300;
const SUNCOST = 200;
const SHOT_INTERVAL = 1500;
const RANGE = TILE_WIDTH * 7;
const COOLDOWN = 7500;
const SPRITE_WIDTH = 64;
const SPRITE_HEIGHT = 64;
const OFFSET_X = (TILE_WIDTH - SPRITE_WIDTH) / 2;
const OFFSET_Y = (TILE_HEIGHT - SPRITE_HEIGHT) / 2;
const SPRITE_PATH = "./plants/pea/repeater/Repeater.png";

export const RepeaterInfo: PlantInfoType = {
  SunCost: SUNCOST,
  SpritePath: SPRITE_PATH,
  Cooldown: COOLDOWN,
};

export function createRepeater(options: Options): Repeater {
  const { getZombies } = options;
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
  const shooter = createShooter({
    shotInterval: SHOT_INTERVAL,
    position,
    range: RANGE,
    burstCount: 2,
    burstDelay: 150,
    getZombies,
  });

  function draw(board: Board) {
    const { ctx } = board;

    if (ctx === null) {
      return;
    }

    ctx.drawImage(
      getOrLoadImage(SPRITE_PATH),
      Math.round(position.x),
      Math.round(position.y),
      size.width,
      size.height,
    );
    hitbox.draw(board);
  }

  function update(deltaTime: number) {
    const events: GameEvent[] = [];

    hitbox.position.set(position.x, position.y);

    const ableToShoot = shooter.update(deltaTime);

    if (ableToShoot) {
      events.push(
        createSpawnShotEvent({
          type: ShotType.Peashot,
          x: position.x + size.width,
          y: position.y,
        }),
      );
    }

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
    get shooter() {
      return shooter;
    },
    draw,
    update,
  };
}
