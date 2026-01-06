const http = require('http');
const url = require('url');
const fs = require('fs');

const PORT = 9006;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Handle OAuth callback
  if (parsedUrl.query.code) {
    console.log('\n✅ OAuth Callback Received!');
    console.log('Code:', parsedUrl.query.code);
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>OAuth Success - Arex Platform</title></head>
      <body style="font-family: Arial; padding: 20px;">
        <h1 style="color: green;">✅ OAuth Successful!</h1>
        <p>Project: arex-ltd-42154393-a701b-fce9f</p>
        <div style="background: #f0f0f0; padding: 10px; margin: 10px 0;">
          <strong>Code received:</strong> ${parsedUrl.query.code.substring(0, 50)}...
        </div>
        <p>This code can now be used with Firebase Authentication.</p>
        <p><a href="/">Home</a> | <a href="/test">Test</a></p>
      </body>
      </html>
    `);
    return;
  }
  
  if (parsedUrl.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
      <head><title>Arex Platform OAuth Server</title></head>
      <body style="font-family: Arial; padding: 20px;">
        <h1>🚀 Arex Platform OAuth Server</h1>
        <p>✅ Server running on port ${PORT}</p>
        <p>Use this as your OAuth redirect URI:</p>
        <code style="background: #f0f0f0; padding: 10px; display: block;">
          http://localhost:${PORT}
        </code>
        <p style="margin-top: 20px;">
          <a href="/test">Test endpoint</a> | 
          <a href="?code=TEST_CODE_123&state=test">Simulate OAuth</a>
        </p>
      </body>
      </html>
    `);
    return;
  }
  
  if (parsedUrl.pathname === '/test') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      server: 'oauth-callback',
      port: PORT,
      project: 'arex-ltd-42154393-a701b-fce9f',
      timestamp: new Date().toISOString(),
      cloudFunction: 'https://us-central1-arex-ltd-42154393-a701b-fce9f.cloudfunctions.net/testSetup'
    }, null, 2));
    return;
  }
  
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OAuth Callback Server - Arex Platform');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ OAuth server running on http://localhost:${PORT}`);
  console.log(`✅ Also: http://127.0.0.1:${PORT}`);
  console.log(`✅ Cloud Shell Preview: https://9006-cs-f787c19f-28f4-434a-ae30-74ac62a35239.cs-europe-west1-onse.cloudshell.dev/`);
  console.log('\n📋 Configure your OAuth provider with:');
  console.log(`   Redirect URI: http://localhost:${PORT}`);
  console.log(`   Redirect URI: https://9006-cs-f787c19f-28f4-434a-ae30-74ac62a35239.cs-europe-west1-onse.cloudshell.dev/`);
});
