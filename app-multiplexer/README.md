## A simple reverse proxy for multiple servers
Configuration file: apps/manifest.js
```js
module.exports = {
  apps: [
    {
      id: 'respotify', // Any unique string, index.html will be generated correspondingly
      port: 3001, // Server port (local, server should listen on 127.0.0.1)
      directory: path.resolve(__dirname, 'respotify'), // Server directory
      command: './run.sh' // Command to start the server process
    },
  ]
}
```
