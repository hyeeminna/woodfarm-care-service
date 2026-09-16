# Requirements Document

## Introduction

WOODFARM CARE 간편 견적은 사무·상업 공간의 가구 클리닝·점검·간단수리·정기관리 서비스를 위한 웹 기반 간편 견적 MVP이다.
사용자는 4단계 질문(공간 규모 → 가구 종류·수량 → 필요 서비스 → 사진 업로드)으로 예상 견적 범위를 확인하고,
무료 방문견적을 신청할 수 있다.

이 MVP는 React + TypeScript + Vite 환경의 순수 프론트엔드 데모로 동작하며, 백엔드·데이터베이스·외부 API 연동은 포함하지 않는다.
기존 woodfarmgagu 프로젝트 안에 독립적인 섹션으로 추가된다.

---

## Glossary

- **App**: WOODFARM CARE 간편 견적 웹 애플리케이션 전체
- **Estimate_Flow**: 랜딩 화면 이후 STEP 1~4를 거쳐 견적 결과까지 이어지는 단계 진행 화면
- **Step_Navigator**: 각 단계 화면 상단에 위치하며 현재 단계 번호와 진행 바를 표시하는 UI 요소
- **Size_Selector**: STEP 1에서 공간 상주 인원 규모를 단일 선택하는 카드 목록 컴포넌트
- **Furniture_Selector**: STEP 2에서 가구 종류를 복수 선택하고 수량을 입력하는 카드 목록 컴포넌트
- **Service_Selector**: STEP 3에서 관리 서비스를 복수 선택하는 카드 목록 컴포넌트
- **Photo_Uploader**: STEP 4에서 가구 사진을 최대 5장 선택하고 미리보기·삭제를 제공하는 컴포넌트
- **Estimate_Calculator**: `estimateConfig` 설정 객체를 참조해 예상 견적 범위를 계산하는 순수 함수 모듈
- **Result_Screen**: 계산된 견적 범위와 입력 요약을 표시하는 화면
- **Visit_Request_Form**: 무료 방문견적 신청을 위한 연락처·공간 정보 입력 폼 컴포넌트
- **Completion_Screen**: 방문견적 신청 완료 메시지를 표시하는 화면
- **estimateConfig**: 가구별 최소·최대 단가를 한 곳에서 관리하는 설정 객체
- **CompanySize**: `'UNDER_10' | 'BETWEEN_11_30' | 'BETWEEN_31_50' | 'OVER_50'` 공간 상주 인원 규모 타입
- **FurnitureType**: `'CHAIR' | 'PARTITION' | 'SOFA' | 'DESK'` 관리 대상 가구 종류 타입
- **ServiceType**: `'CLEANING' | 'INSPECTION' | 'MINOR_REPAIR' | 'REGULAR_CARE'` 서비스 종류 타입
- **EstimateFormData**: 사용자가 4단계에서 입력한 데이터를 담는 TypeScript 인터페이스
- **EstimateResult**: 계산 결과 상태(`CALCULATED` | `VISIT_REQUIRED`), 최소·최대 금액, 안내 메시지를 담는 인터페이스
- **VisitRequest**: 신청 폼 입력값과 견적 데이터를 합쳐 제출 시 구성되는 인터페이스

---

## Requirements

### Requirement 1: 랜딩 화면 진입 및 견적 시작

**User Story:** As a 사무·상업 공간 담당자, I want 랜딩 화면에서 서비스 소개를 확인하고 간편 견적을 시작하기를 원한다, so that 전화 문의 전에 예상 비용과 서비스 범위를 빠르게 파악할 수 있다.

#### Acceptance Criteria

1. THE App SHALL 랜딩 화면에 서비스명 `OFFICE CARE`, 메인 카피 `사무·상업가구, 교체하기 전에 관리하세요.`, 서브 카피 `기업용 사무가구부터 카페·병원·식당 등의 가구까지, 클리닝·유지관리 서비스를 간편하게 확인해보세요.`, 그리고 보조 안내 문구 `약 1분 소요 · 예상 견적 확인 · 무료 방문견적 신청`을 표시한다.
2. WHEN 사용자가 `간편 견적 시작하기` 버튼을 클릭하면, THE App SHALL STEP 1 화면으로 이동한다.
3. THE App SHALL 랜딩 화면에서 `간편 견적 시작하기` 버튼이 화면에서 유일한 주요 액션 버튼이 되도록 하고, 포인트 컬러를 적용하여 다른 텍스트 및 보조 요소와 시각적으로 명확히 구분되는 스타일로 표시한다.

