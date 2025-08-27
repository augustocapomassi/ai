import * as fs from 'fs';
import * as readline from 'readline';
import { SalesRecord, MonthlyAggregation } from './types';
import { calculateMean, calculateStandardDeviation } from './utils';

export class DataProcessor {
  private inputFile: string;
  private outputFile: string;

  constructor(inputFile: string, outputFile: string) {
    this.inputFile = inputFile;
    this.outputFile = outputFile;
  }

  /**
   * Processes the CSV file and generates monthly aggregations
   */
  async processData(): Promise<void> {
    console.log(`Processing file: ${this.inputFile}`);
    
    // Create output directory if it doesn't exist
    const outputDir = require('path').dirname(this.outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Process data in streaming fashion to handle large files
    const aggregations = await this.streamProcessFile();
    
    // Sort aggregations by year and month
    aggregations.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

    // Write results to CSV
    await this.writeAggregationsToCSV(aggregations);
    
    console.log(`Processing completed. Results saved to: ${this.outputFile}`);
    console.log(`Total monthly aggregations: ${aggregations.length}`);
  }

  /**
   * Processes the file using streams to handle large files efficiently
   */
  private async streamProcessFile(): Promise<MonthlyAggregation[]> {
    const fileStream = fs.createReadStream(this.inputFile);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    // Map to store monthly data: key = "YYYY-MM", value = array of totals
    const monthlyData = new Map<string, number[]>();
    let lineCount = 0;

    for await (const line of rl) {
      lineCount++;
      
      // Skip header
      if (lineCount === 1) continue;

      try {
        const record = this.parseCSVLine(line);
        if (record) {
          const year = record.fecha.getFullYear();
          const month = record.fecha.getMonth() + 1; // getMonth() returns 0-11
          const key = `${year}-${month.toString().padStart(2, '0')}`;
          
          if (!monthlyData.has(key)) {
            monthlyData.set(key, []);
          }
          
          monthlyData.get(key)!.push(record.total);
        }
      } catch (error) {
        console.warn(`Warning: Skipping invalid line ${lineCount}: ${error}`);
      }
    }

    // Convert monthly data to aggregations
    const aggregations: MonthlyAggregation[] = [];
    
    for (const [key, totals] of monthlyData) {
      const [yearStr, monthStr] = key.split('-');
      const year = parseInt(yearStr);
      const month = parseInt(monthStr);
      
      const aggregation: MonthlyAggregation = {
        year,
        month,
        sales_count: totals.length,
        max_total: Math.max(...totals),
        min_total: Math.min(...totals),
        avg_total: calculateMean(totals),
        std_dev_total: calculateStandardDeviation(totals)
      };
      
      aggregations.push(aggregation);
    }

    return aggregations;
  }

  /**
   * Parses a single CSV line into a SalesRecord
   */
  private parseCSVLine(line: string): SalesRecord | null {
    const parts = line.split(',');
    
    if (parts.length !== 5) {
      return null;
    }

    const id = parseInt(parts[0]);
    const order_id = parseInt(parts[1]);
    const customer_id = parseInt(parts[2]);
    const total = parseFloat(parts[3]);
    const fecha = new Date(parts[4]);

    // Validate data
    if (isNaN(id) || isNaN(order_id) || isNaN(customer_id) || 
        isNaN(total) || isNaN(fecha.getTime())) {
      return null;
    }

    return {
      id,
      order_id,
      customer_id,
      total,
      fecha
    };
  }

  /**
   * Writes the monthly aggregations to a CSV file
   */
  private async writeAggregationsToCSV(aggregations: MonthlyAggregation[]): Promise<void> {
    const header = 'year,month,sales_count,max_total,min_total,avg_total,std_dev_total\n';
    
    const csvContent = header + aggregations
      .map(agg => 
        `${agg.year},${agg.month},${agg.sales_count},${agg.max_total},${agg.min_total},${agg.avg_total},${agg.std_dev_total}`
      )
      .join('\n');

    fs.writeFileSync(this.outputFile, csvContent);
  }

  /**
   * Gets summary statistics of the processed data
   */
  getProcessingStats(): {
    totalRecords: number;
    totalAggregations: number;
    dateRange: { start: string; end: string };
    totalSales: number;
  } {
    // This would need to be implemented with a second pass through the file
    // or by storing stats during processing
    throw new Error('Processing stats not available. Call processData() first.');
  }
}
