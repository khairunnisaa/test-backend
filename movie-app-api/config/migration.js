var mysql = require('mysql');
var migration = require('mysql-migrations');
require('dotenv').config()

var connection = mysql.createPool({
   connectionLimit: 10,
   host: "localhost",
   user: "root",
   password: "",
   database: "stockbit"
});

connection.on('error', function(err) {
  console.log("[mysql error]",err);
});

function executeQuery(sql, callback) {
   connection.getConnection((err, connection) => {
      console.log("error",err);
      if (err) {
         return callback(err, null);
      } else {
         if (connection) {
            connection.query(sql, function (error, results, fields) {
               connection.release();
               if (error) {
                  return callback(error, null);
               }
               return callback(null, results);
            });
         }
      }
   });
}

function query(sql, callback) {
   executeQuery(sql, function (err, data) {
      if (err) {
         return callback(err);
      }
      callback(null, data);
   });
}

connection.getConnection((err, connection) => {
      if (err) {
         return callback(err, null);
      } else {
         console.log("success")
      }
});

migration.init(connection, __dirname + '/config/migrations');

module.exports = {
   query: query,
   connection: connection
}
