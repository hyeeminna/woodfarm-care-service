import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RequestFormScreen } from './RequestFormScreen';
import type { EstimateFormData, EstimateResult } from '../types';

describe('RequestFormScreen', () => {
  const mockFormData: EstimateFormData = {
    companySize: 'BETWEEN_11_30',
    furniture: [{ type: 'CHAIR', quantity: 30 }],
    services: ['CLEANING'],
    photos: [],
  };

  const mockResult: EstimateResult = {
    status: 'CALCULATED',
    minPrice: 250000,
    maxPrice: 320000,
    messages: [],
  };

  const mockProps = {
    formData: mockFormData,
    result: mockResult,
    onAction: vi.fn(),
  };

  it('방문견적 신청 폼 UI가 올바르게 렌더링된다', () => {
    render(<RequestFormScreen {...mockProps} />);
    
    // 제목 확인
    expect(screen.getByText('무료 방문견적 신청')).toBeInTheDocument();
    
    // 필수 필드 확인
    expect(screen.getByLabelText(/담당자명/)).toBeInTheDocument();
    expect(screen.getByLabelText(/업체명 또는 공간명/)).toBeInTheDocument();
    expect(screen.getByLabelText(/연락처/)).toBeInTheDocument();
    expect(screen.getByLabelText(/공간 유형/)).toBeInTheDocument();
    expect(screen.getByLabelText(/방문 지역/)).toBeInTheDocument();
    
    // 선택 필드 확인
    expect(screen.getByLabelText(/문의사항/)).toBeInTheDocument();
    expect(screen.getByLabelText(/개인정보 수집·이용에 동의/)).toBeInTheDocument();
    
    // MVP 데모 안내 확인
    expect(screen.getByText(/현재 화면은 MVP 데모이며 실제 접수 기능은 추후 연결 예정입니다/)).toBeInTheDocument();
  });

  it('필수 필드가 비어있을 때 신청 버튼이 비활성화된다', () => {
    render(<RequestFormScreen {...mockProps} />);
    
    const submitButton = screen.getByRole('button', { name: /무료 방문견적 신청/ });
    expect(submitButton).toBeDisabled();
  });

  it('유효한 필드 입력 시 오류 메시지가 표시되지 않는다', () => {
    render(<RequestFormScreen {...mockProps} />);
    
    const nameInput = screen.getByLabelText(/담당자명/);
    fireEvent.change(nameInput, { target: { value: '홍길동' } });
    fireEvent.blur(nameInput);
    
    // 오류 메시지가 표시되지 않아야 함
    expect(screen.queryByText(/담당자명은 공백만으로 구성될 수 없습니다/)).not.toBeInTheDocument();
  });

  it('공백만 입력 시 담당자명 오류 메시지가 표시된다', () => {
    render(<RequestFormScreen {...mockProps} />);
    
    const nameInput = screen.getByLabelText(/담당자명/);
    fireEvent.change(nameInput, { target: { value: '   ' } });
    fireEvent.blur(nameInput);
    
    expect(screen.getByText(/담당자명은 공백만으로 구성될 수 없습니다/)).toBeInTheDocument();
  });

  it('잘못된 연락처 형식 입력 시 오류 메시지가 표시된다', () => {
    render(<RequestFormScreen {...mockProps} />);
    
    const phoneInput = screen.getByLabelText(/연락처/);
    fireEvent.change(phoneInput, { target: { value: '010-1234-abcd' } });
    fireEvent.blur(phoneInput);
    
    expect(screen.getByText(/연락처는 숫자와 하이픈\(-\)만 입력할 수 있습니다/)).toBeInTheDocument();
  });

  it('모든 필수 필드와 개인정보 동의 완료 시 신청 버튼이 활성화된다', () => {
    render(<RequestFormScreen {...mockProps} />);
    
    // 필수 필드 입력
    fireEvent.change(screen.getByLabelText(/담당자명/), { target: { value: '홍길동' } });
    fireEvent.change(screen.getByLabelText(/업체명 또는 공간명/), { target: { value: '테스트 회사' } });
    fireEvent.change(screen.getByLabelText(/연락처/), { target: { value: '010-1234-5678' } });
    fireEvent.change(screen.getByLabelText(/방문 지역/), { target: { value: '서울시 강남구' } });
    
    // 개인정보 동의
    fireEvent.click(screen.getByLabelText(/개인정보 수집·이용에 동의/));
    
    const submitButton = screen.getByRole('button', { name: /무료 방문견적 신청/ });
    expect(submitButton).toBeEnabled();
  });

  it('폼 제출 시 SUBMIT_REQUEST 액션이 VisitRequest와 함께 호출된다', () => {
    render(<RequestFormScreen {...mockProps} />);
    
    // 필수 필드 입력
    fireEvent.change(screen.getByLabelText(/담당자명/), { target: { value: '홍길동' } });
    fireEvent.change(screen.getByLabelText(/업체명 또는 공간명/), { target: { value: '테스트 회사' } });
    fireEvent.change(screen.getByLabelText(/연락처/), { target: { value: '010-1234-5678' } });
    fireEvent.change(screen.getByLabelText(/방문 지역/), { target: { value: '서울시 강남구' } });
    fireEvent.click(screen.getByLabelText(/개인정보 수집·이용에 동의/));
    
    // 폼 제출
    const submitButton = screen.getByRole('button', { name: /무료 방문견적 신청/ });
    fireEvent.click(submitButton);
    
    expect(mockProps.onAction).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SUBMIT_REQUEST',
        visitRequest: expect.objectContaining({
          managerName: '홍길동',
          companyName: '테스트 회사',
          phone: '010-1234-5678',
          region: '서울시 강남구',
          privacyConsent: true,
          formData: mockFormData,
          result: mockResult,
        })
      })
    );
  });

  it('이전 버튼 클릭 시 GO_BACK 액션이 호출된다', () => {
    render(<RequestFormScreen {...mockProps} />);
    
    const backButton = screen.getByRole('button', { name: /이전/ });
    fireEvent.click(backButton);
    
    expect(mockProps.onAction).toHaveBeenCalledWith({ type: 'GO_BACK' });
  });

  it('공간 유형 선택지가 모두 표시된다', () => {
    render(<RequestFormScreen {...mockProps} />);
    
    const spaceTypeSelect = screen.getByLabelText(/공간 유형/);
    
    // 각 공간 유형 옵션 확인
    expect(screen.getByRole('option', { name: '사무실' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '카페' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '음식점' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '병원' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '학원' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '기타' })).toBeInTheDocument();
  });
});