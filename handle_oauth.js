const http = require('http');
const url = require('url');

// The URL from your error
const oauthUrl = "http://localhost:9006/?state=22851381&code=4/0ATX87lPv7AU2P16ogF_8K7vznek6kE3IoW-S4BWFaAyYw47iHAJ3bCZNZZR3ZQ_WmbusyA&scope=email%20https://www.googleapis.com/auth/userinfo.email%20openid%20https://www.googleapis.com/auth/cloudplatformprojects.readonly%20https://www.googleapis.com/auth/firebase%20https://www.googleapis.com/auth/cloud-platform&authuser=0&prompt=consent";

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  console.log('Request received:', req.url);
  
  // If this is the OAuth callback
  if (parsedUrl.query.code) {
    console.log('\n✅ OAuth Code Captured!');
    console.log('Code:', parsedUrl.query.code);
    console.log('State:', parsedUrl.query.state);
    console.log('Scope:', parsedUrl.query.scope);
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>✅ OAuth Successful!</h2>
          <p><strong>Code received:</strong> ${parsedUrl.query.code.substring(0, 30)}...</p>
          <p><strong>Save this code and use it to get Firebase tokens.</strong></p>
          <h3>Next Steps:</h3>
          <ol>
            <li>Copy the code above</li>
            <li>Use it with Firebase SDK or REST API</li>
            <li>Exchange for access/id tokens</li>
          </ol>
        </body>
      </html>
    `);
    
    // Don't exit - keep server running for future callbacks
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>OAuth Callback Server</h2>
          <p>Server running on port 9006</p>
          <p>Waiting for OAuth redirect...</p>
          <hr>
          <p>To test, visit this URL:</p>
          <code style="background: #f0f0f0; padding: 10px; display: block;">
            ${oauthUrl}
          </code>
        </body>
      </html>
    `);
  }
});

server.listen(9006, '0.0.0.0', () => {
  console.log('OAuth callback server running on http://localhost:9006');
  console.log('Waiting for OAuth redirect...');
  console.log('\n📋 To complete OAuth flow:');
  console.log('1. Open this URL in your browser:');
  console.log(oauthUrl);
  console.log('\n2. Or wait for the OAuth flow to redirect here automatically');
});
