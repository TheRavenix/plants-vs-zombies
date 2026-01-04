import type { HasHealth } from "./types";

export function entityTakeDamage(hasHealth: HasHealth, amount: number) {
  hasHealth.health = Math.max(0, hasHealth.health - amount);
}
