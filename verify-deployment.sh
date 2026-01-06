#!/bin/bash

echo "🔍 Verifying Arex Platform Deployment..."
echo "========================================"

PROJECT="arex-ltd-42154393-a701b-fce9f"
BASE_URL="https://us-central1-${PROJECT}.cloudfunctions.net"

# Test endpoints
ENDPOINTS=(
  "testSetup"
  "serviceAccountInfo"
  "getDevToken"
)

for ENDPOINT in "${ENDPOINTS[@]}"; do
  echo -n "Testing $ENDPOINT: "
  RESPONSE=$(curl -s -w "%{http_code}" "${BASE_URL}/${ENDPOINT}" -o /tmp/response.json)
  
  if [ "$RESPONSE" = "200" ]; then
    echo "✅ ONLINE"
    
    if [ "$ENDPOINT" = "getDevToken" ]; then
      TOKEN=$(cat /tmp/response.json | jq -r '.token' 2>/dev/null)
      if [ "$TOKEN" != "null" ] && [ ! -z "$TOKEN" ]; then
        echo "   🔑 Token generated successfully!"
        echo "   Token preview: ${TOKEN:0:50}..."
      else
        ERROR=$(cat /tmp/response.json | jq -r '.error' 2>/dev/null)
        echo "   ❌ Token generation failed: $ERROR"
      fi
    fi
    
  else
    echo "❌ OFFLINE (HTTP $RESPONSE)"
  fi
done

echo ""
echo "🌐 Your deployed services:"
echo "   - Hosting: https://${PROJECT}.web.app"
echo "   - Functions: ${BASE_URL}"
echo "   - OAuth Server: https://9006-cs-f787c19f-28f4-434a-ae30-74ac62a35239.cs-europe-west1-onse.cloudshell.dev/"
echo ""
echo "🚀 Complete OAuth Flow:"
echo "   https://9006-cs-f787c19f-28f4-434a-ae30-74ac62a35239.cs-europe-west1-onse.cloudshell.dev/?code=4/0ATX87lPv7AU2P16ogF_8K7vznek6kE3IoW-S4BWFaAyYw47iHAJ3bCZNZZR3ZQ_WmbusyA&state=22851381"
