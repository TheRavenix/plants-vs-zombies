import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  getCanvasCoordinates,
  type Board,
} from "../board";
import { FontSize } from "../constants/font";
import { drawButton, drawCenteredText, isPointInRect } from "../helpers/canvas";

import type { Rect } from "../types/math";

export type ModalButton = {
  id: string;
  text: string;
};

export type Modal = {
  id: string;
  title: string;
  description: string;
  buttons: ModalButton[];
};

type CreateModalOptions = {
  title: string;
  description: string;
  buttons: ModalButton[];
};

const MODAL_WIDTH = 500;
const MODAL_HEIGHT = 300;
const MODAL_X = BOARD_WIDTH / 2 - MODAL_WIDTH / 2;
const MODAL_Y = BOARD_HEIGHT / 2 - MODAL_HEIGHT / 2;
const BUTTON_WIDTH = 120;
const BUTTON_PADDING = 20;

function createModalId(): string {
  return `MODAL-${crypto.randomUUID()}`;
}

export function createModal(options: CreateModalOptions): Modal {
  return {
    id: createModalId(),
    title: options.title,
    description: options.description,
    buttons: options.buttons,
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
    modal.title.toUpperCase(),
    MODAL_X + MODAL_WIDTH / 2,
    MODAL_Y + 25,
    "#000000",
    {
      fontSize: FontSize.Xl,
      bold: true,
    }
  );
  drawCenteredText(
    board,
    modal.description,
    MODAL_X + MODAL_WIDTH / 2,
    MODAL_Y + MODAL_HEIGHT / 2 - 25,
    "#000000"
  );
  for (let i = 0; i < modal.buttons.length; i++) {
    const button = modal.buttons[i];
    const rect = getModalButtonRect(i, modal.buttons);

    drawButton(board, button.text, rect.x, rect.y, rect.width, rect.height, {
      background: "#212121",
      stroke: "#000000",
      text: "#ffffff",
    });
  }
}

export function updateModal(_modal: Modal, _deltaTime: number) {}

export function isPointerInModalCloseArea(
  _modal: Modal,
  board: Board,
  event: PointerEvent
): boolean {
  const { canvas } = board;
  const { x, y } = getCanvasCoordinates(canvas, event);

  return !isPointInRect(
    {
      x,
      y,
    },
    {
      x: MODAL_X,
      y: MODAL_Y,
      width: MODAL_WIDTH,
      height: MODAL_HEIGHT,
    }
  );
}

export function getModalButtonRect(
  index: number,
  buttons: ModalButton[]
): Rect {
  const totalButtonsWidth =
    BUTTON_WIDTH * buttons.length + BUTTON_PADDING * (buttons.length - 1);
  const startX = MODAL_X + (MODAL_WIDTH - totalButtonsWidth) / 2;
  const xPos = startX + index * (BUTTON_WIDTH + BUTTON_PADDING);

  return {
    x: xPos,
    y: MODAL_Y + MODAL_HEIGHT - 70,
    width: BUTTON_WIDTH,
    height: 40,
  };
}
