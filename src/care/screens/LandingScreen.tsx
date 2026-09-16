import React from 'react';
import type { AppAction } from '../types';

interface LandingScreenProps {
  onAction: (action: AppAction) => void;
}

/**
 * 랜딩 화면 컴포넌트
 * 
 * 서비스 소개와 간편 견적 시작 CTA를 제공합니다.
 * 
 * Requirements:
 * - 1.1: 서비스명 OFFICE CARE 표시
 * - 1.2: 핵심 문구 표시 (메인 카피, 서브 카피)
 * - 1.3: 간편 견적 시작 CTA 및 보조 안내 문구
 */
export function LandingScreen({ onAction }: LandingScreenProps) {
  const handleStartEstimate = () => {
    onAction({ type: 'START_ESTIMATE' });
  };

  const styles = {
    screen: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    } as React.CSSProperties,
    
    container: {
      width: '100%',
      maxWidth: '480px',
      textAlign: 'center',
    } as React.CSSProperties,
    
    serviceHeader: {
      marginBottom: '48px',
    } as React.CSSProperties,
    
    serviceName: {
      fontSize: '28px',
      fontWeight: 700,
      color: '#2b2d42',
      letterSpacing: '0.5px',
      margin: 0,
    } as React.CSSProperties,
    
    mainContent: {
      background: 'white',
      padding: '40px 32px',
      borderRadius: '16px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
    } as React.CSSProperties,
    
    mainCopy: {
      fontSize: '24px',
      fontWeight: 600,
      color: '#2b2d42',
      lineHeight: 1.4,
      margin: '0 0 20px 0',
    } as React.CSSProperties,
    
    subCopy: {
      fontSize: '16px',
      color: '#6c757d',
      lineHeight: 1.6,
      margin: '0 0 32px 0',
    } as React.CSSProperties,
    
    helperText: {
      fontSize: '14px',
      color: '#8e9aaf',
      marginBottom: '32px',
      padding: '12px 16px',
      background: '#f8f9fa',
      borderRadius: '8px',
      borderLeft: '3px solid #6c5ce7',
    } as React.CSSProperties,
    
    ctaButton: {
      width: '100%',
      padding: '16px 24px',
      fontSize: '18px',
      fontWeight: 600,
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'center',
      background: '#6c5ce7',
      color: 'white',
    } as React.CSSProperties,
  };

  // 반응형 스타일 적용을 위한 미디어 쿼리 확인
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;
  const isSmallMobile = typeof window !== 'undefined' && window.innerWidth <= 360;

  // 반응형 스타일 오버라이드
  if (isMobile) {
    styles.screen.padding = '16px';
    styles.serviceName.fontSize = '24px';
    styles.mainContent.padding = '32px 24px';
    styles.mainCopy.fontSize = '22px';
    styles.subCopy.fontSize = '15px';
  }

  if (isSmallMobile) {
    styles.mainContent.padding = '24px 20px';
    styles.mainCopy.fontSize = '20px';
    styles.ctaButton.fontSize = '16px';
    styles.ctaButton.padding = '14px 20px';
  }

  return (
    <div style={styles.screen}>
      <div style={styles.container}>
        {/* 서비스명 */}
        <div style={styles.serviceHeader}>
          <h1 style={styles.serviceName}>OFFICE CARE</h1>
        </div>

        {/* 메인 콘텐츠 */}
        <div style={styles.mainContent}>
          {/* 메인 카피 */}
          <h2 style={styles.mainCopy}>
            사무·상업가구, 교체하기 전에 관리하세요.
          </h2>

          {/* 서브 카피 */}
          <p style={styles.subCopy}>
            기업용 사무가구부터 카페·병원·식당 등의 가구까지, 클리닝·유지관리 서비스를 간편하게 확인해보세요.
          </p>

          {/* 보조 안내 */}
          <div style={styles.helperText}>
            약 1분 소요 · 예상 견적 확인 · 무료 방문견적 신청
          </div>

          {/* Primary CTA */}
          <button 
            type="button"
            style={styles.ctaButton}
            onClick={handleStartEstimate}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#5a4fcf';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#6c5ce7';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            간편 견적 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}