var express = require('express');
var bodyParser = require('body-parser');
var lzString = require('./utils/lzString');
var app = express();

var port = process.env.PORT || 8080;

var tempStorage = [];
var SOCKET_CONSTANTS = {
  SEND_DATA: 'send_socket_data'
};

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());

function pushToStorage(data, whereFrom) {
  console.log('Comes from ' + whereFrom + ':');
  console.dir(JSON.parse(data), {depth: null, colors: true});
}

function getWhereFrom(req) {
  switch (req.method) {
    case 'GET':
      return req.params.name;
    case 'POST':
      return 'post';
    default:
      return '';
  }
}

// serve static pages
app.post('/analytics', function(req, res){
  const decoded = decodeURIComponent(req.body);
  const decompressed = lzString.decompressFromBase64(decoded);
  pushToStorage(decompressed, getWhereFrom(req));
  res.status(200).send(decompressed);
});

app.get('/analytics/:name', function(req, res){
  const decoded = decodeURIComponent(req.query.x);
  const decompressed = lzString.decompressFromBase64(decoded);
  pushToStorage(decompressed, getWhereFrom(req));
  res.status(204).send({});
});

const server = app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

const io = require('socket.io')(server);

io.on('connection', function (socket) {

  socket.on(SOCKET_CONSTANTS.SEND_DATA, function (data) {
    const decoded = decodeURIComponent(data);
    const decompressed = lzString.decompressFromBase64(decoded);
    pushToStorage(decompressed, 'Socket');
  });

  socket.on('disconnect', function () {
    // do smth here on disconnect
  });
});