const http2 = require('http2');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const privateKey = fs.readFileSync(__dirname + '/AuthKey_PZQK85QBM4.p8');
const { keyId, teamId } = require('./config');
const payload = { iss: teamId };
const options = { algorithm: 'ES256', keyid: keyId };
const TAG = '[[ios]]:';

const jwtToken = (() => {
  const token = jwt.sign(payload, privateKey, options);  // string
  console.log(TAG, 'JWT token generated:', token.slice(0,5) + '...' + token.slice(-5));
  console.log(TAG, 'JWT token decoded:', jwt.decode(token, options));
  return token;
})();

const client = http2.connect('https://api.development.push.apple.com:443')
  .on('error', (err) => console.error(err));

const router = express.Router();
router.use(bodyParser.json());

var TEST_DEVICE_TOKEN;

router.post('/device-token', (req, res) => {
  TEST_DEVICE_TOKEN = req.body.token;
  console.log(TAG, 'Registered device token');
});

router.post('/authenticate', (req, res) => {
  const h2Request = client.request({
    ':method': 'POST',
    ':scheme': 'https',
    ':path': `/3/device/${TEST_DEVICE_TOKEN}`,
    'authorization': 'bearer ' + jwtToken,
    'apns-priority': '10',
    'apns-topic': 'edu.gatech.wenqi.twofactor',
    'apns-collapse-id': 'test'
  });
  h2Request.setEncoding('utf8');
  let buffer = '';
  h2Request.on('data', chunk => buffer += chunk);
  h2Request.on('end', () => {
    res.send({ res: buffer });
    console.log('Response sent:', buffer);
  });
  h2Request.end(JSON.stringify({
    'aps': {
      'alert': {
        'title': 'Two-Factor Authentication',
        'body': 'Confirm login request'
      },
      'badge': 10,
      'category': 'CONFIRMATION'
    }
  }));
});

module.exports = router;
