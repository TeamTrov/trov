var express = require('express');
var app = require('../app')
var db = require('./db.js');

// middleware
var bodyParser = require('body-parser');
var request = require('request');

app.use(bodyParser.json());

console.log("sss");
// server.get('/', function (req, res) {
//   res.send('CLIENT-SERVER.JS Get Request Received');
// });

app.get('/', function (req, res) {
  res.send('CLIENT-SERVER.JS Get Request Received');
});

app.post('/', function (req, res) {
  res.send('CLIENT-SERVER.JS Post Request Received');
});

// post req new user
// post req upd prog
// post req upd trov complete

// module.exports = server;
