import type { Hitbox } from "../features/hitbox";

export function findFirstCollision<T>(
  source: Hitbox,
  targets: T[],
  getHitbox: (target: T) => Hitbox,
): T | undefined {
  return targets.find((target) => source.isColliding(getHitbox(target)));
}
