import { DataGenerator } from './dataGenerator';
import { DataGeneratorConfig } from './types';

async function main() {
  try {
    // Configuration for data generation
    const config: DataGeneratorConfig = {
      recordCount: 1000000, // 1 million records
      outputFile: './data/sales_data.csv',
      startDate: new Date('2020-01-01'),
      endDate: new Date('2024-12-31'),
      minTotal: 10.0,        // Minimum sale amount
      maxTotal: 10000.0,     // Maximum sale amount
      maxCustomerId: 50000,  // Maximum customer ID
      maxOrderId: 2000000    // Maximum order ID
    };

    console.log('🚀 Starting CSV data generation...');
    console.log('Configuration:');
    console.log(`- Records to generate: ${config.recordCount.toLocaleString()}`);
    console.log(`- Date range: ${config.startDate.toISOString().split('T')[0]} to ${config.endDate.toISOString().split('T')[0]}`);
    console.log(`- Total range: $${config.minTotal} - $${config.maxTotal}`);
    console.log(`- Output file: ${config.outputFile}`);
    console.log('');

    const generator = new DataGenerator(config);
    
    const startTime = Date.now();
    await generator.generateCSV();
    const endTime = Date.now();
    
    const duration = (endTime - startTime) / 1000;
    console.log(`⏱️  Generation completed in ${duration.toFixed(2)} seconds`);
    
    // Validate the generated file
    console.log('🔍 Validating generated file...');
    const validation = generator.validateGeneratedFile();
    console.log(`✅ Validation passed:`);
    console.log(`   - Total lines: ${validation.lineCount.toLocaleString()}`);
    console.log(`   - File size: ${validation.fileSize}`);
    
    console.log('\n🎉 Data generation completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during data generation:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}
