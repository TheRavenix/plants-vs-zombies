import type {
  FirepeaShot,
  Peashot,
  RicochetPeashot,
  SnowpeaShot,
} from "../pea";
import type { PuffShroomshot } from "../shroom";

export type Shot =
  | Peashot
  | SnowpeaShot
  | PuffShroomshot
  | FirepeaShot
  | RicochetPeashot;