---

### Requirement 2: 단계 진행 표시

**User Story:** As a 견적 입력 중인 사용자, I want 현재 진행 단계를 화면에서 확인하기를 원한다, so that 전체 흐름에서 얼마나 진행되었는지 파악하고 안심하고 계속 진행할 수 있다.

#### Acceptance Criteria

1. WHILE 사용자가 STEP 1부터 STEP 4 중 하나의 화면에 있는 동안, THE Step_Navigator SHALL 현재 단계 번호를 `1 / 4` 형식으로 표시한다.
2. WHILE 사용자가 STEP 1부터 STEP 4 중 하나의 화면에 있는 동안, THE Step_Navigator SHALL 진행 바의 채워진 너비를 `25% x 현재 단계 번호`로 표시한다.
3. WHILE 사용자가 STEP 1 화면에 있는 동안, THE Step_Navigator SHALL `이전` 버튼을 표시하지 않고 `다음` 버튼만 제공한다.
4. WHILE 사용자가 STEP 2~4 중 하나의 화면에 있는 동안, THE Step_Navigator SHALL `이전` 버튼과 `다음` 버튼을 함께 제공한다.
5. WHEN 사용자가 STEP 1~4 어느 화면에서든 `처음으로` 버튼을 클릭하면, THE App SHALL 모든 입력값을 초기화하고 랜딩 화면으로 이동한다.
6. WHILE 사용자가 STEP 1~4 중 하나의 화면에 있는 동안, THE App SHALL 해당 화면에 하나의 단계 질문만 표시한다.

---

### Requirement 3: STEP 1 — 공간 규모 선택

**User Story:** As a 견적을 시작한 사용자, I want 공간 상주 인원 범위를 선택하기를 원한다, so that 서비스 규모에 맞는 견적 참고 기준을 제공할 수 있다.

#### Acceptance Criteria

1. THE Size_Selector SHALL `10인 이하`, `11~30인`, `31~50인`, `50인 이상` 네 개의 카드 선택지를 표시한다.
2. WHEN 사용자가 카드를 클릭하면, THE Size_Selector SHALL 해당 항목만 선택 상태로 변경하고 이전 선택을 해제한다.
3. IF 카드가 선택 상태이면, THEN THE Size_Selector SHALL 해당 카드에 강조 테두리, 배경색 변경, 체크 아이콘을 함께 표시하여 선택 여부를 색상만으로 구분하지 않는다.
4. WHILE 선택된 공간 규모 값이 없는 동안, THE Step_Navigator SHALL `다음` 버튼을 비활성화 상태로 표시하고 클릭 이벤트를 처리하지 않는다.
5. IF 사용자가 네 개 카드 중 하나를 선택한 상태이면, THEN THE Step_Navigator SHALL `다음` 버튼을 활성화 상태로 표시한다.
6. WHEN 사용자가 활성화된 `다음` 버튼을 클릭하면, THE App SHALL 선택값을 `CompanySize` 타입으로 저장하고 STEP 2 화면으로 이동한다.

---

### Requirement 4: STEP 2 — 가구 종류 및 수량 선택

**User Story:** As a 견적을 진행 중인 사용자, I want 관리받을 가구 종류를 선택하고 각 수량을 입력하기를 원한다, so that 가구별 규모를 반영한 견적 범위를 확인할 수 있다.

#### Acceptance Criteria

