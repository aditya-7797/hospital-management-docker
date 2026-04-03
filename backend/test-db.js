import { pool } from './db.js';

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    
    // Check if Prescriptions table exists and its structure
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'prescriptions'
    `);
    
    if (tableCheck.rows.length === 0) {
      console.log('❌ Prescriptions table does not exist');
      return;
    }
    
    console.log('✅ Prescriptions table exists');
    
    // Check table structure
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'prescriptions'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Prescriptions table structure:');
    columns.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });
    
    // Check if there are any existing prescriptions
    const count = await client.query('SELECT COUNT(*) FROM prescriptions');
    console.log(`📊 Current prescriptions count: ${count.rows[0].count}`);
    
    // Check if MedicalRecords table exists
    const recordsCheck = await client.query(`
      SELECT COUNT(*) FROM medicalrecords
    `);
    console.log(`📋 Medical records count: ${recordsCheck.rows[0].count}`);
    
    client.release();
    console.log('✅ Database test completed');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await pool.end();
  }
}

testDatabase();
