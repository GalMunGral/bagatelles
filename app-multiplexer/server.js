const http = require('http');
const { exec } = require('child_process');
const express = require('express');
const cookieParser = require('cookie-parser');
const { apps } = require('./apps/manifest');

for (let { directory, command } of apps) {
  exec(`cd ${directory} && ${command}`, (error, stdout, stderr) => {
    if (error) console.log(error);
    stdout.pipe(process.stdout);
    stderr.pipe(process.stderr);
  });
}

const server = express();

server.set('view engine', 'ejs');

server.use(cookieParser());

server.get('/___index', (_, res) => {
  res.render('index', { apps });
});

server.use((req, res, next) => {  
  if (req.cookies.PORT) {
    const request = http.request({
      method: req.method,
      port: req.cookies.PORT,
      path: req.url,
      headers: req.headers,
    });
    request.on('response', response => {
      res.writeHead(
        response.statusCode,
        response.statusMessage,
        { ...response.headers, 'cache-control' : 'no-store' }
      );
      response.pipe(res);
    });
    req.pipe(request);
  } else {
    next();
  }
});

server.listen(8080, () => console.log('Listening on 8080'));
