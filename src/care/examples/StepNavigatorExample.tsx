import React, { useState } from 'react';
import { StepNavigator } from '../components';

/**
 * StepNavigator 컴포넌트 사용 예제
 * 
 * 4단계 견적 플로우에서 사용하는 네비게이터의 동작을 보여줍니다.
 */
export function StepNavigatorExample() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [canProceed, setCanProceed] = useState<boolean>(false);

  const handleNext = () => {
    if (currentStep < 4 && canProceed) {
      setCurrentStep(currentStep + 1);
      // 다음 단계에서는 기본적으로 진행 불가능 상태로 시작
      setCanProceed(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // 이전 단계로 돌아가면 진행 가능 상태로 설정
      setCanProceed(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setCanProceed(false);
  };

  const toggleCanProceed = () => {
    setCanProceed(!canProceed);
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px' }}>
      <h2>StepNavigator Example</h2>
      
      <div style={{ marginBottom: '20px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
        <p><strong>Current Step:</strong> {currentStep}</p>
        <p><strong>Can Proceed:</strong> {canProceed ? 'Yes' : 'No'}</p>
        <button 
          onClick={toggleCanProceed}
          style={{
            padding: '8px 16px',
            background: '#6c5ce7',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Toggle Can Proceed
        </button>
      </div>

      <StepNavigator
        currentStep={currentStep}
        canProceed={canProceed}
        onNext={handleNext}
        onBack={currentStep > 1 ? handleBack : undefined}
        onReset={handleReset}
      />

      <div style={{ marginTop: '20px', padding: '16px', background: '#e3f2fd', borderRadius: '8px' }}>
        <h4>Instructions:</h4>
        <ul>
          <li>Toggle "Can Proceed" button to enable/disable the 다음 button</li>
          <li>Click 다음 to advance (only when enabled)</li>
          <li>Click 이전 to go back (available from step 2+)</li>
          <li>Click 처음으로 to reset to step 1</li>
          <li>Progress bar shows current progress (25% per step)</li>
        </ul>
      </div>
    </div>
  );
}

export default StepNavigatorExample;