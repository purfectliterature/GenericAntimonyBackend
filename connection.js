/*
connection.js
Configures and starts MySQL connection.
*/

const mysql = require("mysql");

// MySQL server connection configuration
const connection = mysql.createConnection({
    host: "localhost",
    user: "projectantimony",
    password: "projectantimony",
    database: "projectantimony"
});

// Initiate connection
connection.connect(function (error) {
    if (error) throw error;
});

module.exports = connection;