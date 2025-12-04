import { createHitbox } from "@/game/helpers/hitbox";
import {
  createPlantId,
  drawPlantName,
  drawPlantRect,
  syncPlantHitbox,
} from "./helpers";

import { PLANT_HEIGHT, PLANT_WIDTH, PlantName } from "./constants";

import type {
  Plant,
  PlantDrawOptions,
  PlantState,
  PlantUpdateOptions,
} from "./types";
import type { Vector2 } from "@/game/utils/vector";

type SunflowerState = PlantState;

interface Sunflower extends Plant<SunflowerState> {}

type CreateSunflowerOptions = Vector2;

const SUNFLOWER_TOUGHNESS = 300;
const SUNFLOWER_SUNCOST = 50;

function createSunflower(options: CreateSunflowerOptions): Sunflower {
  const { x, y } = options;
  const state: SunflowerState = {
    name: PlantName.Sunflower,
    id: createPlantId(),
    x,
    y,
    width: PLANT_WIDTH,
    height: PLANT_HEIGHT,
    toughness: SUNFLOWER_TOUGHNESS,
    sunCost: SUNFLOWER_SUNCOST,
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

function draw(options: PlantDrawOptions<SunflowerState>) {
  const { state, board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  drawPlantRect(options);
  drawPlantName(options);

  state.hitbox.draw(state.hitbox, board);
}

function update(options: PlantUpdateOptions<SunflowerState>) {
  syncPlantHitbox(options);
}

export { createSunflower };
