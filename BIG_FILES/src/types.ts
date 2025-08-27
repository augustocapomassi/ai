export interface SalesRecord {
  id: number;
  order_id: number;
  customer_id: number;
  total: number;
  fecha: Date;
}

export interface MonthlyAggregation {
  year: number;
  month: number;
  sales_count: number;
  max_total: number;
  min_total: number;
  avg_total: number;
  std_dev_total: number;
}

export interface DataGeneratorConfig {
  recordCount: number;
  outputFile: string;
  startDate: Date;
  endDate: Date;
  minTotal: number;
  maxTotal: number;
  maxCustomerId: number;
  maxOrderId: number;
}
