import { describe, expect, it } from "vitest";
import { createTorchwood } from "./torchwood";
import { TILE_HEIGHT, TILE_WIDTH } from "@/game/board";
import { createPeashot, createSnowpeaShot } from "../../shots";

import type { Shot } from "../../shots/types/shot";
import type { DespawnShotEvent, SpawnShotEvent } from "@/game/level/events";

describe("Torchood Logic", () => {
  it("Should not do anything if there's no peashot", () => {
    const shots: Shot[] = [];

    const torchwood = createTorchwood({
      x: TILE_WIDTH * 3,
      y: TILE_HEIGHT * 3,
      getShots: () => shots,
    });
    const shot = createSnowpeaShot({
      x: TILE_WIDTH * 3,
      y: TILE_HEIGHT * 3,
      getZombies: () => [],
    });

    shots.push(shot);

    const events = torchwood.update(16);

    expect(events.length).toBe(0);
  });

  it("Should REMOVE peashot and ADD firepea-shot", () => {
    const shots: Shot[] = [];

    const torchwood = createTorchwood({
      x: TILE_WIDTH * 3,
      y: TILE_HEIGHT * 3,
      getShots: () => shots,
    });
    const shot = createPeashot({
      x: TILE_WIDTH * 3,
      y: TILE_HEIGHT * 3,
      getZombies: () => [],
    });

    shots.push(shot);

    const events = torchwood.update(16);

    expect(events.length).toBe(2);

    const event1 = events[0] as DespawnShotEvent;
    const event2 = events[1] as SpawnShotEvent;

    expect(event1.type).toBe("DESPAWN_SHOT");
    expect(event2.type).toBe("SPAWN_SHOT");
    expect(event2.payload.type).toBe("FIREPEA_SHOT");
  });
});
