import "./style.css";

import { createBoard } from "./game/board";
import { createGame, startGame } from "./game/game";

const app = document.querySelector("#app");

window.addEventListener("load", () => {
  const board = createBoard({
    root: app,
    center: true,
  });
  const game = createGame();

  startGame(game, board);
});
