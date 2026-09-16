import type { EstimateFormData, EstimateResult, EstimateMessage } from '../types';
import { estimateConfig } from '../config/estimateConfig';

/**
 * 견적 계산 핵심 함수
 * 
 * 사용자가 입력한 조건을 바탕으로 예상 견적을 계산한다.
 * 예외를 던지지 않는 순수 함수로 설계되었으며, 모든 경계 케이스에서 유효한 결과를 반환한다.
 * 
 * Requirements 8.1~8.9: 견적 계산 로직
 * 
 * @param formData 사용자 입력 데이터 (규모, 가구, 서비스, 사진)
 * @returns 계산된 견적 결과 또는 방문 확인 필요 상태
 */
export function calculateEstimate(formData: EstimateFormData): EstimateResult {
  const { furniture, services } = formData;
  
  // 빈 가구 배열 처리 (방어 설계)
  if (!furniture || furniture.length === 0) {
    return {
      status: 'VISIT_REQUIRED',
      minPrice: null,
      maxPrice: null,
      messages: [],
    };
  }
  
  // Early return: SOFA 또는 DESK 포함 시 방문 확인 필요 (Requirements 8.5)
  const hasVisitRequiredFurniture = furniture.some(item => 
    item.type === 'SOFA' || item.type === 'DESK'
  );
  
  if (hasVisitRequiredFurniture) {
    return {
      status: 'VISIT_REQUIRED',
      minPrice: null,
      maxPrice: null,
      messages: generateServiceMessages(services),
    };
  }
  
  // CHAIR·PARTITION 각 수량 × 단가 합산 (Requirements 8.2, 8.3)
  let subtotalMin = 0;
  let subtotalMax = 0;
  
  for (const item of furniture) {
    const config = estimateConfig[item.type];
    
    // 설정되지 않은 가구 또는 null 단가 처리 (방어 설계)
    if (!config || config.min === null || config.max === null) {
      return {
        status: 'VISIT_REQUIRED',
        minPrice: null,
        maxPrice: null,
        messages: generateServiceMessages(services),
      };
    }
    
    // 유효하지 않은 수량 처리 (방어 설계)
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 999) {
      return {
        status: 'VISIT_REQUIRED',
        minPrice: null,
        maxPrice: null,
        messages: generateServiceMessages(services),
      };
    }
    
    subtotalMin += item.quantity * config.min;
    subtotalMax += item.quantity * config.max;
  }
  
  // Math.floor(v / 10000) * 10000로 만 원 절사 (Requirements 8.3)
  const minPrice = Math.floor(subtotalMin / 10000) * 10000;
  const maxPrice = Math.floor(subtotalMax / 10000) * 10000;
  
  return {
    status: 'CALCULATED',
    minPrice,
    maxPrice,
    messages: generateServiceMessages(services),
  };
}

/**
 * 선택된 서비스에 따른 안내 메시지 생성
 * 
 * MINOR_REPAIR와 REGULAR_CARE는 금액에 포함하지 않고 별도 안내 메시지만 추가한다.
 * (Requirements 8.6, 8.7)
 * 
 * @param services 선택된 서비스 목록
 * @returns 생성된 메시지 배열
 */
function generateServiceMessages(services: string[]): EstimateMessage[] {
  const messages: EstimateMessage[] = [];
  
  // MINOR_REPAIR 포함 시 금액 미합산, 메시지 추가 (Requirements 8.6)
  if (services.includes('MINOR_REPAIR')) {
    messages.push({
      type: 'MINOR_REPAIR_NOTICE',
      text: '수리 비용은 부품과 파손 상태 확인 후 별도로 안내됩니다.',
    });
  }
  
  // REGULAR_CARE 포함 시 금액 미합산, 메시지 추가 (Requirements 8.7)
  if (services.includes('REGULAR_CARE')) {
    messages.push({
      type: 'REGULAR_CARE_NOTICE',
      text: '방문 주기와 작업 범위를 협의한 뒤 정기관리 견적을 별도로 안내합니다.',
    });
  }
  
  return messages;
}