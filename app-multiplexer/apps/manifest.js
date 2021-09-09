const path = require('path');

module.exports = {
  apps: [
    {
      id: 'respotify',
      port: 3001,
      directory: path.resolve(__dirname, 'respotify'),
      command: './run.sh'
    },
    {
      id: 'notube',
      port: 3002,
      directory: path.resolve(__dirname, 'notube'),
      command: './run.sh'
    },
  ]
}
