import type { Board } from "../board";
import { FontFamily, FontSize } from "../constants/font";

type DrawTextFont = {
  fontSize?: FontSize;
  fontFamily?: FontFamily;
};

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

  ctx.fillStyle = fillStyle;
  ctx.font = `${fontSize}px ${fontFamily}`;

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
