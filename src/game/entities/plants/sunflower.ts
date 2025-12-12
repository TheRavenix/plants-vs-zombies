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
  PlantTakeDamageOptions,
  PlantUpdateOptions,
} from "./types";
import type { Vector2 } from "@/game/utils/vector";

type SunflowerState = {
  rechargeTimer: number;
} & PlantState;

type Sunflower = Plant<SunflowerState>;

type CreateSunflowerOptions = Vector2;

const TOUGHNESS = 300;
const SUNCOST = 50;
const SUN_PRODUCTION = 25;
const RECHARGE_INTERVAL = 7500;

function createSunflower(options: CreateSunflowerOptions): Sunflower {
  const { x, y } = options;
  const state: SunflowerState = {
    name: PlantName.Sunflower,
    id: createPlantId(),
    x,
    y,
    width: PLANT_WIDTH,
    height: PLANT_HEIGHT,
    toughness: TOUGHNESS,
    sunCost: SUNCOST,
    hitbox: createHitbox({
      x,
      y,
      width: PLANT_WIDTH,
      height: PLANT_HEIGHT,
    }),
    rechargeTimer: 0,
  };

  return {
    get state() {
      return state;
    },
    draw,
    update,
    takeDamage,
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
  const { state, game, deltaTime } = options;

  state.rechargeTimer += deltaTime;

  if (state.rechargeTimer >= RECHARGE_INTERVAL) {
    game.sun += SUN_PRODUCTION;
    state.rechargeTimer = 0;
  }
  if (state.toughness <= 0) {
    game.plantManager.removePlantById(state.id);
  }

  syncPlantHitbox(options);
}

function takeDamage(options: PlantTakeDamageOptions<SunflowerState>) {
  const { state, damage } = options;

  state.toughness -= damage;
}

export { createSunflower };
