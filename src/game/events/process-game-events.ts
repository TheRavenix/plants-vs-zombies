import { createShot } from "../entities/shots/service/create-shot";
import { createSun } from "../entities/sun";

import type { LevelStore } from "../level";
import type { GameEvent } from "./types";

export function processGameEvents(events: GameEvent[], store: LevelStore) {
  const { actions } = store;

  for (const { type, payload } of events) {
    switch (type) {
      case "SPAWN_SHOT": {
        const shot = createShot(
          payload.type,
          payload.x,
          payload.y,
          store,
          payload.direction,
        );

        if (shot !== null) {
          actions.addShot(shot);
        }
        break;
      }

      case "SPAWN_SUN": {
        actions.addSun(
          createSun({
            x: payload.x,
            y: payload.y,
            amount: payload.amount,
          }),
        );
        break;
      }

      case "DESPAWN_SHOT": {
        actions.removeShotById(payload.id);
        break;
      }
    }
  }
}
