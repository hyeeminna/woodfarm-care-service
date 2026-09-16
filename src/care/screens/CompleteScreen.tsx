import React from 'react';
import type { AppAction } from '../types';

interface CompleteScreenProps {
  onAction: (action: AppAction) => void;
}

/**
 * 방문견적 신청 완료 화면 컴포넌트
 * 
 * 방문견적 신청 제출 완료 후 표시되는 화면으로, 
 * 완료 확인 메시지와 처음으로 돌아가기 기능을 제공합니다.
 * 
 * Requirements:
 * - 12.1: 방문견적 신청 완료 화면 전환
 * - 12.2: 신청 완료 확인 메시지 표시
 * - 12.3: 처음으로 돌아가기 버튼 제공
 * - 12.4: 전체 상태 초기화 및 랜딩 화면 이동
 */
export function CompleteScreen({ onAction }: CompleteScreenProps) {
  const handleGoToHome = () => {
    onAction({ type: 'RESET_ALL' });
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
    
    mainContent: {
      background: 'white',
      padding: '48px 32px',
      borderRadius: '16px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
    } as React.CSSProperties,
    
    icon: {
      fontSize: '64px',
      color: '#28a745',
      marginBottom: '32px',
      display: 'block',
    } as React.CSSProperties,
    
    title: {
      fontSize: '24px',
      fontWeight: 700,
      color: '#2b2d42',
      lineHeight: 1.4,
      margin: '0 0 20px 0',
    } as React.CSSProperties,
    
    description: {
      fontSize: '16px',
      color: '#6c757d',
      lineHeight: 1.6,
      margin: '0 0 40px 0',
    } as React.CSSProperties,
    
    homeButton: {
      width: '100%',
      padding: '16px 24px',
      fontSize: '18px',
      fontWeight: 600,
      border: '2px solid #6c5ce7',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'center',
      background: 'white',
      color: '#6c5ce7',
    } as React.CSSProperties,
  };

  // 반응형 스타일 적용을 위한 미디어 쿼리 확인
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;
  const isSmallMobile = typeof window !== 'undefined' && window.innerWidth <= 360;

  // 반응형 스타일 오버라이드
  if (isMobile) {
    styles.screen.padding = '16px';
    styles.mainContent.padding = '40px 24px';
    styles.title.fontSize = '22px';
    styles.description.fontSize = '15px';
    styles.icon.fontSize = '56px';
  }

  if (isSmallMobile) {
    styles.mainContent.padding = '32px 20px';
    styles.title.fontSize = '20px';
    styles.homeButton.fontSize = '16px';
    styles.homeButton.padding = '14px 20px';
  }

  return (
    <div style={styles.screen}>
      <div style={styles.container}>
        <div style={styles.mainContent}>
          {/* 완료 아이콘 */}
          <span style={styles.icon} role="img" aria-label="완료">
            ✅
          </span>

          {/* 완료 제목 */}
          <h1 style={styles.title}>
            방문견적 신청이 완료되었습니다.
          </h1>

          {/* 안내 설명 */}
          <p style={styles.description}>
            입력한 연락처로 상담 일정을 안내드리겠습니다.
          </p>

          {/* 처음으로 돌아가기 버튼 */}
          <button 
            type="button"
            style={styles.homeButton}
            onClick={handleGoToHome}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#6c5ce7';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#6c5ce7';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            aria-label="처음 화면으로 돌아가서 새로운 견적 시작하기"
          >
            처음으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}