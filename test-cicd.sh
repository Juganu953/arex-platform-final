#!/bin/bash

echo "Testing CI/CD Setup..."
echo "======================"

# Check if workflow file exists
if [ -f ".github/workflows/firebase-deploy.yml" ]; then
  echo "✅ GitHub Actions workflow exists"
else
  echo "❌ Workflow file missing"
fi

# Check Node version in package.json
if grep -q '"node": "20"' functions/package.json; then
  echo "✅ Node.js 20 configured"
else
  echo "❌ Node.js version not set to 20"
fi

# Check Firebase project config
if [ -f ".firebaserc" ]; then
  echo "✅ Firebase config exists"
  grep "arex-ltd" .firebaserc && echo "✅ Correct project ID"
else
  echo "❌ Firebase config missing"
fi

echo ""
echo "Next steps:"
echo "1. Add FIREBASE_TOKEN to GitHub Secrets"
echo "2. Push to GitHub to trigger first deployment"
echo "3. Monitor at: https://github.com/Juganu953/arex-platform-final/actions"
