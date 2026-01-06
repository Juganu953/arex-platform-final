const http = require('http');
const url = require('url');
const fs = require('fs');

const PORT = 9006;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Handle OAuth callback
  if (parsedUrl.query.code) {
    console.log('\n✅ OAuth Callback Received!');
    console.log('Code:', parsedUrl.query.code);
    console.log('State:', parsedUrl.query.state);
    
    // Save the code
    fs.writeFileSync('oauth_code_received.txt', 
      `Code: ${parsedUrl.query.code}\nState: ${parsedUrl.query.state}\nTimestamp: ${new Date().toISOString()}`);
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>OAuth Success</title></head>
      <body style="font-family: Arial; padding: 20px;">
        <h1 style="color: green;">✅ OAuth Successful!</h1>
        <p>Code received and saved.</p>
        <div style="background: #f0f0f0; padding: 10px;">
          <strong>Code:</strong> ${parsedUrl.query.code.substring(0, 50)}...
        </div>
        <p><a href="/">Home</a></p>
      </body>
      </html>
    `);
    return;
  }
  
  // Serve home page
  if (pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
      <body style="font-family: Arial; padding: 20px;">
        <h1>Arex Platform OAuth Server</h1>
        <p>Running on port ${PORT}</p>
        <p>Redirect URI: <code>http://localhost:${PORT}</code></p>
        <p><a href="/test">Test endpoint</a></p>
      </body>
      </html>
    `);
    return;
  }
  
  // Test endpoint
  if (pathname === '/test') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      server: 'oauth-callback',
      port: PORT,
      timestamp: new Date().toISOString()
    }));
    return;
  }
  
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OAuth Callback Server');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ OAuth server running on http://127.0.0.1:${PORT}`);
  console.log(`✅ Also: http://localhost:${PORT}`);
  console.log('\nUse this as your OAuth redirect URI');
});
