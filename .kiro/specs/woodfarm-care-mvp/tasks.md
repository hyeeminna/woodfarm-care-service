# Implementation Plan: WOODFARM CARE 간편 견적 MVP

## Overview

`src/care/` 독립 섹션으로 기존 woodfarmgagu 프로젝트에 추가한다.
라우팅 라이브러리 없이 `AppShell`의 `useReducer`가 화면 전환을 담당하는 순수 프론트엔드 SPA이다.
구현 순서는 **타입·설정 → 순수 함수 → 상태 관리 → 화면 컴포넌트 → 스타일 → 테스트 → 빌드 검증** 순으로 진행한다.

---

## Tasks

- [x] 1. 프로젝트 기반 설정 — `src/care/` 섹션 초기화
  - `src/care/` 디렉토리 구조 생성: `config/`, `types/`, `lib/`, `hooks/`, `screens/`, `components/`, `styles/`
  - `fast-check` 패키지가 devDependencies에 없으면 `npm install -D fast-check` 추가
  - `@testing-library/react`, `@testing-library/user-event` devDependencies 확인 및 추가
  - `src/care/styles/care.css` 빈 파일 생성 (이후 스타일 태스크에서 채움)
  - `src/care/index.tsx` 진입점 파일 생성 (AppShell export)
  - _Requirements: 전 범위 (기반 구조)_

  - [x] 1.1 TypeScript 타입 정의 (`src/care/types/index.ts`)
    - `CompanySize`, `FurnitureType`, `ServiceType`, `SpaceType` 열거 타입 정의
    - `FurnitureItem`, `UploadedPhoto`, `EstimateFormData` 인터페이스 정의
    - `EstimateStatus`, `EstimateMessageType`, `EstimateMessage`, `EstimateResult` 인터페이스 정의
    - `FurniturePriceConfig`, `EstimateConfig` 인터페이스 정의
    - `VisitRequest`, `VisitRequestFormFields`, `FormErrors`, `UploadError` 인터페이스 정의
    - `ScreenState`, `AppState`, `AppAction` 타입 정의 (useAppReducer에서도 참조)
    - _Requirements: 3.6, 4.10, 5.6, 6.10, 8.1, 11.6_

  - [x] 1.2 견적 단가 설정 객체 (`src/care/config/estimateConfig.ts`)
    - `estimateConfig: EstimateConfig` 객체를 단일 소스로 export
    - CHAIR: `{ min: 7000, max: 8500 }`, PARTITION: `{ min: 4000, max: 6500 }`, SOFA/DESK: `{ min: null, max: null }`
    - _Requirements: 8.4, 8.5_

