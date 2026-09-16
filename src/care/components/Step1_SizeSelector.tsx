import React from 'react';
import { CompanySize } from '../types';

// ── Step1_SizeSelector Props Interface ─────────────────────────

export interface Step1_SizeSelectorProps {
  selected: CompanySize | null;
  onChange: (value: CompanySize) => void;
}

// ── Step1_SizeSelector Component ──────────────────────────────

/**
 * STEP 1: 공간 규모 선택 컴포넌트
 * 
 * 4개 크기 옵션 중 하나를 단일 선택하는 라디오 그룹입니다.
 * 선택된 카드는 시각적으로 강조되고 체크 아이콘이 표시됩니다.
 * 
 * Requirements:
 * - 3.1-3.6: 단일 선택, 카드 강조, 체크 아이콘
 * - 14.2-14.3: 접근성 role="radio", aria-checked, 키보드 지원
 * - 13.1-13.3: 반응형 카드 레이아웃 (모바일 1열, 태블릿+ 2열)
 */
export const Step1_SizeSelector: React.FC<Step1_SizeSelectorProps> = ({
  selected,
  onChange,
}) => {
  // 선택 옵션 정의
  const sizeOptions = [
    { value: 'UNDER_10' as CompanySize, label: '10인 이하' },
    { value: 'BETWEEN_11_30' as CompanySize, label: '11~30인' },
    { value: 'BETWEEN_31_50' as CompanySize, label: '31~50인' },
    { value: 'OVER_50' as CompanySize, label: '50인 이상' },
  ];

  // 키보드 이벤트 핸들러
  const handleKeyDown = (event: React.KeyboardEvent, value: CompanySize) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onChange(value);
    }
  };

  return (
    <div className="care-container">
      <div className="care-content">
        {/* 제목 */}
        <h2 className="care-title">
          공간의 상주 인원은 몇 명인가요?
        </h2>
        <p className="care-subtitle">
          해당하는 규모를 선택해주세요
        </p>

        {/* 라디오 그룹 */}
        <div 
          role="radiogroup" 
          aria-label="공간 규모 선택"
          className="care-card-grid"
        >
          {sizeOptions.map((option) => {
            const isSelected = selected === option.value;
            
            return (
              <div
                key={option.value}
                role="radio"
                aria-checked={isSelected}
                aria-label={`${option.label} 선택`}
                tabIndex={0}
                data-selected={isSelected}
                className={`care-card ${isSelected ? 'care-card--selected' : ''}`}
                onClick={() => onChange(option.value)}
                onKeyDown={(e) => handleKeyDown(e, option.value)}
              >
                {/* 선택 상태 체크 아이콘 */}
                {isSelected && (
                  <div className="care-check-icon" aria-hidden="true">
                    ✓
                  </div>
                )}

                {/* 라벨 */}
                <span className={`care-card-label ${isSelected ? 'care-card-label--selected' : ''}`}>
                  {option.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Step1_SizeSelector;