export function adjustInRange(x: number, min: number, max: number): number {
  return x < min ? min : x > max ? max : x;
}
