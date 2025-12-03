import { createHitbox, drawHitbox } from "@/game/helpers/hitbox";
import { drawPlantId, drawPlantRect, syncPlantHitbox } from "./helpers";
import { createPeashot, SHOT_HEIGHT } from "../shots";

import { PLANT_HEIGHT, PLANT_WIDTH, PlantId } from "./constants";

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

interface Peashooter extends Plant<PeashooterState> {}

type CreatePeashooterOptions = Vector2;

const PEASHOOTER_TOUGHNESS = 300;
const PEASHOOTER_SUNCOST = 100;
const PEASHOOTER_SHOT_INTERVAL = 1500;

function createPeashooter(options: CreatePeashooterOptions): Peashooter {
  const { x, y } = options;
  const state: PeashooterState = {
    id: PlantId.Peashooter,
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
    state,
    draw: drawPeashooter,
    update: updatePeashooter,
  };
}

function drawPeashooter(options: PlantDrawOptions<PeashooterState>) {
  const { state, board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  drawPlantRect(options);
  drawPlantId(options);
  drawHitbox(state.hitbox, board);
}

function updatePeashooter(options: PlantUpdateOptions<PeashooterState>) {
  const { deltaTime, state, game } = options;

  state.shotTimer += deltaTime;

  if (state.shotTimer >= PEASHOOTER_SHOT_INTERVAL) {
    game.shotManager.addShot(
      createPeashot({
        x: state.x + state.width,
        y: state.y + state.height / 2 - SHOT_HEIGHT / 2,
      })
    );
    state.shotTimer = 0;
  }

  syncPlantHitbox(options);
}

export { createPeashooter, drawPeashooter, updatePeashooter };
