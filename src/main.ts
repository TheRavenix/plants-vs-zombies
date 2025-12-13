import "./style.css";

import { boardActions } from "./game/board";
import { gameActions } from "./game/game";

const app = document.querySelector("#app");

window.addEventListener("load", () => {
  const board = boardActions.createBoard({
    root: app,
    center: true,
  });
  const game = gameActions.createGame();

  gameActions.startGame(game, board);
});
