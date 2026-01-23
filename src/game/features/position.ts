export interface Position {
  readonly x: number;
  readonly y: number;
  setX(x: number): void;
  setY(y: number): void;
  set(x: number, y: number): void;
}

type Options = {
  x: number;
  y: number;
};

export function createPosition(options: Options): Position {
  let x = options.x;
  let y = options.y;

  return {
    get x() {
      return x;
    },
    get y() {
      return y;
    },
    setX(newX) {
      x = newX;
    },
    setY(newY) {
      y = newY;
    },
    set(newX, newY) {
      x = newX;
      y = newY;
    },
  };
}
