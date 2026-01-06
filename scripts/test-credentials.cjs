const { Client } = require('pg');
require('dotenv').config();

async function test() {
  console.log('🔐 Testing credentials...');
  console.log('User:', process.env.PG_USER);
  console.log('Host:', process.env.PG_HOST);
  console.log('Port:', process.env.PG_PORT);
  console.log('Database:', process.env.PG_DATABASE);
  
  const client = new Client({
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Credentials VALID - Connected!');
    
    // Show all tables (for agent workspace)
    const tables = await client.query(`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\n📊 Available tables:');
    tables.rows.forEach(t => console.log(`  ${t.table_type}: ${t.table_name}`));
    
    await client.end();
  } catch (error) {
    console.error('❌ Invalid credentials:', error.message);
    console.log('\n🔧 Fix: Get fresh password from Aiven Console → Connection information');
  }
}

test();
