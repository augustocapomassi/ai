import { DataGenerator, DataGeneratorConfig } from '../dataGenerator';
import { SalesRecord } from '../types';
import * as fs from 'fs';
import * as path from 'path';

describe('DataGenerator', () => {
  let tempDir: string;
  let config: DataGeneratorConfig;

  beforeEach(() => {
    tempDir = path.join(__dirname, '../../temp-test');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    config = {
      recordCount: 100,
      outputFile: path.join(tempDir, 'test_sales.csv'),
      startDate: new Date('2020-01-01'),
      endDate: new Date('2020-12-31'),
      minTotal: 10.0,
      maxTotal: 100.0,
      maxCustomerId: 50,
      maxOrderId: 200
    };
  });

  afterEach(() => {
    // Clean up test files
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('constructor', () => {
    it('should create instance with configuration', () => {
      const generator = new DataGenerator(config);
      expect(generator).toBeInstanceOf(DataGenerator);
    });
  });

  describe('generateCSV', () => {
    it('should generate CSV file with correct number of records', async () => {
      const generator = new DataGenerator(config);
      
      await generator.generateCSV();
      
      expect(fs.existsSync(config.outputFile)).toBe(true);
      
      const content = fs.readFileSync(config.outputFile, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim() !== '');
      
      // Should have header + recordCount lines
      expect(lines.length).toBe(config.recordCount + 1);
      
      // Check header
      expect(lines[0]).toBe('id,order_id,customer_id,total,fecha');
    });

    it('should generate CSV with valid data format', async () => {
      const generator = new DataGenerator(config);
      
      await generator.generateCSV();
      
      const content = fs.readFileSync(config.outputFile, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim() !== '');
      
      // Skip header, check first few data lines
      for (let i = 1; i < Math.min(5, lines.length); i++) {
        const parts = lines[i].split(',');
        expect(parts.length).toBe(5);
        
        // Check ID is sequential
        expect(parseInt(parts[0])).toBe(i);
        
        // Check order_id is within range
        const orderId = parseInt(parts[1]);
        expect(orderId).toBeGreaterThanOrEqual(1);
        expect(orderId).toBeLessThanOrEqual(config.maxOrderId);
        
        // Check customer_id is within range
        const customerId = parseInt(parts[2]);
        expect(customerId).toBeGreaterThanOrEqual(1);
        expect(customerId).toBeLessThanOrEqual(config.maxCustomerId);
        
        // Check total is within range
        const total = parseFloat(parts[3]);
        expect(total).toBeGreaterThanOrEqual(config.minTotal);
        expect(total).toBeLessThanOrEqual(config.maxTotal);
        
        // Check date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        expect(parts[4]).toMatch(dateRegex);
      }
    });

    it('should handle large record counts in batches', async () => {
      const largeConfig = { ...config, recordCount: 10000 };
      const generator = new DataGenerator(largeConfig);
      
      const startTime = Date.now();
      await generator.generateCSV();
      const endTime = Date.now();
      
      expect(fs.existsSync(largeConfig.outputFile)).toBe(true);
      
      const content = fs.readFileSync(largeConfig.outputFile, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim() !== '');
      expect(lines.length).toBe(largeConfig.recordCount + 1);
      
      // Should complete in reasonable time (less than 10 seconds)
      expect(endTime - startTime).toBeLessThan(10000);
    });

    it('should create output directory if it does not exist', async () => {
      const deepConfig = { 
        ...config, 
        outputFile: path.join(tempDir, 'deep', 'nested', 'test.csv') 
      };
      const generator = new DataGenerator(deepConfig);
      
      await generator.generateCSV();
      
      expect(fs.existsSync(deepConfig.outputFile)).toBe(true);
    });
  });

  describe('validateGeneratedFile', () => {
    it('should validate file correctly after generation', async () => {
      const generator = new DataGenerator(config);
      
      await generator.generateCSV();
      
      const validation = generator.validateGeneratedFile();
      
      expect(validation.lineCount).toBe(config.recordCount + 1);
      expect(validation.fileSize).toMatch(/^\d+(\.\d+)? (Bytes|KB|MB|GB)$/);
    });

    it('should throw error for non-existent file', () => {
      const generator = new DataGenerator(config);
      
      expect(() => generator.validateGeneratedFile()).toThrow('Generated file does not exist');
    });

    it('should throw error for incorrect record count', async () => {
      const generator = new DataGenerator(config);
      
      // Manually create a file with wrong number of records
      const wrongContent = 'id,order_id,customer_id,total,fecha\n1,1,1,10.00,2020-01-01\n2,2,2,20.00,2020-01-02';
      fs.writeFileSync(config.outputFile, wrongContent);
      
      expect(() => generator.validateGeneratedFile()).toThrow(`Expected ${config.recordCount} records, but found 2`);
    });
  });

  describe('private methods', () => {
    it('should generate batches correctly', async () => {
      const generator = new DataGenerator(config);
      
      // Access private method through reflection for testing
      const generateBatch = (generator as any).generateBatch.bind(generator);
      const batch = generateBatch(1, 5);
      
      expect(batch).toHaveLength(5);
      expect(batch[0].id).toBe(1);
      expect(batch[4].id).toBe(5);
      
      batch.forEach(record => {
        expect(record).toHaveProperty('id');
        expect(record).toHaveProperty('order_id');
        expect(record).toHaveProperty('customer_id');
        expect(record).toHaveProperty('total');
        expect(record).toHaveProperty('fecha');
      });
    });

    it('should convert batch to CSV correctly', async () => {
      const generator = new DataGenerator(config);
      
      const testRecords: SalesRecord[] = [
        {
          id: 1,
          order_id: 100,
          customer_id: 25,
          total: 50.00,
          fecha: new Date('2020-06-15')
        },
        {
          id: 2,
          order_id: 101,
          customer_id: 30,
          total: 75.50,
          fecha: new Date('2020-06-16')
        }
      ];
      
      const convertBatchToCSV = (generator as any).convertBatchToCSV.bind(generator);
      const csvContent = convertBatchToCSV(testRecords);
      
      const expectedLines = [
        '1,100,25,50,2020-06-15',
        '2,101,30,75.5,2020-06-16'
      ];
      
      expectedLines.forEach(line => {
        expect(csvContent).toContain(line);
      });
    });
  });
});
