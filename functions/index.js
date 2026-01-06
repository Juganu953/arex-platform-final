const functions = require('firebase-functions');

exports.working = functions.https.onRequest((req, res) => {
  res.json({
    success: true,
    message: "Firebase Functions are working!",
    project: "arex-ltd-42154393-a701b-fce9f",
    timestamp: new Date().toISOString()
  });
});
