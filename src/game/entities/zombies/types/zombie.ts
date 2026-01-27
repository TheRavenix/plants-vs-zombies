import type { BasicZombie } from "../basic-zombie/basic-zombie";
import type { FlagZombie } from "../flag-zombie/flag-zombie";

export type Zombie = BasicZombie | FlagZombie;
