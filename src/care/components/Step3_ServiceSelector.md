# Step3_ServiceSelector Component

## Overview
서비스 선택을 위한 다중 선택 카드 컴포넌트입니다. 사용자가 원하는 서비스를 복수 선택할 수 있으며, 선택된 카드는 시각적으로 강조됩니다.

## Features Implemented

### ✅ 4 Service Cards with Name + Description
- **세척 (CLEANING)**: 오염·얼룩·먼지 등을 가구 재질에 맞게 클리닝
- **상태점검 (INSPECTION)**: 흔들림·마모·파손 여부와 사용 가능 상태 확인  
- **간단수리 (MINOR_REPAIR)**: 나사 조임, 부품 점검 등 현장에서 가능한 경정비
- **정기관리 (REGULAR_CARE)**: 일정 주기에 맞춘 반복 점검 및 클리닝 상담

### ✅ Multiple Selection Toggle
- 클릭으로 선택/해제 토글
- 복수 선택 가능
- 선택 상태를 배열로 관리

### ✅ Visual Feedback
- 선택된 카드: 보라색 테두리 + 배경색 변경
- 체크 아이콘 표시 (우측 상단)
- 호버 효과 (미선택 카드)
- 포커스 아웃라인 (키보드 접근성)

### ✅ Notice Text
간단수리와 정기관리는 가구 상태 및 관리 주기에 따라 방문 확인 후 최종 금액이 달라질 수 있습니다.
- 노란색 배경의 안내 박스로 표시
- 요구사항 7.1 충족

### ✅ Props Interface
```typescript
interface Step3_ServiceSelectorProps {
  selected: ServiceType[];
  onChange: (services: ServiceType[]) => void;
}
```

### ✅ Validation Function
```typescript
export const canProceedFromStep3 = (selected: ServiceType[]): boolean => {
  return selected.length > 0;
}
```

## Accessibility (요구사항 14.3)

### ✅ ARIA Attributes
- `role="group"` for container
- `role="checkbox"` for each service card
- `aria-checked` for selection state
- `aria-label` with service descriptions

### ✅ Keyboard Support
- Tab navigation between cards
- Enter/Space to toggle selection
- Focus indicators

### ✅ Semantic HTML
- `h2` for main title
- `h3` for service names
- `p` for descriptions and instructions

## Requirements Coverage

### Requirements 5.1-5.7 ✅
- 5.1: Multiple service selection implemented
- 5.2: Service cards with name and description
- 5.3: Toggle selection with visual feedback
- 5.4: Check icons for selected items
- 5.5: Card highlighting for selected state
- 5.6: Notice text about pricing variability
- 5.7: Validation that at least one service is selected

### Requirement 7.1 ✅
- Notice text about MINOR_REPAIR and REGULAR_CARE pricing

### Requirement 14.3 ✅
- Full accessibility implementation with ARIA and keyboard support

## Usage Example

```typescript
import { Step3_ServiceSelector, canProceedFromStep3 } from './Step3_ServiceSelector';

const [services, setServices] = useState<ServiceType[]>([]);

const handleNext = () => {
  if (canProceedFromStep3(services)) {
    // Proceed to next step
  }
};

<Step3_ServiceSelector 
  selected={services}
  onChange={setServices}
/>
```

## Files Created
1. `src/care/components/Step3_ServiceSelector.tsx` - Main component
2. `src/care/components/Step3_ServiceSelector.test.tsx` - Unit tests
3. `src/care/examples/Step3_ServiceSelectorExample.tsx` - Usage example
4. Updated `src/care/components/index.ts` - Export declarations

## Design Consistency
- Follows same patterns as `Step1_SizeSelector`
- Consistent styling and color scheme
- Same accessibility approach
- Same TypeScript patterns and interfaces