import React, { useState } from 'react';
import { Step1_SizeSelector } from '../components/Step1_SizeSelector';
import { CompanySize } from '../types';

/**
 * Step1_SizeSelector 사용 예제
 * 
 * 이 예제는 Step1_SizeSelector 컴포넌트의 기본 사용법을 보여줍니다.
 */
export const Step1_SizeSelectorExample: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<CompanySize | null>(null);

  // canProceed 계산 (선택된 값이 있으면 true)
  const canProceed = selectedSize !== null;

  const handleSizeChange = (value: CompanySize) => {
    setSelectedSize(value);
    console.log('Selected company size:', value);
  };

  const handleNext = () => {
    if (canProceed) {
      console.log('Proceeding with size:', selectedSize);
      alert(`선택된 규모: ${getSizeLabel(selectedSize)}`);
    }
  };

  const handleReset = () => {
    setSelectedSize(null);
    console.log('Size selection reset');
  };

  // 크기 값을 한국어 라벨로 변환
  const getSizeLabel = (size: CompanySize | null): string => {
    switch (size) {
      case 'UNDER_10': return '10인 이하';
      case 'BETWEEN_11_30': return '11~30인';
      case 'BETWEEN_31_50': return '31~50인';
      case 'OVER_50': return '50인 이상';
      default: return '선택되지 않음';
    }
  };

  const exampleStyles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
    } as React.CSSProperties,

    header: {
      textAlign: 'center',
      marginBottom: '40px',
    } as React.CSSProperties,

    title: {
      fontSize: '24px',
      fontWeight: 700,
      color: '#2c3e50',
      marginBottom: '8px',
    } as React.CSSProperties,

    description: {
      fontSize: '14px',
      color: '#6c757d',
    } as React.CSSProperties,

    selectorContainer: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
      marginBottom: '32px',
    } as React.CSSProperties,

    controls: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      marginBottom: '32px',
    } as React.CSSProperties,

    button: {
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: 500,
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    } as React.CSSProperties,

    resetButton: {
      color: '#6c757d',
      backgroundColor: 'white',
    } as React.CSSProperties,

    nextButton: {
      color: canProceed ? 'white' : '#adb5bd',
      backgroundColor: canProceed ? '#6c5ce7' : '#e9ecef',
      border: 'none',
      cursor: canProceed ? 'pointer' : 'not-allowed',
    } as React.CSSProperties,

    status: {
      textAlign: 'center',
      padding: '16px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 6px rgba(0, 0, 0, 0.1)',
    } as React.CSSProperties,

    statusLabel: {
      fontSize: '12px',
      color: '#6c757d',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '8px',
    } as React.CSSProperties,

    statusValue: {
      fontSize: '16px',
      fontWeight: 600,
      color: selectedSize ? '#6c5ce7' : '#adb5bd',
    } as React.CSSProperties,
  };

  return (
    <div style={exampleStyles.container}>
      {/* 헤더 */}
      <div style={exampleStyles.header}>
        <h1 style={exampleStyles.title}>
          Step1_SizeSelector 예제
        </h1>
        <p style={exampleStyles.description}>
          공간 규모 선택 컴포넌트를 테스트해보세요
        </p>
      </div>

      {/* 컴포넌트 */}
      <div style={exampleStyles.selectorContainer}>
        <Step1_SizeSelector
          selected={selectedSize}
          onChange={handleSizeChange}
        />
      </div>

      {/* 컨트롤 버튼 */}
      <div style={exampleStyles.controls}>
        <button
          type="button"
          style={{ ...exampleStyles.button, ...exampleStyles.resetButton }}
          onClick={handleReset}
        >
          초기화
        </button>
        
        <button
          type="button"
          style={{ ...exampleStyles.button, ...exampleStyles.nextButton }}
          onClick={handleNext}
          disabled={!canProceed}
        >
          다음 단계
        </button>
      </div>

      {/* 상태 표시 */}
      <div style={exampleStyles.status}>
        <div style={exampleStyles.statusLabel}>
          현재 선택
        </div>
        <div style={exampleStyles.statusValue}>
          {getSizeLabel(selectedSize)}
        </div>
        <div style={{ 
          marginTop: '8px', 
          fontSize: '12px', 
          color: canProceed ? '#28a745' : '#dc3545' 
        }}>
          {canProceed ? '✓ 다음 단계로 진행 가능' : '⚠ 규모를 선택해주세요'}
        </div>
      </div>
    </div>
  );
};

export default Step1_SizeSelectorExample;