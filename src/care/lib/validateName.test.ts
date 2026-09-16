import { describe, it, expect } from 'vitest';
import { validateName } from './validateName';

describe('validateName', () => {
  it('유효한 이름/업체명을 허용한다', () => {
    expect(validateName('김철수')).toBe(true);
    expect(validateName('ABC회사')).toBe(true);
    expect(validateName('홍길동')).toBe(true);
    expect(validateName('회사명')).toBe(true);
    expect(validateName('John Doe')).toBe(true);
    expect(validateName('123번 회사')).toBe(true);
    expect(validateName('a')).toBe(true); // 최소한 하나의 문자
  });

  it('공백만으로 구성된 문자열을 거부한다', () => {
    expect(validateName('')).toBe(false); // 빈 문자열
    expect(validateName(' ')).toBe(false); // 스페이스 하나
    expect(validateName('   ')).toBe(false); // 스페이스 여러개
    expect(validateName('\t')).toBe(false); // 탭 문자
    expect(validateName('\n')).toBe(false); // 줄바꿈 문자
    expect(validateName('\r')).toBe(false); // 캐리지 리턴
    expect(validateName(' \t \n ')).toBe(false); // 여러 공백 문자 조합
  });

  it('앞뒤 공백이 있어도 내용이 있으면 허용한다', () => {
    expect(validateName(' 김철수 ')).toBe(true);
    expect(validateName('\t회사명\t')).toBe(true);
    expect(validateName(' \n ABC회사 \n ')).toBe(true);
  });

  it('유니코드 공백 문자를 처리한다', () => {
    expect(validateName('\u3000')).toBe(false); // 전각 스페이스 (한중일 공백)
    expect(validateName('\u00A0')).toBe(false); // Non-breaking space
    expect(validateName('\u2000')).toBe(false); // En quad
    expect(validateName('\u2001')).toBe(false); // Em quad
  });
});