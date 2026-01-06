const { Client } = require('pg');
require('dotenv').config();

async function checkAll() {
  console.log('🔍 AGENT WORKSPACE STATUS CHECK\n');
  
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
    
    // 1. Database info
    const dbInfo = await client.query('SELECT version(), current_database(), current_user');
    console.log('📊 DATABASE:');
    console.log('  Version:', dbInfo.rows[0].version.split(',')[0]);
    console.log('  Name:', dbInfo.rows[0].current_database);
    console.log('  User:', dbInfo.rows[0].current_user);
    
    // 2. Tables
    const tables = await client.query(\`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    \`);
    console.log('\n📁 TABLES:', tables.rows.length);
    tables.rows.forEach(t => console.log('  ', t.table_name));
    
    // 3. Sample data if tables exist
    if (tables.rows.some(t => t.table_name === 'agents')) {
      const agents = await client.query('SELECT COUNT(*) as count FROM agents');
      console.log('\n👥 AGENTS:', agents.rows[0].count);
    }
    
    if (tables.rows.some(t => t.table_name === 'tickets')) {
      const tickets = await client.query(\`
        SELECT status, COUNT(*) 
        FROM tickets 
        GROUP BY status
      \`);
      console.log('\n🎫 TICKETS:');
      tickets.rows.forEach(t => console.log('  ', t.status + ':', t.count));
    }
    
    console.log('\n✅ READY for Agent Workspace!');
    await client.end();
    
  } catch (error) {
    console.error('❌ Check failed:', error.message);
  }
}

checkAll();
