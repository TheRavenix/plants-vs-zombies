import { TILE_HEIGHT } from "@/game/board";

import type { Position } from "@/game/features/position";
import type { LevelContext } from "@/game/level";
import type { Updatable } from "@/game/types/updatable";

export interface Shooter extends Updatable {
  readonly shotTimer: number;
}

type Options = {
  shotInterval: number;
  position: Position;
  range: number;
  burstCount?: number;
  burstDelay?: number;
  ctx: LevelContext;
  onShoot(): void;
};

export function createShooter(options: Options): Shooter {
  const {
    shotInterval,
    position,
    range,
    ctx,
    burstCount = 1,
    burstDelay = 0,
    onShoot,
  } = options;
  let shotTimer = 0;
  let shotsFiredInBurst = 0;
  let burstTimer = 0;

  function update(deltaTime: number) {
    if (shotsFiredInBurst > 0 && shotsFiredInBurst < burstCount) {
      burstTimer += deltaTime;

      if (burstTimer >= burstDelay) {
        onShoot();
        shotsFiredInBurst++;
        burstTimer = 0;
      }

      return;
    }

    shotTimer += deltaTime;

    if (shotTimer >= shotInterval) {
      const ableToShoot = ctx.zombies.some((zombie) => {
        return (
          position.y >= zombie.position.y &&
          position.y <= zombie.position.y + TILE_HEIGHT &&
          zombie.position.x <= position.x + range &&
          zombie.position.x >= position.x
        );
      });

      if (ableToShoot) {
        onShoot();
        if (burstCount > 1) {
          shotsFiredInBurst = 1;
          burstTimer = 0;
        }
      }
      shotTimer = 0;
    }
  }

  return {
    get shotTimer() {
      return shotTimer;
    },
    update,
  };
}