1. THE Furniture_Selector SHALL `사무용 의자`, `파티션`, `소파`, `책상` 네 가지 가구 카드를 표시한다.
2. WHEN 사용자가 선택 해제된 가구 카드를 클릭하면, THE Furniture_Selector SHALL 해당 카드를 선택 상태로 전환하고 카드 안에 수량 입력 영역을 표시하며 수량 기본값을 1로 설정한다.
3. WHEN 사용자가 선택된 가구 카드를 다시 클릭하면, THE Furniture_Selector SHALL 해당 카드를 선택 해제하고 수량 입력 영역을 숨기며 저장된 수량 값을 제거한다.
4. WHEN 사용자가 수량 입력 필드에 값을 입력하면, THE Furniture_Selector SHALL 1 이상 999 이하의 정수만 유효한 수량으로 저장하고, 범위를 벗어나거나 정수가 아닌 값이 입력된 경우 입력란 아래에 오류 표시를 한다.
5. THE Furniture_Selector SHALL `-` 버튼, 수량 직접 입력 필드, `+` 버튼으로 구성된 스테퍼를 제공한다.
6. IF 현재 수량이 1이면, THEN THE Furniture_Selector SHALL `-` 버튼을 비활성화 상태로 표시한다.
7. IF 현재 수량이 999이면, THEN THE Furniture_Selector SHALL `+` 버튼을 비활성화 상태로 표시한다.
8. WHILE 선택된 가구가 하나도 없거나 선택된 가구 중 유효하지 않은 수량이 하나라도 있는 동안, THE Step_Navigator SHALL `다음` 버튼을 비활성화 상태로 유지한다.
9. IF 한 종류 이상의 가구가 선택되고 선택된 모든 가구의 수량이 1 이상 999 이하의 정수이면, THEN THE Step_Navigator SHALL `다음` 버튼을 활성화 상태로 표시한다.
10. WHEN 사용자가 활성화된 `다음` 버튼을 클릭하면, THE App SHALL 선택값을 `FurnitureItem[]` 타입으로 저장하고 STEP 3 화면으로 이동한다.

---

### Requirement 5: STEP 3 — 관리 서비스 선택

**User Story:** As a 가구 종류와 수량을 입력한 사용자, I want 필요한 관리 서비스를 선택하기를 원한다, so that 원하는 서비스 조합에 맞는 견적 범위를 확인할 수 있다.

#### Acceptance Criteria

1. THE Service_Selector SHALL `세척`, `상태점검`, `간단수리`, `정기관리` 네 가지 서비스 카드를 표시하며, 각 카드에는 서비스명과 한 줄 설명 텍스트를 함께 포함한다.
2. THE Service_Selector SHALL 네 개의 서비스 카드와 같은 화면에 `간단수리와 정기관리는 가구 상태 및 관리 주기에 따라 방문 확인 후 최종 금액이 달라질 수 있습니다.` 안내 문구를 표시한다.
3. WHEN 사용자가 선택 해제된 서비스 카드를 클릭하면, THE Service_Selector SHALL 해당 서비스를 선택 상태로 전환하고 체크 아이콘과 강조 스타일을 표시한다.
4. WHEN 사용자가 선택된 서비스 카드를 클릭하면, THE Service_Selector SHALL 해당 서비스의 선택을 해제하고 강조 스타일을 제거한다.
5. WHILE 선택된 서비스가 하나도 없는 동안, THE Step_Navigator SHALL `다음` 버튼을 비활성화 상태로 표시하고 클릭 이벤트를 처리하지 않는다.
6. WHEN 사용자가 한 개 이상의 서비스를 선택하고 활성화된 `다음` 버튼을 클릭하면, THE App SHALL 선택값을 `ServiceType[]` 타입으로 저장하고 STEP 4 화면으로 이동한다.
7. WHEN 사용자가 이전 단계에서 STEP 3으로 돌아오면, THE Service_Selector SHALL 이전에 선택한 서비스 목록을 유지하여 표시한다.

---

### Requirement 6: STEP 4 — 사진 업로드

**User Story:** As a 서비스를 선택한 사용자, I want 관리받을 가구 사진을 첨부하거나 건너뛰기를 원한다, so that 방문 상담 전에 가구 상태를 미리 전달하거나 사진 없이도 견적을 확인할 수 있다.

#### Acceptance Criteria

