import React, { useState } from 'react';
import { Step3_ServiceSelector, canProceedFromStep3 } from '../components/Step3_ServiceSelector';
import { ServiceType } from '../types';

/**
 * Step3_ServiceSelector 사용 예제
 * 
 * 서비스 선택 컴포넌트의 기본 사용법을 보여줍니다.
 */
export const Step3_ServiceSelectorExample: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([]);

  const handleServiceChange = (services: ServiceType[]) => {
    setSelectedServices(services);
    console.log('Selected services:', services);
    console.log('Can proceed:', canProceedFromStep3(services));
  };

  const handleNext = () => {
    if (canProceedFromStep3(selectedServices)) {
      alert(`다음 단계로 진행합니다. 선택된 서비스: ${selectedServices.join(', ')}`);
    } else {
      alert('서비스를 하나 이상 선택해주세요.');
    }
  };

  const handleReset = () => {
    setSelectedServices([]);
  };

  const styles = {
    container: {
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    } as React.CSSProperties,

    header: {
      textAlign: 'center',
      marginBottom: '40px',
    } as React.CSSProperties,

    title: {
      fontSize: '24px',
      fontWeight: 700,
      color: '#2c3e50',
      marginBottom: '12px',
    } as React.CSSProperties,

    description: {
      fontSize: '16px',
      color: '#6c757d',
      lineHeight: 1.5,
    } as React.CSSProperties,

    controls: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      marginTop: '40px',
    } as React.CSSProperties,

    button: {
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    } as React.CSSProperties,

    primaryButton: {
      backgroundColor: '#6c5ce7',
      color: 'white',
    } as React.CSSProperties,

    secondaryButton: {
      backgroundColor: '#f8f9fa',
      color: '#495057',
      border: '1px solid #dee2e6',
    } as React.CSSProperties,

    disabledButton: {
      backgroundColor: '#e9ecef',
      color: '#6c757d',
      cursor: 'not-allowed',
    } as React.CSSProperties,

    status: {
      marginTop: '20px',
      padding: '16px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      textAlign: 'center',
    } as React.CSSProperties,

    statusText: {
      fontSize: '14px',
      color: '#495057',
      margin: '4px 0',
    } as React.CSSProperties,
  };

  const canProceed = canProceedFromStep3(selectedServices);

  return (
    <div style={styles.container}>
      {/* 헤더 */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          Step 3: 서비스 선택 예제
        </h1>
        <p style={styles.description}>
          원하는 서비스를 선택하고 다음 단계로 진행하세요.<br />
          복수 선택이 가능하며, 최소 1개 이상 선택해야 합니다.
        </p>
      </div>

      {/* 서비스 선택 컴포넌트 */}
      <Step3_ServiceSelector
        selected={selectedServices}
        onChange={handleServiceChange}
      />

      {/* 상태 표시 */}
      <div style={styles.status}>
        <p style={styles.statusText}>
          <strong>선택된 서비스:</strong> {selectedServices.length > 0 ? selectedServices.join(', ') : '없음'}
        </p>
        <p style={styles.statusText}>
          <strong>다음 단계 진행 가능:</strong> {canProceed ? '예' : '아니오'}
        </p>
      </div>

      {/* 컨트롤 버튼 */}
      <div style={styles.controls}>
        <button
          style={{
            ...styles.button,
            ...styles.secondaryButton,
          }}
          onClick={handleReset}
          disabled={selectedServices.length === 0}
        >
          초기화
        </button>
        <button
          style={{
            ...styles.button,
            ...(canProceed ? styles.primaryButton : styles.disabledButton),
          }}
          onClick={handleNext}
          disabled={!canProceed}
        >
          다음 단계
        </button>
      </div>
    </div>
  );
};

export default Step3_ServiceSelectorExample;