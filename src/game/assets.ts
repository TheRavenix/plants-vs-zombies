const imageCache: Record<string, HTMLImageElement> = {};

/**
 * For testing only. If you want more control over loading move to an async way
 */
export function getOrLoadImage(path: string): HTMLImageElement {
  if (imageCache[path]) {
    return imageCache[path];
  }

  const img = new Image();
  img.src = path;
  imageCache[path] = img;
  return img;
}
