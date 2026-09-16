import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppShell } from './index';

describe('AppShell', () => {
  it('초기 상태에서 LandingScreen을 렌더링한다', () => {
    render(<AppShell />);
    
    // LandingScreen의 특징적인 텍스트를 확인
    expect(screen.getByText('OFFICE CARE')).toBeInTheDocument();
    expect(screen.getByText('간편 견적 시작하기')).toBeInTheDocument();
    expect(screen.getByText('사무·상업가구, 교체하기 전에 관리하세요.')).toBeInTheDocument();
  });

  it('AppShell 컴포넌트가 정상적으로 마운트된다', () => {
    const { container } = render(<AppShell />);
    
    // 루트 요소가 존재하는지 확인
    expect(container.querySelector('.woodfarm-care-app')).toBeInTheDocument();
  });
});