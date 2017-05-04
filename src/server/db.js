var mysql = require('mysql');
var sequelize = require('sequelize');

// establish connection
var connection = mysql.createConnection({
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'trov'
});

// establish connection error instance
connection.connect((err) => {
  if(err) {
    console.error("ERROR connecting to database!")
  } else {
    console.log('DATABASE connection established');
  }
});

module.exports.connection = connection;
