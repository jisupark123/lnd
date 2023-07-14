// 숫자로 바꿀 수 있는 문자열인지 확인하는 함수
export function isNumeric(s: string): boolean {
  return !isNaN(parseFloat(s));
}
