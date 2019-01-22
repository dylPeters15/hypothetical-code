const express = require('express');const cors = require('cors');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient

const app = express();
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
    });
app.use(bodyParser.urlencoded({extended: true}))



  MongoClient.connect('mongodb://localhost:27017', (err, database) => {
    // ... start the server
    db = client.db('test-db'); // whatever your database name is
    app.listen(8000, () => {
        console.log('Server started!');
      });
  });

  app.route('/api/v1/login/user1').get((req, res) => {
    res.send({
        cats: [{ name: 'lilly' }, { name: 'lucy' }]
      });
});

app.post('/quotes', (req, res) => {
    db.collection('quotes').save(req.body, (err, result) => {
      if (err) return console.log(err)
  
      console.log('saved to database')
      res.redirect('/')
    })
  })