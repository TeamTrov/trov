var express = require('express');
var app = express.Router();

//Middle ware that is specific to this app
app.use(function(req, res, next) {
  console.log("APP.JS -> SERVER.JS Route Successful");
  next();
});


// app.get('/', function(req, res) {
//   null;
// });


module.exports = app;
