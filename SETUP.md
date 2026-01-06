# Arex Platform Setup Guide

## Firebase Functions Setup

### 1. Service Account Configuration

**DO NOT COMMIT** the actual `firebase-service-account.json` file to GitHub.

Instead:
1. Get your service account key from Google Cloud Console
2. Encode it to base64: `cat firebase-service-account.json | base64 -w 0`
3. Add as GitHub Secret: `GOOGLE_APPLICATION_CREDENTIALS_JSON`

### 2. Firebase Token

1. Generate CI token: `firebase login:ci`
2. Add as GitHub Secret: `FIREBASE_TOKEN`

### 3. GitHub Secrets Required

Add these at: https://github.com/Juganu953/arex-platform-final/settings/secrets/actions

- `FIREBASE_TOKEN`: Firebase deployment token
- `GOOGLE_APPLICATION_CREDENTIALS_JSON`: Base64 encoded service account key

### 4. Local Development

Copy `firebase-service-account-SAMPLE.json` to `firebase-service-account.json`
and fill in your actual credentials (keep it in .gitignore).