1. THE Photo_Uploader SHALL 파일 확장자와 MIME 타입 모두 `image/jpeg`, `image/png`, `image/webp` 중 하나에 해당하는 파일만 유효한 파일로 허용한다.
2. THE Photo_Uploader SHALL 파일당 최대 용량을 10MB(10,485,760바이트)로 제한한다.
3. THE Photo_Uploader SHALL 한 번에 여러 파일 선택을 지원하며 업로드된 총 사진 수량을 최대 5장으로 제한한다.
4. WHEN 사용자가 유효한 이미지 파일을 선택하면, THE Photo_Uploader SHALL 각 사진의 미리보기 이미지와 파일명을 목록에 표시한다.
5. WHEN 사용자가 미리보기 항목의 삭제 버튼을 클릭하면, THE Photo_Uploader SHALL 해당 항목을 목록에서 제거한다.
6. IF 사용자가 현재 5장이 업로드된 상태에서 추가 파일을 선택하면, THEN THE Photo_Uploader SHALL 초과 파일을 목록에 추가하지 않고 최대 첨부 수량 제한을 안내하는 오류 메시지를 파일명과 함께 표시하며 기존 5장은 유지한다.
7. IF 업로드된 사진이 0장이면, THEN THE Photo_Uploader SHALL `사진 없이 견적 보기` 버튼을 표시하고 `다음` 버튼을 표시하지 않는다.
8. IF 업로드된 사진이 1장 이상이면, THEN THE Photo_Uploader SHALL `다음` 버튼을 활성화하고 `사진 없이 견적 보기` 버튼을 표시하지 않는다.
9. THE Photo_Uploader SHALL `사람의 얼굴, 연락처, 문서 등 개인정보가 포함되지 않은 사진을 권장합니다.` 안내 문구를 표시한다.
10. WHEN 사용자가 `다음` 버튼 또는 `사진 없이 견적 보기` 버튼을 클릭하면, THE App SHALL 현재 업로드된 사진 목록을 `UploadedPhoto[]` 형식으로 저장하고 분석 중 화면으로 이동한다.
11. THE Photo_Uploader SHALL 사진 파일을 브라우저 메모리에서만 미리보기 용도로 사용하며 사용자 세션 외부로 전송하거나 저장하지 않는다.

---

### Requirement 7: 입력값 유지 및 단계 이동

**User Story:** As a 견적 입력 중인 사용자, I want 이전 단계로 돌아가거나 결과에서 수정해도 기존 선택값이 유지되기를 원한다, so that 실수로 이전 단계로 이동해도 다시 처음부터 입력하지 않아도 된다.

#### Acceptance Criteria

1. WHILE 사용자가 STEP 2 이상에 있는 동안, WHEN 사용자가 `이전` 버튼을 클릭하면, THE App SHALL 현재 단계 번호에서 1을 뺀 단계 화면으로 이동하고 해당 단계의 기존 입력값을 그대로 표시한다.
2. WHILE 사용자가 STEP 1 화면에 있는 동안, THE App SHALL `이전` 버튼을 표시하지 않는다.
3. WHEN 사용자가 Result_Screen에서 `조건 다시 선택하기` 버튼을 클릭하면, THE App SHALL 기존 EstimateFormData 입력값을 유지한 채로 STEP 1 화면으로 이동한다.
4. WHEN 사용자가 Result_Screen에서 `새 견적 시작하기` 버튼을 클릭하면, THE App SHALL EstimateFormData의 모든 필드를 초기 기본값(빈 값 또는 선택 없음 상태)으로 재설정하고 STEP 1 화면으로 이동한다.
5. THE App SHALL 입력값을 세션이 유지되는 동안 메모리에서 관리하며, 탭을 닫거나 페이지를 새로고침하면 입력값이 재설정된다.

---

### Requirement 8: 예상 견적 계산

**User Story:** As a 4단계 입력을 완료한 사용자, I want 선택한 가구와 서비스를 기준으로 예상 견적 범위를 확인하기를 원한다, so that 전화 문의 전에 서비스 비용의 대략적인 수준을 파악할 수 있다.

#### Acceptance Criteria

1. WHEN Estimate_Calculator가 호출되면, THE Estimate_Calculator SHALL `estimateConfig` 설정 객체에서 가구별 최소·최대 단가를 읽어 계산에 사용한다.
2. THE Estimate_Calculator SHALL 선택된 각 가구 수량에 해당 가구의 최소 단가와 최대 단가를 각각 곱하고 모든 가구의 금액을 합산하여 최소·최대 견적 범위를 산출한다.
3. THE Estimate_Calculator SHALL 계산된 최소·최대 금액에서 만 원 미만을 절사하여 만 원 단위로 표시한다.
4. THE Estimate_Calculator SHALL 초기 데모 단가로 사무용 의자 최소 7,000원/최대 8,500원, 파티션 최소 4,000원/최대 6,500원을 사용하며, 해당 단가는 세척과 상태점검을 합산한 기본 서비스 기준값이다.
5. IF `estimateConfig`에서 단가가 `null`로 설정된 가구(소파, 책상)가 선택값에 하나라도 포함되면, THEN THE Estimate_Calculator SHALL `EstimateResult.status`를 `VISIT_REQUIRED`로 설정하고 `minPrice`와 `maxPrice`를 `null`로 반환한다.
6. IF 선택된 서비스에 `MINOR_REPAIR`가 포함되면, THEN THE Estimate_Calculator SHALL 수리 비용을 합산하지 않고 수리 비용 별도 안내 메시지를 `EstimateResult.messages`에 추가한다.
7. IF 선택된 서비스에 `REGULAR_CARE`가 포함되면, THEN THE Estimate_Calculator SHALL 정기관리 비용을 합산하지 않고 정기관리 별도 상담 메시지를 `EstimateResult.messages`에 추가한다.
8. WHEN `사무용 의자 30개`, `파티션 10개`, `CLEANING`, `INSPECTION`을 입력하면, THE Estimate_Calculator SHALL `minPrice` 250,000원, `maxPrice` 320,000원을 반환하여 결과 화면에 `약 25~32만 원`으로 표시한다.
9. THE Estimate_Calculator SHALL 서비스별 할인, 최소 출장비, 거리별 출장비, 부가가치세, 가구 재질, 오염도, 작업 난이도를 계산에 반영하지 않는다.

