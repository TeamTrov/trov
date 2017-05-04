var express = require('express');
var server = express.Router();
var db = require('./db.js')

// routing requests from app.js
server.use(function(req, res, next) {
  console.log("APP.JS -> SERVER.JS Route Successful");
  next();
});

// express get route commented out for now:

// server.get('/', function(req, res) {
//   console.log('home page')
// });


module.exports = server;
