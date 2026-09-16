import React from 'react';

// ── StepNavigator Props Interface ──────────────────────────────────

export interface StepNavigatorProps {
  currentStep: number;
  canProceed: boolean;
  onNext: () => void;
  onBack?: () => void;
  onReset: () => void;
}

// ── StepNavigator Component ───────────────────────────────────────

/**
 * 견적 단계 네비게이터 컴포넌트
 * 
 * 단계 표시, 진행 바, 네비게이션 버튼을 제공합니다.
 * 
 * Requirements:
 * - 2.1-2.6: 단계 표시, 진행 바, 이전/다음/처음으로 버튼
 * - 14.1-14.2: 접근성 aria-label 지원
 * - 13.4: 모바일에서 하단 고정 버튼 배치 (EstimateFlow에서 처리)
 */
export const StepNavigator: React.FC<StepNavigatorProps> = ({
  currentStep,
  canProceed,
  onNext,
  onBack,
  onReset,
}) => {
  // 진행 바 너비 계산 (현재 단계 * 25%)
  const progressWidth = `${currentStep * 25}%`;

  return (
    <nav className="step-navigator" role="navigation" aria-label="견적 단계 네비게이션">
      {/* 단계 표시 */}
      <div className="step-navigator__display">
        <span className="step-navigator__text" aria-label={`4단계 중 ${currentStep}단계`}>
          {currentStep} / 4
        </span>
      </div>

      {/* 진행 바 */}
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
          style={{ width: progressWidth }}
          aria-hidden="true"
        />
      </div>

      {/* 버튼 그룹 */}
      <div className="step-navigator__buttons">
        {/* 처음으로 버튼 - 모든 단계에 표시 */}
        <button
          type="button"
          className="care-btn care-btn--text"
          onClick={onReset}
          aria-label="처음으로 돌아가기"
        >
          처음으로
        </button>

        <div className="step-navigator__nav-buttons">
          {/* 이전 버튼 - onBack이 있을 때만 렌더링 (STEP2~4) */}
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

          {/* 다음 버튼 - canProceed가 false면 disabled */}
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
    </nav>
  );
};

export default StepNavigator;