---

### Requirement 9: 분석 중 화면

**User Story:** As a 4단계 입력을 완료하고 결과를 기다리는 사용자, I want 분석 중임을 알리는 화면을 보기를 원한다, so that 견적 결과가 준비되고 있다는 것을 인지하고 기다릴 수 있다.

#### Acceptance Criteria

1. WHEN 분석 중 화면이 표시되면, THE App SHALL 로딩 인디케이터와 함께 `선택한 조건으로 예상 견적을 계산하고 있어요.` 문구와 `실제 금액은 현장 상태와 가구 재질에 따라 달라질 수 있습니다.` 보조 문구를 표시한다.
2. WHEN 분석 중 화면이 표시되면, THE App SHALL 800ms 이상 1,200ms 이하의 시간이 경과한 뒤 자동으로 Result_Screen으로 이동한다.
3. THE Estimate_Calculator SHALL 견적 계산을 클라이언트 브라우저에서 동기적으로 처리하며 외부 서버 요청 없이 완료한다.

---

### Requirement 10: 예상 견적 결과 표시

**User Story:** As a 견적 계산이 완료된 사용자, I want 선택 내용과 예상 견적 범위를 한 화면에서 확인하기를 원한다, so that 방문견적 신청 여부를 결정하기 위한 충분한 정보를 얻을 수 있다.

#### Acceptance Criteria

1. IF EstimateResult.status가 `CALCULATED`이면, THEN THE Result_Screen SHALL 선택한 공간 규모, 가구 종류별 수량, 선택 서비스, 첨부 사진 장수, 그리고 `약 N~M만 원` 형식의 예상 견적 범위를 한 화면에 표시한다.
2. THE Result_Screen SHALL `위 금액은 입력한 수량과 서비스를 기준으로 계산한 참고용 예상 범위입니다. 가구의 재질, 오염·파손 정도, 작업 환경, 이동 거리 등에 따라 실제 견적은 달라질 수 있습니다.` 안내 문구를 항상 표시한다.
3. IF EstimateResult.status가 `VISIT_REQUIRED`이면, THEN THE Result_Screen SHALL 선택한 공간 규모, 가구 종류별 수량, 선택 서비스, 첨부 사진 장수는 유지하여 표시하고, 견적 범위 영역에는 금액 대신 `방문 확인 필요` 메시지와 방문견적 신청 CTA를 표시하며 오류 화면으로 전환하지 않는다.
4. THE Result_Screen SHALL `무료 방문견적 신청` 주요 CTA 버튼, `조건 다시 선택하기` 보조 CTA 버튼, `새 견적 시작하기` 보조 CTA 버튼을 제공한다.
5. WHEN 사용자가 `조건 다시 선택하기` 버튼을 클릭하면, THE App SHALL 기존 EstimateFormData 입력값을 유지한 채로 STEP 1 화면으로 이동한다.
6. WHEN 사용자가 `새 견적 시작하기` 버튼을 클릭하면, THE App SHALL EstimateFormData의 모든 입력값을 초기화하고 STEP 1 화면으로 이동한다.
7. IF EstimateResult.messages에 MINOR_REPAIR 관련 메시지가 포함되면, THEN THE Result_Screen SHALL 수리 비용 별도 안내 문구를 표시한다.
8. IF EstimateResult.messages에 REGULAR_CARE 관련 메시지가 포함되면, THEN THE Result_Screen SHALL 정기관리 별도 상담 안내 문구를 표시한다.
9. WHEN 사용자가 `무료 방문견적 신청` 버튼을 클릭하면, THE App SHALL Visit_Request_Form 화면으로 이동한다.

