/**
 * 연락처 유효성 검사 함수
 * 숫자와 하이픈만 허용하는 정규표현식을 사용하여 검증
 * 
 * @param value 검증할 연락처 문자열
 * @returns 유효한 경우 true, 그렇지 않으면 false
 */
export function validatePhone(value: string): boolean {
  return /^[0-9-]+$/.test(value);
}