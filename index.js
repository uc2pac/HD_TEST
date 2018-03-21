var express = require('express');
var bodyParser = require('body-parser');
var lzString = require('./utils/lzString');
var app = express();
var port = 8080;

var tempStorage = [];

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());

function pushToStorage(data) {
  console.dir(JSON.parse(data), {depth: null, colors: true});
}

// serve static pages
app.post('/analytics', function(req, res){
  var decoded = decodeURIComponent(req.body);
  var decompressed = lzString.decompressFromBase64(decoded);

  pushToStorage(decompressed);

  res.status(200).send(decompressed);
});

var server = app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});