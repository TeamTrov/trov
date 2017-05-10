var express = require('express');
var server = express.Router();
var db = require('./db.js')



// routing requests from app.js
server.use(function(req, res, next) {
  console.log("APP.JS -> SERVER.JS Route Successful");
  next();
});

// creating tables in database
db.connection.query(`CREATE DATABASE IF NOT EXISTS trov;`);
db.connection.query(`USE trov;`);
db.connection.query(`CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  facebookId VARCHAR(100) UNIQUE,
  email VARCHAR(75) UNIQUE
);`);
db.connection.query(`CREATE TABLE IF NOT EXISTS trovs (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  createdBy INT,
  numberOfUsers VARCHAR(10),
  currentProgress INT,
  challenges VARCHAR(50)
);`);
db.connection.query(`CREATE TABLE IF NOT EXISTS users_trovs (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  trovId INT,
  currentChallenge INT,
  totalChallenges INT,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (trovId) REFERENCES trovs(id)
);`);
db.connection.query(`CREATE TABLE IF NOT EXISTS challenges (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  hint VARCHAR(50),
  challengeNum INT(255),
  latitude VARCHAR(100),
  longitude VARCHAR(100),
  reward VARCHAR(100)
);`);

// *** GET ALL TROVES FROM DB **
server.get('/getalltrovs', function(req, res) {
  var AllTrovs;
  db.connection.query(`use trov`);
  db.connection.query(`SELECT * FROM trovs;`,
    function(error, result) {
      if(error) {
        console.log("Error querying")
        console.log(error)
      } else {
        console.log("Success querying")
        // console.log(result);
        AllTrovs = JSON.stringify(result);
        res.end(AllTrovs);
      }
    }
  )
});

// *** UPDATE TROVE FROM DB **
server.post('/updateusertrov', function(req, res) {
  var trovName = req.body.trovName;
  var currChall = req.body.currentChallengeNum;

  db.connection.query(`use trov`);
  db.connection.query(`UPDATE trovs SET currentProgress = ${currChall} WHERE name = "${trovName}";`,
    function(error, result) {
      if(error) {
        console.log("Error querying")
      } else {
        console.log("Success updating trov!")
      }
    }
  )
  res.end();
});

// *** ADD USER **
server.post('https://localhost:3000/addnewusertodb', function(req, res) {
  // req.body.username
  var newUser = req.body.username;
  var email = req.body.email;

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
          db.connection.query(`INSERT INTO users (username, email) VALUES ("${newUser}", "${email}")`);
        } else {
          console.log("User exists!")
          // username already exist
        }
      }
    }
  )
  res.end();
});

// *** GET USER'S CURRENT TROVE **
server.get('/getuserdata', function(req, res) {
  // input: username
  // go to database
  // return current trove of user and progress
});

module.exports = server;
