// 첫글자를 대문자로 바꾸는 함수
// 빈문자열이 들어오면 그대로 반환한다.
export default function capitalize(s: string): string {
  return !s.length ? '' : s.charAt(0).toUpperCase() + s.slice(1);
}