- [x] 2. 순수 함수 라이브러리 (`src/care/lib/`)

  - [x] 2.1 견적 계산 함수 (`calculateEstimate.ts`)
    - `calculateEstimate(formData: EstimateFormData): EstimateResult` 순수 함수 구현
    - SOFA 또는 DESK 포함 시 early return으로 `VISIT_REQUIRED` 반환 (minPrice/maxPrice = null)
    - CHAIR·PARTITION 각 수량 × 단가 합산 (subtotalMin, subtotalMax)
    - MINOR_REPAIR 포함 시 금액 미합산, `MINOR_REPAIR_NOTICE` 메시지 추가
    - REGULAR_CARE 포함 시 금액 미합산, `REGULAR_CARE_NOTICE` 메시지 추가
    - `Math.floor(v / 10000) * 10000`로 만 원 절사 후 `CALCULATED` 반환
    - 예외를 던지지 않는 방어 설계 (빈 배열 등 모든 경계 케이스에서 유효한 결과 반환)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9_

  - [ ]* 2.2 견적 계산 프로퍼티 테스트 (`calculateEstimate.property.test.ts`)
    - **Property 1: 견적 계산 결과의 단가 범위 준수** — CHAIR·PARTITION 임의 수량에 대해 minPrice/maxPrice가 단가 기반 계산과 일치
    - **Property 2: null 단가 가구 포함 시 VISIT_REQUIRED 반환** — SOFA 또는 DESK 포함 시 항상 VISIT_REQUIRED, minPrice/maxPrice null
    - **Property 3: 견적 금액 만 원 절사 후 대소 관계 보존** — minRaw ≤ maxRaw이면 절사 후에도 minPrice ≤ maxPrice
    - fast-check 사용, `numRuns: 100`
    - **Validates: Requirements 8.2, 8.3, 8.5**

  - [ ]* 2.3 견적 계산 단위 테스트 (`calculateEstimate.test.ts`)
    - 의자 30개 + 파티션 10개 + CLEANING + INSPECTION → minPrice 250000, maxPrice 320000 (Requirements 8.8)
    - SOFA 포함 시 VISIT_REQUIRED 반환
    - MINOR_REPAIR 포함 시 메시지 추가, 금액 미합산
    - REGULAR_CARE 포함 시 메시지 추가, 금액 미합산
    - 만 원 미만 절사 정확성 확인
    - _Requirements: 8.1 ~ 8.9_

  - [x] 2.4 견적 금액 포맷 함수 (`formatPrice.ts`)
    - `formatPriceRange(min: number, max: number): string` 구현
    - `250000, 320000` → `"약 25~32만 원"`, `min === max` → `"약 N만 원"`
    - _Requirements: 10.1_

  - [x] 2.5 유효성 검사 함수 (`validatePhone.ts`, `validateName.ts`, `validatePhoto.ts`)
    - `validatePhone(value: string): boolean` — 숫자와 하이픈만 허용 (`/^[0-9-]+$/`)
    - `validateName(value: string): boolean` — `s.trim() !== ''` 조건
    - `validatePhoto(file: File): UploadError | null` — MIME 타입·확장자 검사(jpeg/png/webp), 10MB(10,485,760바이트) 이하 검사
    - _Requirements: 6.1, 6.2, 11.3, 11.4, 15.1, 15.2_

  - [ ]* 2.6 유효성 검사 프로퍼티 테스트 (`validation.property.test.ts`)
    - **Property 9: 공백 전용 문자열 이름 필드 거부** — 스페이스·탭·줄바꿈 등 공백 문자만으로 구성된 임의 문자열에 대해 `validateName` 항상 false 반환
    - **Property 10: 연락처 필드 — 숫자·하이픈 외 문자 거부** — 숫자·하이픈 외 문자 포함 시 `validatePhone` 항상 false 반환
    - fast-check 사용, `numRuns: 100`
    - **Validates: Requirements 11.3, 11.4, 11.5**

- [x] 3. 상태 관리 — `useAppReducer` (`src/care/hooks/useAppReducer.ts`)

  - [x] 3.1 AppState reducer 구현
    - `INITIAL_FORM_DATA`, `INITIAL_APP_STATE` 초기값 정의
    - 모든 `AppAction` 타입에 대한 reducer 전환 로직 구현 (전환표 기준):
      - `START_ESTIMATE`: LANDING → STEP1
      - `SUBMIT_STEP(1~4)`: 각 단계 → 다음 단계 (4 → LOADING)
      - `GO_BACK`: 현재 화면에서 이전 단계로 (STEP 순서 역방향)
      - `SHOW_LOADING`: → LOADING
      - `SHOW_RESULT`: → RESULT, result 상태 업데이트
      - `GO_TO_REQUEST_FORM`: → REQUEST_FORM
      - `SUBMIT_REQUEST`: → COMPLETE
      - `RESET_ALL`: 모든 필드 초기화 후 → LANDING
      - `RESET_AND_RETRY`: formData 유지, → STEP1
      - `UPDATE_FORM`: formData에 partial 병합
      - `GO_TO_STEP`: 지정 단계로 이동
    - `useAppReducer()` 커스텀 훅 export
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 10.5, 10.6, 12.4_

- [x] 4. 체크포인트 — 순수 함수 및 상태 관리 검증
  - 모든 테스트 통과 확인 (`vitest --run`), 타입 오류 없음 확인 (`tsc --noEmit`)
  - 문제 발생 시 사용자에게 보고

