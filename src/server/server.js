var express = require('express');
var server = express.Router();
var db = require('./db.js');
var url = require('url');

// routing requests from app.js
server.use(function(req, res, next) {
  console.log("APP.JS -> SERVER.JS Route Successful");
  next();
});

// db.connection.query(`DROP DATABASE trov;`); // <--- comment in to reset database

// creating tables in database
db.connection.query(`CREATE DATABASE IF NOT EXISTS trov;`);
db.connection.query(`USE trov;`);
db.connection.query(`CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  facebookId VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(75) NOT NULL UNIQUE,
  isLoggedIn BOOL,
  currentChallengeNum INT NULL
);`);
db.connection.query(`CREATE TABLE IF NOT EXISTS trovs (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  createdBy VARCHAR(50),
  numberOfUsers VARCHAR(10),
  currentProgress INT
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
  reward VARCHAR(100),
  trov VARCHAR(100)
);`);



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

// *** UPDATE TROVE PROGRESS **
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

// *** ADD TROV TO (TROVLESS) USER**
server.post('/addnewusertrov', function(req, res) {
  var username = req.body.username;
  var trov = req.body.trovName;
  db.connection.query(`use trov`);
  db.connection.query(`INSERT INTO users_trovs (userId, trovId, isCurrentTrov, currentChallengeNo, totalChallengesNo) VALUES ("${username}", "${trovName}", 1, 1, 3)`,
    function(error, result) {
      if(error) {
        console.log("Error querying database (/addnewusertrov)");
      } else {
        console.log(`Success adding user's new trov`);
      }
    }
  )
  res.end();
});

// *** UPDATE USER TROV CHALLENGE NO **
server.post('/updateuserchallenge', function(req, res) {
  var nextChalNumber;
  var userId = req.body.username;
  var trovId = req.body.trovName;

  db.connection.query(`use trov`);
  db.connection.query(`SELECT currentChallengeNo FROM users_trovs WHERE userId = "${userId}" AND trovId = "${trovId}";`,
    function(error, result) {
      if(error) {
        console.log("Error querying database (/updateuserchallenge)");
      } else {
        nextChalNumber = result[0].currentChallengeNo + 1;
        db.connection.query(`UPDATE users_trovs SET currentChallengeNo = ${nextChalNumber} WHERE userId = "${userId}" AND trovId = "${trovId}";`,
          function(error, result) {
            if(error) {
              console.log('Error incrementing users_trovs')
            }
          }
        )
      }
    }
  )
  res.end();
});

// *** ADD USER **
server.post('/addnewusertodb', function(req, res) {
  var newUser = req.body.username;
  var username = req.body.username;
  var facebookId = req.body.facebookId;
  var email = req.body.email;
  db.connection.query(`use trov`);
  db.connection.query(`SELECT * FROM users WHERE username = "${username}";`,
  function(error, result) {
    if(error) {
      console.log("Error querying database (/addnewusertodb)");
    } else {
      if (result.length === 0) {
        db.connection.query(`use trov`);
        db.connection.query(`INSERT INTO users (username, facebookId, email, isLoggedIn) VALUES ("${newUser}", "${facebookId}", "${email}", true)`);
        console.log(`User "${username}" doesn't yet exist. Added user to database`)
      } else {
        console.log(`User "${username}" already exists in database!`);
      }
    }
  }
)
res.end();
});

// *** FIND LOGGED-IN USER ***
server.get('/getcurrentuser', function(req, res) {
  db.connection.query(`use trov`);
  db.connection.query('SELECT username FROM users WHERE isLoggedIn = true;',
  function(error, result) {
    if(error) {
      console.log("Error querying database (/getcurrentuser)");
    } else {
      if (result.length !== 0) {
        console.log('\nUser is found!');
        console.log(result[0].username);
        res.end(result[0].username);
      }
    }
  }
)
});

