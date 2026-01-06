import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

// Initialize Firebase Admin with service account
try {
  // Try to use service account key if it exists
  const keyPath = path.join(__dirname, '../../firebase-admin-key.json');
  if (fs.existsSync(keyPath)) {
    const serviceAccount = require(keyPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Initialized with service account key');
  } else {
    // Fall back to default credentials
    admin.initializeApp();
    console.log('Initialized with default credentials');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  admin.initializeApp();
}

/**
 * Test endpoint
 */
export const testSetup = functions.https.onRequest(async (req, res) => {
  res.json({
    status: "OK",
    projectId: process.env.GOOGLE_CLOUD_PROJECT || "arex-ltd-42154393-a701b-fce9f",
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
    message: "Firebase Functions are working!",
    oauthServer: "https://9006-cs-f787c19f-28f4-434a-ae30-74ac62a35239.cs-europe-west1-onse.cloudshell.dev/",
    authMethod: admin.app().options.credential ? "Service Account" : "Default"
  });
});

/**
 * Generate Firebase token (fixed version)
 */
export const getDevToken = functions.https.onRequest(async (req, res) => {
  try {
    const auth = admin.auth();
    const uid = "test-user-" + Date.now();
    
    console.log(`Creating token for uid: ${uid}`);
    
    // Try to create custom token
    const customToken = await auth.createCustomToken(uid);
    
    res.json({
      success: true,
      token: customToken,
      uid: uid,
      projectId: admin.app().options.projectId,
      note: "Use signInWithCustomToken() with this token"
    });
  } catch (error: any) {
    console.error('Error creating token:', error);
    
    // Provide helpful error message
    let errorMessage = error.message;
    if (error.message.includes('signBlob')) {
      errorMessage = "Service account missing 'Service Account Token Creator' role. Run: gcloud projects add-iam-policy-binding [PROJECT] --member='serviceAccount:firebase-admin@[PROJECT].iam.gserviceaccount.com' --role='roles/iam.serviceAccountTokenCreator'";
    }
    
    res.status(500).json({ 
      error: errorMessage,
      code: error.code,
      solution: "See https://firebase.google.com/docs/auth/admin/create-custom-tokens"
    });
  }
});

/**
 * Exchange OAuth code for Firebase token
 */
export const exchangeOAuthCode = functions.https.onCall(async (data, context) => {
  const code = data?.code;
  
  if (!code) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'OAuth code is required'
    );
  }
  
  try {
    const auth = admin.auth();
    const uid = `oauth-user-${Date.now()}`;
    const customToken = await auth.createCustomToken(uid);
    
    return {
      success: true,
      token: customToken,
      uid: uid,
      codeReceived: code.substring(0, 30) + "...",
      note: "Call signInWithCustomToken() with this token"
    };
  } catch (error: any) {
    console.error('Error in exchangeOAuthCode:', error);
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Error creating token'
    );
  }
});

/**
 * Simple OAuth validation endpoint
 */
export const validateOAuth = functions.https.onRequest(async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    res.json({
      valid: false,
      message: "No code provided",
      usage: "Add ?code=YOUR_OAUTH_CODE to validate"
    });
    return;
  }
  
  // Just validate that we received a code
  res.json({
    valid: true,
    code: typeof code === 'string' ? code.substring(0, 30) + "..." : "Invalid",
    length: typeof code === 'string' ? code.length : 0,
    timestamp: new Date().toISOString(),
    nextStep: "Use this code with exchangeOAuthCode function"
  });
});
