import type { Game } from "@/game/game";
import type { Sun } from "./sun";

function addSun(suns: Sun[], sun: Sun): Sun[] {
  return [...suns, sun];
}

function removeSunById(suns: Sun[], id: string): Sun[] {
  return suns.filter((sun) => sun.id !== id);
}

function findSunById(suns: Sun[], id: string): Sun | undefined {
  return suns.find((sun) => sun.id === id);
}

function findSunWithinCoordinates(
  suns: Sun[],
  x: number,
  y: number
): Sun | undefined {
  return suns.find((sun) => {
    return (
      x >= sun.x &&
      x <= sun.x + sun.width &&
      y >= sun.y &&
      y <= sun.y + sun.height
    );
  });
}

function collectSun(sun: Sun, game: Game) {
  game.sun += sun.amount;
  game.suns = removeSunById(game.suns, sun.id);
}

export const sunActions = {
  addSun,
  removeSunById,
  findSunById,
  findSunWithinCoordinates,
  collectSun,
} as const;
