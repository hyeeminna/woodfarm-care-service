import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LandingScreen } from './LandingScreen';

describe('LandingScreen', () => {
  const mockOnAction = jest.fn();

  beforeEach(() => {
    mockOnAction.mockClear();
  });

  test('renders service name and main content', () => {
    render(<LandingScreen onAction={mockOnAction} />);
    
    // 서비스명 확인
    expect(screen.getByText('OFFICE CARE')).toBeInTheDocument();
    
    // 메인 카피 확인
    expect(screen.getByText('사무·상업가구, 교체하기 전에 관리하세요.')).toBeInTheDocument();
    
    // 서브 카피 확인
    expect(screen.getByText(/기업용 사무가구부터 카페·병원·식당 등의 가구까지/)).toBeInTheDocument();
    
    // 보조 안내 확인
    expect(screen.getByText('약 1분 소요 · 예상 견적 확인 · 무료 방문견적 신청')).toBeInTheDocument();
    
    // CTA 버튼 확인
    expect(screen.getByRole('button', { name: '간편 견적 시작하기' })).toBeInTheDocument();
  });

  test('dispatches START_ESTIMATE action when CTA button is clicked', () => {
    render(<LandingScreen onAction={mockOnAction} />);
    
    const ctaButton = screen.getByRole('button', { name: '간편 견적 시작하기' });
    fireEvent.click(ctaButton);
    
    expect(mockOnAction).toHaveBeenCalledWith({ type: 'START_ESTIMATE' });
  });

  test('CTA button has primary colors', () => {
    render(<LandingScreen onAction={mockOnAction} />);
    
    const ctaButton = screen.getByRole('button', { name: '간편 견적 시작하기' });
    
    // 인라인 스타일로 구현되었으므로 스타일 속성 확인
    expect(ctaButton).toHaveStyle({
      background: '#6c5ce7',
      color: 'white'
    });
  });

  test('renders all required content according to requirements 1.1, 1.2, 1.3', () => {
    render(<LandingScreen onAction={mockOnAction} />);
    
    // Requirements 1.1: 서비스명 OFFICE CARE
    expect(screen.getByRole('heading', { level: 1, name: 'OFFICE CARE' })).toBeInTheDocument();
    
    // Requirements 1.2: 핵심 문구 (메인 카피, 서브 카피)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('사무·상업가구, 교체하기 전에 관리하세요.');
    expect(screen.getByText(/기업용 사무가구부터 카페·병원·식당 등의 가구까지/)).toBeInTheDocument();
    
    // Requirements 1.3: 간편 견적 시작 CTA 및 보조 안내 문구
    expect(screen.getByText('약 1분 소요 · 예상 견적 확인 · 무료 방문견적 신청')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '간편 견적 시작하기' })).toBeInTheDocument();
  });
});