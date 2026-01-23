import { BOARD_HEIGHT, BOARD_WIDTH, type Board } from "../board";
import { FontSize } from "../constants/font";
import {
  drawButton,
  drawCenteredText,
  getWrappedLines,
  isPointInRect,
} from "../helpers/canvas";

import type { Rect } from "../types/math";
import type { Drawable } from "../types/drawable";
import type { Updatable } from "../types/updatable";

export type ModalButton = {
  id: string;
  text: string;
};

export interface Modal extends Drawable, Updatable {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly buttons: ModalButton[];
}

type Options = {
  title: string;
  description: string;
  buttons: ModalButton[];
};

const MODAL_WIDTH = 600;
const MODAL_HEIGHT = 350;
const MODAL_X = BOARD_WIDTH / 2 - MODAL_WIDTH / 2;
const MODAL_Y = BOARD_HEIGHT / 2 - MODAL_HEIGHT / 2;
const BUTTON_WIDTH = 120;
const BUTTON_PADDING = 20;

export function createModal(options: Options): Modal {
  let title = options.title;
  let description = options.description;
  let buttons = options.buttons;

  function draw(board: Board) {
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
      title.toUpperCase(),
      MODAL_X + MODAL_WIDTH / 2,
      MODAL_Y + 25,
      "#000000",
      {
        fontSize: FontSize.Xl,
        bold: true,
      },
    );

    const descriptionLines = getWrappedLines(
      board,
      description,
      MODAL_WIDTH / 2,
    );
    let descriptionLinesCurrentY = MODAL_Y + MODAL_HEIGHT / 3;

    for (const line of descriptionLines) {
      drawCenteredText(
        board,
        line,
        MODAL_X + MODAL_WIDTH / 2,
        descriptionLinesCurrentY,
        "#000000",
      );
      descriptionLinesCurrentY += 30;
    }

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const rect = getModalButtonRect(i, buttons);

      drawButton(board, button.text, rect.x, rect.y, rect.width, rect.height, {
        background: "#212121",
        stroke: "#000000",
        text: "#ffffff",
      });
    }
  }

  function update(_deltaTime: number) {}

  return {
    get id() {
      return createModalId();
    },
    get title() {
      return title;
    },
    get description() {
      return description;
    },
    get buttons() {
      return buttons;
    },
    draw,
    update,
  };
}

function createModalId(): string {
  return `MODAL-${crypto.randomUUID()}`;
}

// TODO: This needs to either be updated or moved or removed
export function isPointerInModalCloseArea(
  _modal: Modal,
  board: Board,
  event: PointerEvent,
): boolean {
  const { x, y } = board.getCanvasCoordinates(event);

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
    },
  );
}

export function getModalButtonRect(
  index: number,
  buttons: ModalButton[],
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
