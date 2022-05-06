const express = require('express');
const { runQuery, mySQLRealEscapeString } = require('../helpers');

//setting express
const app = express();

//mongo databse connection
var dbConnect = require('monk')('mongodb://localhost/bhemu-notes');
var notesElementTable = dbConnect.get('notesElement');

//get
app.get('/', async function(req, res) {
    const notesId =  req.query.notesId;
    if (!notesId) {
        res.status(400);
        res.send({statusCode: 400, msg: "notesId not provided"});
        return;
    }
    const queryResp = await notesElementTable.find({ notesId });
    res.status(200);
    res.send({ statusCode: 200, msg: "success", data: queryResp})

    // const query = ` SELECT notesElement.*, notes.notesTitle, notes.notesType FROM notesElement INNER JOIN notes WHERE notes.notesId = ` + notesId + ` AND notesElement.notesId = ` + notesId;
    // runQuery(dbConnect, query, res);
});

//insert
app.post('/', async function(req, res) {
    const notesId = req.query.notesId;
    const element = req.body.element;
    if (!notesId || !element) {
        res.status(400);
        res.send({statusCode: 400, msg: "Please provide all details"});
        return;
    }
    const queryResp = await notesElementTable.insert({ notesId, element, idDone: 0 });
    res.status(200);
    res.send({ statusCode: 200, msg: "success", data: queryResp})

    // runQuery(dbConnect, "INSERT INTO `notesElement` (`notesId`, `element`) VALUES ('"+ notesId +"', '"+ element +"')", res);
})

//delete
app.delete('/', async function(req, res) {
    const elementId = req.query.elementId;
    if (!elementId) {
        res.status(400);
        res.send({statusCode: 400, msg: "elementId not provided"});
        return;
    }
    const queryResp = await notesElementTable.remove({ _id: elementId });
    res.status(200);
    res.send({ statusCode: 200, msg: "success", data: queryResp})

    // runQuery(dbConnect, "DELETE FROM `notesElement` WHERE `notesElement`.`elementId` =" + elementId, res);
})

//update notes type
app.put('/', async function(req, res) {
    const notesId = req.query.notesId; 
    let element;
    try {
        element = mySQLRealEscapeString(req.body.element);
    } catch{ }
    
    if (!notesId || !element) {
        res.status(400);
        res.send({statusCode: 400, msg: "Please provide all details"});
        return;
    }
    const queryResp = await notesElementTable.update({ _id: notesId }, { $set: { element: element } });
    res.status(200);
    res.send({ statusCode: 200, msg: "success", data: queryResp})

});

//save toDo type
app.post('/save', function(req, res) {
    const notesId = req.query.notesId;
    // const element = mySQLRealEscapeString(req.body.element);
    const element = req.body.element;
    
    // console.log("element", element)
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