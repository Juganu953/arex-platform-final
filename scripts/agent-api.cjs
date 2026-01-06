const express = require('express');
const { Client } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json());

const client = new Client({
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT),
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

async function start() {
  await client.connect();
  console.log('✅ Database connected for Agent API');
  
  app.get('/api/agents', async (req, res) => {
    try {
      const result = await client.query('SELECT * FROM agents ORDER BY id');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/api/dashboard', async (req, res) => {
    try {
      const [agents, tickets, metrics] = await Promise.all([
        client.query('SELECT COUNT(*) FROM agents WHERE status = $1', ['active']),
        client.query(\`SELECT status, COUNT(*) FROM tickets GROUP BY status\`),
        client.query('SELECT * FROM business_metrics WHERE metric_date = CURRENT_DATE')
      ]);
      
      res.json({
        agents: agents.rows[0].count,
        tickets: tickets.rows,
        metrics: metrics.rows
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Agent API running on http://localhost:${PORT}`);
    console.log(`   Endpoints:`);
    console.log(`   • GET /api/agents`);
    console.log(`   • GET /api/dashboard`);
  });
}

start().catch(console.error);
