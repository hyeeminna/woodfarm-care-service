import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Step3_ServiceSelector, canProceedFromStep3 } from './Step3_ServiceSelector';
import { ServiceType } from '../types';

describe('Step3_ServiceSelector', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all service options', () => {
    render(<Step3_ServiceSelector selected={[]} onChange={mockOnChange} />);

    expect(screen.getByText('세척')).toBeInTheDocument();
    expect(screen.getByText('상태점검')).toBeInTheDocument();
    expect(screen.getByText('간단수리')).toBeInTheDocument();
    expect(screen.getByText('정기관리')).toBeInTheDocument();

    expect(screen.getByText('오염·얼룩·먼지 등을 가구 재질에 맞게 클리닝')).toBeInTheDocument();
    expect(screen.getByText('흔들림·마모·파손 여부와 사용 가능 상태 확인')).toBeInTheDocument();
  });

  it('shows selected services as checked', () => {
    const selected: ServiceType[] = ['CLEANING', 'INSPECTION'];
    render(<Step3_ServiceSelector selected={selected} onChange={mockOnChange} />);

    const cleaningCard = screen.getByRole('checkbox', { name: /세척/ });
    const inspectionCard = screen.getByRole('checkbox', { name: /상태점검/ });
    const repairCard = screen.getByRole('checkbox', { name: /간단수리/ });

    expect(cleaningCard).toHaveAttribute('aria-checked', 'true');
    expect(inspectionCard).toHaveAttribute('aria-checked', 'true');
    expect(repairCard).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles service selection on click', () => {
    render(<Step3_ServiceSelector selected={[]} onChange={mockOnChange} />);

    const cleaningCard = screen.getByRole('checkbox', { name: /세척/ });
    fireEvent.click(cleaningCard);

    expect(mockOnChange).toHaveBeenCalledWith(['CLEANING']);
  });

  it('removes service when clicking selected item', () => {
    const selected: ServiceType[] = ['CLEANING', 'INSPECTION'];
    render(<Step3_ServiceSelector selected={selected} onChange={mockOnChange} />);

    const cleaningCard = screen.getByRole('checkbox', { name: /세척/ });
    fireEvent.click(cleaningCard);

    expect(mockOnChange).toHaveBeenCalledWith(['INSPECTION']);
  });

  it('supports keyboard navigation', () => {
    render(<Step3_ServiceSelector selected={[]} onChange={mockOnChange} />);

    const cleaningCard = screen.getByRole('checkbox', { name: /세척/ });
    fireEvent.keyDown(cleaningCard, { key: 'Enter' });

    expect(mockOnChange).toHaveBeenCalledWith(['CLEANING']);

    mockOnChange.mockClear();
    fireEvent.keyDown(cleaningCard, { key: ' ' });

    expect(mockOnChange).toHaveBeenCalledWith(['CLEANING']);
  });

  it('displays notice text', () => {
    render(<Step3_ServiceSelector selected={[]} onChange={mockOnChange} />);

    expect(screen.getByText(/간단수리와 정기관리는 가구 상태 및 관리 주기에 따라/)).toBeInTheDocument();
  });

  describe('canProceedFromStep3', () => {
    it('returns false for empty selection', () => {
      expect(canProceedFromStep3([])).toBe(false);
    });

    it('returns true for non-empty selection', () => {
      expect(canProceedFromStep3(['CLEANING'])).toBe(true);
      expect(canProceedFromStep3(['CLEANING', 'INSPECTION'])).toBe(true);
    });
  });
});