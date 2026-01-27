import { describe, expect, it } from "vitest";
import { createSunflower } from "./sunflower";
import { TILE_HEIGHT, TILE_WIDTH } from "@/game/board";

describe("Sunflower Logic", () => {
  it("Should GENERATE sun", () => {
    const sunflower = createSunflower({
      x: TILE_WIDTH * 3,
      y: TILE_HEIGHT * 3,
    });

    const events = sunflower.update(1000 * 24);

    expect(events.length).toBe(1);
    expect(events[0].type).toBe("SPAWN_SUN");
  });
});
