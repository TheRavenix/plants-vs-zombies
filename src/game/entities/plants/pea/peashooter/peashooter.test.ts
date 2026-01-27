import { describe, expect, it } from "vitest";
import { createPeashooter } from "./peashooter";
import { TILE_HEIGHT, TILE_WIDTH } from "@/game/board";
import { createBasicZombie } from "../../../zombies";

import type { Plant } from "../../types/plant";
import type { Zombie } from "../../../zombies/types/zombie";

describe("Peashooter Logic", () => {
  it("Should NOT shoot if the lane is empty", () => {
    const peashooter = createPeashooter({
      x: TILE_WIDTH * 3,
      y: TILE_HEIGHT * 3,
      getZombies: () => [],
    });

    const events = peashooter.update(1500);

    expect(events.length).toBe(0);
  });

  it("Should SHOOT if the there's a zombie in the lane", () => {
    const plants: Plant[] = [];
    const zombies: Zombie[] = [];

    const peashooter = createPeashooter({
      x: TILE_WIDTH * 3,
      y: TILE_HEIGHT * 3,
      getZombies: () => zombies,
    });
    const zombie = createBasicZombie({
      x: TILE_WIDTH * 7,
      y: TILE_HEIGHT * 3,
      getPlants: () => plants,
    });

    plants.push(peashooter);
    zombies.push(zombie);

    const events = peashooter.update(1500);

    expect(events.length).toBe(1);
    expect(events[0].type).toBe("SPAWN_SHOT");
  });
});
