import { DataGenerator } from './dataGenerator';
import { DataGeneratorConfig } from './types';
import { DataProcessor } from './dataProcessor';
import * as fs from 'fs';

async function runFullPipeline() {
  try {
    console.log('🚀 Starting full CSV processing pipeline...\n');

    // Step 1: Generate data
    console.log('📝 STEP 1: Generating CSV data...');
    const config: DataGeneratorConfig = {
      recordCount: 1000000,
      outputFile: './data/sales_data.csv',
      startDate: new Date('2020-01-01'),
      endDate: new Date('2024-12-31'),
      minTotal: 10.0,
      maxTotal: 10000.0,
      maxCustomerId: 50000,
      maxOrderId: 2000000
    };

    const generator = new DataGenerator(config);
    const genStartTime = Date.now();
    await generator.generateCSV();
    const genEndTime = Date.now();
    console.log(`✅ Data generation completed in ${((genEndTime - genStartTime) / 1000).toFixed(2)}s\n`);

    // Step 2: Process data
    console.log('📊 STEP 2: Processing and aggregating data...');
    const processor = new DataProcessor('./data/sales_data.csv', './data/monthly_aggregations.csv');
    const procStartTime = Date.now();
    await processor.processData();
    const procEndTime = Date.now();
    console.log(`✅ Data processing completed in ${((procEndTime - procStartTime) / 1000).toFixed(2)}s\n`);

    // Step 3: Show results summary
    console.log('📋 STEP 3: Results summary...');
    if (fs.existsSync('./data/monthly_aggregations.csv')) {
      const content = fs.readFileSync('./data/monthly_aggregations.csv', 'utf-8');
      const lines = content.split('\n').filter(line => line.trim() !== '');
      const recordCount = lines.length - 1; // Subtract header
      
      console.log(`✅ Generated ${recordCount} monthly aggregations`);
      console.log(`📁 Output file: ./data/monthly_aggregations.csv`);
      
      // Show first few lines
      console.log('\n📊 Preview of results:');
      lines.slice(0, 6).forEach(line => console.log(`   ${line}`));
      if (lines.length > 6) {
        console.log('   ...');
      }
    }

    console.log('\n🎉 Full pipeline completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during pipeline execution:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  runFullPipeline();
}

export { runFullPipeline };
