import {
  randomInt,
  randomFloat,
  randomDate,
  generateSalesRecord,
  calculateMean,
  calculateStandardDeviation,
  formatDate,
  formatCurrency
} from '../utils';
import { DataGeneratorConfig } from '../types';

describe('Utility Functions', () => {
  describe('randomInt', () => {
    it('should generate integers within the specified range', () => {
      const min = 1;
      const max = 10;
      
      for (let i = 0; i < 100; i++) {
        const result = randomInt(min, max);
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it('should handle single value range', () => {
      const result = randomInt(5, 5);
      expect(result).toBe(5);
    });
  });

  describe('randomFloat', () => {
    it('should generate floats within the specified range', () => {
      const min = 0.5;
      const max = 1.5;
      
      for (let i = 0; i < 100; i++) {
        const result = randomFloat(min, max);
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThan(max);
      }
    });
  });

  describe('randomDate', () => {
    it('should generate dates within the specified range', () => {
      const start = new Date('2020-01-01');
      const end = new Date('2020-12-31');
      
      for (let i = 0; i < 100; i++) {
        const result = randomDate(start, end);
        expect(result.getTime()).toBeGreaterThanOrEqual(start.getTime());
        expect(result.getTime()).toBeLessThanOrEqual(end.getTime());
      }
    });

    it('should handle same start and end date', () => {
      const date = new Date('2020-01-01');
      const result = randomDate(date, date);
      expect(result.getTime()).toBe(date.getTime());
    });
  });

  describe('generateSalesRecord', () => {
    it('should generate a valid sales record', () => {
      const config: DataGeneratorConfig = {
        recordCount: 1000,
        outputFile: 'test.csv',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2020-12-31'),
        minTotal: 10.0,
        maxTotal: 100.0,
        maxCustomerId: 100,
        maxOrderId: 1000
      };

      const record = generateSalesRecord(1, config);
      
      expect(record.id).toBe(1);
      expect(record.order_id).toBeGreaterThanOrEqual(1);
      expect(record.order_id).toBeLessThanOrEqual(config.maxOrderId);
      expect(record.customer_id).toBeGreaterThanOrEqual(1);
      expect(record.customer_id).toBeLessThanOrEqual(config.maxCustomerId);
      expect(record.total).toBeGreaterThanOrEqual(config.minTotal);
      expect(record.total).toBeLessThanOrEqual(config.maxTotal);
      expect(record.fecha.getTime()).toBeGreaterThanOrEqual(config.startDate.getTime());
      expect(record.fecha.getTime()).toBeLessThanOrEqual(config.endDate.getTime());
    });
  });

  describe('calculateMean', () => {
    it('should calculate mean correctly', () => {
      expect(calculateMean([1, 2, 3, 4, 5])).toBe(3);
      expect(calculateMean([10, 20, 30])).toBe(20);
      expect(calculateMean([0, 0, 0])).toBe(0);
    });

    it('should return 0 for empty array', () => {
      expect(calculateMean([])).toBe(0);
    });

    it('should handle single value', () => {
      expect(calculateMean([42])).toBe(42);
    });

    it('should round to 2 decimal places', () => {
      expect(calculateMean([1, 2, 3])).toBe(2);
      expect(calculateMean([1.333, 2.667])).toBe(2);
    });
  });

  describe('calculateStandardDeviation', () => {
    it('should calculate standard deviation correctly', () => {
      // Test with known values: [2, 4, 4, 4, 5, 5, 7, 9]
      // Mean = 5, Variance = 4, Std Dev = 2
      const values = [2, 4, 4, 4, 5, 5, 7, 9];
      const result = calculateStandardDeviation(values);
      expect(result).toBe(2);
    });

    it('should return 0 for empty array', () => {
      expect(calculateStandardDeviation([])).toBe(0);
    });

    it('should return 0 for single value', () => {
      expect(calculateStandardDeviation([42])).toBe(0);
    });

    it('should round to 2 decimal places', () => {
      const values = [1, 2, 3, 4, 5];
      const result = calculateStandardDeviation(values);
      expect(result).toBe(1.58); // sqrt(2.5) ≈ 1.58
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2020-12-25');
      expect(formatDate(date)).toBe('2020-12-25');
    });

    it('should handle single digit month and day', () => {
      const date = new Date('2020-01-05');
      expect(formatDate(date)).toBe('2020-01-05');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with 2 decimal places', () => {
      expect(formatCurrency(123.456)).toBe('123.46');
      expect(formatCurrency(123)).toBe('123.00');
      expect(formatCurrency(0)).toBe('0.00');
    });
  });
});
