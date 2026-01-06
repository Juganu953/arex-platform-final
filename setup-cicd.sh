#!/bin/bash

echo "Setting up CI/CD for arex-platform-final"

# Get Firebase token
echo "1. Getting Firebase CI token..."
TOKEN=$(firebase login:ci --no-localhost 2>/dev/null | grep "firebase" | head -1)
if [ -z "$TOKEN" ]; then
    echo "   Run manually: firebase login:ci"
    echo "   Then copy the token and add to GitHub Secrets as FIREBASE_TOKEN"
else
    echo "   Token obtained: ${TOKEN:0:20}..."
fi

# Create workflow file
echo "2. Creating GitHub Actions workflow..."
mkdir -p .github/workflows

cat > .github/workflows/firebase-deploy.yml << 'WORKFLOW'
name: Deploy to Firebase
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Firebase CLI
        run: npm install -g firebase-tools
        
      - run: cd functions && npm ci
      - run: cd functions && npm run build
      
      - name: Deploy
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        run: firebase deploy --token "\${{ secrets.FIREBASE_TOKEN }}" --project "arex-ltd-42154393-a701b-fce9f"
WORKFLOW

echo "3. Files created:"
echo "   - .github/workflows/firebase-deploy.yml"
echo ""
echo "4. Next steps:"
echo "   a) Add FIREBASE_TOKEN to GitHub Secrets"
echo "   b) Push this workflow file to GitHub"
echo "   c) Future pushes to main branch will auto-deploy"
echo ""
echo "5. To deploy now:"
echo "   git add .github/"
echo "   git commit -m 'Add CI/CD workflow'"
echo "   git push origin main"
