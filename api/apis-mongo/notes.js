const express = require('express');
const { encryptText, decryptText } = require("../encryptionUtil");

//setting express
const app = express();

//mongo databse connection
var dbConnect = require('monk')('mongodb://localhost/bhemu-notes');
var notesTable = dbConnect.get('notes');

//read 
app.get('/', async function(req, res) {
    const userId = req.query.userId;
    if (!userId) {
        res.status(400);
        res.send({statusCode: 400, msg: "userId is not provided"});
        return;
    }

    const queryResp = await notesTable.find({ userId });
    const data = queryResp.map((element) => (
        { ...element, notesId: element._id }
        ))

    res.status(200);
    res.send({ statusCode: 200, msg: "success", data})
});

// read notesElement
app.get('/getNotes', async function(req, res) {
    const _id = req.query.notesId;
    if (!_id) {
        res.status(400);
        res.send({statusCode: 400, msg: "userId is not provided"});
        return;
    }

    const queryResp = await notesTable.find({ _id });

    res.status(200);
    res.send({ statusCode: 200, msg: "success", data: queryResp})
});

//create
app.post('/', async function(req, res) {
    const userId = req.query.userId;
    let notesTitle = encryptText("Enter Notes Title");
    if (req.body.notesTitle) {
        notesTitle = encryptText(req.body.notesTitle);
    }
    let notesType = false;
    if (req.body.notesType) {
        notesType = req.body.notesType;
    }
    if (!userId) {
        res.status(400);
        res.send({statusCode: 400, msg: "userId is not provided"});
        return;
    }

    const queryResp = await notesTable.insert({ userId: userId, notesTitle , notesType, notes: [{element:"", isDone:false}] }
            );

    res.status(200);
    res.send({ statusCode: 200, msg: "inserted", data: queryResp})
});

//update
app.put('/', async function(req, res) {
    const _id = req.query.notesId;
    const notesTitle = encryptText(req.body.notesTitle);
    const newNotes = req.body.newNotes; 

    if (!_id || !req.body.newNotes || !req.body.notesTitle) {
        res.status(400);
        res.send({statusCode: 400, msg: "Please provide notesId, newNotes and notesTitle"});
        return;
    }

    const queryResp = await notesTable.update({ _id }, { $set: { notes: newNotes, notesTitle } });

    res.status(200);
    res.send({ statusCode: 200, msg: "updated", queryResp})
});

//delete
app.delete('/', async function(req, res) {
    const _id = req.query.noteId;

    if (!_id) {
        res.status(400);
        res.send({statusCode: 400, msg: "notesId is not provided"});
        return;
    }

    const queryResp = await notesTable.remove({ _id });

    res.status(200);
    res.send({ statusCode: 200, msg: "deleted", queryResp})
});

//CRUD

//exporting this file so that it can be used at other places
module.exports = app;