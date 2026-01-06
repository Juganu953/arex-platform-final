const http = require('http');
const url = require('url');

const PORT = 9006;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Handle OAuth callback
  if (parsedUrl.query.code) {
    console.log('\n✅ OAuth Callback Received!');
    console.log('Code:', parsedUrl.query.code);
    console.log('State:', parsedUrl.query.state);
    
    // Return JSON response
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({
      success: true,
      message: "OAuth code received successfully",
      code: parsedUrl.query.code,
      state: parsedUrl.query.state,
      redirect_uri: `https://${req.headers.host}`,
      timestamp: new Date().toISOString(),
      project: "arex-ltd-42154393-a701b-fce9f"
    }, null, 2));
    return;
  }
  
  // Serve HTML page
  res.writeHead(200, { 
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Arex Platform OAuth Server</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.1);
          padding: 30px;
          border-radius: 15px;
          backdrop-filter: blur(10px);
        }
        h1 {
          margin-top: 0;
          font-size: 2.5em;
        }
        .status {
          background: rgba(255, 255, 255, 0.2);
          padding: 15px;
          border-radius: 10px;
          margin: 15px 0;
        }
        .url {
          background: rgba(0, 0, 0, 0.3);
          padding: 10px;
          border-radius: 5px;
          font-family: 'Courier New', monospace;
          word-break: break-all;
          margin: 10px 0;
        }
        .button {
          display: inline-block;
          background: #4CAF50;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          margin: 10px 5px;
          font-weight: bold;
          transition: background 0.3s;
        }
        .button:hover {
          background: #45a049;
        }
        .button.test {
          background: #2196F3;
        }
        .button.test:hover {
          background: #0b7dda;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Arex Platform OAuth Server</h1>
        <p>✅ Server is running and ready to accept OAuth callbacks</p>
        
        <div class="status">
          <h3>📊 Server Information</h3>
          <p><strong>Port:</strong> ${PORT}</p>
          <p><strong>Host:</strong> ${req.headers.host}</p>
          <p><strong>Project:</strong> arex-ltd-42154393-a701b-fce9f</p>
        </div>
        
        <div class="status">
          <h3>🔗 Your OAuth Redirect URI</h3>
          <div class="url">https://${req.headers.host}</div>
          <p>Use this URL in your Firebase OAuth configuration</p>
        </div>
        
        <div class="status">
          <h3>🧪 Test OAuth Flow</h3>
          <p>Click to simulate OAuth callback:</p>
          <a href="/?code=TEST_CODE_123&state=test_state" class="button test">
            Test with Dummy Code
          </a>
          <a href="/?code=4/0ATX87lPv7AU2P16ogF_8K7vznek6kE3IoW-S4BWFaAyYw47iHAJ3bCZNZZR3ZQ_WmbusyA&state=22851381" class="button">
            ✅ Complete OAuth with Your Code
          </a>
        </div>
        
        <div class="status">
          <h3>📡 Other Services</h3>
          <p>
            <a href="https://5000-cs-f787c19f-28f4-434a-ae30-74ac62a35239.cs-europe-west1-onse.cloudshell.dev/status.html" 
               target="_blank" class="button test">
              Open Hosting Status Page
            </a>
          </p>
          <p>
            <a href="https://us-central1-arex-ltd-42154393-a701b-fce9f.cloudfunctions.net/testSetup" 
               target="_blank" class="button test">
              Test Cloud Function
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ OAuth Server running on port ${PORT}`);
  console.log(`🌐 Cloud Shell Preview URL:`);
  console.log(`   https://9006-cs-f787c19f-28f4-434a-ae30-74ac62a35239.cs-europe-west1-onse.cloudshell.dev/`);
  console.log(`🔗 Local URL:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`\n📋 Use this as your OAuth redirect URI:`);
  console.log(`   https://9006-cs-f787c19f-28f4-434a-ae30-74ac62a35239.cs-europe-west1-onse.cloudshell.dev/`);
  console.log(`\n🚀 Test URLs:`);
  console.log(`   1. Home: https://9006-cs-f787c19f-28f4-434a-ae30-74ac62a35239.cs-europe-west1-onse.cloudshell.dev/`);
  console.log(`   2. With your code: https://9006-cs-f787c19f-28f4-434a-ae30-74ac62a35239.cs-europe-west1-onse.cloudshell.dev/?code=4/0ATX87lPv7AU2P16ogF_8K7vznek6kE3IoW-S4BWFaAyYw47iHAJ3bCZNZZR3ZQ_WmbusyA&state=22851381`);
});
