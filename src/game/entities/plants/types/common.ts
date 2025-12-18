import type { Board } from "@/game/board";
import type { Game } from "@/game/game";
import type { Hitbox } from "@/game/helpers/hitbox";
import type { Size } from "@/game/types/size";
import type { Vector2 } from "@/game/types/vector";

export type BasePlant = {
  id: string;
  toughness: number;
  sunCost: number;
  hitbox: Hitbox;
} & Vector2 &
  Size;

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
