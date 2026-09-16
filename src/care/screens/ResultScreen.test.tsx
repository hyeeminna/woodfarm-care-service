import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResultScreen } from './ResultScreen';
import type { EstimateFormData, EstimateResult } from '../types';

describe('ResultScreen', () => {
  const mockOnRequestVisit = jest.fn();
  const mockOnRetry = jest.fn();
  const mockOnReset = jest.fn();

  const mockFormData: EstimateFormData = {
    companySize: 'BETWEEN_11_30',
    furniture: [
      { type: 'CHAIR', quantity: 30 },
      { type: 'PARTITION', quantity: 10 }
    ],
    services: ['CLEANING', 'INSPECTION'],
    photos: []
  };

  beforeEach(() => {
    mockOnRequestVisit.mockClear();
    mockOnRetry.mockClear();
    mockOnReset.mockClear();
  });

  test('renders calculated estimate result correctly', () => {
    const mockResult: EstimateResult = {
      status: 'CALCULATED',
      minPrice: 250000,
      maxPrice: 320000,
      messages: []
    };

    render(
      <ResultScreen 
        formData={mockFormData}
        result={mockResult}
        onRequestVisit={mockOnRequestVisit}
        onRetry={mockOnRetry}
        onReset={mockOnReset}
      />
    );
    
    // 제목 확인
    expect(screen.getByText('견적 결과')).toBeInTheDocument();
    expect(screen.getByText('선택한 조건을 기준으로 계산된 예상 견적입니다')).toBeInTheDocument();
    
    // 견적 범위 확인
    expect(screen.getByText('예상 견적 범위')).toBeInTheDocument();
    expect(screen.getByText('약 25~32만 원')).toBeInTheDocument();
    
    // 입력 요약 확인
    expect(screen.getByText('11~30인')).toBeInTheDocument();
    expect(screen.getByText('사무용 의자 30개')).toBeInTheDocument();
    expect(screen.getByText('파티션 10개')).toBeInTheDocument();
    expect(screen.getByText('세척')).toBeInTheDocument();
    expect(screen.getByText('상태점검')).toBeInTheDocument();
    expect(screen.getByText('0장')).toBeInTheDocument();
  });

  test('renders visit required result correctly', () => {
    const mockFormDataWithSofa: EstimateFormData = {
      ...mockFormData,
      furniture: [
        { type: 'SOFA', quantity: 2 }
      ]
    };

    const mockResult: EstimateResult = {
      status: 'VISIT_REQUIRED',
      minPrice: null,
      maxPrice: null,
      messages: []
    };

    render(
      <ResultScreen 
        formData={mockFormDataWithSofa}
        result={mockResult}
        onRequestVisit={mockOnRequestVisit}
        onRetry={mockOnRetry}
        onReset={mockOnReset}
      />
    );
    
    // 방문 확인 필요 메시지 확인
    expect(screen.getByText('방문 확인 필요')).toBeInTheDocument();
    expect(screen.getByText('선택한 가구는 현장 확인 후 정확한 견적을 제공해드립니다')).toBeInTheDocument();
    
    // 소파 정보 확인
    expect(screen.getByText('소파 2개')).toBeInTheDocument();
  });

  test('displays repair and care messages when present', () => {
    const mockResult: EstimateResult = {
      status: 'CALCULATED',
      minPrice: 250000,
      maxPrice: 320000,
      messages: [
        { type: 'MINOR_REPAIR_NOTICE', text: 'repair notice' },
        { type: 'REGULAR_CARE_NOTICE', text: 'care notice' }
      ]
    };

    render(
      <ResultScreen 
        formData={mockFormData}
        result={mockResult}
        onRequestVisit={mockOnRequestVisit}
        onRetry={mockOnRetry}
        onReset={mockOnReset}
      />
    );
    
    // 메시지 확인
    expect(screen.getByText('간단수리 비용은 가구 파손 정도에 따라 별도로 책정됩니다.')).toBeInTheDocument();
    expect(screen.getByText('정기관리 비용은 관리 주기와 범위에 따라 별도 상담 후 결정됩니다.')).toBeInTheDocument();
  });

  test('always displays disclaimer text', () => {
    const mockResult: EstimateResult = {
      status: 'CALCULATED',
      minPrice: 250000,
      maxPrice: 320000,
      messages: []
    };

    render(
      <ResultScreen 
        formData={mockFormData}
        result={mockResult}
        onRequestVisit={mockOnRequestVisit}
        onRetry={mockOnRetry}
        onReset={mockOnReset}
      />
    );
    
    // 안내 문구 확인 (Requirements 10.2)
    expect(screen.getByText(/위 금액은 입력한 수량과 서비스를 기준으로 계산한 참고용 예상 범위입니다/)).toBeInTheDocument();
  });

  test('renders all three CTA buttons', () => {
    const mockResult: EstimateResult = {
      status: 'CALCULATED',
      minPrice: 250000,
      maxPrice: 320000,
      messages: []
    };

    render(
      <ResultScreen 
        formData={mockFormData}
        result={mockResult}
        onRequestVisit={mockOnRequestVisit}
        onRetry={mockOnRetry}
        onReset={mockOnReset}
      />
    );
    
    // 3개 CTA 버튼 확인 (Requirements 10.4)
    expect(screen.getByRole('button', { name: '무료 방문견적 신청' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '조건 다시 선택하기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '새 견적 시작하기' })).toBeInTheDocument();
  });

  test('calls correct handlers when buttons are clicked', () => {
    const mockResult: EstimateResult = {
      status: 'CALCULATED',
      minPrice: 250000,
      maxPrice: 320000,
      messages: []
    };

    render(
      <ResultScreen 
        formData={mockFormData}
        result={mockResult}
        onRequestVisit={mockOnRequestVisit}
        onRetry={mockOnRetry}
        onReset={mockOnReset}
      />
    );
    
    // 방문견적 신청 버튼 클릭
    fireEvent.click(screen.getByRole('button', { name: '무료 방문견적 신청' }));
    expect(mockOnRequestVisit).toHaveBeenCalledTimes(1);
    
    // 조건 다시 선택하기 버튼 클릭 (Requirements 10.5)
    fireEvent.click(screen.getByRole('button', { name: '조건 다시 선택하기' }));
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
    
    // 새 견적 시작하기 버튼 클릭 (Requirements 10.6)
    fireEvent.click(screen.getByRole('button', { name: '새 견적 시작하기' }));
    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  test('displays photo count correctly', () => {
    const mockFormDataWithPhotos: EstimateFormData = {
      ...mockFormData,
      photos: [
        { file: new File([''], 'test1.jpg'), previewUrl: 'blob:test1', name: 'test1.jpg' },
        { file: new File([''], 'test2.jpg'), previewUrl: 'blob:test2', name: 'test2.jpg' }
      ]
    };

    const mockResult: EstimateResult = {
      status: 'CALCULATED',
      minPrice: 250000,
      maxPrice: 320000,
      messages: []
    };

    render(
      <ResultScreen 
        formData={mockFormDataWithPhotos}
        result={mockResult}
        onRequestVisit={mockOnRequestVisit}
        onRetry={mockOnRetry}
        onReset={mockOnReset}
      />
    );
    
    // 첨부 사진 수량 확인
    expect(screen.getByText('2장')).toBeInTheDocument();
  });

  test('displays all furniture types with Korean labels', () => {
    const mockFormDataAllFurniture: EstimateFormData = {
      ...mockFormData,
      furniture: [
        { type: 'CHAIR', quantity: 5 },
        { type: 'PARTITION', quantity: 3 },
        { type: 'SOFA', quantity: 2 },
        { type: 'DESK', quantity: 1 }
      ]
    };

    const mockResult: EstimateResult = {
      status: 'VISIT_REQUIRED',
      minPrice: null,
      maxPrice: null,
      messages: []
    };

    render(
      <ResultScreen 
        formData={mockFormDataAllFurniture}
        result={mockResult}
        onRequestVisit={mockOnRequestVisit}
        onRetry={mockOnRetry}
        onReset={mockOnReset}
      />
    );
    
    // 모든 가구 종류 확인
    expect(screen.getByText('사무용 의자 5개')).toBeInTheDocument();
    expect(screen.getByText('파티션 3개')).toBeInTheDocument();
    expect(screen.getByText('소파 2개')).toBeInTheDocument();
    expect(screen.getByText('책상 1개')).toBeInTheDocument();
  });
});