const express = require('express');
const { md5Hash } = require("../encryptionUtil");

//setting express
const app = express();

//mongo databse connection
var dbConnect = require('monk')('mongodb://localhost/bhemu-notes');
var usersTable = dbConnect.get('users');

// read
app.get('/', async function(req, res) {
    const username = req.query.userName;
    const password = md5Hash(req.query.password); 

    if (username && password) {
        const queryResp = await usersTable.find({ username, password }, {_id:0});
        res.status(200);
        res.send({ statusCode: 200, msg: "success", data: queryResp})
    } else {
        res.status(400);
        res.send({ statusCode: 400, msg: "please provide all details"})
        return;
    }
});

app.post('/', async function(req, res) {
    const username = req.body.username;
    const password = md5Hash(req.body.password); 

    if (username && password) {
        const queryResp = await usersTable.insert({ username, password });
        res.status(200);
        res.send({ statusCode: 200, msg: "Inserted", data: queryResp})
    } else {
        res.status(400);
        res.send({ statusCode: 400, msg: "please provide all details"})
        return;
    }
});

//exporting this file so that it can be used at other places
module.exports = app;