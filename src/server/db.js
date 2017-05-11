var express    = require("express");
var mysql = require('mysql');
var app = express();


// establish remote database connection
var connection = mysql.createConnection({
  port     : 3306,
  host     : 'trov.cemgq7chalnt.us-west-1.rds.amazonaws.com',
  user     : 'teamtrov',
  password : 'teamtrov'
});

// establish local database connection (for test use)
// var connection = mysql.createConnection({
//   port     : 3306,
//   host     : 'localhost',
//   user     : 'root',
//   password : ''
// });


// handle database connection errors
connection.connect(function(err){
  if(!err) {
    if (connection.config.host === 'localhost') {
      console.log("LOCAL SERVER-DATABASE connected ...");
    } else {
      console.log("EXTERNAL SERVER-DATABASE connected ...");
    }
  } else {
      console.log("ERROR CONNECTING TO DB (db.js)", err);
  }
});

module.exports.connection = connection;
