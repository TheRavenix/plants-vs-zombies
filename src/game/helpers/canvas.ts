import type { Board } from "../board";
import { FontFamily, FontSize } from "../constants/font";
import type { Size } from "../types/size";
import type { Vector2 } from "../types/vector";

type DrawTextFont = {
  fontSize?: FontSize;
  fontFamily?: FontFamily;
  bold?: boolean;
};

type DrawButtonFillStyle = {
  background: string;
  stroke: string;
  text: string;
};

export type Button<T> = {
  id: T;
  text: string;
  fill: DrawButtonFillStyle;
  font?: DrawTextFont;
} & Vector2 &
  Size;

export function drawText(
  board: Board,
  text: string,
  x: number,
  y: number,
  fillStyle: string,
  font?: DrawTextFont
) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  const fontSize = font?.fontSize !== undefined ? font.fontSize : FontSize.Base;
  const fontFamily =
    font?.fontFamily !== undefined ? font.fontFamily : FontFamily.Pixelify;
  const bold = font?.bold !== undefined ? font.bold : false;

  ctx.fillStyle = fillStyle;
  ctx.font = `${bold ? "bold " : ""}${fontSize}px ${fontFamily}`;

  ctx.fillText(text, x, y);
}

export function drawCenteredText(
  board: Board,
  text: string,
  x: number,
  y: number,
  fillStyle: string,
  font?: DrawTextFont
) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.save();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  drawText(board, text, x, y, fillStyle, font);

  ctx.restore();
}

export function drawButton(
  board: Board,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: DrawButtonFillStyle,
  font?: DrawTextFont
) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.save();

  ctx.fillStyle = fill.background;
  ctx.fillRect(x, y, width, height);

  ctx.strokeStyle = fill.stroke;
  ctx.lineWidth = 4;
  ctx.strokeRect(x, y, width, height);

  drawCenteredText(board, text, x + width / 2, y + height / 2, fill.text, {
    ...font,
    fontSize: font?.fontSize !== undefined ? font.fontSize : FontSize.Xl,
    bold: font?.bold !== undefined ? font.bold : true,
  });

  ctx.restore();
}
