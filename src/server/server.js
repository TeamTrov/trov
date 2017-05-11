var express = require('express');
var server = express.Router();
var db = require('./db.js')

// routing requests from app.js
server.use(function(req, res, next) {
  console.log("APP.JS -> SERVER.JS Route Successful");
  next();
});

// creating tables in database
// db.connection.query(`DROP DATABASE trov;`);
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
  createdBy VARCHAR(50),
  numberOfUsers VARCHAR(10),
  currentProgress INT,
  challenges VARCHAR(50)
);`);
db.connection.query(`CREATE TABLE IF NOT EXISTS users_trovs (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  userId VARCHAR(50),
  trovId VARCHAR(50),
  isCurrentTrov BOOL DEFAULT false,
  currentChallengeNo INT,
  totalChallengesNo INT
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

// test data
// db.connection.query(`USE trov;`);
// db.connection.query(`INSERT INTO users (username, facebookId, email) VALUES ('jholtz', 'jjjholtz', 'jazz@gmail.com');`);
// db.connection.query(`INSERT INTO users (username, facebookId, email) VALUES ('dholtz', 'dddholtz', 'dazz@gmail.com');`);
// db.connection.query(`INSERT INTO trovs (name, createdBy, numberOfUsers, currentProgress, challenges) VALUES ('Mission Madness', 'dholtz', 2, 0, '[1, 2, 3]');`);
// db.connection.query(`INSERT INTO trovs (name, createdBy, numberOfUsers, currentProgress, challenges) VALUES ('Kalua Kraziness', 'jholtz', 1, 0, '[4, 5, 6]');`);
// db.connection.query(`INSERT INTO users_trovs (userId, trovId, isCurrentTrov, currentChallengeNo, totalChallengesNo) VALUES ('jholtz', 'Mission Madness', false, 10, 10);`);
// db.connection.query(`INSERT INTO users_trovs (userId, trovId, isCurrentTrov, currentChallengeNo, totalChallengesNo) VALUES ('jholtz', 'Kalua Kraziness', true, 1, 10);`);

// *** GET ALL TROVES FROM DB **
server.get('/getalltrovs', function(req, res) {
  var AllTrovs;
  db.connection.query(`use trov`);
  db.connection.query(`SELECT * FROM trovs;`,
    function(error, result) {
      if(error) {
        console.log("Error querying database (/getalltrovs)");
      } else {
        console.log("Success querying");
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
  var currentChallengeNum = req.body.currentChallengeNum;
  db.connection.query(`use trov`);
  db.connection.query(`UPDATE trovs SET currentProgress = ${currentChallengeNum} WHERE name = "${trovName}";`,
    function(error, result) {
      if(error) {
        console.log("Error querying database (/updateusertrov)");
      } else {
        console.log(`Success updating trov: ${trovName}`);
      }
    }
  )
  res.end();
});

// *** ADD USER **
server.post('/addnewusertodb', function(req, res) {
  var username = req.body.username;
  var facebookId = req.body.facebookId;
  var email = req.body.email;
  db.connection.query(`use trov`);
  db.connection.query(`SELECT * FROM users WHERE username = "${username}";`,
    function(error, result) {
      if(error) {
        console.log("Error querying database (/addnewusertodb)")
      } else {
        if (result.length === 0) {
          db.connection.query(`use trov`);
          db.connection.query(`INSERT INTO users (username, facebookId, email) VALUES ("${username}", "${facebookId}", "${email}")`);
          console.log(`User "${username}" doesn't yet exist. Added user to database`)
        } else {
          console.log(`User "${username}" already exists in database!`);
        }
      }
    }
  )
  res.end();
});

// *** GET USER'S CURRENT TROVE **
server.get('/getusertrovdata', function(req, res) {
  var trovData;
  var username = "jholtz"; // needs to be updated
  db.connection.query(`use trov`);
  db.connection.query(`SELECT * FROM users_trovs WHERE userId = "${username}" AND isCurrentTrov = true;`,
    function(error, result) {
      if(error) {
        console.log("Error querying database (/getusertrovdata)");
      } else {
        if (result.length !== 0) {
          trovData = JSON.stringify(result);
          res.end(trovData);
        } else {
          console.log(`User not currently on a trove!`);
        }
      }
    }
  )
});

module.exports = server;
