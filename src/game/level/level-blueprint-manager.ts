import { BOARD_COLS, TILE_HEIGHT, TILE_WIDTH } from "../board";
import type { PlantType } from "../entities/plants";
import {
  addZombie,
  createZombie,
  ZombieType,
  type Zombie,
} from "../entities/zombies";
import { createSeedPacket } from "../seed";

import type { Level } from "./level";

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

export type LevelBlueprintManager = {
  levelBlueprint: LevelBlueprint;
  triggeredTimelineIds: string[];
  started: boolean;
  lastStayingZombie: Zombie | null;
};

type CreateLevelBlueprintManagerOptions = {
  levelBlueprint: LevelBlueprint;
};

export function createLevelBlueprintManager(
  options: CreateLevelBlueprintManagerOptions
): LevelBlueprintManager {
  return {
    levelBlueprint: options.levelBlueprint,
    triggeredTimelineIds: [],
    started: false,
    lastStayingZombie: null,
  };
}

export function startLevelBlueprintManager(
  levelBlueprintManager: LevelBlueprintManager,
  level: Level
) {
  if (!levelBlueprintManager.started) {
    level.sunAmount = levelBlueprintManager.levelBlueprint.config.initialSun;
    levelBlueprintManager.started = true;
  }
}

export function updateLevelBlueprintManager(
  levelBlueprintManager: LevelBlueprintManager,
  _deltaTime: number,
  level: Level
) {
  const { levelBlueprint, triggeredTimelineIds } = levelBlueprintManager;

  const timeMins = parseFloat((level.time / 1000).toFixed(2));

  for (const timeline of levelBlueprint.timelines) {
    if (timeMins >= timeline.timeTrigger) {
      if (triggeredTimelineIds.includes(timeline.id)) {
        continue;
      }

      for (const zombieConfig of timeline.zombies) {
        const zombie = createZombie(
          zombieConfig.type,
          TILE_WIDTH * BOARD_COLS,
          TILE_HEIGHT * zombieConfig.lane
        );

        if (zombie === null) {
          continue;
        }

        level.zombies = addZombie(level.zombies, zombie);
      }

      triggeredTimelineIds.push(timeline.id);
    }
  }

  if (triggeredTimelineIds.length === levelBlueprint.timelines.length) {
    if (level.zombies.length === 1) {
      if (levelBlueprintManager.lastStayingZombie === null) {
        levelBlueprintManager.lastStayingZombie = level.zombies[0];
      }
    }
    if (level.zombies.length <= 0) {
      level.gameOver = true;

      if (level.rewardPacket === null) {
        if (levelBlueprintManager.lastStayingZombie !== null) {
          level.rewardPacket = createSeedPacket({
            plantType: levelBlueprint.winConditions.reward,
            x: levelBlueprintManager.lastStayingZombie.x,
            y: levelBlueprintManager.lastStayingZombie.y,
          });
        }
      }
    }
  }
}
