import React from 'react';
import { ServiceType } from '../types';

// ── Step3_ServiceSelector Props Interface ─────────────────────

export interface Step3_ServiceSelectorProps {
  selected: ServiceType[];
  onChange: (services: ServiceType[]) => void;
}

// ── Step3_ServiceSelector Component ──────────────────────────

/**
 * STEP 3: 서비스 선택 컴포넌트
 * 
 * 4개 서비스 옵션 중 복수 선택 가능한 토글 카드 그룹입니다.
 * 선택된 카드는 시각적으로 강조되고 체크 아이콘이 표시됩니다.
 * 
 * Requirements:
 * - 5.1-5.7: 복수 선택, 카드 강조, 체크 아이콘, 안내 문구
 * - 7.1: 간단수리/정기관리 안내 문구
 * - 14.3: 접근성 role="checkbox", aria-checked, 키보드 지원
 * - 13.1-13.3: 반응형 카드 레이아웃
 */
export const Step3_ServiceSelector: React.FC<Step3_ServiceSelectorProps> = ({
  selected,
  onChange,
}) => {
  // 서비스 옵션 정의
  const serviceOptions = [
    { 
      value: 'CLEANING' as ServiceType, 
      name: '세척', 
      description: '오염·얼룩·먼지 등을 가구 재질에 맞게 클리닝' 
    },
    { 
      value: 'INSPECTION' as ServiceType, 
      name: '상태점검', 
      description: '흔들림·마모·파손 여부와 사용 가능 상태 확인' 
    },
    { 
      value: 'MINOR_REPAIR' as ServiceType, 
      name: '간단수리', 
      description: '나사 조임, 부품 점검 등 현장에서 가능한 경정비' 
    },
    { 
      value: 'REGULAR_CARE' as ServiceType, 
      name: '정기관리', 
      description: '일정 주기에 맞춘 반복 점검 및 클리닝 상담' 
    },
  ];

  // 토글 핸들러
  const handleToggle = (value: ServiceType) => {
    if (selected.includes(value)) {
      // 선택 해제
      onChange(selected.filter(service => service !== value));
    } else {
      // 선택 추가
      onChange([...selected, value]);
    }
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (event: React.KeyboardEvent, value: ServiceType) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle(value);
    }
  };

  return (
    <div className="care-container">
      <div className="care-content">
        {/* 제목 */}
        <h2 className="care-title">
          어떤 서비스를 받고 싶으신가요?
        </h2>
        <p className="care-subtitle">
          원하는 서비스를 모두 선택해주세요 (복수 선택 가능)
        </p>

        {/* 체크박스 그룹 */}
        <div 
          role="group" 
          aria-label="서비스 선택"
          className="care-card-grid"
        >
          {serviceOptions.map((option) => {
            const isSelected = selected.includes(option.value);
            
            return (
              <div
                key={option.value}
                role="checkbox"
                aria-checked={isSelected}
                aria-label={`${option.name} - ${option.description}`}
                tabIndex={0}
                data-selected={isSelected}
                className={`care-card service-card ${isSelected ? 'care-card--selected' : ''}`}
                onClick={() => handleToggle(option.value)}
                onKeyDown={(e) => handleKeyDown(e, option.value)}
              >
                {/* 선택 상태 체크 아이콘 */}
                {isSelected && (
                  <div className="care-check-icon" aria-hidden="true">
                    ✓
                  </div>
                )}

                {/* 서비스명 */}
                <h3 className={`service-card__name ${isSelected ? 'service-card__name--selected' : ''}`}>
                  {option.name}
                </h3>

                {/* 서비스 설명 */}
                <p className="service-card__description">
                  {option.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* 안내 문구 */}
        <div className="service-notice">
          <p className="service-notice__text">
            💡 간단수리와 정기관리는 가구 상태 및 관리 주기에 따라 방문 확인 후 최종 금액이 달라질 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

// canProceed 유틸리티 함수
export const canProceedFromStep3 = (selected: ServiceType[]): boolean => {
  return selected.length > 0;
};

export default Step3_ServiceSelector;