- [x] 5. 화면 컴포넌트 구현

  - [x] 5.1 `LandingScreen.tsx`
    - 서비스명 `OFFICE CARE`, 메인 카피, 서브 카피, 보조 안내 문구(`약 1분 소요 · 예상 견적 확인 · 무료 방문견적 신청`) 표시
    - `간편 견적 시작하기` 버튼(포인트 컬러, 유일한 주요 CTA)
    - 버튼 클릭 시 `START_ESTIMATE` dispatch
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 5.2 `StepNavigator.tsx`
    - `StepNavigatorProps` 인터페이스 구현
    - 단계 표시: `1 / 4` 형식, 진행 바 너비 `${currentStep * 25}%`
    - `다음` 버튼: `canProceed`가 false이면 `disabled`, pointer-events 차단
    - `이전` 버튼: `onBack`이 있을 때만 렌더링 (STEP2~4)
    - `처음으로` 버튼: 모든 단계에 표시, 클릭 시 `RESET_ALL` dispatch
    - 모든 버튼에 적절한 `aria-label` 또는 `<label>` 연결
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 14.1, 14.2_

  - [x] 5.3 `Step1_SizeSelector.tsx`
    - 4개 카드 렌더링: `10인 이하`, `11~30인`, `31~50인`, `50인 이상`
    - 단일 선택: 선택된 카드에 강조 테두리, 배경색 변경, 체크 아이콘, `data-selected="true"` 부여
    - 선택 상태를 색상만으로 구분하지 않음 (체크 아이콘 + 텍스트 병용)
    - `canProceed = selected !== null`를 부모(`EstimateFlow`)로 전달
    - 카드에 `role="radio"`, `aria-checked`, Tab/Enter/Space 키보드 접근 지원
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 14.2, 14.3_

  - [ ]* 5.4 SizeSelector 프로퍼티 테스트 (`sizeSelector.property.test.ts`)
    - **Property 4: 크기 선택 단일 선택 불변성** — 4개 카드 중 임의 하나 클릭 시 해당 카드만 선택 상태, 나머지 3개 선택 해제, `canProceed` true
    - fast-check `fc.constantFrom` 사용, `numRuns: 100`
    - **Validates: Requirements 3.2, 3.3, 3.5**

  - [x] 5.5 `Step2_FurnitureSelector.tsx`
    - 4개 카드: 사무용 의자(`CHAIR`), 파티션(`PARTITION`), 소파(`SOFA`), 책상(`DESK`)
    - 복수 선택 토글: 선택 시 카드 안에 스테퍼(- / 직접입력 / +) 표시, 기본값 1
    - 스테퍼: 수량 1이면 `-` 비활성화, 999이면 `+` 비활성화
    - 수량 유효성: 1~999 정수만 허용, 오류 시 입력란 아래 오류 문구 표시
    - 오류 상태는 컴포넌트 로컬 `useState`로 관리, 유효한 값만 상위로 전달
    - 카드 재클릭 시 선택 해제 + 수량 입력 영역 숨김 + 저장 수량 제거
    - `canProceed = items.length > 0 && items.every(i => i.quantity >= 1 && i.quantity <= 999 && Number.isInteger(i.quantity))`
    - 오류 입력란에 `aria-invalid="true"`, `aria-describedby` 연결
    - _Requirements: 4.1 ~ 4.10, 14.1, 14.2, 15.5_

  - [ ]* 5.6 FurnitureSelector 프로퍼티 테스트 (`furnitureSelector.property.test.ts`)
    - **Property 5: 가구 카드 토글 라운드트립** — 임의 카드 선택 후 동일 카드 재클릭 시 항목 제거, 수량 영역 숨김, 선택 이전 상태로 복원
    - **Property 6: 가구 수량 유효성 — [1, 999] 정수 제약** — 0·1000이상·소수·음수·빈 문자열 입력 시 오류 상태, `canProceed` false
    - fast-check 사용, `numRuns: 100`
    - **Validates: Requirements 4.2, 4.3, 4.4, 4.8**

  - [x] 5.7 `Step3_ServiceSelector.tsx`
    - 4개 카드: `세척(CLEANING)`, `상태점검(INSPECTION)`, `간단수리(MINOR_REPAIR)`, `정기관리(REGULAR_CARE)`
    - 각 카드에 서비스명 + 한 줄 설명 텍스트 포함
    - `간단수리와 정기관리는 가구 상태 및 관리 주기에 따라 방문 확인 후 최종 금액이 달라질 수 있습니다.` 안내 문구 표시
    - 복수 선택 토글: 선택 시 체크 아이콘 + 강조 스타일, 재클릭 시 해제
    - 이전 단계에서 돌아올 때 기존 선택값 유지
    - `canProceed = selected.length > 0`
    - _Requirements: 5.1 ~ 5.7, 7.1, 14.3_

  - [x] 5.8 `Step4_PhotoUploader.tsx`
    - 파일 input: `accept="image/jpeg,image/png,image/webp"`, `multiple` 속성
    - 유효성 검사: MIME 타입 + 확장자 모두 검사, 10MB 이하, 총 5장 이하
    - 유효 파일: Object URL 생성 + 미리보기(이미지 + 파일명) 목록 표시
    - 삭제 버튼: `URL.revokeObjectURL` 호출 후 목록에서 제거
    - 오류 메시지: 파일명 + 오류 유형별 안내 (INVALID_TYPE / SIZE_EXCEEDED / COUNT_EXCEEDED)
    - 사진 0장: `사진 없이 견적 보기` 버튼만 표시, `다음` 버튼 숨김
    - 사진 1장 이상: `다음` 버튼 활성화, `사진 없이 견적 보기` 버튼 숨김
    - 개인정보 안내 문구 표시
    - `useEffect` cleanup에서 남은 모든 Object URL 해제 (`URL.revokeObjectURL`)
    - 미리보기 이미지 alt: 파일명 최대 50자 절사
    - _Requirements: 6.1 ~ 6.11, 14.5, 15.1, 15.2, 15.3_

  - [ ]* 5.9 PhotoUploader 프로퍼티 테스트 (`photoUploader.property.test.ts`)
    - **Property 7: 사진 업로드 총 수량 5장 상한 불변성** — 현재 n장(0~5)에서 m장 추가 시 결과 배열 길이 항상 5 이하, n+m>5이면 초과 파일마다 COUNT_EXCEEDED 오류
    - **Property 8: 유효한 이미지 파일의 미리보기 메타데이터 보존** — 유효 파일 선택 시 previewUrl 비어있지 않음, name은 원본 파일명의 최대 50자 절사와 일치
    - fast-check 사용, `numRuns: 100`
    - **Validates: Requirements 6.3, 6.4, 6.6, 14.5**

  - [x] 5.10 `EstimateFlow.tsx` — STEP1~4 컨테이너
    - `currentStep`에 따라 `Step1~4` 컴포넌트를 조건부 렌더링
    - `StepNavigator`를 상단에 배치, `canProceed`, `onNext`, `onBack`, `onReset` 전달
    - `onNext` 핸들러: `SUBMIT_STEP` dispatch
    - `onBack` 핸들러: `GO_BACK` dispatch (STEP1에서는 undefined)
    - 각 Step의 `onChange`에서 `UPDATE_FORM` dispatch
    - _Requirements: 2.1 ~ 2.6, 7.1, 7.2_

  - [x] 5.11 `LoadingScreen.tsx`
    - 로딩 인디케이터 + `선택한 조건으로 예상 견적을 계산하고 있어요.` + 보조 문구 표시
    - `useEffect`에서 800~1200ms 랜덤 `setTimeout` 후 `calculateEstimate` 호출 → `SHOW_RESULT` dispatch
    - 클린업 함수에서 `clearTimeout` 처리
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 5.12 `ResultScreen.tsx`
    - `EstimateResult.status === 'CALCULATED'`이면: 공간 규모, 가구 종류별 수량, 선택 서비스, 첨부 사진 장수, `약 N~M만 원` 형식 견적 범위 표시 (`formatPriceRange` 사용)
    - `status === 'VISIT_REQUIRED'`이면: 입력 요약은 유지, 견적 범위 영역에 `방문 확인 필요` 메시지 + 방문견적 신청 CTA 표시
    - 안내 문구 항상 표시 (참고용 예상 범위 고지)
    - MINOR_REPAIR 메시지 있으면 수리 비용 별도 안내 표시
    - REGULAR_CARE 메시지 있으면 정기관리 별도 상담 안내 표시
    - 3개 CTA: `무료 방문견적 신청`(주요), `조건 다시 선택하기`(보조), `새 견적 시작하기`(보조)
    - _Requirements: 10.1 ~ 10.9_

  - [x] 5.13 `RequestFormScreen.tsx`
    - 필드: 담당자명(필수), 업체명(필수), 연락처(필수), 공간 유형(필수, 드롭다운 or 라디오), 방문 지역(필수), 문의사항(선택), 개인정보 동의(필수 체크박스)
    - 공간 유형 선택지: 사무실, 카페, 음식점, 병원, 학원, 기타
    - blur 이벤트 + 제출 클릭 시 유효성 검사 (`validateName`, `validatePhone`)
    - 오류 필드: `aria-invalid="true"`, `aria-describedby`로 오류 메시지 연결
    - 필수 항목 미완료 또는 동의 미체크이면 신청 버튼 비활성화
    - 신청 버튼 클릭: `VisitRequest` 구성(formData + result + submittedAt ISO 문자열 자동 포함) → 콘솔 출력 → `SUBMIT_REQUEST` dispatch
    - MVP 데모 안내 문구 표시
    - _Requirements: 11.1 ~ 11.8, 14.1, 14.2, 15.4, 15.5, 15.6_

  - [x] 5.14 `CompleteScreen.tsx`
    - `방문견적 신청이 완료되었습니다.` 제목 + `입력한 연락처로 상담 일정을 안내드리겠습니다.` 설명 표시
    - `처음으로 돌아가기` 버튼: 클릭 시 `RESET_ALL` dispatch → LANDING 화면
    - _Requirements: 12.1 ~ 12.4_

  - [x] 5.15 `AppShell` 최종 연결 (`src/care/index.tsx`)
    - `useAppReducer` 훅으로 `state`, `dispatch` 획득
    - `currentScreen`에 따라 모든 화면 컴포넌트 조건부 렌더링
    - `care.css` import
    - _Requirements: 전체 화면 전환 흐름_