---

### Requirement 11: 방문견적 신청 폼

**User Story:** As a 예상 견적을 확인한 사용자, I want 연락처와 공간 정보를 입력하여 무료 방문견적을 신청하기를 원한다, so that 전문가가 방문하여 정확한 견적과 상담을 제공받을 수 있다.

#### Acceptance Criteria

1. THE Visit_Request_Form SHALL 담당자명(필수), 업체명 또는 공간명(필수), 연락처(필수), 공간 유형(필수), 방문 지역(필수), 문의사항(선택), 개인정보 수집·이용 동의(필수) 입력 항목을 제공한다.
2. THE Visit_Request_Form SHALL 공간 유형 선택지로 `사무실`, `카페`, `음식점`, `병원`, `학원`, `기타`를 제공한다.
3. IF 담당자명 또는 업체명 입력값이 공백 문자만으로 구성되거나 빈 문자열이면, THEN THE Visit_Request_Form SHALL 해당 입력란 아래에 어떤 조건을 위반했는지 알 수 있는 오류 문구를 표시한다.
4. IF 연락처 입력값에 숫자와 하이픈 이외의 문자가 포함되면, THEN THE Visit_Request_Form SHALL 해당 입력란 아래에 어떤 조건을 위반했는지 알 수 있는 오류 문구를 표시한다.
5. WHILE 필수 항목 중 하나라도 유효하지 않거나 개인정보 동의가 체크되지 않은 동안, THE Visit_Request_Form SHALL 신청 버튼을 비활성화 상태로 유지한다.
6. WHEN 방문견적 신청 폼이 표시되면, THE Visit_Request_Form SHALL 규모 선택값, 가구 종류 및 수량, 선택 서비스, 계산된 예상 견적 범위, 업로드 사진, 신청 일시를 `VisitRequest` 인터페이스에 자동으로 포함한다.
7. THE Visit_Request_Form SHALL `현재 화면은 MVP 데모이며 실제 접수 기능은 추후 연결 예정입니다.` 안내 문구를 표시한다.
8. WHEN 사용자가 유효한 모든 입력을 완료하고 신청 버튼을 클릭하면, THE Visit_Request_Form SHALL 신청 데이터를 외부 서버로 전송하지 않고 브라우저 개발자 콘솔에 출력한 뒤 Completion_Screen으로 이동한다.

---

### Requirement 12: 신청 완료 화면

**User Story:** As a 방문견적 신청을 제출한 사용자, I want 신청 완료 확인 메시지를 보기를 원한다, so that 신청이 정상적으로 처리되었음을 인지하고 다음 행동을 결정할 수 있다.

#### Acceptance Criteria

1. WHEN 방문견적 신청 제출이 완료되면, THE App SHALL Completion_Screen으로 이동한다.
2. THE Completion_Screen SHALL `방문견적 신청이 완료되었습니다.` 제목과 `입력한 연락처로 상담 일정을 안내드리겠습니다.` 설명 문구를 표시한다.
3. THE Completion_Screen SHALL `처음으로 돌아가기` 버튼을 제공한다.
4. WHEN 사용자가 `처음으로 돌아가기` 버튼을 클릭하면, THE App SHALL EstimateFormData의 모든 필드를 초기 기본값으로 재설정하고 랜딩 화면으로 이동한다.

---

### Requirement 13: 반응형 레이아웃

**User Story:** As a 모바일 또는 데스크톱 기기를 사용하는 사용자, I want 가로 스크롤 없이 모든 화면을 사용하기를 원한다, so that 기기 종류와 관계없이 불편 없이 견적 흐름을 완료할 수 있다.

#### Acceptance Criteria

1. THE App SHALL 360px 이상의 화면 폭에서 견적 흐름의 모든 단계 화면을 가로 스크롤 없이 표시한다.
2. WHILE 화면 폭이 360px 이상 767px 이하인 동안, THE App SHALL 선택 카드를 1열 또는 2열로 배치한다.
3. WHILE 화면 폭이 768px 이상인 동안, THE App SHALL 콘텐츠 영역의 최대 폭을 720px 이상 960px 이하로 제한한다.
4. WHILE 화면 폭이 360px 이상 767px 이하인 동안, THE App SHALL 다음 단계 이동 버튼 및 제출 버튼을 viewport 하단에 고정된 영역에 배치한다.

