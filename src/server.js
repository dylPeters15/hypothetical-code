const express = require('express');
const cors = require('cors');
var headerParser = require('header-parser');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const crypto = require('crypto');

const app = express();
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions))
app.use(headerParser);
app.use(bodyParser.json());

function saltAndHash(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}


MongoClient.connect('mongodb://localhost:27017', (err, database) => {
    // ... start the server
    db = database.db('my-test-db'); // whatever your database name is
    app.listen(8000, () => {
        console.log('Server started!');
    });

    function verifiedForUserOperations(entered_username, entered_token, callback) {
        db.collection('users').find({
            username: entered_username,
            token: entered_token
        }).toArray(function (err, results) {
            callback(results.length == 1);
        });
    }

    function verifiedForAdminOperations(entered_username, entered_token, callback) {
        if (entered_username == 'admin') {
            verifiedForUserOperations(entered_username, entered_token, callback);
        } else {
            callback(false);
        }
    }

    app.route('/api/v1/login').get((req, res) => {
        let entered_username = req.headers['username'];
        let entered_password = req.headers['password'];
        db.collection('users').find({
            username: entered_username
        }).toArray(function (err, results) {
            // send HTML file populated with quotes here
            if (results.length == 1) {
                let user = results[0];
                let enteredSaltedHashedPassword = crypto.pbkdf2Sync(entered_password, user.salt, 1000, 64, 'sha512').toString('hex');
                if (enteredSaltedHashedPassword === user.saltedHashedPassword) {
                    //return token
                    res.send({
                        token: user.token
                    });
                } else {
                    //incorrect password
                    res.send({
                        message: "Incorrect password."
                    });
                }
            } else {
                //incorrect username
                res.send({
                    message: "Incorrect username."
                });
            }
        });
    });

    app.route('/api/v1/sku-inventory').get((req,res) =>{
        db.collection('ingredients').find().toArray(function(err,results) {
          res.send(results);
        });
      });

    app.route('/api/v1/change-password').put((req, res) => {
        const username = req.headers['username'];
        const token = req.headers['token'];
        verifiedForUserOperations(username, token, function (verified) {
            const newPass = req.body['newpassword'];
            const oldPass = req.body['oldpassword'];
            if (verified) {
                const filterschema = {
                    username: username,
                    token: token
                };
                db.collection('users').findOne(filterschema, function(dberr, dbres) {
                    const oldSaltedHash = crypto.pbkdf2Sync(oldPass, dbres.salt, 1000, 64, 'sha512').toString('hex');
                    if (oldSaltedHash == dbres.saltedHashedPassword) {
                        const newSaltedHash = crypto.pbkdf2Sync(newPass, dbres.salt, 1000, 64, 'sha512').toString('hex');
                        db.collection('users').updateOne(filterschema, {
                            $set: {
                                saltedHashedPassword: newSaltedHash
                            }
                        }, function(innerdberr, innerdbres) {
                            res.send({
                                success: true
                            });
                        });
                    } else {
                        res.send({
                            errormessage: 'Incorrect password.'
                        });
                    }
                });
            } else {
                res.send({
                    errormessage: 'Not permitted to perform operation.'
                });
            }
        });
    });

    app.route('/api/v1/delete-account').delete((req, res) => {
        const username = req.headers['username'];
        const token = req.headers['token'];
        verifiedForUserOperations(username, token, function (verified) {
            if (verified) {
                const password = req.headers['password'];
                const filterschema = {
                    username: username,
                    token: token
                };
                db.collection('users').findOne(filterschema, (dberr, dbres) => {
                    if (dberr) {
                        res.send({
                            errormessage: "Error finding user."
                        });
                    } else {
                        var saltedHashedPassword = saltAndHash(password, dbres['salt']);
                        if (saltedHashedPassword == dbres['saltedHashedPassword']) {
                            db.collection('users').deleteOne(filterschema, (innerdberr, innerdbres) => {
                                if (innerdberr) {
                                    res.send({
                                        errormessage: "Error deleting user."
                                    });
                                } else {
                                    res.send({
                                        success: true
                                    });
                                }
                            });
                        } else {
                            res.send({
                                errormessage: "Incorrect password."
                            })
                        }
                    }
                })
            } else {
                res.send({
                    errormessage: 'Not permitted to perform operation.'
                });
            }
        });
    });

});

