import { describe, it, expect } from 'vitest';
import { validatePhone } from './validatePhone';

describe('validatePhone', () => {
  it('숫자와 하이픈만 포함된 유효한 연락처를 허용한다', () => {
    expect(validatePhone('010-1234-5678')).toBe(true);
    expect(validatePhone('02-123-4567')).toBe(true);
    expect(validatePhone('1234567890')).toBe(true);
    expect(validatePhone('010-123-4567')).toBe(true);
    expect(validatePhone('123-456-7890')).toBe(true);
  });

  it('숫자와 하이픈 이외의 문자가 포함된 연락처를 거부한다', () => {
    expect(validatePhone('010 1234 5678')).toBe(false); // 공백 포함
    expect(validatePhone('010.1234.5678')).toBe(false); // 점 포함
    expect(validatePhone('010-1234-5678a')).toBe(false); // 영문자 포함
    expect(validatePhone('(010)1234-5678')).toBe(false); // 괄호 포함
    expect(validatePhone('010-1234-5678#')).toBe(false); // 특수문자 포함
    expect(validatePhone('')).toBe(false); // 빈 문자열
    expect(validatePhone('abc')).toBe(false); // 영문자만
    expect(validatePhone('가나다')).toBe(false); // 한글 포함
  });

  it('edge case: 하이픈만 있는 경우와 숫자만 있는 경우', () => {
    expect(validatePhone('-')).toBe(true); // 하이픈만
    expect(validatePhone('123')).toBe(true); // 숫자만
    expect(validatePhone('---')).toBe(true); // 하이픈만 여러개
    expect(validatePhone('0')).toBe(true); // 숫자 하나
  });
});