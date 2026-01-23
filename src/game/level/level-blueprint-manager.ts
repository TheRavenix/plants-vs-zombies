import { BOARD_COLS, TILE_HEIGHT, TILE_WIDTH } from "../board";
import { createZombie } from "../entities/zombies/service/create-zombie";
import { createSeedPacket } from "../seed";

import type { LevelContext } from "./level";
import type { Startable } from "../types/startable";
import type { Updatable } from "../types/updatable";
import type { PlantType } from "../entities/plants/constants/plant-type";
import type { Zombie } from "../entities/zombies/types/zombie";
import type { ZombieType } from "../entities/zombies";

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
  readonly levelBlueprint: LevelBlueprint;
  readonly triggeredTimelineIds: string[];
  readonly started: boolean;
  readonly lastStayingZombie: Zombie | null;
}

type Options = {
  levelBlueprint: LevelBlueprint;
  ctx: LevelContext;
};

export function createLevelBlueprintManager(
  options: Options,
): LevelBlueprintManager {
  const { ctx } = options;
  let levelBlueprint = options.levelBlueprint;
  let triggeredTimelineIds: string[] = [];
  let started = false;
  let lastStayingZombie: Zombie | null = null;

  function update(_deltaTime: number) {
    const timeMins = parseFloat((ctx.time / 1000).toFixed(2));

    for (const timeline of levelBlueprint.timelines) {
      if (timeMins >= timeline.timeTrigger) {
        if (triggeredTimelineIds.includes(timeline.id)) {
          continue;
        }

        for (const zombieConfig of timeline.zombies) {
          const zombie = createZombie(
            zombieConfig.type,
            TILE_WIDTH * BOARD_COLS,
            TILE_HEIGHT * zombieConfig.lane,
            ctx,
          );

          if (zombie === null) {
            continue;
          }

          ctx.addZombie(zombie);
        }

        triggeredTimelineIds.push(timeline.id);
      }
    }

    if (triggeredTimelineIds.length === levelBlueprint.timelines.length) {
      if (ctx.zombies.length === 1) {
        if (lastStayingZombie === null) {
          lastStayingZombie = ctx.zombies[0];
        }
      }
      if (ctx.zombies.length <= 0) {
        ctx.setGameOver(true);

        if (ctx.rewardPacket === null) {
          if (lastStayingZombie !== null) {
            ctx.setRewardPacket(
              createSeedPacket({
                plantType: levelBlueprint.winConditions.reward,
                x: lastStayingZombie.position.x,
                y: lastStayingZombie.position.y,
              }),
            );
          }
        }
      }
    }
  }

  function start() {
    if (!started) {
      ctx.setSunAmount(levelBlueprint.config.initialSun);
      started = true;
    }
  }

  return {
    get levelBlueprint() {
      return levelBlueprint;
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
