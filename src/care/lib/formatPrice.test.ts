import { describe, it, expect } from 'vitest';
import { formatPriceRange } from './formatPrice';

describe('formatPrice', () => {
  describe('formatPriceRange', () => {
    it('formats price range correctly when min and max are different', () => {
      expect(formatPriceRange(250000, 320000)).toBe('약 25~32만 원');
    });

    it('formats single price correctly when min equals max', () => {
      expect(formatPriceRange(300000, 300000)).toBe('약 30만 원');
    });

    it('handles zero values', () => {
      expect(formatPriceRange(0, 0)).toBe('약 0만 원');
      expect(formatPriceRange(0, 100000)).toBe('약 0~10만 원');
    });

    it('handles decimal results correctly', () => {
      expect(formatPriceRange(50000, 150000)).toBe('약 5~15만 원');
      expect(formatPriceRange(25000, 35000)).toBe('약 2.5~3.5만 원');
    });

    it('handles large numbers', () => {
      expect(formatPriceRange(1000000, 2000000)).toBe('약 100~200만 원');
    });
  });
});