// *** LOGOUT USER ***
server.get('/logoutuser', function(req, res) {
  db.connection.query(`use trov`);
  db.connection.query('UPDATE users SET isLoggedIn=false WHERE isLoggedIn=true',
  function(error, result) {
    if(error) {
      console.log("Error querying database (/logoutuser)");
    } else {
      console.log('User is logged out!');
      res.redirect('/');
    }
  }
)
});


// *** GET USER'S CURRENT TROVE AND ALL CHALLENGES ASSOCIATED WITH THAT TROVE **
server.get('/getuserdata', function(req, res) {
  var resData = {};
  var username = req.query.id || '';
  db.connection.query(`use trov`);
  db.connection.query(`SELECT * FROM users_trovs WHERE userId = "${username}";`,
  function(error, result) {
    if(error) {
      console.log("Error querying database (/getuserdata)");
    } else {
      if (result.length !== 0) {
        resData.currTrov = result;
        db.connection.query(`select * FROM challenges WHERE trov = (SELECT trovId FROM users_trovs WHERE userId = "${username}");`,
        function(error, secondResult) {
          if(error) {
            console.log("Error querying database II (/getuserdata)");
          } else {
            resData.challenges = secondResult;
            res.end(JSON.stringify(resData));
          }
        }
      );
    } else {
      console.log(`User not currently on a trove!`);
      res.end("User not currently on a trove!");
    }
  }
}
)
});

