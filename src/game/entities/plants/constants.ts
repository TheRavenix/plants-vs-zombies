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
  Peashooter = "Peashooter",
  Sunflower = "Sunflower",
  Repeater = "Repeater",
  Threepeater = "Threepeater",
  Snowpea = "Snowpea",
  WallNut = "WallNut",
  Puffshroom = "Puffshroom",
  Sunshroom = "Sunshroom",
  Torchwood = "Torchwood",
  Firepea = "Firepea",
}

export const PlantInfo: Readonly<Record<PlantType, PlantInfoType>> = {
  Peashooter: PeashooterInfo,
  Sunflower: SunflowerInfo,
  Repeater: RepeaterInfo,
  Threepeater: ThreepeaterInfo,
  Snowpea: SnowpeaInfo,
  Firepea: FirepeaInfo,
  WallNut: WallNutInfo,
  Puffshroom: PuffshroomInfo,
  Sunshroom: SunshroomInfo,
  Torchwood: TorchwoodInfo,
};
