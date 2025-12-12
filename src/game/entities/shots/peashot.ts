import { createHitbox, isHitboxColliding } from "@/game/helpers/hitbox";
import { createShotId, drawShotRect, syncShotHitbox } from "./helpers";

import { SHOT_HEIGHT, SHOT_WIDTH, ShotName } from "./constants";

import type {
  Shot,
  ShotDrawOptions,
  ShotState,
  ShotUpdateOptions,
} from "./types";
import type { Vector2 } from "@/game/utils/vector";

type PeashotState = {
  direction?: PeashotDirection;
} & ShotState;

type Peashot = Shot<PeashotState>;

type CreatePeashotOptions = {
  direction?: PeashotDirection;
} & Vector2;

const DAMAGE = 15;
const SPEED = 150;

const PeashotDirection = {
  Right: "RIGHT",
  UpRight: "UP_RIGHT",
  DownRight: "DOWN_RIGHT",
} as const;
type PeashotDirection =
  (typeof PeashotDirection)[keyof typeof PeashotDirection];

function createPeashot(options: CreatePeashotOptions): Peashot {
  const { x, y, direction = PeashotDirection.Right } = options;
  const state: PeashotState = {
    name: ShotName.Peashot,
    id: createShotId(),
    x,
    y,
    width: SHOT_WIDTH,
    height: SHOT_HEIGHT,
    damage: DAMAGE,
    speed: SPEED,
    fillStyle: "#A0B09A",
    hitbox: createHitbox({
      x,
      y,
      width: SHOT_WIDTH,
      height: SHOT_HEIGHT,
    }),
    direction,
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

  state.hitbox.draw(state.hitbox, board);
}

function update(options: ShotUpdateOptions<PeashotState>) {
  const { deltaTime, state, game } = options;
  const { zombieManager, shotManager } = game;
  const speed = state.speed * (deltaTime / 1000);

  switch (state.direction) {
    case PeashotDirection.Right:
      state.x += speed;
      break;

    case PeashotDirection.UpRight:
      state.x += speed;
      state.y -= speed;
      break;

    case PeashotDirection.DownRight:
      state.x += speed;
      state.y += speed;
      break;

    default:
      state.x += speed;
  }

  let deleteZombieId: string | null = null;

  const collisionZombie = zombieManager.zombies.find((zombie) => {
    return isHitboxColliding(state.hitbox, zombie.state.hitbox);
  });

  if (collisionZombie !== undefined) {
    deleteZombieId = collisionZombie.state.id;
  }
  if (deleteZombieId !== null) {
    const zombie = zombieManager.findZombieById(deleteZombieId);

    if (zombie === undefined) {
      return;
    }

    zombie.takeDamage({
      state: zombie.state,
      damage: DAMAGE,
    });
    shotManager.removeShotById(state.id);

    deleteZombieId = null;
  }

  syncShotHitbox(options);
}

export { createPeashot };
export { PeashotDirection };
