const http = require('http');
const url = require('url');
const querystring = require('querystring');

const PORT = 9006;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Handle Cloud Shell JWT redirect
  if (parsedUrl.pathname === '/cloudshell/jwt') {
    console.log('Handling Cloud Shell JWT redirect...');
    
    // Extract the redirect URL from JWT query params
    const redirectUri = parsedUrl.query.redirect_uri || '';
    const state = parsedUrl.query.state || '';
    
    if (redirectUri) {
      // Parse the state to get original parameters
      try {
        const stateObj = JSON.parse(Buffer.from(state, 'base64').toString());
        console.log('State object:', stateObj);
      } catch (e) {
        console.log('Could not parse state:', e.message);
      }
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
        <body style="font-family: Arial; padding: 20px;">
          <h1>Cloud Shell JWT Redirect</h1>
          <p>This is a Cloud Shell authentication redirect.</p>
          <p>Original URL parameters preserved.</p>
          <script>
            // Auto-continue after a brief pause
            setTimeout(() => {
              window.location.href = '/?' + new URLSearchParams(${JSON.stringify(parsedUrl.query)});
            }, 1000);
          </script>
        </body>
        </html>
      `);
      return;
    }
  }
  
  // Handle OAuth callback
  if (parsedUrl.query.code) {
    console.log('\n✅ OAuth Code Received via Cloud Shell!');
    console.log('Code:', parsedUrl.query.code.substring(0, 30) + '...');
    console.log('State:', parsedUrl.query.state);
    
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    
    const response = {
      success: true,
      message: "OAuth code received successfully through Cloud Shell",
      code: parsedUrl.query.code,
      state: parsedUrl.query.state,
      timestamp: new Date().toISOString(),
      project: "arex-ltd-42154393-a701b-fce9f",
      note: "Use this code with Firebase Authentication"
    };
    
    console.log('Response:', response);
    res.end(JSON.stringify(response, null, 2));
    return;
  }
  
  // Serve simple HTML
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
    <body style="font-family: Arial; padding: 20px;">
      <h1>✅ OAuth Server Working</h1>
      <p>Server is running on Cloud Shell port ${PORT}</p>
      <p>Add query parameters ?code=CODE&state=STATE to test</p>
      <hr>
      <p><a href="/?code=TEST_123&state=test">Test with dummy code</a></p>
      <p><a href="/?code=4/0ATX87lPv7AU2P16ogF_8K7vznek6kE3IoW-S4BWFaAyYw47iHAJ3bCZNZZR3ZQ_WmbusyA&state=22851381">Test with your real code</a></p>
    </body>
    </html>
  `);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ OAuth Server Fixed Version running on port ${PORT}`);
  console.log(`🌐 URL: https://9006-cs-f787c19f-28f4-434a-ae30-74ac62a35239.cs-europe-west1-onse.cloudshell.dev/`);
  console.log(`\n📋 Test URLs:`);
  console.log(`1. https://9006-cs-f787c19f-28f4-434a-ae30-74ac62a35239.cs-europe-west1-onse.cloudshell.dev/?code=TEST`);
  console.log(`2. https://9006-cs-f787c19f-28f4-434a-ae30-74ac62a35239.cs-europe-west1-onse.cloudshell.dev/?code=4/0ATX87lPv7AU2P16ogF_8K7vznek6kE3IoW-S4BWFaAyYw47iHAJ3bCZNZZR3ZQ_WmbusyA&state=22851381`);
});
