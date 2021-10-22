var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 1000,
    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE
});

module.exports = pool;