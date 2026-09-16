import React from 'react';
import { LandingScreen } from '../screens/LandingScreen';
import { useAppReducer } from '../hooks/useAppReducer';

/**
 * LandingScreen 사용 예시 컴포넌트
 * 
 * 이 컴포넌트는 LandingScreen이 실제 앱에서 어떻게 사용되는지 보여줍니다.
 */
export function LandingScreenExample() {
  const { state, dispatch } = useAppReducer();

  // START_ESTIMATE 액션이 실행되었을 때의 상태 변화 확인용
  console.log('Current screen:', state.currentScreen);

  return (
    <div>
      {state.currentScreen === 'LANDING' ? (
        <LandingScreen onAction={dispatch} />
      ) : (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>견적 프로세스 시작됨</h2>
          <p>현재 화면: {state.currentScreen}</p>
          <button 
            onClick={() => dispatch({ type: 'RESET_ALL' })}
            style={{
              padding: '12px 24px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '16px'
            }}
          >
            랜딩 화면으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}