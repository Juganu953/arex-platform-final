import * as functions from "firebase-functions/v2/https";

export const hello = functions.onRequest((req, res) => {
  res.json({
    message: "Hello from Arex Platform!",
    project: "arex-ltd-42154393-a701b-fce9f",
    working: true,
    timestamp: new Date().toISOString()
  });
});

export const getToken = functions.onRequest((req, res) => {
  res.json({
    token: "test-token-" + Date.now(),
    uid: "user-" + Date.now(),
    expiresIn: 3600,
    project: "arex-ltd-42154393-a701b-fce9f"
  });
});

export const status = functions.onRequest((req, res) => {
  res.json({
    status: "online",
    services: ["firebase", "functions", "hosting"],
    timestamp: new Date().toISOString()
  });
});
