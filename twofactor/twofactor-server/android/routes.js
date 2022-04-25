const express = require('express');
const fetch = require('node-fetch');
const { google } = require('googleapis');
const key = require('./service-account.json');

const PROJECT_ID = 'two-factor-ac76f';
const TAG = '[[android]]:';
var FCMaccessToken;
var TEST_DEVICE_TOKEN;

const router = express.Router();

router.post('/device-token', (req, res) => {
  if (!(req.body.token && req.body.username)) {
    res.send({ error: "Missing username/token" })
  }
  TEST_DEVICE_TOKEN = req.body.token;
  console.log(TAG, `Registered device token: ${TEST_DEVICE_TOKEN}`);
  res.send({ result: "OK" });
})

router.post('/authenticate', (req, res) => {
  if (!FCMaccessToken) {
    res.send('stupid');
  }
  fetch(`https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + FCMaccessToken
    },
    body: JSON.stringify({
      message: {
        token: TEST_DEVICE_TOKEN,
        data: {
          sessionId: 'test'
        }
      }
    })    
  })
  .then(() => res.send({ success: true }))
  .then(() => console.log('Push notification sent!'))
  .catch(err => console.log(TAG, err));
});

// Initialize
requestToken().then(token => {
  FCMaccessToken = token;
  console.log(TAG, 'Received FCM Token:', token.slice(0,6) + '...' + token.slice(-5));
});

function requestToken() {
  return new Promise((resolve, reject) => {

    const jwtClient = new google.auth.JWT(
      key.client_email, // from FCM service account
      null, // keyFile
      key.private_key, // from FCM service account
      ['https://www.googleapis.com/auth/firebase.messaging'], // scopes
      null, // ?
    );

    jwtClient.authorize((err, tokens) => {
      if (err) { reject(err); return; }
      resolve(tokens.access_token);
    });
  });
}

module.exports = router;
