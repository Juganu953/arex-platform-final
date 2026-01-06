import * as functions from "firebase-functions/v2";

export const hello = functions.https.onRequest((req, res) => {
  res.json({
    message: "Hello from Arex Platform!",
    project: "arex-ltd-42154393-a701b-fce9f",
    working: true,
    timestamp: new Date().toISOString()
  });
});
