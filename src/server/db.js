var express    = require("express");
var mysql = require('mysql');
var app = express();


// establish database connection
var connection = mysql.createConnection({
  port     : 3306,
  host     : 'trov.cemgq7chalnt.us-west-1.rds.amazonaws.com',
  user     : 'teamtrov',
  password : 'teamtrov'
});


// handle database connection errors
connection.connect(function(err){
  if(!err) {
      console.log("EXTERNAL SERVER-DATABASE connected ...");
  } else {
      console.log(err);
  }
});

module.exports.connection = connection;
