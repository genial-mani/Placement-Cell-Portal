const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost', 
  user: 'root', 
  password: 'Manikanta@31', 
  database: 'placement_portal',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});

module.exports = connection;
