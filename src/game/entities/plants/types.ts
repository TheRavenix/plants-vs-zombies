import type { Board } from "@/game/board";
import type { Game } from "@/game/game";
import type { Hitbox } from "@/game/helpers/hitbox";
import type { Size } from "@/game/types/size";
import type { Vector2 } from "@/game/types/vector";
import type { PlantType } from "./constants";

export type BasePlant = {
  id: string;
  toughness: number;
  sunCost: number;
  hitbox: Hitbox;
} & Vector2 &
  Size;

// TODO: Move Custom Plants to their own files
// TODO: Keep in mind the a => b and b => a effect (dependant)
export type Sunflower = {
  rechargeTimer: number;
  type: PlantType.Sunflower;
} & BasePlant;

export type Peashooter = {
  shotTimer: number;
  type: PlantType.Peashooter;
} & BasePlant;

export type Repeater = {
  shotTimer: number;
  type: PlantType.Repeater;
} & BasePlant;

export type Threepeater = {
  shotTimer: number;
  type: PlantType.Threepeater;
} & BasePlant;

export type Plant = Sunflower | Peashooter | Repeater | Threepeater;

export type PlantDrawOptions = {
  board: Board;
};

export type PlantUpdateOptions = {
  deltaTime: number;
  game: Game;
};

export type PlantTakeDamageOptions = {
  damage: number;
};
