import { describe, it, expect } from 'vitest';
import { calculateEstimate } from './calculateEstimate';
import type { EstimateFormData } from '../types';

describe('calculateEstimate', () => {
  const baseFormData: EstimateFormData = {
    companySize: 'BETWEEN_11_30',
    furniture: [],
    services: [],
    photos: [],
  };

  it('의자 30개 + 파티션 10개 + 세척 + 상태점검 → 약 25~32만 원 (Requirements 8.8)', () => {
    const formData: EstimateFormData = {
      ...baseFormData,
      furniture: [
        { type: 'CHAIR', quantity: 30 },
        { type: 'PARTITION', quantity: 10 },
      ],
      services: ['CLEANING', 'INSPECTION'],
    };

    const result = calculateEstimate(formData);
    
    expect(result.status).toBe('CALCULATED');
    expect(result.minPrice).toBe(250000); // (30×7000 + 10×4000) = 250,000
    expect(result.maxPrice).toBe(320000); // (30×8500 + 10×6500) = 320,000
  });

  it('SOFA 포함 시 VISIT_REQUIRED 반환 (Requirements 8.5)', () => {
    const formData: EstimateFormData = {
      ...baseFormData,
      furniture: [
        { type: 'CHAIR', quantity: 10 },
        { type: 'SOFA', quantity: 1 },
      ],
      services: ['CLEANING'],
    };

    const result = calculateEstimate(formData);
    
    expect(result.status).toBe('VISIT_REQUIRED');
    expect(result.minPrice).toBe(null);
    expect(result.maxPrice).toBe(null);
  });

  it('DESK 포함 시 VISIT_REQUIRED 반환 (Requirements 8.5)', () => {
    const formData: EstimateFormData = {
      ...baseFormData,
      furniture: [
        { type: 'PARTITION', quantity: 5 },
        { type: 'DESK', quantity: 2 },
      ],
      services: ['CLEANING'],
    };

    const result = calculateEstimate(formData);
    
    expect(result.status).toBe('VISIT_REQUIRED');
    expect(result.minPrice).toBe(null);
    expect(result.maxPrice).toBe(null);
  });

  it('MINOR_REPAIR 포함 시 메시지 추가, 금액은 계산 (Requirements 8.6)', () => {
    const formData: EstimateFormData = {
      ...baseFormData,
      furniture: [{ type: 'CHAIR', quantity: 10 }],
      services: ['CLEANING', 'MINOR_REPAIR'],
    };

    const result = calculateEstimate(formData);
    
    expect(result.status).toBe('CALCULATED');
    expect(result.minPrice).toBe(70000); // 10×7000 = 70,000
    expect(result.maxPrice).toBe(80000); // 10×8500 = 85,000 → 80,000 (만원절사)
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].type).toBe('MINOR_REPAIR_NOTICE');
    expect(result.messages[0].text).toContain('수리 비용은 부품과 파손 상태 확인 후');
  });

  it('REGULAR_CARE 포함 시 메시지 추가, 금액은 계산 (Requirements 8.7)', () => {
    const formData: EstimateFormData = {
      ...baseFormData,
      furniture: [{ type: 'PARTITION', quantity: 15 }],
      services: ['INSPECTION', 'REGULAR_CARE'],
    };

    const result = calculateEstimate(formData);
    
    expect(result.status).toBe('CALCULATED');
    expect(result.minPrice).toBe(60000); // 15×4000 = 60,000
    expect(result.maxPrice).toBe(90000); // 15×6500 = 97,500 → 90,000 (만원절사)
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].type).toBe('REGULAR_CARE_NOTICE');
    expect(result.messages[0].text).toContain('방문 주기와 작업 범위를 협의');
  });

  it('만 원 절사 정확성 검증 (Requirements 8.3)', () => {
    const formData: EstimateFormData = {
      ...baseFormData,
      furniture: [{ type: 'CHAIR', quantity: 1 }],
      services: ['CLEANING'],
    };

    const result = calculateEstimate(formData);
    
    expect(result.status).toBe('CALCULATED');
    // 1×7000 = 7,000 → 0 (만원절사)
    // 1×8500 = 8,500 → 0 (만원절사)
    expect(result.minPrice).toBe(0);
    expect(result.maxPrice).toBe(0);
  });

  it('빈 가구 배열 처리 (방어 설계)', () => {
    const formData: EstimateFormData = {
      ...baseFormData,
      furniture: [],
      services: ['CLEANING'],
    };

    const result = calculateEstimate(formData);
    
    expect(result.status).toBe('VISIT_REQUIRED');
    expect(result.minPrice).toBe(null);
    expect(result.maxPrice).toBe(null);
  });

  it('유효하지 않은 수량 처리 (방어 설계)', () => {
    const formData: EstimateFormData = {
      ...baseFormData,
      furniture: [{ type: 'CHAIR', quantity: 0 }], // 유효하지 않은 수량
      services: ['CLEANING'],
    };

    const result = calculateEstimate(formData);
    
    expect(result.status).toBe('VISIT_REQUIRED');
    expect(result.minPrice).toBe(null);
    expect(result.maxPrice).toBe(null);
  });

  it('MINOR_REPAIR + REGULAR_CARE 둘 다 포함 시 두 메시지 모두 표시', () => {
    const formData: EstimateFormData = {
      ...baseFormData,
      furniture: [{ type: 'CHAIR', quantity: 20 }],
      services: ['CLEANING', 'MINOR_REPAIR', 'REGULAR_CARE'],
    };

    const result = calculateEstimate(formData);
    
    expect(result.status).toBe('CALCULATED');
    expect(result.messages).toHaveLength(2);
    expect(result.messages.some(m => m.type === 'MINOR_REPAIR_NOTICE')).toBe(true);
    expect(result.messages.some(m => m.type === 'REGULAR_CARE_NOTICE')).toBe(true);
  });
});