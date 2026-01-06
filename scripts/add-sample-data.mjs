import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;

async function addData() {
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
    console.log('📝 Adding sample data...');
    
    // Add more agents
    await client.query(`
      INSERT INTO agents (name, email, status) VALUES 
      ('Alex Johnson', 'alex@example.com', 'active'),
      ('Sarah Williams', 'sarah@example.com', 'active'),
      ('Mike Brown', 'mike@example.com', 'inactive')
      ON CONFLICT (email) DO NOTHING
    `);
    console.log('✅ Added agents');
    
    // Add tickets
    await client.query(`
      INSERT INTO tickets (ticket_number, customer_name, customer_email, subject, description, priority, status) VALUES
      ('TICK-001', 'John Customer', 'john@customer.com', 'Login issue', 'Cannot login to account', 'high', 'open'),
      ('TICK-002', 'Jane Client', 'jane@client.com', 'Billing question', 'Invoice #12345 clarification', 'medium', 'in-progress'),
      ('TICK-003', 'Bob User', 'bob@user.com', 'Feature request', 'Add export to PDF feature', 'low', 'resolved'),
      ('TICK-004', 'Alice Customer', 'alice@customer.com', 'Bug report', 'Button not working on mobile', 'high', 'open')
      ON CONFLICT (ticket_number) DO NOTHING
    `);
    console.log('✅ Added tickets');
    
    // Update metrics
    await client.query(`
      INSERT INTO business_metrics (metric_date, metric_name, metric_value) VALUES
      (CURRENT_DATE, 'active_users', 1250),
      (CURRENT_DATE, 'new_signups', 42),
      (CURRENT_DATE, 'response_time', 2.5)
      ON CONFLICT (metric_date, metric_name) DO UPDATE SET metric_value = EXCLUDED.metric_value
    `);
    console.log('✅ Updated metrics');
    
    // Show summary
    const agents = await client.query('SELECT COUNT(*) FROM agents');
    const tickets = await client.query('SELECT COUNT(*) FROM tickets');
    const metrics = await client.query('SELECT COUNT(*) FROM business_metrics');
    
    console.log('\n📊 Summary:');
    console.log(`   Agents: ${agents.rows[0].count}`);
    console.log(`   Tickets: ${tickets.rows[0].count}`);
    console.log(`   Metrics: ${metrics.rows[0].count}`);
    
    await client.end();
    console.log('\n✅ Sample data added! Ready for dashboard.');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

addData();
