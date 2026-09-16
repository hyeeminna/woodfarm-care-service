import React from 'react';
import type { EstimateFormData, EstimateResult, AppAction } from '../types';

interface ResultScreenProps {
  formData: EstimateFormData;
  result: EstimateResult;
  onAction: (action: AppAction) => void;
}

/**
 * 견적 결과 화면 컴포넌트 (임시 구현)
 * 
 * 이 컴포넌트는 AppShell 연결을 위한 기본 구현입니다.
 * 향후 Task 5.12에서 완전한 구현으로 교체됩니다.
 */
export function ResultScreen({ formData, result, onAction }: ResultScreenProps) {
  const handleRequestVisit = () => {
    onAction({ type: 'GO_TO_REQUEST_FORM' });
  };

  const handleRetry = () => {
    onAction({ type: 'RESET_AND_RETRY' });
  };

  const handleReset = () => {
    onAction({ type: 'RESET_ALL' });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '20px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f8f9fa'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '40px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
          견적 결과 (임시 화면)
        </h1>
        
        <div style={{ marginBottom: '20px' }}>
          <p><strong>상태:</strong> {result.status}</p>
          {result.status === 'CALCULATED' && (
            <>
              <p><strong>최소 금액:</strong> {result.minPrice?.toLocaleString()}원</p>
              <p><strong>최대 금액:</strong> {result.maxPrice?.toLocaleString()}원</p>
            </>
          )}
          <p><strong>선택한 가구:</strong> {formData.furniture.length}개</p>
          <p><strong>선택한 서비스:</strong> {formData.services.length}개</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={handleRequestVisit}
            style={{ 
              padding: '12px 20px', 
              background: '#6c5ce7', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            무료 방문견적 신청
          </button>
          <button 
            onClick={handleRetry}
            style={{ 
              padding: '12px 20px', 
              background: 'white', 
              color: '#6c5ce7', 
              border: '2px solid #6c5ce7', 
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            조건 다시 선택하기
          </button>
          <button 
            onClick={handleReset}
            style={{ 
              padding: '12px 20px', 
              background: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            새 견적 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}