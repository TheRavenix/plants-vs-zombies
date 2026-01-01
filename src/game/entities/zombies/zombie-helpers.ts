import { canvasActions } from "@/game/helpers/canvas";
import { FontSize } from "@/game/constants/font";

import type {
  BaseZombie,
  Zombie,
  ZombieDrawOptions,
  ZombieUpdateOptions,
} from "./types";

function createZombieId(): string {
  return `ZOMBIE-${crypto.randomUUID()}`;
}

function drawZombieRect(zombie: BaseZombie, options: ZombieDrawOptions) {
  const { ctx } = options.board;

  if (ctx === null) {
    return;
  }

  ctx.fillStyle = "#708090";
  ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
  ctx.fill();
}

function drawZombieType(zombie: Zombie, options: ZombieDrawOptions) {
  const { ctx } = options.board;

  if (ctx === null) {
    return;
  }

  canvasActions.drawText(
    options.board,
    `${zombie.type} ${zombie.health}`,
    zombie.x,
    zombie.y + zombie.height / 2,
    "#000000",
    {
      fontSize: FontSize.Xs,
    }
  );
}

function handleZombieDefaultMovement(
  zombie: BaseZombie,
  options: ZombieUpdateOptions
) {
  const { speed, freezeAmount } = zombie;
  const freezedSpeed = (speed * freezeAmount) / 100;
  zombie.x -= (speed - freezedSpeed) * (options.deltaTime / 1000);
}

function syncZombieHitbox(zombie: BaseZombie) {
  zombie.hitbox.x = zombie.x;
  zombie.hitbox.y = zombie.y;
}

export const zombieHelpers = {
  createZombieId,
  drawZombieRect,
  drawZombieType,
  syncZombieHitbox,
  handleZombieDefaultMovement,
} as const;
