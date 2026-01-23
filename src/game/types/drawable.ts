import type { Board } from "../board";

export interface Drawable {
  draw(board: Board): void;
}
