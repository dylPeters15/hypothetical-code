const express = require('express');
const cors = require('cors');
var headerParser = require('header-parser');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const  crypto = require('crypto');

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
    db = database.db('my-test-db'); // whatever your database name is
    app.listen(8000, () => {
        console.log('Server started!');
    });

    app.route('/api/v1/login').get((req, res) => {
        let entered_username = req.headers['username'];
        let entered_password = req.headers['password'];
        db.collection('users').find({
            username: entered_username
        }).toArray(function(err, results) {
            console.log(results);
            // send HTML file populated with quotes here
            if (results.length == 1) {
                let user = results[0];
                let enteredSaltedHashedPassword = crypto.pbkdf2Sync(entered_password, user.salt, 1000, 64, 'sha512').toString('hex');
                if (enteredSaltedHashedPassword === user.saltedHashedPassword) {
                    //return token
                    console.log("token: " + user.token);
                    res.send({
                        token: user.token
                    });
                } else {
                    //incorrect password
                    console.log("incorrect password");
                    res.send({
                        message: "Incorrect password."
                    });
                }
            } else {
                //incorrect username
                console.log("incorrect username");
                res.send({
                    message: "Incorrect username."
                });
            }
          });
    });

    // function onetimeAdminSetup(){
    //     db.collection('users').save(, (err, result) => {
    //         if (err) {
    //             return console.log(err);
    //         }

    // console.log('saved to database');
    //     })
    // }

});

