#!/bin/bash

PROJECT="arex-ltd-42154393-a701b-fce9f"
ENDPOINTS=("api" "token" "hello" "getToken" "status")

echo "Testing Firebase Functions..."
echo "============================="

for endpoint in "${ENDPOINTS[@]}"; do
  URL="https://us-central1-$PROJECT.cloudfunctions.net/$endpoint"
  echo -n "$endpoint: "
  
  if curl -s -f "$URL" > /dev/null 2>&1; then
    echo "✅ ONLINE"
    curl -s "$URL" | head -c 100
    echo "..."
  else
    echo "❌ OFFLINE"
  fi
done