- [x] 6. 체크포인트 — 화면 컴포넌트 통합 검증
  - 모든 테스트 통과 (`vitest --run`), 타입 오류 없음 (`tsc --noEmit`)
  - 핵심 UI 흐름: STEP1 → STEP2 이동 시 입력값 유지, 선택 없이 `다음` 버튼 비활성화 확인
  - 문제 발생 시 사용자에게 보고

- [ ] 7. 스타일링 (`src/care/styles/care.css`)

  - [ ] 7.1 기본 레이아웃 및 반응형
    - 모바일 우선(360px+) CSS 작성, 가로 스크롤 없음 보장
    - 콘텐츠 최대 폭 768px 이상에서 720px~960px 제한, 수평 중앙 정렬
    - 모바일(360~767px): 선택 카드 1열 또는 2열 배치
    - 모바일에서 `다음`·제출 버튼 고정 하단(position: sticky 또는 fixed) 배치
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [ ] 7.2 포인트 컬러 및 컴포넌트 스타일
    - 포인트 컬러 정의 (CSS 변수 `--color-primary`)
    - 선택 카드: 기본 상태 vs 선택 상태 (강조 테두리 + 배경색 + 체크 아이콘) — 색상만으로 구분하지 않음
    - 활성/비활성 버튼 명도·채도 차이 스타일
    - 오류 상태 입력란: 기본 상태와 구별되는 테두리 + 오류 아이콘/색상
    - CSS transition: 단일 전환 300ms 이하, JS 인라인 애니메이션 사용 금지
    - WCAG AA 대비 비율(4.5:1) 충족하는 텍스트·배경 색상 설정
    - 키보드 포커스 인디케이터 (`:focus-visible`) 모든 인터랙티브 요소에 적용
    - _Requirements: 14.4, 14.6, 15.5, 16.1, 16.2, 16.3, 16.4_

