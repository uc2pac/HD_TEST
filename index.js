var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var appRoot = path.resolve(__dirname);
var lzString = require('./utils/lzString');
var app = express();

var port = process.env.PORT || 8080;

var tempStorage = [];
var SOCKET_CONSTANTS = {
  SEND_DATA: 'send_socket_data'
};

app.use(express.static('public'));

app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(bodyParser.text({limit: '50mb'}));

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
app.post('/analytics', function(req, res) {
  var decoded = decodeURIComponent(req.body);
  var decompressed = lzString.decompressFromBase64(decoded);

  pushToStorage(decompressed, 'post or beacon');

  res.status(200).send(decompressed);
});

app.get('/worker/:name', (req, res) => {
  res.sendFile(`${appRoot}/worker/${req.params.name}`);
});

app.get('/analytics/:name', function(req, res) {
  var decoded = decodeURIComponent(req.query.x);
  var decompressed = lzString.decompressFromBase64(decoded);

  pushToStorage(decompressed, 'pixel');
  
  res.status(204).send();
});

var server = app.listen(port, function() {
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