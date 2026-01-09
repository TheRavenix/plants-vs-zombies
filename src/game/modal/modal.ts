import { BOARD_HEIGHT, BOARD_WIDTH, type Board } from "../board";
import { drawButton, drawCenteredText, type Button } from "../helpers/canvas";

export type Modal = {
  id: string;
  title: string;
  description: string;
  actions: Button<unknown>[];
  active: boolean;
};

type CreateModalOptions = {
  title: string;
  description: string;
  actions: Button<unknown>[];
};

const MODAL_WIDTH = 500;
const MODAL_HEIGHT = 300;
const MODAL_X = BOARD_WIDTH / 2 - MODAL_WIDTH / 2;
const MODAL_Y = BOARD_HEIGHT / 2 - MODAL_HEIGHT / 2;

function createModalId(): string {
  return `MODAL-${crypto.randomUUID()}`;
}

export function createModal(options: CreateModalOptions): Modal {
  return {
    id: createModalId(),
    title: options.title,
    description: options.description,
    actions: options.actions,
    active: true,
  };
}

export function drawModal(modal: Modal, board: Board) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(MODAL_X, MODAL_Y, MODAL_WIDTH, MODAL_HEIGHT);

  drawCenteredText(
    board,
    modal.title,
    MODAL_X + MODAL_WIDTH / 2,
    MODAL_Y + 25,
    "#000000"
  );
  drawCenteredText(
    board,
    modal.description,
    MODAL_X + MODAL_WIDTH / 2,
    MODAL_Y + MODAL_HEIGHT / 2 - 25,
    "#000000"
  );
  for (const action of modal.actions) {
    drawButton(
      board,
      action.text,
      action.x,
      action.y,
      action.width,
      action.height,
      action.fill,
      action.font
    );
  }
}

export function updateModal(_modal: Modal, _deltaTime: number) {}

export function removeInactiveModals(modals: Modal[]): Modal[] {
  return modals.filter((modal) => modal.active);
}
