// x를 min과 max 범위 안으로 조정하는 함수
export function adjustInRange(x: number, min: number, max: number): number {
  return x < min ? min : x > max ? max : x;
}
