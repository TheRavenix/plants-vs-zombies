import type {
  FirepeaShot,
  Peashot,
  RicochetPeashot,
  SnowpeaShot,
} from "../pea";
import type { Shroomshot } from "../shroomshot";

export type Shot =
  | Peashot
  | SnowpeaShot
  | Shroomshot
  | FirepeaShot
  | RicochetPeashot;
