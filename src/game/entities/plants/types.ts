import type { Board } from "@/game/board";
import type { Game } from "@/game/game";
import type { Hitbox } from "@/game/helpers/hitbox";
import type { Size } from "@/game/utils/size";
import type { Vector2 } from "@/game/utils/vector";
import type { PlantName } from "./constants";

export type PlantState = {
  name: PlantName;
  id: string;
  toughness: number;
  sunCost: number;
  get hitbox(): Hitbox;
} & Vector2 &
  Size;

export type Plant<S extends PlantState = PlantState> = {
  get state(): S;
  draw(options: PlantDrawOptions): void;
  update(options: PlantUpdateOptions): void;
};

export type PlantDrawOptions<S extends PlantState = PlantState> = {
  get state(): S;
  get board(): Board;
};

export type PlantUpdateOptions<S extends PlantState = PlantState> = {
  deltaTime: number;
  get state(): S;
  get game(): Game;
};
