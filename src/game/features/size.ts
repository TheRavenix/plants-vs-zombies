export interface Size {
  readonly width: number;
  readonly height: number;
  setWidth(width: number): void;
  setHeight(height: number): void;
  set(width: number, height: number): void;
}

type Options = {
  width: number;
  height: number;
};

export function createSize(options: Options): Size {
  let width = options.width;
  let height = options.height;

  return {
    get width() {
      return width;
    },
    get height() {
      return height;
    },
    setWidth(newWidth) {
      width = newWidth;
    },
    setHeight(newHeight) {
      height = newHeight;
    },
    set(newWidth, newHeight) {
      width = newWidth;
      height = newHeight;
    },
  };
}
