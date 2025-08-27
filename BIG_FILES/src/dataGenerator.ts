import * as fs from 'fs';
import * as path from 'path';
import { SalesRecord, DataGeneratorConfig } from './types';
import { generateSalesRecord } from './utils';

export class DataGenerator {
  private config: DataGeneratorConfig;

  constructor(config: DataGeneratorConfig) {
    this.config = config;
  }

  /**
   * Generates the CSV file with random sales data
   */
  async generateCSV(): Promise<void> {
    console.log(`Generating ${this.config.recordCount.toLocaleString()} records...`);
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(this.config.outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write CSV header
    const header = 'id,order_id,customer_id,total,fecha\n';
    fs.writeFileSync(this.config.outputFile, header);

    // Generate records in batches to avoid memory issues
    const batchSize = 10000;
    const totalBatches = Math.ceil(this.config.recordCount / batchSize);

    for (let batch = 0; batch < totalBatches; batch++) {
      const startIndex = batch * batchSize;
      const endIndex = Math.min(startIndex + batchSize, this.config.recordCount);
      const batchSizeActual = endIndex - startIndex;

      console.log(`Processing batch ${batch + 1}/${totalBatches} (records ${startIndex + 1}-${endIndex})`);

      const batchData = this.generateBatch(startIndex + 1, batchSizeActual);
      const csvContent = this.convertBatchToCSV(batchData);
      
      // Append to file
      fs.appendFileSync(this.config.outputFile, csvContent);
    }

    console.log(`CSV file generated successfully: ${this.config.outputFile}`);
    console.log(`Total records: ${this.config.recordCount.toLocaleString()}`);
  }

  /**
   * Generates a batch of sales records
   */
  private generateBatch(startId: number, count: number): SalesRecord[] {
    const records: SalesRecord[] = [];
    
    for (let i = 0; i < count; i++) {
      const record = generateSalesRecord(startId + i, this.config);
      records.push(record);
    }

    return records;
  }

  /**
   * Converts a batch of records to CSV format
   */
  private convertBatchToCSV(records: SalesRecord[]): string {
    return records
      .map(record => {
        const fecha = record.fecha.toISOString().split('T')[0]; // YYYY-MM-DD format
        return `${record.id},${record.order_id},${record.customer_id},${record.total},${fecha}`;
      })
      .join('\n') + '\n';
  }

  /**
   * Validates the generated CSV file
   */
  validateGeneratedFile(): { lineCount: number; fileSize: string } {
    if (!fs.existsSync(this.config.outputFile)) {
      throw new Error('Generated file does not exist');
    }

    const content = fs.readFileSync(this.config.outputFile, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const fileSize = fs.statSync(this.config.outputFile).size;

    // Subtract 1 for header, should equal recordCount
    const actualRecordCount = lines.length - 1;
    
    if (actualRecordCount !== this.config.recordCount) {
      throw new Error(`Expected ${this.config.recordCount} records, but found ${actualRecordCount}`);
    }

    return {
      lineCount: lines.length,
      fileSize: this.formatFileSize(fileSize)
    };
  }

  /**
   * Formats file size in human-readable format
   */
  private formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}
