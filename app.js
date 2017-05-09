var express = require("express");
var app = express();

// middleware
var morgan = require('morgan');
var bodyParser = require('body-parser');
var favicon = require('favicon'); //use this to add icon to webpage
app.use(morgan('dev'));
app.use(bodyParser.json());

// ports
var port = process.env.PORT || 3000;
app.listen(port);
console.log("Listening on port " + port);

// routing to server
var server = require('./src/server/server.js');
app.use('/', server);

// serving client files
app.use(express.static('src/client'));

module.exports = app;
