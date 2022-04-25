const express = require('express');
const bodyParser = require('body-parser');
const android = require('./android/routes');
const ios = require('./ios/routes');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const usernameToSocket = new Map();

io.on('connection', socket => {
  socket.on('register', username => {
    console.log('registered socket for user:', username);
    usernameToSocket.set(username, socket);
  });
});

app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use('/android', android);
app.use('/ios', ios);

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/template');

app.get('/', (req, res) => {
  const username = req.query.username;
  res.render('index', { username });
});

app.post('/confirm', (req, res) => {
  console.log('CONFIRMED')
  console.log('session:', req.body.sessionId);
  const username = req.body.username;
  const socket = usernameToSocket.get(username);
  socket.emit('success');
  res.send({});
})

// Important: Call listen on HttpServer instead of Express server
// so that Socket.IO can intercept requests
http.listen(process.env.PORT || 80);
