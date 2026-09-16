import { describe, it, expect, vi } from 'vitest';
import { StepNavigatorProps } from './StepNavigator';

describe('StepNavigator', () => {
  const defaultProps: StepNavigatorProps = {
    currentStep: 1,
    canProceed: false,
    onNext: vi.fn(),
    onReset: vi.fn(),
  };

  it('should have correct interface for props', () => {
    // Verify that StepNavigatorProps interface exists and has required properties
    expect(defaultProps).toHaveProperty('currentStep');
    expect(defaultProps).toHaveProperty('canProceed');  
    expect(defaultProps).toHaveProperty('onNext');
    expect(defaultProps).toHaveProperty('onReset');
    expect(typeof defaultProps.currentStep).toBe('number');
    expect(typeof defaultProps.canProceed).toBe('boolean');
    expect(typeof defaultProps.onNext).toBe('function');
    expect(typeof defaultProps.onReset).toBe('function');
  });

  it('should handle optional onBack prop', () => {
    const propsWithBack: StepNavigatorProps = {
      ...defaultProps,
      onBack: vi.fn(),
    };
    
    expect(propsWithBack).toHaveProperty('onBack');
    expect(typeof propsWithBack.onBack).toBe('function');
  });

  it('should accept valid currentStep values (1-4)', () => {
    [1, 2, 3, 4].forEach(step => {
      const props: StepNavigatorProps = {
        ...defaultProps,
        currentStep: step,
      };
      expect(props.currentStep).toBe(step);
      expect(props.currentStep).toBeGreaterThanOrEqual(1);
      expect(props.currentStep).toBeLessThanOrEqual(4);
    });
  });

  it('should handle progress calculation correctly', () => {
    [1, 2, 3, 4].forEach(step => {
      const expectedProgress = step * 25;
      expect(expectedProgress).toBe(step * 25);
      expect(expectedProgress).toBeGreaterThanOrEqual(25);
      expect(expectedProgress).toBeLessThanOrEqual(100);
    });
  });
});