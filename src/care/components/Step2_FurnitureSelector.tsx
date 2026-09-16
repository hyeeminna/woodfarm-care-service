import React, { useState, useCallback } from 'react';
import { FurnitureItem, FurnitureType } from '../types';

// ── Step2_FurnitureSelector Props Interface ────────────────────

export interface Step2_FurnitureSelectorProps {
  items: FurnitureItem[];
  onChange: (items: FurnitureItem[]) => void;
}

// ── Step2_FurnitureSelector Component ─────────────────────────

/**
 * STEP 2: 가구 선택 컴포넌트
 * 
 * 4개 가구 타입 중 다중 선택이 가능한 토글 카드 그룹입니다.
 * 선택된 카드는 수량 조절 스테퍼를 표시하며, 1-999 범위로 제한됩니다.
 * 카드 재클릭 시 선택 해제되고 수량이 초기화됩니다.
 * 
 * Requirements:
 * - 4.1-4.10: 다중 선택, 수량 스테퍼, 유효성 검사
 * - 14.1-14.2: 접근성 aria-labels, 키보드 지원
 * - 15.5: 에러 메시지 표시
 * - 13.1-13.3: 반응형 카드 레이아웃
 */
export const Step2_FurnitureSelector: React.FC<Step2_FurnitureSelectorProps> = ({
  items,
  onChange,
}) => {
  const [quantityErrors, setQuantityErrors] = useState<Record<FurnitureType, string>>({} as Record<FurnitureType, string>);

  // 가구 옵션 정의
  const furnitureOptions = [
    { value: 'CHAIR' as FurnitureType, label: '사무용 의자' },
    { value: 'PARTITION' as FurnitureType, label: '파티션' },
    { value: 'SOFA' as FurnitureType, label: '소파' },
    { value: 'DESK' as FurnitureType, label: '책상' },
  ];

  // 현재 선택된 가구 찾기
  const getSelectedItem = (type: FurnitureType): FurnitureItem | null => {
    return items.find(item => item.type === type) || null;
  };

  // 수량 유효성 검사
  const validateQuantity = (value: number): string => {
    if (!Number.isInteger(value)) {
      return '정수를 입력해주세요';
    }
    if (value < 1) {
      return '최소 1개 이상이어야 합니다';
    }
    if (value > 999) {
      return '최대 999개까지 입력할 수 있습니다';
    }
    return '';
  };

  // 가구 토글 (선택/해제)
  const toggleFurniture = useCallback((type: FurnitureType) => {
    const existingItem = getSelectedItem(type);
    
    if (existingItem) {
      // 이미 선택된 경우 - 제거
      const newItems = items.filter(item => item.type !== type);
      onChange(newItems);
      
      // 에러 상태 정리
      const newErrors = { ...quantityErrors };
      delete newErrors[type];
      setQuantityErrors(newErrors);
    } else {
      // 새로 선택하는 경우 - 기본 수량 1로 추가
      const newItem: FurnitureItem = {
        type,
        quantity: 1
      };
      onChange([...items, newItem]);
    }
  }, [items, onChange, quantityErrors]);

  // 수량 변경
  const updateQuantity = useCallback((type: FurnitureType, newQuantity: number) => {
    const error = validateQuantity(newQuantity);
    
    // 에러 상태 업데이트
    setQuantityErrors(prev => ({
      ...prev,
      [type]: error
    }));

    // 유효한 값인 경우만 실제 상태 업데이트
    if (!error) {
      const newItems = items.map(item =>
        item.type === type
          ? { ...item, quantity: newQuantity }
          : item
      );
      onChange(newItems);
    }
  }, [items, onChange]);

  // 스테퍼 버튼 핸들러
  const handleDecrement = useCallback((type: FurnitureType) => {
    const currentItem = getSelectedItem(type);
    if (currentItem && currentItem.quantity > 1) {
      updateQuantity(type, currentItem.quantity - 1);
    }
  }, [updateQuantity, getSelectedItem]);

  const handleIncrement = useCallback((type: FurnitureType) => {
    const currentItem = getSelectedItem(type);
    if (currentItem && currentItem.quantity < 999) {
      updateQuantity(type, currentItem.quantity + 1);
    }
  }, [updateQuantity, getSelectedItem]);

  // 직접 입력 핸들러
  const handleQuantityInput = useCallback((type: FurnitureType, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      updateQuantity(type, numValue);
    } else if (value === '') {
      // 빈 값인 경우 에러 설정
      setQuantityErrors(prev => ({
        ...prev,
        [type]: '수량을 입력해주세요'
      }));
    }
  }, [updateQuantity]);

  // 키보드 이벤트 핸들러
  const handleCardKeyDown = (event: React.KeyboardEvent, type: FurnitureType) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleFurniture(type);
    }
  };

  return (
    <div className="care-container">
      <div className="care-content">
        {/* 제목 */}
        <h2 className="care-title">
          관리할 가구를 선택해주세요
        </h2>
        <p className="care-subtitle">
          해당하는 가구와 수량을 선택해주세요 (복수 선택 가능)
        </p>

        {/* 가구 그리드 */}
        <div className="care-card-grid">
          {furnitureOptions.map((option) => {
            const selectedItem = getSelectedItem(option.value);
            const isSelected = !!selectedItem;
            const hasError = !!quantityErrors[option.value];
            
            return (
              <div
                key={option.value}
                role="button"
                aria-label={`${option.label} ${isSelected ? '선택됨' : '선택 안됨'}`}
                tabIndex={0}
                data-selected={isSelected}
                className={`care-card furniture-card ${isSelected ? 'care-card--selected' : ''}`}
                onClick={() => toggleFurniture(option.value)}
                onKeyDown={(e) => handleCardKeyDown(e, option.value)}
              >
                {/* 카드 헤더 */}
                <div className="furniture-card__header">
                  <span className={`care-card-label ${isSelected ? 'care-card-label--selected' : ''}`}>
                    {option.label}
                  </span>

                  {/* 선택 상태 체크 아이콘 */}
                  {isSelected && (
                    <div className="care-check-icon" aria-hidden="true">
                      ✓
                    </div>
                  )}
                </div>

                {/* 수량 조절 섹션 (선택된 경우만 표시) */}
                {isSelected && selectedItem && (
                  <div 
                    className="furniture-card__quantity"
                    onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 방지
                  >
                    <label className="furniture-card__quantity-label">
                      수량
                    </label>
                    
                    <div className="furniture-card__controls">
                      {/* 감소 버튼 */}
                      <button
                        type="button"
                        className={`furniture-card__stepper ${selectedItem.quantity <= 1 ? 'furniture-card__stepper--disabled' : ''}`}
                        aria-label={`${option.label} 수량 감소`}
                        disabled={selectedItem.quantity <= 1}
                        onClick={() => handleDecrement(option.value)}
                      >
                        −
                      </button>

                      {/* 수량 입력 */}
                      <input
                        type="number"
                        min="1"
                        max="999"
                        value={selectedItem.quantity}
                        className={`furniture-card__input ${hasError ? 'furniture-card__input--error' : ''}`}
                        aria-label={`${option.label} 수량`}
                        aria-invalid={hasError}
                        aria-describedby={hasError ? `error-${option.value}` : undefined}
                        onChange={(e) => handleQuantityInput(option.value, e.target.value)}
                      />

                      {/* 증가 버튼 */}
                      <button
                        type="button"
                        className={`furniture-card__stepper ${selectedItem.quantity >= 999 ? 'furniture-card__stepper--disabled' : ''}`}
                        aria-label={`${option.label} 수량 증가`}
                        disabled={selectedItem.quantity >= 999}
                        onClick={() => handleIncrement(option.value)}
                      >
                        +
                      </button>
                    </div>

                    {/* 에러 메시지 */}
                    {hasError && (
                      <span 
                        id={`error-${option.value}`}
                        className="furniture-card__error" 
                        role="alert"
                      >
                        {quantityErrors[option.value]}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Step2_FurnitureSelector;