var express    = require("express");
var mysql = require('mysql');
var app = express();


// establish database connection
var connection = mysql.createConnection({
  port     : 3306,
  host     : 'localhost',
  user     : 'root',
  password : ''
});


// handle database connection errors
connection.connect(function(err){
  if(!err) {
      console.log("SERVER-DATABASE connected ...");
  } else {
      console.log(err);
  }
});

function getValueOfKey(table) {
  connection.query(`SELECT ${key} FROM ${table};`,
    function(error, success) {
      if (error) {
        console.error('ADD TO DB ERROR: ' + error);
      }
    }
  );
}


module.exports.connection = connection;
