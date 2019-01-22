const express = require('express');
const cors = require('cors');
var headerParser = require('header-parser');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient

const app = express();
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
  }
  
  app.use(cors(corsOptions))
  app.use(headerParser);
app.use(bodyParser.urlencoded({ extended: true }))



MongoClient.connect('mongodb://localhost:27017', (err, database) => {
    // ... start the server
    db = database.db('test-db'); // whatever your database name is
    app.listen(8000, () => {
        console.log('Server started!');
    });
});

app.route('/api/v1/login').get((req, res) => {
    console.log(req.headers['username']);
    console.log(req.headers['saltedhashedpassword']);
    res.send({
        cats: [{ name: 'lilly' }, { name: 'lucy' }]
    });
});