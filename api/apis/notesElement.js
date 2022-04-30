const express = require('express');
var mysql = require('mysql');
const { runQuery, mySQLRealEscapeString } = require('../helpers');

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
    const notesId =  req.query.notesId;
    if (!notesId) {
        res.status(400);
        res.send({statusCode: 400, msg: "notesId not provided"});
        return;
    }
    const query = ` SELECT notesElement.*, notes.notesTitle, notes.notesType FROM notesElement INNER JOIN notes WHERE notes.notesId = ` + notesId + ` AND notesElement.notesId = ` + notesId;
    runQuery(dbConnect, query, res);
});

app.post('/', function(req, res) {
    const notesId = req.query.notesId;
    const element = req.body.element;
    if (!notesId || !element) {
        res.status(400);
        res.send({statusCode: 400, msg: "Please provide all details"});
        return;
    }
    runQuery(dbConnect, "INSERT INTO `notesElement` (`notesId`, `element`) VALUES ('"+ notesId +"', '"+ element +"')", res);
})

app.delete('/', function(req, res) {
    const elementId = req.query.elementId;
    if (!elementId) {
        res.status(400);
        res.send({statusCode: 400, msg: "elementId not provided"});
        return;
    }
    runQuery(dbConnect, "DELETE FROM `notesElement` WHERE `notesElement`.`elementId` =" + elementId, res);
})

app.put('/', function(req, res) {
    const notesId = req.query.notesId; 
    const element = mySQLRealEscapeString(req.body.element);
    console.log("element", element)
    const isDone = req.body.isDone;
    
    if (!notesId || (!element && !isDone)) {
        res.status(400);
        res.send({statusCode: 400, msg: "Please provide all details"});
        return;
    }

    let query = "UPDATE `notesElement` SET ";
    if (isDone && element) {
        query += "`element` = '"+ element +"', `isDone` = '"+ isDone;
    } else if (isDone) {
        query += "`isDone` = '"+ isDone;
    } else if (element) {
        query += "`element` = '"+ element;
    }
    query += "' WHERE `notesElement`.`notesId` = "+ notesId;

    runQuery(dbConnect, query , res);
});

app.post('/save', function(req, res) {
    const notesId = req.query.notesId;
    const element = mySQLRealEscapeString(req.body.element);
    console.log("element", element)
    if (!notesId || !element) {
        res.status(400);
        res.send({statusCode: 400, msg: "Please provide all details"});
        return;
    }

    const query1 = "DELETE FROM notesElement WHERE notesId = " + notesId;
    let query2 = "INSERT INTO `notesElement` (`notesId`, `element`, isDone) VALUES"

    for(let i = 0; i < element.length; i++) {
        query2 += ( i === 0 ? "" : ", " ) + "('"+ notesId +"', '"+ element[i]?.element +"', '"+ element[i]?.isDone +"')"
    }

    // transaction start
    dbConnect.beginTransaction(function(err) {
        if (err) {
            res.status(500);
            res.send({statusCode: 500, msg: "Something went wrong", error: err.message});
            return;
        }

        //first query run
        dbConnect.query(query1, function(err, result) {
            if (err) { 
                dbConnect.rollback(function() {
                    res.status(500);
                    res.send({statusCode: 500, msg: "Something went wrong", error: err.message});
                    return;
                });
            }
        
            //second query run
            dbConnect.query(query2, function(err, result) {
                if (err) { 
                    dbConnect.rollback(function() {
                        res.status(500);
                        res.send({statusCode: 500, msg: "Something went wrong", error: err.message});
                        return;
                    });
                }
                
                //query run commit
                dbConnect.commit(function(err) {
                    if (err) { 
                        dbConnect.rollback(function() {
                            res.status(500);
                            res.send({statusCode: 500, msg: "Something went wrong", error: err.message});
                            return;
                        });
                    }

                    //success
                    res.status(200);
                    res.send({statusCode: 200, msg: "success"});
                });
            });
        });
    });
});

//exporting this file so that it can be used at other places
module.exports = app;