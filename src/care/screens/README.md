# LandingScreen Component

## 개요

`LandingScreen` 컴포넌트는 OFFICE CARE 간편 견적 서비스의 첫 화면을 담당하는 React 컴포넌트입니다.

## 기능

- 서비스명 "OFFICE CARE" 표시
- 메인 카피와 서브 카피를 통한 서비스 소개
- 보조 안내 문구로 사용자 기대치 설정
- 간편 견적 시작 CTA 버튼 제공
- 버튼 클릭 시 `START_ESTIMATE` 액션 디스패치

## 요구사항 충족

### Requirements 1.1 - 서비스명
- ✅ `OFFICE CARE` 서비스명을 `<h1>` 태그로 표시

### Requirements 1.2 - 핵심 문구
- ✅ 메인 카피: "사무·상업가구, 교체하기 전에 관리하세요."
- ✅ 서브 카피: "기업용 사무가구부터 카페·병원·식당 등의 가구까지, 클리닝·유지관리 서비스를 간편하게 확인해보세요."

### Requirements 1.3 - CTA 및 보조 안내
- ✅ 보조 안내: "약 1분 소요 · 예상 견적 확인 · 무료 방문견적 신청"
- ✅ Primary CTA: "간편 견적 시작하기" 버튼
- ✅ 버튼 클릭 시 `START_ESTIMATE` 액션 디스패치

## 사용법

```tsx
import { LandingScreen } from './screens/LandingScreen';
import { useAppReducer } from './hooks/useAppReducer';

function App() {
  const { state, dispatch } = useAppReducer();

  return (
    <LandingScreen onAction={dispatch} />
  );
}
```

## Props

### `onAction: (action: AppAction) => void`
- AppAction 타입의 액션을 받아 처리하는 함수
- 버튼 클릭 시 `{ type: 'START_ESTIMATE' }` 액션을 전달받음

## 스타일링

### 현재 버전 (LandingScreen.tsx)
- React 인라인 스타일 사용
- 외부 의존성 없이 사용 가능
- 반응형 디자인 지원 (JavaScript 기반)

### 대안 버전 (LandingScreenWithCSS.tsx)
- 외부 CSS 파일 사용
- CSS 클래스 기반 스타일링
- 미디어 쿼리를 통한 반응형 지원

## 반응형 지원

- **데스크탑**: 최대 너비 480px로 제한
- **모바일 (≤480px)**: 패딩 및 폰트 크기 조정
- **소형 모바일 (≤360px)**: 추가 컴팩트 레이아웃

## 디자인 특징

- Clean & Simple 디자인 방향
- 그라데이션 배경으로 시각적 매력 향상
- 화이트 카드 중심의 콘텐츠 구성
- 포인트 컬러 (#6c5ce7) 사용
- 호버 및 액티브 상태 피드백 제공

## 접근성

- 시맨틱 HTML 태그 사용 (`h1`, `h2`, `button`)
- 명확한 버튼 텍스트 제공
- 키보드 네비게이션 지원
- 충분한 색상 대비 확보

## 테스트

`LandingScreen.test.tsx`에서 다음 사항들을 테스트합니다:

- 모든 필수 텍스트 콘텐츠 렌더링
- CTA 버튼 클릭 시 올바른 액션 디스패치
- 스타일링 적용 확인
- 요구사항별 기능 검증

## 파일 구조

```
src/care/screens/
├── LandingScreen.tsx          # 메인 컴포넌트 (인라인 스타일)
├── LandingScreenWithCSS.tsx   # CSS 클래스 버전
├── LandingScreen.css          # 외부 스타일시트
├── LandingScreen.test.tsx     # 단위 테스트
├── README.md                  # 이 문서
└── index.ts                   # 모듈 export
```

## 예시

실제 동작 확인을 위한 예시 컴포넌트는 `src/care/examples/LandingScreenExample.tsx`를 참고하세요.