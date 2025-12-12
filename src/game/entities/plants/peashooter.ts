import { createHitbox } from "@/game/helpers/hitbox";
import {
  createPlantId,
  drawPlantName,
  drawPlantRect,
  syncPlantHitbox,
} from "./helpers";
import { createPeashot, SHOT_HEIGHT } from "../shots";

import { PLANT_HEIGHT, PLANT_WIDTH, PlantName } from "./constants";
import { TILE_WIDTH } from "@/game/board";

import type {
  Plant,
  PlantDrawOptions,
  PlantState,
  PlantUpdateOptions,
} from "./types";
import type { Vector2 } from "@/game/utils/vector";

type PeashooterState = {
  shotTimer: number;
} & PlantState;

type Peashooter = Plant<PeashooterState>;

type CreatePeashooterOptions = Vector2;

const PEASHOOTER_TOUGHNESS = 300;
const PEASHOOTER_SUNCOST = 100;
const PEASHOOTER_SHOT_INTERVAL = 1500;
const PEASHOOTER_RANGE = TILE_WIDTH * 6;

function createPeashooter(options: CreatePeashooterOptions): Peashooter {
  const { x, y } = options;
  const state: PeashooterState = {
    name: PlantName.Peashooter,
    id: createPlantId(),
    x,
    y,
    width: PLANT_WIDTH,
    height: PLANT_HEIGHT,
    toughness: PEASHOOTER_TOUGHNESS,
    sunCost: PEASHOOTER_SUNCOST,
    shotTimer: 0,
    hitbox: createHitbox({
      x,
      y,
      width: PLANT_WIDTH,
      height: PLANT_HEIGHT,
    }),
  };

  return {
    get state() {
      return state;
    },
    draw,
    update,
  };
}

function draw(options: PlantDrawOptions<PeashooterState>) {
  const { state, board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  drawPlantRect(options);
  drawPlantName(options);

  state.hitbox.draw(state.hitbox, board);
}

function update(options: PlantUpdateOptions<PeashooterState>) {
  const { deltaTime, state, game } = options;

  state.shotTimer += deltaTime;

  if (state.shotTimer >= PEASHOOTER_SHOT_INTERVAL) {
    for (const zombie of game.zombieManager.zombies) {
      if (
        state.y === zombie.state.y &&
        zombie.state.x <= state.x + PEASHOOTER_RANGE
      ) {
        game.shotManager.addShot(
          createPeashot({
            x: state.x + state.width,
            y: state.y + SHOT_HEIGHT / 2,
          })
        );
        break;
      }
    }
    state.shotTimer = 0;
  }

  syncPlantHitbox(options);
}

export { createPeashooter };
