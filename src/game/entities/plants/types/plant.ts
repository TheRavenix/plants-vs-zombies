import type { Peashooter, Repeater, Snowpea, Threepeater } from "../pea";
import type { Sunflower } from "../sunflower";
import type { WallNut } from "../wall-nut";

export type Plant =
  | Sunflower
  | Peashooter
  | Repeater
  | Threepeater
  | Snowpea
  | WallNut;
