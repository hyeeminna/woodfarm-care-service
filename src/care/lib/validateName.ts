/**
 * 이름/업체명 유효성 검사 함수
 * 공백만으로 구성된 문자열을 거부
 * 
 * @param value 검증할 이름 또는 업체명 문자열
 * @returns 유효한 경우 true (trim 후 빈 문자열이 아닌 경우), 그렇지 않으면 false
 */
export function validateName(value: string): boolean {
  return value.trim() !== '';
}