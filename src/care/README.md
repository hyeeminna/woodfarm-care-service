# WOODFARM CARE 간편 견적 MVP

사무·상업 공간의 가구 클리닝·점검·간단수리·정기관리 서비스를 위한 웹 기반 간편 견적 애플리케이션입니다.

## 구조

```
src/care/
├── index.tsx              # AppShell - 메인 애플리케이션 진입점
├── hooks/useAppReducer.ts # 전역 상태 관리
├── screens/               # 화면 컴포넌트들
│   ├── LandingScreen.tsx
│   ├── EstimateFlow.tsx   # STEP 1~4 컨테이너
│   ├── LoadingScreen.tsx
│   ├── ResultScreen.tsx
│   ├── RequestFormScreen.tsx
│   └── CompleteScreen.tsx
├── components/            # 재사용 UI 컴포넌트들
├── lib/                   # 순수 함수들 (견적 계산 등)
├── types/                 # TypeScript 타입 정의
├── config/                # 설정 객체들
└── styles/                # CSS 스타일
```

## 사용 방법

```tsx
import { AppShell } from './src/care';

function App() {
  return <AppShell />;
}
```

## 화면 흐름

1. **LANDING** - 서비스 소개 및 시작 버튼
2. **STEP1-4** - 견적 조건 입력 (규모 → 가구 → 서비스 → 사진)
3. **LOADING** - 견적 계산 중
4. **RESULT** - 견적 결과 표시
5. **REQUEST_FORM** - 방문견적 신청 폼
6. **COMPLETE** - 신청 완료

## 특징

- 순수 프론트엔드 (백엔드 없음)
- React + TypeScript + Vite
- useReducer 기반 상태 관리
- 반응형 디자인 (모바일 우선)
- 접근성 준수 (WCAG AA)
- 프로퍼티 기반 테스트 포함