var express = require("express");
var db - require('./db');

// middleware
var morgan = require('morgan');
var bodyParser = require('body-parser');

// misc
var favicon = require('favicon'); //use this to add icon to webpage

// routing
var app = express();

// ports
var port = process.env.PORT || 3000;
app.listen(port);
console.log("Listening on port " + port);

// logging and parsing
app.use(morgan('dev'));
app.use(bodyParser.json());

// serving client files
app.use(express.static('src/client'));
