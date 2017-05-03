var express = require('express');
var server = express();
var bodyParser = require('body-parser');
var db = require('./db.js');
var request = require('request');

server.use(bodyParser.json());

server.get('/', function (req, res) {
  res.send('CLIENT-SERVER.JS Get Request Received');
});

server.post('/', function (req, res) {
  res.send('CLIENT-SERVER.JS Post Request Received');
});

module.exports.server = server;
