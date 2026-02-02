import {
  BOARD_COLS,
  BOARD_HEIGHT,
  BOARD_WIDTH,
  TILE_HEIGHT,
  TILE_WIDTH,
} from "../board";
import { createZombie } from "../entities/zombies/service/create-zombie";
import { createSeedPacket } from "../seed";

import type { Startable } from "../types/startable";
import type { Updatable } from "../types/updatable";
import type { PlantType } from "../entities/plants/constants/plant-type";
import type { Zombie } from "../entities/zombies/types/zombie";
import type { ZombieType } from "../entities/zombies";
import type { LevelStore } from "./level-store";

export type LevelBlueprint = {
  id: string;
  name: string;
  difficulty: number;
  config: {
    initialSun: number;
    lanes: number;
    background: string;
    canSpawnSunFromSky: boolean;
    forcedSeeds: string[];
    bannedSeeds: string[];
  };
  timelines: {
    id: string;
    timeTrigger: number;
    action: string;
    eventType?: string;
    message?: string;
    zombies: { type: ZombieType; lane: number }[];
  }[];
  winConditions: {
    type: string;
    reward: PlantType;
  };
};

export interface LevelBlueprintManager extends Updatable, Startable {
  readonly blueprint: LevelBlueprint;
  readonly triggeredTimelineIds: string[];
  readonly started: boolean;
  readonly lastStayingZombie: Zombie | null;
}

type Options = {
  blueprint: LevelBlueprint;
  store: LevelStore;
};

export function createLevelBlueprintManager(
  options: Options,
): LevelBlueprintManager {
  const { store } = options;
  const { state, actions } = store;
  let blueprint = options.blueprint;
  let triggeredTimelineIds: string[] = [];
  let started = false;
  let lastStayingZombie: Zombie | null = null;

  function update(_deltaTime: number) {
    const timeMins = parseFloat((state.time / 1000).toFixed(2));

    for (const timeline of blueprint.timelines) {
      if (timeMins >= timeline.timeTrigger) {
        if (triggeredTimelineIds.includes(timeline.id)) {
          continue;
        }

        for (const zombieConfig of timeline.zombies) {
          const zombie = createZombie(
            zombieConfig.type,
            TILE_WIDTH * BOARD_COLS,
            TILE_HEIGHT * zombieConfig.lane,
            store,
          );

          if (zombie === null) {
            continue;
          }

          actions.addZombie(zombie);
        }

        triggeredTimelineIds.push(timeline.id);
      }
    }

    if (triggeredTimelineIds.length === blueprint.timelines.length) {
      if (state.zombies.length === 1) {
        if (lastStayingZombie === null) {
          lastStayingZombie = state.zombies[0];
        }
      }
      if (state.zombies.length <= 0) {
        actions.setGameOver(true);

        if (state.rewardPacket === null) {
          if (lastStayingZombie !== null) {
            actions.setRewardPacket(
              createSeedPacket({
                plantType: blueprint.winConditions.reward,
                x: lastStayingZombie.position.x,
                y: lastStayingZombie.position.y,
              }),
            );
          } else {
            actions.setRewardPacket(
              createSeedPacket({
                plantType: blueprint.winConditions.reward,
                x: BOARD_WIDTH / 2,
                y: BOARD_HEIGHT / 2,
              }),
            );
          }
        }
      }
    }
  }

  function start() {
    if (!started) {
      actions.setSunAmount(blueprint.config.initialSun);
      started = true;
    }
  }

  return {
    get blueprint() {
      return blueprint;
    },
    get triggeredTimelineIds() {
      return triggeredTimelineIds;
    },
    get started() {
      return started;
    },
    get lastStayingZombie() {
      return lastStayingZombie;
    },
    update,
    start,
  };
}
