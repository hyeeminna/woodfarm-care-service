// ── 공통 열거 타입 ──────────────────────────────────────────

export type CompanySize =
  | 'UNDER_10'
  | 'BETWEEN_11_30'
  | 'BETWEEN_31_50'
  | 'OVER_50';

export type FurnitureType = 'CHAIR' | 'PARTITION' | 'SOFA' | 'DESK';

export type ServiceType =
  | 'CLEANING'
  | 'INSPECTION'
  | 'MINOR_REPAIR'
  | 'REGULAR_CARE';

export type SpaceType =
  | 'OFFICE'
  | 'CAFE'
  | 'RESTAURANT'
  | 'HOSPITAL'
  | 'ACADEMY'
  | 'OTHER';

// ── 핵심 데이터 구조 ──────────────────────────────────────────

export interface FurnitureItem {
  type: FurnitureType;
  quantity: number; // 1~999 정수
}

export interface UploadedPhoto {
  file: File;
  previewUrl: string; // Object URL (URL.createObjectURL)
  name: string;       // 파일명 (alt 텍스트용, 최대 50자)
}

export interface EstimateFormData {
  companySize: CompanySize | null;
  furniture: FurnitureItem[];
  services: ServiceType[];
  photos: UploadedPhoto[];
}

// ── 견적 결과 ─────────────────────────────────────────────────

export type EstimateStatus = 'CALCULATED' | 'VISIT_REQUIRED';

export type EstimateMessageType = 'MINOR_REPAIR_NOTICE' | 'REGULAR_CARE_NOTICE';

export interface EstimateMessage {
  type: EstimateMessageType;
  text: string;
}

export interface EstimateResult {
  status: EstimateStatus;
  minPrice: number | null;  // 만 원 절사 후 값 (VISIT_REQUIRED이면 null)
  maxPrice: number | null;
  messages: EstimateMessage[];
}

// ── 견적 설정 객체 ────────────────────────────────────────────

export interface FurniturePriceConfig {
  min: number | null; // null = 방문 확인 필요
  max: number | null;
}

export type EstimateConfig = Record<FurnitureType, FurniturePriceConfig>;

// ── 방문견적 신청 ─────────────────────────────────────────────

export interface VisitRequestFormFields {
  managerName: string;
  companyName: string;
  phone: string;           // 숫자와 하이픈만 허용
  spaceType: SpaceType;
  region: string;
  inquiry: string;         // 선택 항목
  privacyConsent: boolean; // 필수
}

export interface VisitRequest {
  // 폼 입력값
  managerName: string;
  companyName: string;
  phone: string;           // 숫자와 하이픈만 허용
  spaceType: SpaceType;
  region: string;
  inquiry: string;         // 선택 항목
  privacyConsent: boolean; // 필수

  // 견적 데이터 (자동 포함)
  formData: EstimateFormData;
  result: EstimateResult;
  submittedAt: string;     // ISO 8601 문자열
}

export type FormErrors = Partial<Record<keyof VisitRequestFormFields, string>>;

export interface UploadError {
  fileName: string;
  reason: 'INVALID_TYPE' | 'SIZE_EXCEEDED' | 'COUNT_EXCEEDED';
}

// ── 화면 상태 및 앱 상태 ────────────────────────────────────────

export type ScreenState =
  | 'LANDING'
  | 'STEP1'
  | 'STEP2'
  | 'STEP3'
  | 'STEP4'
  | 'LOADING'
  | 'RESULT'
  | 'REQUEST_FORM'
  | 'COMPLETE';

export interface AppState {
  currentScreen: ScreenState;
  formData: EstimateFormData;
  result: EstimateResult | null;
}

export type AppAction =
  | { type: 'START_ESTIMATE' }
  | { type: 'UPDATE_FORM'; payload: Partial<EstimateFormData> }
  | { type: 'GO_TO_STEP'; step: 1 | 2 | 3 | 4 }
  | { type: 'SUBMIT_STEP'; step: 1 | 2 | 3 | 4 }
  | { type: 'GO_BACK' }
  | { type: 'SHOW_LOADING' }
  | { type: 'SHOW_RESULT'; result: EstimateResult }
  | { type: 'GO_TO_REQUEST_FORM' }
  | { type: 'SUBMIT_REQUEST'; visitRequest: VisitRequest }
  | { type: 'RESET_ALL' }
  | { type: 'RESET_AND_RETRY' };