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
  PlantTakeDamageOptions,
  PlantUpdateOptions,
} from "./types";
import type { Vector2 } from "@/game/utils/vector";

type RepeaterState = {
  shotTimer: number;
} & PlantState;

type Repeater = Plant<RepeaterState>;

type CreateRepeaterOptions = Vector2;

const REPEATER_TOUGHNESS = 300;
const REPEATER_SUNCOST = 100;
const REPEATER_SHOT_INTERVAL = 1500;
const REPEATER_RANGE = TILE_WIDTH * 6;

function createRepeater(options: CreateRepeaterOptions): Repeater {
  const { x, y } = options;
  const state: RepeaterState = {
    name: PlantName.Repeater,
    id: createPlantId(),
    x,
    y,
    width: PLANT_WIDTH,
    height: PLANT_HEIGHT,
    toughness: REPEATER_TOUGHNESS,
    sunCost: REPEATER_SUNCOST,
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
    takeDamage,
  };
}

function draw(options: PlantDrawOptions<RepeaterState>) {
  const { state, board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  drawPlantRect(options);
  drawPlantName(options);

  state.hitbox.draw(state.hitbox, board);
}

function update(options: PlantUpdateOptions<RepeaterState>) {
  const { deltaTime, state, game } = options;

  state.shotTimer += deltaTime;

  if (state.shotTimer >= REPEATER_SHOT_INTERVAL) {
    for (const zombie of game.zombieManager.zombies) {
      if (
        state.y === zombie.state.y &&
        zombie.state.x <= state.x + REPEATER_RANGE
      ) {
        game.shotManager.addShots(
          createPeashot({
            x: state.x + state.width,
            y: state.y + SHOT_HEIGHT / 2,
          }),
          createPeashot({
            x: state.x + state.width + TILE_WIDTH / 2,
            y: state.y + SHOT_HEIGHT / 2,
          })
        );
        break;
      }
    }
    state.shotTimer = 0;
  }
  if (state.toughness <= 0) {
    game.plantManager.removePlantById(state.id);
  }

  syncPlantHitbox(options);
}

function takeDamage(options: PlantTakeDamageOptions<RepeaterState>) {
  const { state, damage } = options;

  state.toughness -= damage;
}

export { createRepeater };
