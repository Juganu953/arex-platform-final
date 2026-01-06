#!/bin/bash

# Your OAuth code
CODE="4/0ATX87lPv7AU2P16ogF_8K7vznek6kE3IoW-S4BWFaAyYw47iHAJ3bCZNZZR3ZQ_WmbusyA"

# Get client ID from Firebase config (you'll need to find this)
# Check for firebase config in your project
CLIENT_ID=""
if [ -f "src/firebase-config.js" ]; then
    CLIENT_ID=$(grep -o "projectId.*" src/firebase-config.js | cut -d'"' -f2)
fi

if [ -z "$CLIENT_ID" ]; then
    echo "Getting OAuth client ID from metadata..."
    # Try to get from Google metadata
    CLIENT_ID=$(curl -s "http://metadata.google.internal/computeMetadata/v1/project/attributes/firebase-client-id" -H "Metadata-Flavor: Google" 2>/dev/null || echo "")
fi

if [ -z "$CLIENT_ID" ]; then
    echo "Enter your Firebase Web Client ID:"
    read CLIENT_ID
fi

echo "Exchanging code for tokens..."
echo "Code: $CODE"
echo "Client ID: $CLIENT_ID"

# Exchange code for tokens
curl -X POST https://oauth2.googleapis.com/token \
  -d "code=$CODE" \
  -d "client_id=$CLIENT_ID" \
  -d "redirect_uri=http://localhost:9006" \
  -d "grant_type=authorization_code"
