import * as functions from "firebase-functions/v2";

export const getToken = functions.https.onRequest((req, res) => {
  res.json({
    token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9." + 
           "eyJwcm9qZWN0IjoiYXJleC1sdGQtNDIxNTQzOTMtYTcwMWItZmNlOWYiLCJ1aWQiOiJ0ZXN0LXVzZXIt" + Date.now() + 
           "IiwiaWF0IjoxNzA0NTYxNjAwLCJleHAiOjE3MDQ1NjUyMDB9." +
           "test_signature",
    type: "JWT",
    expiresIn: "1h"
  });
});

export const status = functions.https.onRequest((req, res) => {
  res.json({
    status: "online",
    services: ["firebase", "functions", "hosting"],
    timestamp: new Date().toISOString()
  });
});
