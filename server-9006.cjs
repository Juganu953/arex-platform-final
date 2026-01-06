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
    
    // Save the code to a file
    fs.writeFileSync('oauth_code_received.txt', 
      `Code: ${parsedUrl.query.code}\nState: ${parsedUrl.query.state}\nTimestamp: ${new Date().toISOString()}`);
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>OAuth Success - Arex Platform</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
          .container { background: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; }
          .success { color: #0c0; font-size: 24px; margin-bottom: 20px; }
          .code { background: #f0f0f0; padding: 15px; border-radius: 5px; font-family: monospace; word-break: break-all; }
          .info { margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success">✅ OAuth Authentication Successful!</div>
          <p>Your authorization code has been received and saved.</p>
          
          <div class="info">
            <h3>Code Received:</h3>
            <div class="code">${parsedUrl.query.code.substring(0, 50)}...</div>
            
            <h3>Next Steps:</h3>
            <ol>
              <li>This code has been saved to <strong>oauth_code_received.txt</strong></li>
              <li>Use it with Firebase Authentication</li>
              <li>Call your Cloud Function to exchange it for a token</li>
            </ol>
          </div>
          
          <p style="margin-top: 20px;">
            <a href="/">Back to home</a> | 
            <a href="/test">Test endpoint</a> |
            <a href="/code">View saved code</a>
          </p>
        </div>
      </body>
      </html>
    `);
    return;
  }
  
  // Serve different paths
  switch (pathname) {
    case '/':
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
        <body style="font-family: Arial, sans-serif; padding: 40px;">
          <h1>🚀 Arex Platform OAuth Server</h1>
          <p>Server running on port ${PORT}</p>
          <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3>OAuth Callback URL:</h3>
            <code style="background: white; padding: 10px; display: block;">
              http://localhost:${PORT}/?code=YOUR_CODE_HERE&state=STATE_VALUE
            </code>
          </div>
          <p>Use this as your OAuth redirect URI in Firebase settings.</p>
          <ul>
            <li><a href="/test">Test endpoint</a></li>
            <li><a href="/code">View saved OAuth code</a></li>
          </ul>
        </body>
        </html>
      `);
      break;
      
    case '/test':
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ok',
        server: 'oauth-callback',
        port: PORT,
        timestamp: new Date().toISOString(),
        project: 'arex-ltd-42154393-a701b-fce9f'
      }, null, 2));
      break;
      
    case '/code':
      try {
        const code = fs.readFileSync('oauth_code_received.txt', 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Saved OAuth Code:\n\n${code}`);
      } catch {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('No OAuth code saved yet.');
      }
      break;
      
    default:
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`OAuth Callback Server\nPort: ${PORT}\nPath: ${pathname}`);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ OAuth callback server running on http://127.0.0.1:${PORT}`);
  console.log(`✅ Also available on http://localhost:${PORT}`);
  console.log('\n📋 Configure your OAuth provider to use:');
  console.log(`   Redirect URI: http://localhost:${PORT}`);
  console.log(`   Redirect URI: http://127.0.0.1:${PORT}`);
  console.log('\n🔗 Test URLs:');
  console.log(`   Home: http://localhost:${PORT}/`);
  console.log(`   Test: http://localhost:${PORT}/test`);
  console.log(`   Code: http://localhost:${PORT}/code`);
});
