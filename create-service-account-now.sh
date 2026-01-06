#!/bin/bash

PROJECT_ID="arex-ltd-42154393-a701b-fce9f"
SERVICE_ACCOUNT_NAME="arex-functions-sa"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
KEY_FILE="firebase-service-account.json"

echo "🚀 Creating service account for project: $PROJECT_ID"

# Check if we have permissions
echo "1. Checking permissions..."
gcloud projects describe $PROJECT_ID --format="value(projectNumber)" || {
  echo "❌ Cannot access project. You might need:"
  echo "   - Owner role on the project"
  echo "   - Or ask project owner to run this script"
  exit 1
}

# Create service account
echo "2. Creating service account: $SERVICE_ACCOUNT_NAME"
if ! gcloud iam service-accounts describe $SERVICE_ACCOUNT_EMAIL --project=$PROJECT_ID 2>/dev/null; then
  gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
    --display-name="Arex Platform Functions Service Account" \
    --project=$PROJECT_ID
  echo "✅ Service account created"
else
  echo "⚠️  Service account already exists"
fi

# Grant necessary roles
echo "3. Granting roles to service account..."
ROLES=(
  "roles/iam.serviceAccountTokenCreator"
  "roles/cloudfunctions.developer"
  "roles/firebase.sdkAdminServiceAgent"
  "roles/logging.logWriter"
  "roles/monitoring.metricWriter"
)

for ROLE in "${ROLES[@]}"; do
  echo "   - Granting $ROLE"
  gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="$ROLE" \
    --condition=None \
    --quiet 2>/dev/null || echo "   ⚠️  Could not grant $ROLE (might already have it)"
done

# Create key file
echo "4. Creating service account key..."
if [ -f "$KEY_FILE" ]; then
  echo "⚠️  Key file already exists. Creating backup..."
  mv "$KEY_FILE" "$KEY_FILE.backup.$(date +%s)"
fi

gcloud iam service-accounts keys create $KEY_FILE \
  --iam-account=$SERVICE_ACCOUNT_EMAIL \
  --project=$PROJECT_ID

if [ $? -eq 0 ] && [ -f "$KEY_FILE" ]; then
  echo "✅ Key file created: $KEY_FILE"
  echo ""
  echo "📋 Service Account Details:"
  echo "   Email: $SERVICE_ACCOUNT_EMAIL"
  echo "   Project: $PROJECT_ID"
  echo "   Key File: $KEY_FILE"
  echo ""
  echo "🔐 Add to GitHub Secrets as GOOGLE_APPLICATION_CREDENTIALS_JSON"
else
  echo "❌ Failed to create key file"
  echo "   You might need to create key manually in Google Cloud Console:"
  echo "   https://console.cloud.google.com/iam-admin/serviceaccounts/details/$SERVICE_ACCOUNT_EMAIL/keys?project=$PROJECT_ID"
fi
