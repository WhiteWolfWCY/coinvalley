import {
  convertAmountToMiliunits,
  convertAmountFromMiliunits,
  formatCurrency,
  calculatePercantageChange,
  fillMissingDays,
  formatDateRange,
  formatPercentage,
} from '@/lib/utils';
import { subDays } from 'date-fns';

describe('Utility Functions', () => {
  describe('convertAmountToMiliunits', () => {
    it('converts dollars to miliunits', () => {
      expect(convertAmountToMiliunits(10.5)).toBe(10500);
      expect(convertAmountToMiliunits(0.75)).toBe(750);
      expect(convertAmountToMiliunits(1)).toBe(1000);
    });

    it('rounds to the nearest miliunit', () => {
      expect(convertAmountToMiliunits(10.555)).toBe(10555);
      expect(convertAmountToMiliunits(10.554)).toBe(10554);
    });
  });

  describe('convertAmountFromMiliunits', () => {
    it('converts miliunits to dollars', () => {
      expect(convertAmountFromMiliunits(10500)).toBe(10.5);
      expect(convertAmountFromMiliunits(750)).toBe(0.75);
      expect(convertAmountFromMiliunits(1000)).toBe(1);
    });
  });

  describe('formatCurrency', () => {
    it('formats a number as USD currency', () => {
      expect(formatCurrency(10.5)).toBe('$10.50');
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(0)).toBe('$0.00');
    });
  });

  describe('calculatePercantageChange', () => {
    it('calculates percentage change between two numbers', () => {
      expect(calculatePercantageChange(110, 100)).toBe(10);
      expect(calculatePercantageChange(90, 100)).toBe(-10);
      expect(calculatePercantageChange(200, 100)).toBe(100);
    });

    it('handles edge cases', () => {
      expect(calculatePercantageChange(100, 0)).toBe(100);
      expect(calculatePercantageChange(0, 0)).toBe(0);
    });
  });

  describe('fillMissingDays', () => {
    it('fills in missing days with zero values', () => {
      const today = new Date();
      const yesterday = subDays(today, 1);
      const twoDaysAgo = subDays(today, 2);
      
      const activeDays = [
        { date: today, income: 100, expenses: 50 },
        { date: twoDaysAgo, income: 200, expenses: 75 },
      ];
      
      const result = fillMissingDays(activeDays, twoDaysAgo, today);
      
      expect(result).toHaveLength(3);
      expect(result[0].date).toEqual(twoDaysAgo);
      expect(result[0].income).toBe(200);
      expect(result[0].expenses).toBe(75);
      
      expect(result[1].date.getDate()).toEqual(yesterday.getDate());
      expect(result[1].income).toBe(0);
      expect(result[1].expenses).toBe(0);
      
      expect(result[2].date).toEqual(today);
      expect(result[2].income).toBe(100);
      expect(result[2].expenses).toBe(50);
    });

    it('returns empty array if activeDays is empty', () => {
      const today = new Date();
      const yesterday = subDays(today, 1);
      
      const result = fillMissingDays([], yesterday, today);
      
      expect(result).toEqual([]);
    });
  });

  describe('formatPercentage', () => {
    it('formats a number as a percentage', () => {
      expect(formatPercentage(10)).toBe('10%');
      expect(formatPercentage(0)).toBe('0%');
      expect(formatPercentage(-5)).toBe('-5%');
    });

    it('adds a prefix for positive numbers when specified', () => {
      expect(formatPercentage(10, { addPrefix: true })).toBe('+10%');
      expect(formatPercentage(0, { addPrefix: true })).toBe('0%');
      expect(formatPercentage(-5, { addPrefix: true })).toBe('-5%');
    });
  });
}); 