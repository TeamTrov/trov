var mysql = require('mysql');
var sequelize = require('sequelize');

var connection = mysql.createConnection({
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'trov'
});

connection.connect((err) => {
  if(err) {
    console.error(error)
  } else {
    console.log('DATABASE connection established');
  }
});

module.exports.connection = connection;
