import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EstimateFlow } from './EstimateFlow';
import type { EstimateFormData, AppAction } from '../types';

// Mock 상태 생성 헬퍼
const createMockFormData = (overrides: Partial<EstimateFormData> = {}): EstimateFormData => ({
  companySize: null,
  furniture: [],
  services: [],
  photos: [],
  ...overrides,
});

describe('EstimateFlow', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('STEP1에서 StepNavigator와 Step1_SizeSelector를 렌더링한다', () => {
    const formData = createMockFormData();
    
    render(
      <EstimateFlow
        currentStep={1}
        formData={formData}
        dispatch={mockDispatch}
      />
    );

    // StepNavigator 요소 확인
    expect(screen.getByText('1 / 4')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: '견적 단계 네비게이션' })).toBeInTheDocument();

    // Step1 콘텐츠 확인
    expect(screen.getByText('공간의 상주 인원은 몇 명인가요?')).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: '공간 규모 선택' })).toBeInTheDocument();
  });

  it('STEP1에서 선택 없으면 다음 버튼이 비활성화된다', () => {
    const formData = createMockFormData({ companySize: null });
    
    render(
      <EstimateFlow
        currentStep={1}
        formData={formData}
        dispatch={mockDispatch}
      />
    );

    const nextButton = screen.getByRole('button', { name: '다음 단계로' });
    expect(nextButton).toBeDisabled();
  });

  it('STEP1에서 크기 선택 시 다음 버튼이 활성화된다', () => {
    const formData = createMockFormData({ companySize: 'BETWEEN_11_30' });
    
    render(
      <EstimateFlow
        currentStep={1}
        formData={formData}
        dispatch={mockDispatch}
      />
    );

    const nextButton = screen.getByRole('button', { name: '다음 단계로' });
    expect(nextButton).toBeEnabled();
  });

  it('STEP2에서 Step2_FurnitureSelector를 렌더링한다', () => {
    const formData = createMockFormData({
      furniture: [{ type: 'CHAIR', quantity: 5 }]
    });
    
    render(
      <EstimateFlow
        currentStep={2}
        formData={formData}
        dispatch={mockDispatch}
      />
    );

    expect(screen.getByText('관리할 가구를 선택해주세요')).toBeInTheDocument();
    expect(screen.getByText('사무용 의자')).toBeInTheDocument();
  });

  it('STEP2에서 이전 버튼이 표시된다', () => {
    const formData = createMockFormData();
    
    render(
      <EstimateFlow
        currentStep={2}
        formData={formData}
        dispatch={mockDispatch}
      />
    );

    expect(screen.getByRole('button', { name: '이전 단계로' })).toBeInTheDocument();
  });

  it('STEP3에서 Step3_ServiceSelector를 렌더링한다', () => {
    const formData = createMockFormData({
      services: ['CLEANING']
    });
    
    render(
      <EstimateFlow
        currentStep={3}
        formData={formData}
        dispatch={mockDispatch}
      />
    );

    expect(screen.getByText('어떤 서비스를 받고 싶으신가요?')).toBeInTheDocument();
    expect(screen.getByText('세척')).toBeInTheDocument();
  });

  it('STEP4에서 Step4_PhotoUploader를 렌더링한다', () => {
    const formData = createMockFormData({ photos: [] });
    
    render(
      <EstimateFlow
        currentStep={4}
        formData={formData}
        dispatch={mockDispatch}
      />
    );

    expect(screen.getByText('사진 업로드 (선택)')).toBeInTheDocument();
    expect(screen.getByText('사진 선택 (0/5)')).toBeInTheDocument();
  });

  it('STEP4는 항상 다음 버튼이 활성화된다', () => {
    const formData = createMockFormData({ photos: [] });
    
    render(
      <EstimateFlow
        currentStep={4}
        formData={formData}
        dispatch={mockDispatch}
      />
    );

    const nextButton = screen.getByRole('button', { name: '다음 단계로' });
    expect(nextButton).toBeEnabled();
  });

  it('모든 단계에서 처음으로 버튼이 표시된다', () => {
    [1, 2, 3, 4].forEach(step => {
      const { unmount } = render(
        <EstimateFlow
          currentStep={step as 1 | 2 | 3 | 4}
          formData={createMockFormData()}
          dispatch={mockDispatch}
        />
      );

      expect(screen.getByRole('button', { name: '처음으로 돌아가기' })).toBeInTheDocument();
      
      unmount();
    });
  });

  it('컨테이너가 올바른 레이아웃 스타일을 가진다', () => {
    const formData = createMockFormData();
    
    const { container } = render(
      <EstimateFlow
        currentStep={1}
        formData={formData}
        dispatch={mockDispatch}
      />
    );

    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveStyle({
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column',
    });
  });
});
