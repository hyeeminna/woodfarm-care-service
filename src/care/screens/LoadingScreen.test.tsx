import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { LoadingScreen } from './LoadingScreen';
import type { EstimateFormData, AppAction } from '../types';

describe('LoadingScreen', () => {
  const mockFormData: EstimateFormData = {
    companySize: 'BETWEEN_11_30',
    furniture: [
      { type: 'CHAIR', quantity: 30 },
      { type: 'PARTITION', quantity: 10 }
    ],
    services: ['CLEANING', 'INSPECTION'],
    photos: []
  };

  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // 타이머 모킹
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('로딩 메시지와 보조 문구를 표시한다', () => {
    render(<LoadingScreen formData={mockFormData} dispatch={mockDispatch} />);

    // Requirements 9.1: 메인 메시지와 보조 문구 표시
    expect(screen.getByText('선택한 조건으로 예상 견적을 계산하고 있어요.')).toBeInTheDocument();
    expect(screen.getByText('실제 금액은 현장 상태와 가구 재질에 따라 달라질 수 있습니다.')).toBeInTheDocument();
  });

  it('로딩 인디케이터가 표시된다', () => {
    render(<LoadingScreen formData={mockFormData} dispatch={mockDispatch} />);

    // Requirements 9.1: 로딩 인디케이터 표시
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('800ms 후에 SHOW_RESULT 액션을 dispatch한다', async () => {
    render(<LoadingScreen formData={mockFormData} dispatch={mockDispatch} />);

    // 800ms 경과
    vi.advanceTimersByTime(800);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SHOW_RESULT',
        result: expect.objectContaining({
          status: 'CALCULATED',
          minPrice: 250000, // 30 * 7000 + 10 * 4000 = 250000
          maxPrice: 320000, // 30 * 8500 + 10 * 6500 = 320000
        })
      });
    });
  });

  it('1200ms 후에도 SHOW_RESULT 액션을 dispatch한다', async () => {
    render(<LoadingScreen formData={mockFormData} dispatch={mockDispatch} />);

    // 1200ms 경과 (최대 딜레이)
    vi.advanceTimersByTime(1200);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SHOW_RESULT',
        result: expect.objectContaining({
          status: 'CALCULATED',
        })
      });
    });
  });

  it('컴포넌트 언마운트 시 타이머를 정리한다', () => {
    const { unmount } = render(<LoadingScreen formData={mockFormData} dispatch={mockDispatch} />);
    
    // clearTimeout spy
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    
    unmount();
    
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('SOFA가 포함된 경우 VISIT_REQUIRED 결과를 반환한다', async () => {
    const formDataWithSofa: EstimateFormData = {
      ...mockFormData,
      furniture: [
        { type: 'CHAIR', quantity: 10 },
        { type: 'SOFA', quantity: 2 }
      ]
    };

    render(<LoadingScreen formData={formDataWithSofa} dispatch={mockDispatch} />);

    vi.advanceTimersByTime(800);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SHOW_RESULT',
        result: expect.objectContaining({
          status: 'VISIT_REQUIRED',
          minPrice: null,
          maxPrice: null,
        })
      });
    });
  });
});