import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Client } = pg;
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

// HTML Dashboard
const dashboardHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Agent Workspace Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #2c3e50; color: white; padding: 20px; border-radius: 8px; }
        .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .stat-card h3 { margin: 0 0 10px 0; color: #2c3e50; }
        .stat-card .value { font-size: 2em; font-weight: bold; color: #3498db; }
        .tables { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .table-container { background: white; padding: 20px; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #ecf0f1; padding: 10px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Agent Workspace Dashboard</h1>
            <p>PostgreSQL: ${process.env.PG_DATABASE} @ ${process.env.PG_HOST}</p>
        </div>
        
        <div id="stats" class="stats">
            <!-- Stats will be loaded here -->
        </div>
        
        <div class="tables">
            <div class="table-container">
                <h2>👥 Agents</h2>
                <div id="agents-table"></div>
            </div>
            <div class="table-container">
                <h2>📈 Business Metrics</h2>
                <div id="metrics-table"></div>
            </div>
        </div>
        
        <div class="table-container" style="margin-top: 20px;">
            <h2>🎫 Recent Tickets</h2>
            <div id="tickets-table"></div>
        </div>
    </div>
    
    <script>
        async function loadDashboard() {
            try {
                // Load stats
                const statsRes = await fetch('/api/stats');
                const stats = await statsRes.json();
                
                document.getElementById('stats').innerHTML = \`
                    <div class="stat-card">
                        <h3>Active Agents</h3>
                        <div class="value">\${stats.activeAgents}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Open Tickets</h3>
                        <div class="value">\${stats.openTickets}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Today's Revenue</h3>
                        <div class="value">\$\${stats.todaysRevenue || '0.00'}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Total Customers</h3>
                        <div class="value">\${stats.totalCustomers || '0'}</div>
                    </div>
                \`;
                
                // Load agents
                const agentsRes = await fetch('/api/agents');
                const agents = await agentsRes.json();
                document.getElementById('agents-table').innerHTML = createTable(agents, ['id', 'name', 'email', 'status']);
                
                // Load metrics
                const metricsRes = await fetch('/api/metrics');
                const metrics = await metricsRes.json();
                document.getElementById('metrics-table').innerHTML = createTable(metrics, ['metric_name', 'metric_value', 'metric_date']);
                
                // Load tickets
                const ticketsRes = await fetch('/api/tickets');
                const tickets = await ticketsRes.json();
                document.getElementById('tickets-table').innerHTML = createTable(tickets, ['ticket_number', 'customer_name', 'subject', 'status', 'priority']);
                
            } catch (error) {
                console.error('Error loading dashboard:', error);
            }
        }
        
        function createTable(data, columns) {
            if (!data.length) return '<p>No data available</p>';
            return \`
                <table>
                    <thead><tr>\${columns.map(c => \`<th>\${c}</th>\`).join('')}</tr></thead>
                    <tbody>
                        \${data.map(row => \`
                            <tr>\${columns.map(c => \`<td>\${row[c] || ''}</td>\`).join('')}</tr>
                        \`).join('')}
                    </tbody>
                </table>
            \`;
        }
        
        // Refresh every 30 seconds
        loadDashboard();
        setInterval(loadDashboard, 30000);
    </script>
</body>
</html>
`;

// API Endpoints
app.get('/', (req, res) => {
  res.send(dashboardHTML);
});

app.get('/api/stats', async (req, res) => {
  try {
    const [agents, tickets, metrics] = await Promise.all([
      client.query("SELECT COUNT(*) FROM agents WHERE status = 'active'"),
      client.query("SELECT COUNT(*) FROM tickets WHERE status = 'open'"),
      client.query("SELECT metric_value FROM business_metrics WHERE metric_name = 'daily_revenue' AND metric_date = CURRENT_DATE")
    ]);
    
    res.json({
      activeAgents: parseInt(agents.rows[0].count),
      openTickets: parseInt(tickets.rows[0].count),
      todaysRevenue: metrics.rows[0]?.metric_value || 0,
      totalCustomers: 342 // You can make this dynamic
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/agents', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM agents ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/metrics', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM business_metrics ORDER BY metric_date DESC LIMIT 10');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tickets', async (req, res) => {
  try {
    const result = await client.query(`
      SELECT t.*, a.name as agent_name 
      FROM tickets t 
      LEFT JOIN agents a ON t.assigned_to = a.id 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
async function startServer() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Agent Workspace Dashboard running:`);
      console.log(`   📍 Local: http://localhost:${PORT}`);
      console.log(`   🌐 Cloud Shell: https://ssh.cloud.google.com/devshell/proxy?authuser=0&port=${PORT}`);
      console.log(`\n📊 Available endpoints:`);
      console.log(`   • /              - Dashboard UI`);
      console.log(`   • /api/stats     - Statistics`);
      console.log(`   • /api/agents    - Agent list`);
      console.log(`   • /api/metrics   - Business metrics`);
      console.log(`   • /api/tickets   - Recent tickets`);
    });
  } catch (error) {
    console.error('❌ Failed to start:', error.message);
    process.exit(1);
  }
}

startServer();