---

### Requirement 14: 접근성 및 키보드 지원

**User Story:** As a 키보드 또는 보조 기술을 사용하는 사용자, I want 모든 입력과 이동을 키보드로 수행하기를 원한다, so that 마우스 없이도 견적 흐름 전체를 완료할 수 있다.

#### Acceptance Criteria

1. THE App SHALL 모든 입력 요소에 연결된 레이블(`<label>` 또는 `aria-label`)을 제공한다.
2. THE App SHALL 키보드 Tab, Enter, Space 키만으로 카드 선택, 단계 이동, 폼 제출이 가능하도록 구현한다.
3. THE App SHALL 선택 상태를 색상만으로 구분하지 않고 체크 아이콘과 텍스트를 함께 사용한다.
4. THE App SHALL 모든 버튼과 본문 텍스트에서 배경 대비 명도 비율이 WCAG AA 기준(4.5:1)을 충족하도록 색상을 설정한다.
5. WHEN 사용자가 업로드한 이미지 파일이 미리보기로 표시되면, THE App SHALL 해당 이미지에 파일명을 50자 이내로 잘라 대체 텍스트로 제공한다.
6. THE App SHALL 키보드 포커스가 이동할 때 현재 포커스된 요소를 시각적으로 식별할 수 있는 포커스 인디케이터를 표시한다.

---

### Requirement 15: 입력 오류 처리

**User Story:** As a 잘못된 입력을 시도한 사용자, I want 오류 원인과 수정 방법을 화면에서 확인하기를 원한다, so that 올바른 값을 입력하여 견적 흐름을 계속 진행할 수 있다.

#### Acceptance Criteria

1. IF Photo_Uploader에서 허용되지 않은 파일 형식이 선택되면, THEN THE App SHALL 해당 파일명과 함께 허용되는 형식(JPG, JPEG, PNG, WEBP)을 안내하는 오류 메시지를 표시한다.
2. IF Photo_Uploader에서 10MB를 초과하는 파일이 선택되면, THEN THE App SHALL 해당 파일명과 함께 파일 크기 제한(10MB)을 안내하는 오류 메시지를 표시한다.
3. IF Photo_Uploader에서 5장 초과 파일 추가가 시도되면, THEN THE App SHALL 초과된 파일명과 함께 최대 첨부 수량(5장) 제한을 안내하는 오류 메시지를 표시한다.
4. IF Visit_Request_Form 제출 시 유효하지 않은 입력란이 있으면, THEN THE App SHALL 담당자명·업체명의 공백 전용 금지, 연락처의 숫자+하이픈 형식, 필수 항목 미입력, 개인정보 동의 미체크 중 어떤 조건을 위반했는지 해당 입력란 아래에 오류 안내를 표시한다.
5. IF 입력란에 오류가 발생하면, THEN THE App SHALL 해당 입력란에 기본 상태와 구별되는 테두리 스타일과 오류 아이콘 또는 색상을 적용하여 오류 위치를 명확히 한다.
6. WHEN 사용자가 오류가 발생한 입력란의 값을 유효한 값으로 수정하면, THE App SHALL 해당 입력란의 오류 표시를 즉시 제거한다.

---

### Requirement 16: UI 시각 피드백

**User Story:** As a 견적 흐름을 진행 중인 사용자, I want 내 행동에 즉각적인 시각 피드백을 받기를 원한다, so that 선택과 입력이 정상적으로 반영되었는지 확인하며 안심하고 다음 단계로 진행할 수 있다.

#### Acceptance Criteria

1. WHEN 사용자가 선택 카드를 클릭하면, THE App SHALL 선택 상태(강조 테두리, 배경색 변경, 체크 아이콘 표시)를 50ms 이내에 시각적으로 반영한다.
2. THE App SHALL 비활성화된 버튼과 활성화된 버튼을 명도 또는 채도의 차이가 눈에 띄게 구분되는 스타일로 표시한다.
3. THE App SHALL 화면 전환 및 상태 변경에 CSS transition 속성 기반의 애니메이션만 사용하며 단일 전환 지속 시간을 300ms 이하로 제한한다.
4. THE App SHALL 로딩 상태, 성공 상태, 오류 상태를 각각 구분된 시각 요소(아이콘, 색상, 텍스트 중 하나 이상)로 표시한다.
