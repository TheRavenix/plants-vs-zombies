import {
  FirepeaInfo,
  PeashooterInfo,
  RepeaterInfo,
  SnowpeaInfo,
  ThreepeaterInfo,
} from "./pea";
import { PuffshroomInfo, SunshroomInfo } from "./shroom";
import { SunflowerInfo } from "./sunflower";
import { TorchwoodInfo } from "./torchwood";
import { WallNutInfo } from "./wall-nut";

import type { PlantInfoType } from "./types";

export const PLANT_WIDTH = 96;
export const PLANT_HEIGHT = 96;

export enum PlantType {
  Peashooter = "PEASHOOTER",
  Sunflower = "SUNFLOWER",
  Repeater = "REPEATER",
  Threepeater = "THREEPEATER",
  Snowpea = "SNOWPEA",
  WallNut = "WALL_NUT",
  Puffshroom = "PUFFSHROOM",
  Sunshroom = "SUNSHROOM",
  Torchwood = "TORCHWOOD",
  Firepea = "FIREPEA",
}

export const PlantInfo: Readonly<Record<PlantType, PlantInfoType>> = {
  [PlantType.Peashooter]: PeashooterInfo,
  [PlantType.Sunflower]: SunflowerInfo,
  [PlantType.Repeater]: RepeaterInfo,
  [PlantType.Threepeater]: ThreepeaterInfo,
  [PlantType.Snowpea]: SnowpeaInfo,
  [PlantType.Firepea]: FirepeaInfo,
  [PlantType.WallNut]: WallNutInfo,
  [PlantType.Puffshroom]: PuffshroomInfo,
  [PlantType.Sunshroom]: SunshroomInfo,
  [PlantType.Torchwood]: TorchwoodInfo,
};
