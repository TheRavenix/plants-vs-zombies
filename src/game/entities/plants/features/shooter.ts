import { TILE_HEIGHT } from "@/game/board";
import { createTimer, type Timer } from "../../features/timer";

import type { Position } from "@/game/features/position";
import type { Updatable } from "@/game/types/updatable";
import type { Zombie } from "../../zombies/types/zombie";

export interface Shooter extends Updatable<boolean> {
  readonly shotTimer: Timer;
}

type Options = {
  shotInterval: number;
  position: Position;
  range: number;
  burstCount?: number;
  burstDelay?: number;
  getZombies(): Zombie[];
};

export function createShooter(options: Options): Shooter {
  const {
    shotInterval,
    position,
    range,
    burstCount = 1,
    burstDelay = 0,
    getZombies,
  } = options;
  let shoot = false;
  let shotsFiredInBurst = 0;
  const burstTimer = createTimer({
    maxTime: burstDelay,
    onReady() {
      shoot = true;
      shotsFiredInBurst++;
    },
  });
  const shotTimer = createTimer({
    maxTime: shotInterval,
    onReady() {
      const ableToShoot = getZombies().some((zombie) => {
        return (
          position.y >= zombie.position.y &&
          position.y <= zombie.position.y + TILE_HEIGHT &&
          zombie.position.x <= position.x + range &&
          zombie.position.x >= position.x
        );
      });

      if (ableToShoot) {
        shoot = true;

        if (burstCount > 1) {
          shotsFiredInBurst = 1;
          burstTimer.reset();
        }
      }
    },
  });

  function update(deltaTime: number) {
    shoot = false;

    if (shotsFiredInBurst > 0 && shotsFiredInBurst < burstCount) {
      burstTimer.update(deltaTime);
      return shoot;
    }

    shotTimer.update(deltaTime);
    return shoot;
  }

  return {
    get shotTimer() {
      return shotTimer;
    },
    update,
  };
}
