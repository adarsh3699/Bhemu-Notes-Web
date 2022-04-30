const express = require('express');
var mysql = require('mysql');
const { runQuery } = require('../helpers');

//setting express
const app = express();

//mysql databse connection
const dbConnect = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database : 'notes2'
});
dbConnect.connect(function(error) {});

app.get('/', function(req, res) {
    const username = req.query.userName;
    const password = req.query.password; 

    if (username && password) {
        runQuery(dbConnect, "SELECT * FROM users WHERE username = '"+ username +"' && password = '"+ password +"'", res, true);
    } else {
        res.status(400);
        res.send({ statusCode: 400, msg: "please provide all details"})
        return;
    }
});

app.post('/', function(req, res) {
    const username = req.body.username;
    const password = req.body.password; 

    if (username && password) {
        runQuery(dbConnect, "INSERT INTO `users` (`username`, `password`) VALUES ('"+ username +"', '"+ password +"')", res);
    } else {
        res.status(400);
        res.send({ statusCode: 400, msg: "please provide all details"})
        return;
    }
});

//exporting this file so that it can be used at other places
module.exports = app;