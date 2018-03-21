var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = 8080;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());

// serve static pages
app.post('/analytics', function(req, res){
    console.log(req.body);
    res.send('Hello World!');
});

var server = app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});