- [ ] 8. 빌드 검증 및 최종 체크포인트

  - [ ] 8.1 전체 테스트 실행
    - `vitest --run` 실행하여 모든 단위 테스트 및 프로퍼티 테스트 통과 확인
    - 실패 테스트 있으면 수정 후 재실행
    - _Requirements: 전 범위_

  - [ ]* 8.2 UI 통합 테스트 (`@testing-library/react`)
    - STEP1 → STEP2 이동 시 입력값 유지 확인
    - 선택 없이 `다음` 버튼 비활성화 확인
    - 5장 초과 파일 선택 시 오류 메시지 표시 확인
    - _Requirements: 3.4, 4.8, 6.6_

  - [ ] 8.3 TypeScript 빌드 검증
    - `tsc --noEmit` 실행하여 타입 오류 없음 확인
    - _Requirements: 전 범위_

---

## Notes

- `*` 표시 서브태스크는 선택 항목으로 MVP 빠른 검증 시 건너뛸 수 있습니다
- 각 태스크는 이전 태스크에 의존하므로 순서대로 구현하세요
- `calculateEstimate`는 서비스 종류(CLEANING/INSPECTION 구분)를 가격 계산에 반영하지 않습니다 — 단가는 두 서비스의 합산 기준값입니다 (Requirements 8.4)
- `fast-check` 미설치 시 `npm install -D fast-check`로 추가하세요
- Object URL은 반드시 컴포넌트 언마운트 시 해제해야 메모리 누수를 방지합니다
- 프로퍼티 테스트 태그 형식: `// Feature: woodfarm-care-mvp, Property {n}: {property_text}`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "2.4", "2.5", "3.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "2.6", "5.1", "5.2"] },
    { "id": 3, "tasks": ["5.3", "5.5", "5.7", "5.8"] },
    { "id": 4, "tasks": ["5.4", "5.6", "5.9", "5.10", "5.11", "5.12"] },
    { "id": 5, "tasks": ["5.13", "5.14"] },
    { "id": 6, "tasks": ["5.15", "7.1"] },
    { "id": 7, "tasks": ["7.2", "8.1", "8.3"] },
    { "id": 8, "tasks": ["8.2"] }
  ]
}
```
