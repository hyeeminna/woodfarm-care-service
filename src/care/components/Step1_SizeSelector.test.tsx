import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Step1_SizeSelector } from './Step1_SizeSelector';
import { CompanySize } from '../types';

describe('Step1_SizeSelector', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all 4 size options', () => {
    render(<Step1_SizeSelector selected={null} onChange={mockOnChange} />);
    
    expect(screen.getByText('10인 이하')).toBeInTheDocument();
    expect(screen.getByText('11~30인')).toBeInTheDocument();
    expect(screen.getByText('31~50인')).toBeInTheDocument();
    expect(screen.getByText('50인 이상')).toBeInTheDocument();
  });

  it('shows question title', () => {
    render(<Step1_SizeSelector selected={null} onChange={mockOnChange} />);
    
    expect(screen.getByText('공간의 상주 인원은 몇 명인가요?')).toBeInTheDocument();
  });

  it('calls onChange when card is clicked', () => {
    render(<Step1_SizeSelector selected={null} onChange={mockOnChange} />);
    
    const card = screen.getByRole('radio', { name: '10인 이하 선택' });
    fireEvent.click(card);
    
    expect(mockOnChange).toHaveBeenCalledWith('UNDER_10');
  });

  it('shows selected state correctly', () => {
    render(<Step1_SizeSelector selected={'BETWEEN_11_30'} onChange={mockOnChange} />);
    
    const selectedCard = screen.getByRole('radio', { name: '11~30인 선택' });
    expect(selectedCard).toHaveAttribute('aria-checked', 'true');
    expect(selectedCard).toHaveAttribute('data-selected', 'true');
  });

  it('shows check icon for selected option', () => {
    render(<Step1_SizeSelector selected={'OVER_50'} onChange={mockOnChange} />);
    
    const selectedCard = screen.getByRole('radio', { name: '50인 이상 선택' });
    expect(selectedCard.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('supports keyboard navigation with Enter key', () => {
    render(<Step1_SizeSelector selected={null} onChange={mockOnChange} />);
    
    const card = screen.getByRole('radio', { name: '31~50인 선택' });
    fireEvent.keyDown(card, { key: 'Enter' });
    
    expect(mockOnChange).toHaveBeenCalledWith('BETWEEN_31_50');
  });

  it('supports keyboard navigation with Space key', () => {
    render(<Step1_SizeSelector selected={null} onChange={mockOnChange} />);
    
    const card = screen.getByRole('radio', { name: '31~50인 선택' });
    fireEvent.keyDown(card, { key: ' ' });
    
    expect(mockOnChange).toHaveBeenCalledWith('BETWEEN_31_50');
  });

  it('has proper radiogroup role', () => {
    render(<Step1_SizeSelector selected={null} onChange={mockOnChange} />);
    
    expect(screen.getByRole('radiogroup', { name: '공간 규모 선택' })).toBeInTheDocument();
  });

  it('only shows one selected item at a time', () => {
    render(<Step1_SizeSelector selected={'UNDER_10'} onChange={mockOnChange} />);
    
    const cards = screen.getAllByRole('radio');
    const selectedCards = cards.filter(card => card.getAttribute('aria-checked') === 'true');
    
    expect(selectedCards).toHaveLength(1);
    expect(selectedCards[0]).toHaveAttribute('aria-label', '10인 이하 선택');
  });
});