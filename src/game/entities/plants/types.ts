import type { Board } from "@/game/board";
import type { Game } from "@/game/game";
import type { Hitbox } from "@/game/helpers/hitbox";
import type { Size } from "@/game/types/size";
import type { Vector2 } from "@/game/types/vector";
import type { PlantType } from "./constants";

export type Plant = {
  type: PlantType;
  id: string;
  toughness: number;
  sunCost: number;
  hitbox: Hitbox;
} & Vector2 &
  Size;

export type PlantDrawOptions<P extends Plant = Plant> = {
  plant: P;
  board: Board;
};

export type PlantUpdateOptions<P extends Plant = Plant> = {
  deltaTime: number;
  plant: P;
  game: Game;
};

export type PlantTakeDamageOptions<P extends Plant = Plant> = {
  damage: number;
  plant: P;
};
