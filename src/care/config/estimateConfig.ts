import type { EstimateConfig } from '../types';

/**
 * 가구별 견적 단가 설정 객체
 * 
 * 이 설정은 MVP의 참고용 예상 견적 계산에 사용되며,
 * 실제 확정 가격이 아닌 초기 데모 설정값입니다.
 * 
 * - min: 세척 + 기본 상태점검 최소 단가 (원)
 * - max: 세척 + 기본 상태점검 최대 단가 (원)
 * - null: 방문 확인 필요 (온라인 예상가 계산 불가)
 * 
 * Requirements 8.4: 초기 데모 단가
 * Requirements 8.5: 미설정 단가 처리
 */
export const estimateConfig: EstimateConfig = {
  CHAIR: {
    min: 7000,  // 사무용 의자: 7,000원/개
    max: 8500,  // 사무용 의자: 8,500원/개
  },
  PARTITION: {
    min: 4000,  // 파티션: 4,000원/개
    max: 6500,  // 파티션: 6,500원/개
  },
  SOFA: {
    min: null,  // 소파: 방문 확인 필요
    max: null,
  },
  DESK: {
    min: null,  // 책상: 방문 확인 필요
    max: null,
  },
};