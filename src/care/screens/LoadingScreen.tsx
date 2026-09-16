import { useEffect } from 'react';
import type { EstimateFormData, AppAction, EstimateResult } from '../types';
import { calculateEstimate } from '../lib/calculateEstimate';

interface LoadingScreenProps {
  formData: EstimateFormData;
  dispatch: (action: AppAction) => void;
}

/**
 * 분석 중 화면 컴포넌트
 * 
 * STEP 4 완료 후 견적 계산 결과를 기다리는 동안 표시되는 로딩 화면.
 * 800~1200ms 랜덤 딜레이 후 calculateEstimate를 호출하여 SHOW_RESULT 액션을 dispatch한다.
 * 
 * Requirements 9.1, 9.2, 9.3: 분석 중 화면
 */
export function LoadingScreen({ formData, dispatch }: LoadingScreenProps) {
  useEffect(() => {
    // 800~1200ms 랜덤 딜레이 (Requirements 9.2)
    const delay = 800 + Math.random() * 400; // 800 + 0~400ms = 800~1200ms
    
    const timeoutId = setTimeout(() => {
      // 견적 계산을 클라이언트에서 동기적으로 처리 (Requirements 9.3)
      const result: EstimateResult = calculateEstimate(formData);
      
      // SHOW_RESULT 액션으로 결과 화면 이동
      dispatch({
        type: 'SHOW_RESULT',
        result,
      });
    }, delay);

    // 클린업 함수에서 clearTimeout 처리
    return () => {
      clearTimeout(timeoutId);
    };
  }, [formData, dispatch]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        {/* 로딩 인디케이터 (Requirements 9.1) */}
        <div className="loading-indicator" role="status" aria-live="polite">
          <div className="loading-spinner"></div>
        </div>
        
        {/* 메인 메시지 (Requirements 9.1) */}
        <h2 className="loading-message">
          선택한 조건으로 예상 견적을 계산하고 있어요.
        </h2>
        
        {/* 보조 문구 (Requirements 9.1) */}
        <p className="loading-subtitle">
          실제 금액은 현장 상태와 가구 재질에 따라 달라질 수 있습니다.
        </p>
      </div>
    </div>
  );
}