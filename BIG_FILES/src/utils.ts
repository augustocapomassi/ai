import { SalesRecord, DataGeneratorConfig } from './types';

/**
 * Generates a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random float between min and max
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generates a random date between start and end dates
 */
export function randomDate(start: Date, end: Date): Date {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime);
}

/**
 * Generates a single sales record
 */
export function generateSalesRecord(
  id: number,
  config: DataGeneratorConfig
): SalesRecord {
  return {
    id,
    order_id: randomInt(1, config.maxOrderId),
    customer_id: randomInt(1, config.maxCustomerId),
    total: parseFloat(randomFloat(config.minTotal, config.maxTotal).toFixed(2)),
    fecha: randomDate(config.startDate, config.endDate),
  };
}

/**
 * Calculates the mean of an array of numbers
 */
export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return parseFloat((sum / values.length).toFixed(2));
}

/**
 * Calculates the standard deviation of an array of numbers
 */
export function calculateStandardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = calculateMean(values);
  const squaredDifferences = values.map(val => Math.pow(val - mean, 2));
  const variance = calculateMean(squaredDifferences);
  return parseFloat(Math.sqrt(variance).toFixed(2));
}

/**
 * Formats a date to YYYY-MM-DD format
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a number to have exactly 2 decimal places
 */
export function formatCurrency(amount: number): string {
  return amount.toFixed(2);
}
