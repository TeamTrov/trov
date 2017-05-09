var express = require('express');
var server = express.Router();
var db = require('./db.js')



// routing requests from app.js
server.use(function(req, res, next) {
  console.log("APP.JS -> SERVER.JS Route Successful");
  next();
});


server.get('/getalltrovs', function(req, res) {

  var AllTrovs = [];

  db.connection.query(`use trov`);
  db.connection.query(`SELECT * FROM trovs;`,
    function(error, result) {
      if(error) {
        console.log("Error querying")
      } else {
        console.log("Success querying")
        console.log(result);
        AllTrovs = result;
      }
    }
  )
  res.end();
});
// *** SELECT TROVE **

server.post('/', function(req, res) {
  // info posted: troveName
  // go into db
  // get troveName info from trovs db
  console.log('select trove')
});


// *** FINISH CHALLENGE **

server.post('/', function(req, res) {
  // info posted: challengeFinished
  // go into db
  // change challenges
  console.log('finish challenge')
});


// *** COMPLETE TROV **

server.post('/', function(req, res) {
  // info posted: trovFinished
  // go into db
  // change trovs
  console.log('complete trov')
});


// *** ADD USER **

server.post('https://localhost:3000/addnewusertodb', function(req, res) {
  // req.body.username
  var newUser = req.body.username;
  var email = req.body.email;
  var location = req.body.location;

  db.connection.query(`use trov`);
  db.connection.query(`SELECT * FROM users WHERE username = "${newUser}";`,
    function(error, result) {
      if(error) {
        console.log("Error querying")
      } else {
        if (result.length === 0) {
          // username doesn't exist
          console.log("User doesn't exist!")
          db.connection.query(`use trov`);
          db.connection.query(`INSERT INTO users (username, email, location) VALUES ("${newUser}", "${email}", "${location}")`);
        } else {
          console.log("User exists!")
          // username already exist
        }
      }
    }
  )
  res.end();
});

module.exports = server;
