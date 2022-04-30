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

//read
app.get('/', function(req, res) {
    const userId = req.query.userId;
    if (!userId) {
        res.status(400);
        res.send({statusCode: 400, msg: "userId is not provided"});
        return;
    }

    runQuery(dbConnect, 'SELECT notesId, notesTitle FROM notes WHERE userId = ' + userId, res);
});

//create
app.post('/', function(req, res) {
    const userId = req.query.userId;
    const notesTitle = req.body.notesTitle;
    let notesType = 0;
    if (req.body.notesType) {
        notesType = req.body.notesType;
    }

    if (userId) {
        let query1;
        if (notesTitle) {
            query1 = "INSERT INTO `notes` (`userId`, `notesTitle`, `notesType`) VALUES ('" + userId + "', '" + notesTitle + "', '" + notesType + "')";
        } else {
            query1 = "INSERT INTO `notes` (userId, notesType) VALUES ('" + userId +"' , '" + notesType + "')"
        }

        //transaction start
        dbConnect.beginTransaction(function(err) {
            if (err) { 
                res.status(500);
                res.send({statusCode: 500, msg: "Something went wrong", error: err.message});
                return;
            }
            //first query run
            dbConnect.query(query1, function(err, results1) {
                if (err) { 
                    dbConnect.rollback(function() {
                        res.status(500);
                        res.send({statusCode: 500, msg: "Something went wrong", error: err.message});
                        return;
                    });
                }
                let noteId = results1?.insertId;
            
                //second query run
                dbConnect.query("INSERT INTO `notesElement` (`notesId`, `element`) VALUES ('"+ noteId +"', '')", function(err, result) {
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
                        res.send({statusCode: 200, msg: "success", noteId});
                    });
                });
            });
        });
    } else {
        res.status(400);
        res.send({statusCode: 400, msg: "Please provide all details"});
    } 
});

//delete
app.delete('/:notesId', function(req, res) {
    const notesId = req.params.notesId;
    if (!notesId) {
        res.status(400);
        res.send({statusCode: 400, msg: "notesId is not provided"});
        return;
    }

    const query1 = "DELETE FROM notes WHERE notesId = " + notesId;
    const query2 = "DELETE FROM notesElement WHERE notesId = " + notesId;

    //transaction start
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

//update
app.put('/', function(req, res) {
    const notesId = req.query.notesId;
    const notesTitle = req.body.notesTitle;
    const notesType = req.body.notesType;

    if (!notesId) {
        res.status(400);
        res.send({statusCode: 400, msg: "notesId is not provided"});
        return;
    }

    if (!notesTitle && !notesType) {
        res.status(200);
        res.send({statusCode: 200, msg: "no key updated"});
        return;
    }

    let query = "UPDATE `notes` SET ";
    if (notesTitle && notesType) {
        query += "`notesTitle` = '" + notesTitle + "', `notesType` = '" + notesType;
    } else if (notesTitle) {
        query += "`notesTitle` = '" + notesTitle;
    } else if(notesType) {
        query += "`notesType` = '" + notesType;
    }
    query += "' WHERE notesId = " + notesId;

    runQuery(dbConnect, query, res);
});

//CRUD

//exporting this file so that it can be used at other places
module.exports = app;