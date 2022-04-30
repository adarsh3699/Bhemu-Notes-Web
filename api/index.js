//imports
var express = require('express');
var bodyParser = require('body-parser');

//setting express
var app = express();

//this allows api call from another origin 
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

//to make external files work
app.use(express.static('public'));

//body parser is required to access variables send through post request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// setting up routes
app.get('/', function(req, res) {
  res.send("hello world");
});

app.get('/api', function(req, res) {
  res.send("notes apis");
});

app.use('/api/users', require('./apis/users'));
app.use('/api/notes', require('./apis/notes'));
app.use('/api/notesElement', require('./apis/notesElement'));

//error handling
app.use(function(err, req, res, next) {
  res.status(422).send({ error: err.message });
});

//setup server
app.listen(process.env.PORT || 4000, function() {
  console.log("Server Running");
});
