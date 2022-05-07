const express = require('express');
const { encryptText, decryptText } = require("../encryptionUtil");

//setting express
const app = express();

//mongo databse connection
var dbConnect = require('monk')('mongodb://localhost/bhemu-notes');
var notesTable = dbConnect.get('notes');

//get all notes 
app.get('/', async function(req, res) {
    const userId = req.query.userId;
    if (!userId) {
        res.status(400);
        res.send({statusCode: 400, msg: "userId is not provided"});
        return;
    }

    try {
        const queryResp = await notesTable.find({ userId }, 'notesTitle'); //only notesTitle field is sent
        const data = queryResp.map((element) => (
            { ...element, notesId: element._id, notesTitle: decryptText(element.notesTitle) }
        ))
        res.status(200);
        res.send({ statusCode: 200, msg: "success", data});
    } catch(e) {
        res.status(500);
        res.send({ statusCode: 500, msg: "Internal server error"});
    }
});

// get notes by notesId
app.get('/:notesId', async function(req, res) {
    const _id = req.params.notesId;
    if (!_id) {
        res.status(400);
        res.send({statusCode: 400, msg: "userId is not provided"});
        return;
    }

    try {
        const queryResp = await notesTable.find({ _id });
        const data = { ...queryResp[0], notesTitle: decryptText(queryResp[0].notesTitle) };

        res.status(200);
        res.send({ statusCode: 200, msg: "success", data });
    } catch(e) {
        res.status(500);
        res.send({ statusCode: 500, msg: "Internal server error"});
    }
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

    try {
        const queryResp = await notesTable.insert({ userId: userId, notesTitle , notesType, notes: [{element:"", isDone:false}] });
        res.status(200);
        res.send({ statusCode: 200, msg: "inserted"});
    } catch(e) {
        res.status(500);
        res.send({ statusCode: 500, msg: "Internal server error"});
    }
});

//update
app.put('/', async function(req, res) {
    const _id = req.query.notesId;
    const notesTitle = encryptText(req.body.notesTitle);
    const newNotes = req.body.newNotes; 

    if (!_id || !newNotes || !req.body.notesTitle) {
        res.status(400);
        res.send({statusCode: 400, msg: "Please provide notesId, newNotes and notesTitle"});
        return;
    }

    try {
        const queryResp = await notesTable.update({ _id }, { $set: { notes: newNotes, notesTitle } });

        res.status(200);
        res.send({ statusCode: 200, msg: "updated"});
    } catch(e) {
        res.status(500);
        res.send({ statusCode: 500, msg: "Internal server error"});
    }
});

//delete
app.delete('/', async function(req, res) {
    const _id = req.query.noteId;

    if (!_id) {
        res.status(400);
        res.send({statusCode: 400, msg: "notesId is not provided"});
        return;
    }

    try {
        const queryResp = await notesTable.remove({ _id });

        res.status(200);
        res.send({ statusCode: 200, msg: "deleted"});
    } catch(e) {
        res.status(500);
        res.send({ statusCode: 500, msg: "Internal server error"});
    }
});

//CRUD

//exporting this file so that it can be used at other places
module.exports = app;