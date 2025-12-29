export function closestValue(target: number, numbers: number[]): number {
  return numbers.reduce((prev, curr) => {
    return Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev;
  });
}

export function closestLowerValue(target: number, numbers: number[]): number {
  return closestValue(
    target,
    numbers.filter((num) => num < target)
  );
}
