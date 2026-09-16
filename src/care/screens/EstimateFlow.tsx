import React, { useMemo } from 'react';
import type { EstimateFormData, AppAction, FurnitureItem, ServiceType, UploadedPhoto, CompanySize } from '../types';
import { StepNavigator } from '../components/StepNavigator';
import { Step1_SizeSelector } from '../components/Step1_SizeSelector';
import { Step2_FurnitureSelector } from '../components/Step2_FurnitureSelector';
import { Step3_ServiceSelector, canProceedFromStep3 } from '../components/Step3_ServiceSelector';
import { Step4_PhotoUploader } from '../components/Step4_PhotoUploader';

// ── EstimateFlow Props Interface ─────────────────────────────

export interface EstimateFlowProps {
  currentStep: 1 | 2 | 3 | 4;
  formData: EstimateFormData;
  dispatch: React.Dispatch<AppAction>;
}

// ── Mobile Bottom Navigation Component ──────────────────────

interface MobileBottomNavProps {
  currentStep: number;
  canProceed: boolean;
  onNext: () => void;
  onBack?: () => void;
  onReset: () => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentStep,
  canProceed,
  onNext,
  onBack,
  onReset,
}) => {
  return (
    <div className="care-bottom-fixed care-mobile-only">
      <div className="step-navigator__buttons">
        <button
          type="button"
          className="care-btn care-btn--text"
          onClick={onReset}
          aria-label="처음으로 돌아가기"
        >
          처음으로
        </button>

        <div className="step-navigator__nav-buttons">
          {onBack && (
            <button
              type="button"
              className="care-btn care-btn--secondary"
              onClick={onBack}
              aria-label="이전 단계로"
            >
              이전
            </button>
          )}

          <button
            type="button"
            className="care-btn care-btn--primary"
            onClick={onNext}
            disabled={!canProceed}
            aria-label="다음 단계로"
            aria-disabled={!canProceed}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

// ── EstimateFlow Component ──────────────────────────────────

/**
 * 견적 입력 흐름 컨테이너 컴포넌트
 * 
 * STEP 1~4 화면을 관리하고 StepNavigator와 통합합니다.
 * 각 단계의 유효성 검사와 네비게이션을 처리합니다.
 * 
 * Requirements:
 * - 2.1-2.6: 단계 진행 표시 및 네비게이션
 * - 7.1-7.2: 입력값 유지 및 단계 이동
 * - 13.1-13.4: 반응형 레이아웃, 모바일 하단 고정 버튼
 */
export const EstimateFlow: React.FC<EstimateFlowProps> = ({
  currentStep,
  formData,
  dispatch,
}) => {
  
  // ── 각 단계별 진행 가능 여부 계산 ────────────────────────────

  const canProceedFromStep1 = useMemo(() => {
    return formData.companySize !== null;
  }, [formData.companySize]);

  const canProceedFromStep2 = useMemo(() => {
    return formData.furniture.length > 0 && 
           formData.furniture.every(item => 
             item.quantity >= 1 && 
             item.quantity <= 999 && 
             Number.isInteger(item.quantity)
           );
  }, [formData.furniture]);

  // Step3의 canProceed는 컴포넌트에서 정의된 함수 사용
  const canProceedFromStep3Value = useMemo(() => {
    return canProceedFromStep3(formData.services);
  }, [formData.services]);

  const canProceedFromStep4 = useMemo(() => {
    // Step4는 항상 진행 가능 (사진 없이도 가능)
    return true;
  }, []);

  // 현재 단계의 진행 가능 여부
  const currentStepCanProceed = useMemo(() => {
    switch (currentStep) {
      case 1:
        return canProceedFromStep1;
      case 2:
        return canProceedFromStep2;
      case 3:
        return canProceedFromStep3Value;
      case 4:
        return canProceedFromStep4;
      default:
        return false;
    }
  }, [currentStep, canProceedFromStep1, canProceedFromStep2, canProceedFromStep3Value, canProceedFromStep4]);

  // ── 네비게이션 핸들러 ────────────────────────────────────────

  const handleNext = () => {
    if (currentStepCanProceed) {
      dispatch({ type: 'SUBMIT_STEP', step: currentStep });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'GO_BACK' });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_ALL' });
  };

  // ── 각 Step의 onChange 핸들러 ───────────────────────────────

  const handleStep1Change = (value: CompanySize) => {
    dispatch({
      type: 'UPDATE_FORM',
      payload: { companySize: value },
    });
  };

  const handleStep2Change = (items: FurnitureItem[]) => {
    dispatch({
      type: 'UPDATE_FORM',
      payload: { furniture: items },
    });
  };

  const handleStep3Change = (services: ServiceType[]) => {
    dispatch({
      type: 'UPDATE_FORM',
      payload: { services },
    });
  };

  const handleStep4Change = (photos: UploadedPhoto[]) => {
    dispatch({
      type: 'UPDATE_FORM',
      payload: { photos },
    });
  };

  return (
    <div className="woodfarm-care-app">
      {/* 상단 네비게이터 - 데스크톱에서는 네비게이션 버튼 포함, 모바일에서는 진행 상태만 */}
      <div className="care-desktop-only">
        <StepNavigator
          currentStep={currentStep}
          canProceed={currentStepCanProceed}
          onNext={handleNext}
          onBack={currentStep > 1 ? handleBack : undefined}
          onReset={handleReset}
        />
      </div>
      
      {/* 모바일에서는 진행 상태만 표시하는 간소화된 네비게이터 */}
      <div className="care-mobile-only">
        <div className="step-navigator">
          <div className="step-navigator__display">
            <span className="step-navigator__text" aria-label={`4단계 중 ${currentStep}단계`}>
              {currentStep} / 4
            </span>
          </div>
          <div 
            className="step-navigator__progress"
            role="progressbar" 
            aria-valuenow={currentStep} 
            aria-valuemin={1} 
            aria-valuemax={4}
            aria-label={`견적 진행률 ${currentStep * 25}%`}
          >
            <div 
              className="step-navigator__progress-fill"
              style={{ width: `${currentStep * 25}%` }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* 단계별 콘텐츠 */}
      <div className="care-content-with-bottom-nav">
        <main role="main" aria-label={`견적 단계 ${currentStep}`}>
          {currentStep === 1 && (
            <Step1_SizeSelector
              selected={formData.companySize}
              onChange={handleStep1Change}
            />
          )}

          {currentStep === 2 && (
            <Step2_FurnitureSelector
              items={formData.furniture}
              onChange={handleStep2Change}
            />
          )}

          {currentStep === 3 && (
            <Step3_ServiceSelector
              selected={formData.services}
              onChange={handleStep3Change}
            />
          )}

          {currentStep === 4 && (
            <Step4_PhotoUploader
              photos={formData.photos}
              onChange={handleStep4Change}
            />
          )}
        </main>
      </div>

      {/* 모바일 하단 고정 네비게이션 */}
      <MobileBottomNav
        currentStep={currentStep}
        canProceed={currentStepCanProceed}
        onNext={handleNext}
        onBack={currentStep > 1 ? handleBack : undefined}
        onReset={handleReset}
      />
    </div>
  );
};

export default EstimateFlow;