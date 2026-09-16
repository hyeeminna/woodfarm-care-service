import React from 'react';
import { useAppReducer } from './hooks/useAppReducer';
import { LandingScreen } from './screens/LandingScreen';
import { EstimateFlow } from './screens/EstimateFlow';
import { LoadingScreen } from './screens/LoadingScreen';
import { ResultScreen } from './screens/ResultScreen';
import { RequestFormScreen } from './screens/RequestFormScreen';
import { CompleteScreen } from './screens/CompleteScreen';
import './styles/care.css';

/**
 * WOODFARM CARE 간편 견적 MVP - 메인 AppShell 컴포넌트
 * 
 * 전체 앱 상태를 관리하고 currentScreen에 따라 적절한 화면 컴포넌트를 렌더링합니다.
 * 라우팅 라이브러리 없이 useReducer를 사용한 단순한 상태 기반 화면 전환을 구현합니다.
 * 
 * 화면 전환 흐름:
 * LANDING → STEP1~4 (EstimateFlow) → LOADING → RESULT → REQUEST_FORM → COMPLETE
 * 
 * Requirements:
 * - 5.15: useAppReducer 연결 및 조건부 렌더링
 * - 전체 화면 전환 흐름 관리
 */
export function AppShell() {
  const { state, dispatch } = useAppReducer();

  // 현재 화면에 따른 컴포넌트 렌더링
  const renderCurrentScreen = () => {
    switch (state.currentScreen) {
      case 'LANDING':
        return <LandingScreen onAction={dispatch} />;

      case 'STEP1':
      case 'STEP2':  
      case 'STEP3':
      case 'STEP4':
        // EstimateFlow가 내부적으로 currentStep을 관리하므로 현재 단계 번호를 전달
        const currentStep = getCurrentStepNumber(state.currentScreen);
        return (
          <EstimateFlow
            currentStep={currentStep}
            formData={state.formData}
            dispatch={dispatch}
          />
        );

      case 'LOADING':
        return (
          <LoadingScreen
            formData={state.formData}
            dispatch={dispatch}
          />
        );

      case 'RESULT':
        // result가 null일 수 없지만 타입 안전성을 위해 체크
        if (!state.result) {
          console.error('RESULT 화면에서 result가 없습니다.');
          dispatch({ type: 'RESET_ALL' });
          return null;
        }
        return (
          <ResultScreen
            formData={state.formData}
            result={state.result}
            onRequestVisit={() => dispatch({ type: 'GO_TO_REQUEST_FORM' })}
            onRetry={() => dispatch({ type: 'RESET_AND_RETRY' })}
            onReset={() => dispatch({ type: 'RESET_ALL' })}
          />
        );

      case 'REQUEST_FORM':
        // result가 null일 수 없지만 타입 안전성을 위해 체크
        if (!state.result) {
          console.error('REQUEST_FORM 화면에서 result가 없습니다.');
          dispatch({ type: 'RESET_ALL' });
          return null;
        }
        return (
          <RequestFormScreen
            formData={state.formData}
            result={state.result}
            onAction={dispatch}
          />
        );

      case 'COMPLETE':
        return <CompleteScreen onAction={dispatch} />;

      default:
        // 예상치 못한 화면 상태 처리
        console.error('알 수 없는 화면 상태:', state.currentScreen);
        dispatch({ type: 'RESET_ALL' });
        return null;
    }
  };

  return (
    <div className="woodfarm-care-app">
      {renderCurrentScreen()}
    </div>
  );
}

/**
 * ScreenState를 단계 번호로 변환하는 유틸리티 함수
 */
function getCurrentStepNumber(screenState: string): 1 | 2 | 3 | 4 {
  switch (screenState) {
    case 'STEP1':
      return 1;
    case 'STEP2':
      return 2;
    case 'STEP3':
      return 3;
    case 'STEP4':
      return 4;
    default:
      // 기본값으로 1 반환 (타입 안전성)
      return 1;
  }
}

// 기본 export
export default AppShell;