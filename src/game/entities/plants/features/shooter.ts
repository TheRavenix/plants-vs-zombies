import { TILE_HEIGHT } from "@/game/board";
import { createTimer, type Timer } from "../../features/timer";

import type { Position } from "@/game/features/position";
import type { LevelStore } from "@/game/level";
import type { Updatable } from "@/game/types/updatable";

export interface Shooter extends Updatable {
  readonly shotTimer: Timer;
}

type Options = {
  shotInterval: number;
  position: Position;
  range: number;
  burstCount?: number;
  burstDelay?: number;
  store: LevelStore;
  onShoot(): void;
};

export function createShooter(options: Options): Shooter {
  const {
    shotInterval,
    position,
    range,
    store,
    burstCount = 1,
    burstDelay = 0,
    onShoot,
  } = options;
  const { state } = store;
  let shotsFiredInBurst = 0;
  const burstTimer = createTimer({
    maxTime: burstDelay,
    onReady() {
      onShoot();
      shotsFiredInBurst++;
    },
  });
  const shotTimer = createTimer({
    maxTime: shotInterval,
    onReady() {
      const ableToShoot = state.zombies.some((zombie) => {
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
          burstTimer.reset();
        }
      }
    },
  });

  function update(deltaTime: number) {
    if (shotsFiredInBurst > 0 && shotsFiredInBurst < burstCount) {
      burstTimer.update(deltaTime);
      return;
    }

    shotTimer.update(deltaTime);
  }

  return {
    get shotTimer() {
      return shotTimer;
    },
    update,
  };
}