// *** INSERTS INFORMATION INTO DATABASE -----> COMMENT IN ONLY IF NOT ALREADY IN DB ***
// db.connection.query("USE trov;");
// db.connection.query("INSERT INTO trovs (name, createdBy, numberOfUsers) VALUES ('Tahoe Trek', 'Team Trov', 0);");
// db.connection.query("INSERT INTO trovs (name, createdBy, numberOfUsers) VALUES ('Mission Meltdown', 'Team Trov', 0);");
// db.connection.query("INSERT INTO trovs (name, createdBy, numberOfUsers) VALUES ('Frisco Sunrise', 'Team Trov', 0);");
// db.connection.query("INSERT INTO trovs (name, createdBy, numberOfUsers) VALUES ('New York Minute', 'Team Trov', 0);");
// db.connection.query("INSERT INTO trovs (name, createdBy, numberOfUsers) VALUES ('Tel Aviv Beach Party', 'Team Trov', 0);");
// db.connection.query("INSERT INTO trovs (name, createdBy, numberOfUsers) VALUES ('Hack Reactor Happiness', 'Team Trov', 0);");
// db.connection.query("INSERT INTO challenges (id, name, hint, challengeNum, latitude, longitude, reward, trov) VALUES (1, 'Hacker Cabin', 'A fun cabin near Donner Lake', 1, 39.3167206, -120.2851098, null, 'Tahoe Trek');");
// db.connection.query("INSERT INTO challenges (id, name, hint, challengeNum, latitude, longitude, reward, trov) VALUES (2, 'Burger Me', 'Unforgettable old-fashioned burgers', 2, 39.517198, -119.885901, 'A free burger', 'Tahoe Trek');");
// db.connection.query("INSERT INTO challenges (id, name, hint, challengeNum, latitude, longitude, reward, trov) VALUES (3, 'Apartment Brown', 'A bachelor pad in Berkeley', 3, 37.871363, -122.279644, 'A free yogurt', 'Tahoe Trek');");
// db.connection.query("INSERT INTO challenges (id, name, hint, challengeNum, latitude, longitude, reward, trov) VALUES (4, 'Dolores Park', 'Bringing the madness to Mission', 1, 37.759617, -122.426904, null, 'Mission Meltdown');");
// db.connection.query("INSERT INTO challenges (id, name, hint, challengeNum, latitude, longitude, reward, trov) VALUES (5, 'Project Juice', 'AKA Project Squeezed Oranges', 2, 37.760307, -122.421717, null, 'Mission Meltdown');");
// db.connection.query("INSERT INTO challenges (id, name, hint, challengeNum, latitude, longitude, reward, trov) VALUES (6, 'Galleria de la Raza', 'In Italian', 3, 37.752710, -122.409420, null, 'Mission Meltdown');");
// db.connection.query("INSERT INTO challenges (id, name, hint, challengeNum, latitude, longitude, reward, trov) VALUES (7, 'Tartine Bakery', 'Place for tartine cookies', 1, 37.761418, -122.424104, null, 'Frisco Sunrise');");
// db.connection.query("INSERT INTO challenges (id, name, hint, challengeNum, latitude, longitude, reward, trov) VALUES (8, 'Urban Putt', 'Mini golfing!', 2, 37.755731, -122.416824, null, 'Frisco Sunrise');");
// db.connection.query("INSERT INTO challenges (id, name, hint, challengeNum, latitude, longitude, reward, trov) VALUES (9, 'Flour + Water', 'On 20th Street', 3, 37.758933, -122.412271, null, 'Frisco Sunrise');");
// db.connection.query("INSERT INTO challenges (id, name, hint, challengeNum, latitude, longitude, reward, trov) VALUES (10, 'Humphrey Slocombe', 'Like Bogart', 1, 37.752816, -122.417770, null, 'New York Minute');");
// db.connection.query("INSERT INTO challenges (id, name, hint, challengeNum, latitude, longitude, reward, trov) VALUES (11, 'Statue of Liberty', 'French given statue', 2, 37.792836, -122.407780, null, 'New York Minute');");
// db.connection.query("INSERT INTO challenges (id, name, hint, challengeNum, latitude, longitude, reward, trov) VALUES (12, 'Manhattan Skyline', 'Big big city', 3, 37.052886, -122.087770, null, 'New York Minute');");
// db.connection.query("INSERT INTO challenges (id, name, hint, challengeNum, latitude, longitude, reward, trov) VALUES (13, 'Dancing Camel Brewery', 'Brewery named after a desert animal', 1, 37.752816, -122.477770, null, 'Tel Aviv Beach Party');");
// db.connection.query("INSERT INTO challenges (id, name, hint, challengeNum, latitude, longitude, reward, trov) VALUES (14, 'The Clock Tower', 'National monument', 2, 37.890816, -122.087420, null, 'Tel Aviv Beach Party');");
// db.connection.query("INSERT INTO challenges (id, name, hint, challengeNum, latitude, longitude, reward, trov) VALUES (15, 'Mediterranean Beach Bonanza', 'Warmest water in the west', 3, 37.752816, -122.477770, null, 'Tel Aviv Beach Party');");
// db.connection.query("INSERT INTO challenges (id, name, hint, challengeNum, latitude, longitude, reward, trov) VALUES (16, 'Westfield Mall', 'Very big mall in SF', 1, 37.783697, -122.408966, null, 'Hack Reactor Happiness');");
// db.connection.query("INSERT INTO challenges (id, name, hint, challengeNum, latitude, longitude, reward, trov) VALUES (17, 'Freds Lecture Room', 'Place of learning', 2, 37.783697, -122.408966, null, 'Hack Reactor Happiness');");
// db.connection.query("INSERT INTO challenges (id, name, hint, challengeNum, latitude, longitude, reward, trov) VALUES (18, 'HR Kitchen', 'Yummm food', 3, 37.783697, -122.408966, null, 'Hack Reactor Happiness');");
// db.connection.query("INSERT INTO users_trovs (userId, trovId, isCurrentTrov, currentChallengeNo, totalChallengesNo) VALUES ('Brandon Lee Brown', 'Tahoe Trek', 0, 1, 3);");
// db.connection.query("INSERT INTO users_trovs (userId, trovId, isCurrentTrov, currentChallengeNo, totalChallengesNo) VALUES ('Brandon Lee Brown', 'Tahoe Trek', 0, 2, 3);");
// db.connection.query("INSERT INTO users_trovs (userId, trovId, isCurrentTrov, currentChallengeNo, totalChallengesNo) VALUES ('Brandon Lee Brown', 'Tahoe Trek', 1, 3, 3);");

module.exports = server;
