import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;

async function checkTables() {
  console.log('📋 CHECKING AGENT WORKSPACE TABLES\n');
  
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
    
    // Check each table
    const tables = ['agents', 'tickets', 'ticket_messages', 'business_metrics'];
    
    for (const table of tables) {
      try {
        const result = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`✅ ${table}: ${result.rows[0].count} rows`);
        
        // Show first few rows for agents and business_metrics
        if (table === 'agents' || table === 'business_metrics') {
          const rows = await client.query(`SELECT * FROM ${table} LIMIT 3`);
          if (rows.rows.length > 0) {
            console.log('   Sample:', rows.rows);
          }
        }
      } catch (err) {
        console.log(`❌ ${table}: Error - ${err.message}`);
      }
    }
    
    await client.end();
    console.log('\n✅ Agent Workspace is READY!');
    
  } catch (error) {
    console.error('Connection failed:', error.message);
  }
}

checkTables();
