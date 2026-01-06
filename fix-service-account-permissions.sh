#!/bin/bash

PROJECT_ID="arex-ltd-42154393-a701b-fce9f"
SERVICE_ACCOUNT="arex-functions-sa@${PROJECT_ID}.iam.gserviceaccount.com"

echo "Fixing permissions for: $SERVICE_ACCOUNT"

# Add the specific permission needed for creating tokens
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/iam.serviceAccountTokenCreator" \
  --quiet

# Add Firebase Admin role
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/firebase.admin" \
  --quiet

# Add Cloud Functions Invoker role (so functions can be called)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/cloudfunctions.invoker" \
  --quiet

echo "✅ Permissions updated"
echo ""
echo "Current roles for $SERVICE_ACCOUNT:"
gcloud projects get-iam-policy $PROJECT_ID \
  --flatten="bindings[].members" \
  --format="table(bindings.role)" \
  --filter="bindings.members:serviceAccount:$SERVICE_ACCOUNT"
