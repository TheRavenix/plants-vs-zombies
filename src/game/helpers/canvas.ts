import type { Board } from "../board";
import { FontFamily, FontSize } from "../constants/font";
import type { Vector2, Rect } from "../types/math";

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

export type Button = {
  id: string;
  text: string;
  fill: DrawButtonFillStyle;
  font?: DrawTextFont;
} & Rect;

export function drawText(
  board: Board,
  text: string,
  x: number,
  y: number,
  fillStyle: string,
  font?: DrawTextFont,
  maxWidth?: number,
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

  ctx.fillText(text, x, y, maxWidth);
}

export function drawCenteredText(
  board: Board,
  text: string,
  x: number,
  y: number,
  fillStyle: string,
  font?: DrawTextFont,
  maxWidth?: number,
) {
  const { ctx } = board;

  if (ctx === null) {
    return;
  }

  ctx.save();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  drawText(board, text, x, y, fillStyle, font, maxWidth);

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
  font?: DrawTextFont,
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

export function isPointInRect(point: Vector2, rect: Rect): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

export function getWrappedLines(
  board: Board,
  text: string,
  maxWidth: number,
): string[] {
  const { ctx } = board;

  if (ctx === null) {
    return [];
  }

  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;

    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  lines.push(currentLine);

  return lines;
}
