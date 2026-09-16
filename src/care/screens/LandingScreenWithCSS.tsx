import React from 'react';
import type { AppAction } from '../types';
import './LandingScreen.css';

interface LandingScreenProps {
  onAction: (action: AppAction) => void;
}

/**
 * 랜딩 화면 컴포넌트 (CSS 클래스 사용 버전)
 * 
 * 서비스 소개와 간편 견적 시작 CTA를 제공합니다.
 * 이 버전은 외부 CSS 파일을 사용합니다.
 * 
 * Requirements:
 * - 1.1: 서비스명 OFFICE CARE 표시
 * - 1.2: 핵심 문구 표시 (메인 카피, 서브 카피)
 * - 1.3: 간편 견적 시작 CTA 및 보조 안내 문구
 */
export function LandingScreenWithCSS({ onAction }: LandingScreenProps) {
  const handleStartEstimate = () => {
    onAction({ type: 'START_ESTIMATE' });
  };

  return (
    <div className="landing-screen">
      <div className="landing-container">
        {/* 서비스명 */}
        <div className="service-header">
          <h1 className="service-name">OFFICE CARE</h1>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="main-content">
          {/* 메인 카피 */}
          <h2 className="main-copy">
            사무·상업가구, 교체하기 전에 관리하세요.
          </h2>

          {/* 서브 카피 */}
          <p className="sub-copy">
            기업용 사무가구부터 카페·병원·식당 등의 가구까지, 클리닝·유지관리 서비스를 간편하게 확인해보세요.
          </p>

          {/* 보조 안내 */}
          <div className="helper-text">
            약 1분 소요 · 예상 견적 확인 · 무료 방문견적 신청
          </div>

          {/* Primary CTA */}
          <button 
            type="button"
            className="cta-button"
            onClick={handleStartEstimate}
          >
            간편 견적 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}