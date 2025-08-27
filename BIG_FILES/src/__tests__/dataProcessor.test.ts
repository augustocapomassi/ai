import { DataProcessor } from '../dataProcessor';
import { MonthlyAggregation } from '../types';
import * as fs from 'fs';
import * as path from 'path';

describe('DataProcessor', () => {
  let tempDir: string;
  let inputFile: string;
  let outputFile: string;

  beforeEach(() => {
    tempDir = path.join(__dirname, '../../temp-test');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    inputFile = path.join(tempDir, 'test_input.csv');
    outputFile = path.join(tempDir, 'test_output.csv');
  });

  afterEach(() => {
    // Clean up test files
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('constructor', () => {
    it('should create instance with input and output files', () => {
      const processor = new DataProcessor(inputFile, outputFile);
      expect(processor).toBeInstanceOf(DataProcessor);
    });
  });

  describe('processData', () => {
    it('should process valid CSV and generate aggregations', async () => {
      // Create test CSV with known data
      const testCSV = [
        'id,order_id,customer_id,total,fecha',
        '1,100,25,50.00,2020-01-15',
        '2,101,30,75.50,2020-01-20',
        '3,102,35,25.00,2020-01-25',
        '4,103,40,100.00,2020-02-10',
        '5,104,45,60.00,2020-02-15',
        '6,105,50,45.00,2020-02-20'
      ].join('\n');

      fs.writeFileSync(inputFile, testCSV);

      const processor = new DataProcessor(inputFile, outputFile);
      await processor.processData();

      expect(fs.existsSync(outputFile)).toBe(true);

      const content = fs.readFileSync(outputFile, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim() !== '');
      
      // Should have header + 2 monthly aggregations (Jan and Feb)
      expect(lines.length).toBe(3);
      expect(lines[0]).toBe('year,month,sales_count,max_total,min_total,avg_total,std_dev_total');
    });

    it('should handle empty CSV gracefully', async () => {
      const emptyCSV = 'id,order_id,customer_id,total,fecha\n';
      fs.writeFileSync(inputFile, emptyCSV);

      const processor = new DataProcessor(inputFile, outputFile);
      await processor.processData();

      expect(fs.existsSync(outputFile)).toBe(true);
      
      const content = fs.readFileSync(outputFile, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim() !== '');
      
      // Should only have header
      expect(lines.length).toBe(1);
      expect(lines[0]).toBe('year,month,sales_count,max_total,min_total,avg_total,std_dev_total');
    });

    it('should skip invalid lines and continue processing', async () => {
      const invalidCSV = [
        'id,order_id,customer_id,total,fecha',
        '1,100,25,50.00,2020-01-15',
        'invalid,line,data,here',
        '2,101,30,75.50,2020-01-20',
        '3,102,35,invalid_number,2020-01-25',
        '4,103,40,100.00,2020-02-10'
      ].join('\n');

      fs.writeFileSync(inputFile, invalidCSV);

      const processor = new DataProcessor(inputFile, outputFile);
      await processor.processData();

      expect(fs.existsSync(outputFile)).toBe(true);
      
      const content = fs.readFileSync(outputFile, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim() !== '');
      
      // Should have header + 2 valid monthly aggregations
      expect(lines.length).toBe(3);
    });

    it('should create output directory if it does not exist', async () => {
      const deepOutputFile = path.join(tempDir, 'deep', 'nested', 'output.csv');
      const testCSV = [
        'id,order_id,customer_id,total,fecha',
        '1,100,25,50.00,2020-01-15'
      ].join('\n');

      fs.writeFileSync(inputFile, testCSV);

      const processor = new DataProcessor(inputFile, deepOutputFile);
      await processor.processData();

      expect(fs.existsSync(deepOutputFile)).toBe(true);
    });

    it('should sort aggregations by year and month', async () => {
      const testCSV = [
        'id,order_id,customer_id,total,fecha',
        '1,100,25,50.00,2020-03-15',
        '2,101,30,75.50,2020-01-20',
        '3,102,35,25.00,2020-02-25',
        '4,103,40,100.00,2019-12-10'
      ].join('\n');

      fs.writeFileSync(inputFile, testCSV);

      const processor = new DataProcessor(inputFile, outputFile);
      await processor.processData();

      const content = fs.readFileSync(outputFile, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim() !== '');
      
      // Skip header, check order
      const dataLines = lines.slice(1);
      expect(dataLines.length).toBe(4);
      
      // Parse and check order: 2019-12, 2020-01, 2020-02, 2020-03
      const years = dataLines.map(line => parseInt(line.split(',')[0]));
      const months = dataLines.map(line => parseInt(line.split(',')[1]));
      
      expect(years).toEqual([2019, 2020, 2020, 2020]);
      expect(months).toEqual([12, 1, 2, 3]);
    });
  });

  describe('private methods', () => {
    it('should parse CSV line correctly', async () => {
      const processor = new DataProcessor(inputFile, outputFile);
      const parseCSVLine = (processor as any).parseCSVLine.bind(processor);

      const validLine = '1,100,25,50.00,2020-01-15';
      const record = parseCSVLine(validLine);

      expect(record).toEqual({
        id: 1,
        order_id: 100,
        customer_id: 25,
        total: 50.00,
        fecha: new Date('2020-01-15')
      });
    });

    it('should return null for invalid CSV line', async () => {
      const processor = new DataProcessor(inputFile, outputFile);
      const parseCSVLine = (processor as any).parseCSVLine.bind(processor);

      // Wrong number of parts
      expect(parseCSVLine('1,100,25,50.00')).toBeNull();
      
      // Invalid numbers
      expect(parseCSVLine('1,invalid,25,50.00,2020-01-15')).toBeNull();
      expect(parseCSVLine('1,100,25,invalid,2020-01-15')).toBeNull();
      
      // Invalid date
      expect(parseCSVLine('1,100,25,50.00,invalid-date')).toBeNull();
    });

    it('should write aggregations to CSV correctly', async () => {
      const processor = new DataProcessor(inputFile, outputFile);
      const writeAggregationsToCSV = (processor as any).writeAggregationsToCSV.bind(processor);

      const testAggregations: MonthlyAggregation[] = [
        {
          year: 2020,
          month: 1,
          sales_count: 3,
          max_total: 75.50,
          min_total: 25.00,
          avg_total: 50.17,
          std_dev_total: 25.25
        },
        {
          year: 2020,
          month: 2,
          sales_count: 2,
          max_total: 100.00,
          min_total: 60.00,
          avg_total: 80.00,
          std_dev_total: 28.28
        }
      ];

      await writeAggregationsToCSV(testAggregations);

      expect(fs.existsSync(outputFile)).toBe(true);
      
      const content = fs.readFileSync(outputFile, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim() !== '');
      
      expect(lines.length).toBe(3); // Header + 2 aggregations
      expect(lines[0]).toBe('year,month,sales_count,max_total,min_total,avg_total,std_dev_total');
      
      // Check first aggregation
      const firstAgg = lines[1].split(',');
      expect(firstAgg[0]).toBe('2020'); // year
      expect(firstAgg[1]).toBe('1');    // month
      expect(firstAgg[2]).toBe('3');    // sales_count
      expect(firstAgg[3]).toBe('75.5'); // max_total
      expect(firstAgg[4]).toBe('25');   // min_total
      expect(firstAgg[5]).toBe('50.17'); // avg_total
      expect(firstAgg[6]).toBe('25.25'); // std_dev_total
    });
  });

  describe('error handling', () => {
    it('should throw error when input file does not exist', async () => {
      const processor = new DataProcessor('nonexistent.csv', outputFile);
      
      await expect(processor.processData()).rejects.toThrow();
    });

    it('should handle malformed CSV gracefully', async () => {
      const malformedCSV = [
        'id,order_id,customer_id,total,fecha',
        '1,100,25,50.00,2020-01-15',
        '2,101,30,75.50,2020-01-20,extra_column',
        '3,102,35,25.00',
        '4,103,40,100.00,2020-02-10'
      ].join('\n');

      fs.writeFileSync(inputFile, malformedCSV);

      const processor = new DataProcessor(inputFile, outputFile);
      
      // Should not throw, but should process valid lines
      await expect(processor.processData()).resolves.not.toThrow();
      
      expect(fs.existsSync(outputFile)).toBe(true);
    });
  });
});
