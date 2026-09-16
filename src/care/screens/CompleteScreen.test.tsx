import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CompleteScreen } from './CompleteScreen';

describe('CompleteScreen', () => {
  it('renders completion message and home button', () => {
    const mockOnAction = vi.fn();
    
    render(<CompleteScreen onAction={mockOnAction} />);
    
    // 완료 제목 확인
    expect(screen.getByText('방문견적 신청이 완료되었습니다.')).toBeInTheDocument();
    
    // 안내 설명 확인
    expect(screen.getByText('입력한 연락처로 상담 일정을 안내드리겠습니다.')).toBeInTheDocument();
    
    // 처음으로 돌아가기 버튼 확인
    expect(screen.getByText('처음으로 돌아가기')).toBeInTheDocument();
  });

  it('dispatches RESET_ALL action when home button is clicked', () => {
    const mockOnAction = vi.fn();
    
    render(<CompleteScreen onAction={mockOnAction} />);
    
    const homeButton = screen.getByText('처음으로 돌아가기');
    fireEvent.click(homeButton);
    
    expect(mockOnAction).toHaveBeenCalledWith({ type: 'RESET_ALL' });
  });

  it('has proper accessibility attributes', () => {
    const mockOnAction = vi.fn();
    
    render(<CompleteScreen onAction={mockOnAction} />);
    
    // 완료 아이콘에 적절한 aria-label 확인
    const icon = screen.getByRole('img', { name: '완료' });
    expect(icon).toBeInTheDocument();
    
    // 버튼에 적절한 aria-label 확인
    const homeButton = screen.getByRole('button', { name: /처음 화면으로 돌아가서/ });
    expect(homeButton).toBeInTheDocument();
  });

  it('renders heading with proper hierarchy', () => {
    const mockOnAction = vi.fn();
    
    render(<CompleteScreen onAction={mockOnAction} />);
    
    // h1 제목이 올바르게 렌더링되는지 확인
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('방문견적 신청이 완료되었습니다.');
  });
});