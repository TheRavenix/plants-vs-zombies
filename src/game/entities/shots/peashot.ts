import { createHitbox, isHitboxColliding } from "@/game/helpers/hitbox";
import {
  createShotId,
  drawShotName,
  drawShotRect,
  syncShotHitbox,
} from "./helpers";

import { SHOT_HEIGHT, SHOT_WIDTH, ShotName } from "./constants";

import type {
  Shot,
  ShotDrawOptions,
  ShotState,
  ShotUpdateOptions,
} from "./types";
import type { Vector2 } from "@/game/utils/vector";

type PeashotState = ShotState;

type Peashot = Shot<PeashotState>;

type CreatePeashotOptions = Vector2;

const PEASHOT_DAMAGE = 25;
const PEASHOT_SPEED = 150;

function createPeashot(options: CreatePeashotOptions): Peashot {
  const { x, y } = options;
  const state: PeashotState = {
    name: ShotName.Peashot,
    id: createShotId(),
    x,
    y,
    width: SHOT_WIDTH,
    height: SHOT_HEIGHT,
    damage: PEASHOT_DAMAGE,
    speed: PEASHOT_SPEED,
    hitbox: createHitbox({
      x,
      y,
      width: SHOT_WIDTH,
      height: SHOT_HEIGHT,
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

function draw(options: ShotDrawOptions<PeashotState>) {
  const { state, board } = options;
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  drawShotRect(options);
  drawShotName(options);

  state.hitbox.draw(state.hitbox, board);
}

function update(options: ShotUpdateOptions<PeashotState>) {
  const { deltaTime, state, game } = options;

  state.x += state.speed * (deltaTime / 1000);

  let deleteZombieId: string | null = null;

  for (let i = 0; i < game.zombieManager.zombies.length; i++) {
    const zombie = game.zombieManager.zombies[i];

    if (isHitboxColliding(state.hitbox, zombie.state.hitbox)) {
      deleteZombieId = zombie.state.id;
      break;
    }
  }

  if (deleteZombieId !== null) {
    const zombie = game.zombieManager.findZombieById(deleteZombieId);

    if (zombie === undefined) {
      return;
    }

    zombie.takeDamage({
      state: zombie.state,
      damage: PEASHOT_DAMAGE,
    });
    game.shotManager.removeShotById(state.id);
    deleteZombieId = null;
  }

  syncShotHitbox(options);
}

export { createPeashot };
