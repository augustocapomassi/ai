import { DataProcessor } from './dataProcessor';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  try {
    const inputFile = './data/sales_data.csv';
    const outputFile = './data/monthly_aggregations.csv';

    // Check if input file exists
    if (!fs.existsSync(inputFile)) {
      console.error(`❌ Input file not found: ${inputFile}`);
      console.log('💡 Please run the data generation first: npm run generate');
      process.exit(1);
    }

    console.log('📊 Starting CSV data processing...');
    console.log(`📁 Input file: ${inputFile}`);
    console.log(`📁 Output file: ${outputFile}`);
    console.log('');

    // Get input file size
    const stats = fs.statSync(inputFile);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`📏 Input file size: ${fileSizeMB} MB`);

    const processor = new DataProcessor(inputFile, outputFile);
    
    const startTime = Date.now();
    await processor.processData();
    const endTime = Date.now();
    
    const duration = (endTime - startTime) / 1000;
    console.log(`⏱️  Processing completed in ${duration.toFixed(2)} seconds`);

    // Show a preview of the results
    if (fs.existsSync(outputFile)) {
      console.log('\n📋 Preview of results:');
      const content = fs.readFileSync(outputFile, 'utf-8');
      const lines = content.split('\n').slice(0, 6); // Header + first 5 rows
      lines.forEach(line => console.log(`   ${line}`));
      
      if (content.split('\n').length > 6) {
        console.log('   ...');
      }
    }
    
    console.log('\n🎉 Data processing completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during data processing:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}
