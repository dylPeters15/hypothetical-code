const express = require('express');
const cors = require('cors');
var headerParser = require('header-parser');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const crypto = require('crypto');
const database_library = require('./database.js');
var fs = require('fs');
var https = require('https');


const app = express();
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
};

app.use(cors(corsOptions));
app.use(headerParser);
app.use(bodyParser.json());


let server = https.createServer({
    key: fs.readFileSync('./ssl/privkey.pem'),
    cert: fs.readFileSync('./ssl/fullchain.pem')
}, app).listen(8443, () => {
    console.log('Server started!');
});
module.exports = server;
MongoClient.connect('mongodb://localhost:27017', (err, database) => {
    // ... start the server
    db = database.db('my-test-db'); // whatever your database name is
    
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

    app.route('/api/v1/my-file').get((req,res) =>{
        db.collection('files').find().toArray(function(err,results) {
          res.send(results);
        });
      });

    app.route('/api/v1/manufacturing-goals').get((req,res) =>{
        let current_username = req.headers['username'];
      db.collection('goals').find({
          user: current_username
      }).toArray(function(err,results) {
          if(results.length > 0){
            res.send(results);
          }
          else {
              res.send({
                message: "No goals found for user " + current_username
              })
          }
        
      });
    });

    app.route('/api/v1/get-goal-by-name').get((req,res) => {
        let goalName = req.headers['name'];
        let username = req.header['username'];
        const filterschema = {
            name: goalName
        };
        db.collection('goals').findOne(filterschema, function(err,results) {
            res.send(results);
        });
    });


    app.route('/api/v1/login').get((req, res) => {
        let entered_username = req.headers['username'];
        let entered_password = req.headers['password'];
        console.log(req.headers)
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

    app.route('/api/v1/product-line').get((req,res) =>{
        db.collection('product_lines').find().toArray(function(err,results) {
          res.send(results);
        });
      });


      app.route('/api/v1/product-line').post((req, res) => {
        console.log("about to save skuz");
        const adminusername = req.headers['username'];
        const admintoken = req.headers['token'];
        verifiedForAdminOperations(adminusername, admintoken, verified => {
            if (!verified) {
                res.send({
                    errormessage: 'Not permitted to perform operation.'
                });
                return
            }
            let name = req.body['name'];
            let skus = req.body['skus'];
            let id = req.body['id'];
 
            let product_line = database_library.productLineModel({
                name: name,
                skus: skus,
                id: id,
            });
            product_line.save().then(
                doc => {
                    res.send({
                        success: true,
                        doc: doc
                    });
                    console.log(doc);
                    return;
                }
            ).catch(
                err => {
                    res.send({
                        errormessage: "Unable to save product line."
                    });
                    console.log(err);
                    return;
                }
            );
        });
    });






    app.route('/api/v1/sku-inventory').get((req,res) =>{
        db.collection('skus').find().toArray(function(err,results) {
          res.send(results);
        });
      });

      console.log("Creating sku inventory post.");
      app.route('/api/v1/sku-inventory').post((req, res) => {
          console.log("sku inventory post being called.");
        const adminusername = req.headers['username'];
        const admintoken = req.headers['token'];
        verifiedForAdminOperations(adminusername, admintoken, verified => {
            if (!verified) {
                res.send({
                    errormessage: 'Not permitted to perform operation.'
                });
                return
            }
            let name = req.body['name'];
            let skuNumber = req.body['skuNumber'];
            let caseUpcNumber = req.body['caseUpcNumber'];
            let unitUpcNumber = req.body['unitUpcNumber'];
            let unitSize = req.body['unitSize'];
            let countPerCase = req.body['countPerCase'];
            let productLine = req.body['productLine'];
            let ingredientTuples = req.body['ingredientTuples'];
            let comment = req.body['comment'];
            let id = req.body['id'];
 
            let sku = database_library.skuModel({
                name: name,
                skuNumber: skuNumber,
                caseUpcNumber: caseUpcNumber,
                unitUpcNumber: unitUpcNumber,
                unitSize: unitSize,
                countPerCase: countPerCase,
                productLine: productLine,
                ingredientTuples: ingredientTuples,
                comment: comment,
                id: id,
            });
            console.log("Sku object: " + sku);
            sku.save().then(
                doc => {
                    res.send({
                        success: true,
                        doc: doc
                    });
                    console.log(doc);
                    return;
                }
            ).catch(
                err => {
                    res.send({
                        errormessage: "Unable to save sku."
                    });
                    console.log(err);
                    return;
                }
            );
        });
    });

    app.route('/api/v1/find-sku-collision').get((req, res) => {
        const username = req.headers['username'];
        const token = req.headers['token'];
        verifiedForAdminOperations(username, token, verified => {
            if (!verified) {
                res.send({
                    errormessage: 'Not permitted to perform operation.'
                });
                return
            }
            const name = req.headers['name'];
            const skuNumber = req.headers['skunumber'];
            const caseUpcNumber = req.headers['caseupcnumber'];
            const unitUpcNumber = req.headers['unitupcnumber'];
            const id = req.headers['id'];
            const filterSchema = {
                $or:[
                    {name:name},
                    {skuNumber:skuNumber},
                    {caseUpcNumber:caseUpcNumber},
                    {unitUpcNumber:unitUpcNumber},
                    {id:id}
                ]
            }
            console.log(filterSchema);
            console.log(req.headers);
            db.collection('skus').findOne(filterSchema, (err,results) => {
                if (err) {
                    res.send({
                        errmessage: "Error finding SKU."
                    });
                    return;
                }
                console.log(results);
                res.send({
                    results: results
                });
            })
            
        });
    });

    app.route('/api/v1/manufacturing-goals').post((req,res) => {
        const username = req.headers['username'];
        let name = req.body['name'];
        let skus = req.body['skus'];
        let skusArray = skus.split(",");
        let quantities = req.body['quantities'];
        let quantitiesArray = quantities.split(",");
        let date = req.body['date'];
        let dateAsDate = Date.parse(date);
        let goal = database_library.goalsModel({
            user: username,
            name: name,
            skus: skusArray,
            quantities: quantitiesArray,
            date: dateAsDate
        });
        goal.save().then(
            doc => {
                res.send({
                    success: true,
                    doc: doc
                });
                console.log(doc);
                return;
            }
        ).catch(
            err => {
                res.send({
                    errormessage: "Unable to save goal."
                });
                console.log(err);
                return;
            }
        )
        
    })

    app.route('/api/v1/ingredient-inventory').get((req,res) =>{
        db.collection('ingredients').find().toArray(function(err,results) {
          res.send(results);
        });
      });

    app.route('/api/v1/get-ingredient-by-id').get((req,res) => {
        console.log(req.headers);
        let ingredientId = req.headers['ingredientid'];
        console.log(ingredientId);
        const filterschema = {
            id: Number(ingredientId)
        };
        db.collection('ingredients').findOne(filterschema, function(err,results) {
            if(err) {
                console.log(err);
            }
            console.log(results)
            if(results != null){
                res.send(results);
            }
            else{
                res.send({
                    errormessage: 'Nothing found for id ' + ingredientId
                });
            }
            
        });
    });

    app.route('/api/v1/get-ingredient-by-number').get((req,res) => {
        let ingredientNumber = req.headers['number'];
        const filterschema = {
            number: Number(ingredientNumber)
        };
        console.log(ingredientNumber);
        console.log(req.headers);
        db.collection('ingredients').findOne(filterschema, function(err,results) {
            res.send(results);
        });
    });

    app.route('/api/v1/get-skuid-by-name').get((req,res) => {
        let input_name = req.headers['name'];
        console.log("input name is here: " + input_name);
        const filterschema = {
            name: String(input_name)
        };
        console.log("ha: " + input_name)
        console.log("haha: " + req.headers)
        db.collection('skus').findOne(filterschema, function(err,results) {
            res.send(results);
        });
    });

    app.route('/api/v1/get-skuinfo-by-id').get((req,res) => {
        let input_id = req.headers['id'];
        console.log("ahoy! value is now " + input_id);
        const filterschema = {
            id: String(input_id)
        };
        db.collection('skus').findOne(filterschema, function(err,results) {
            res.send(results);
        });
    });

    app.route('/api/v1/get-ingredientid-by-name').get((req,res) => {
        let input_name = req.headers['name'];
        console.log("input name is here: " + input_name);
        const filterschema = {
            name: String(input_name)
        };
        console.log("ha: " + input_name)
        console.log("haha: " + req.headers)
        db.collection('ingredients').findOne(filterschema, function(err,results) {
            res.send(results);
        });
    });

    app.route('/api/v1/add-ingredient-sku').put((req, res) => {
        const ingredient = req.body['ingredient'];
        const skus = req.body['skus'];
        const filterschema = {
            number: Number(ingredient)
        };
        db.collection('ingredients').findOne(filterschema, function (dberr, dbres) {
            db.collection('ingredients').updateOne(filterschema, {
                $set: {
                    skus: skus
                }
            }, function (innerdberr, innerdbres) {
                res.send({
                    success: true
                });
            });
        });
    });


    app.route('/api/v1/change-ingredient').put((req, res) => {
        console.log("made it in here even though they said we couldn't");
        const username = req.headers['username'];
        const token = req.headers['token'];
        verifiedForUserOperations(username, token, function (verified) {
            let name = req.body['name'];
            let number = req.body['number'];
            let vendorInformation = req.body['vendorInformation'];
            let packageSize = req.body['packageSize'];
            let costPerPackage = req.body['costPerPackage'];
            let comment = req.body['comment']; 
            const id = req.body['id'];
            if (verified) {
                const filterschema = {
                    id: id,
                };
                        db.collection('ingredients').updateOne(filterschema, {
                            $set: {
                                name: name,
                                number: number,
                                vendorInformation: vendorInformation,
                                packageSize: packageSize,
                                costPerPackage: costPerPackage,
                                comment: comment,
                                id: id
                            }
                        }, function (innerdberr, innerdbres) {
                            res.send({
                                success: true
                            });
                        });
            } else {
                res.send({
                    errormessage: 'Not permitted to perform operation.'
                });
            }
        });
    });

    app.route('/api/v1/ingredient-inventory').post((req, res) => {
        const adminusername = req.headers['username'];
        const admintoken = req.headers['token'];
        verifiedForAdminOperations(adminusername, admintoken, verified => {
            if (!verified) {
                res.send({
                    errormessage: 'Not permitted to perform operation.'
                });
                return
            }
            let name = req.body['name'];
            let number = req.body['number'];
            let vendorInformation = req.body['vendorInformation'];
            let packageSize = req.body['packageSize'];
            let costPerPackage = req.body['costPerPackage'];
            let comment = req.body['comment']; 
            let id = req.body['id']; 
            let ingredientBody = {
                name: name,
                number: number,
                vendorInformation: vendorInformation,
                packageSize: packageSize,
                costPerPackage: costPerPackage,
                comment: comment,
                id: id,
            };
            let ingredient = database_library.ingredientModel(ingredientBody);
            ingredient.save().then(
                doc => {
                    res.send({
                        success: true,
                        doc: doc
                    });
                    console.log(doc);
                    return;
                }
            ).catch(
                err => {
                    res.send({
                        errormessage: "Unable to save ingredient."
                    });
                    console.log(err);
                    return;
                }
            );
        });
    });

    app.route('/api/v1/change-product-line').put((req, res) => {
        console.log("made it in here even though they said we couldn't");
        const username = req.headers['username'];
        const token = req.headers['token'];
        verifiedForUserOperations(username, token, function (verified) {
            const name = req.body['name'];
            const skus = req.body['skus'];
            const id = req.body['id'];
            if (verified) {
                const filterschema = {
                    id: id,
                };
                        db.collection('product-lines').updateOne(filterschema, {
                            $set: {
                                name: name,
                                skus: skus,
                            }
                        }, function (innerdberr, innerdbres) {
                            res.send({
                                success: true
                            });
                        });
                    

            } else {
                res.send({
                    errormessage: 'Not permitted to perform operation.'
                });
            }
        });
    });

    app.route('/api/v1/change-sku').put((req, res) => {
        console.log("made it in here even though they said we couldn't");
        const username = req.headers['username'];
        const token = req.headers['token'];
        verifiedForUserOperations(username, token, function (verified) {
            console.log(req.body);
            const name = req.body['name'];
            const sku_number = req.body['sku_number'];
            const case_upc_number = req.body['case_upc_number'];
            const unit_upc_number = req.body['unit_upc_number'];
            const unit_size = req.body['unit_size'];
            const count_per_case = req.body['count_per_case'];
            const product_line = req.body['product_line'];
            const ingredients = req.body['ingredients'];
            const comment = req.body['comment'];
            const id = req.body['id'];
            if (verified) {
                const filterschema = {
                    id: id,
                };
                        db.collection('skus').updateOne(filterschema, {
                            $set: {
                                name: name,
                                skuNumber: sku_number,
                                caseUpcNumber: case_upc_number,
                                unitUpcNumber: unit_upc_number,
                                unitSize: unit_size,
                                countPerCase: count_per_case,
                                productLine: product_line,
                                ingredientTuples: ingredients,
                                comment: comment
                            }
                        }, function (innerdberr, innerdbres) {
                            console.log(innerdberr);
                            console.log(innerdbres);
                            res.send({
                                success: true
                            });
                        });
                    

            } else {
                res.send({
                    errormessage: 'Not permitted to perform operation.'
                });
            }
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
                db.collection('users').findOne(filterschema, function (dberr, dbres) {
                    const oldSaltedHash = crypto.pbkdf2Sync(oldPass, dbres.salt, 1000, 64, 'sha512').toString('hex');
                    if (oldSaltedHash == dbres.saltedHashedPassword) {
                        const newSaltedHash = crypto.pbkdf2Sync(newPass, dbres.salt, 1000, 64, 'sha512').toString('hex');
                        db.collection('users').updateOne(filterschema, {
                            $set: {
                                saltedHashedPassword: newSaltedHash
                            }
                        }, function (innerdberr, innerdbres) {
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

    app.route('/api/v1/user-list').get((req, res) => {
        const username = req.headers['username'];
        const token = req.headers['token'];
        verifiedForAdminOperations(username, token, verified => {
            if (verified) {
                db.collection('users').find({}).toArray(function (err, results) {
                    if (err) {
                        res.send({
                            errormessage: 'Error finding users.'
                        });
                    } else {
                        var userlist = [];
                        results.forEach(user => {
                            userlist.push({
                                username: user['username']
                            });
                        });
                        res.send({ userlist: userlist });
                    }
                });
            } else {
                res.send({
                    errormessage: 'Not permitted to perform operation.'
                });
            }
        });
    });

    app.route('/api/v1/admin-delete-user').delete((req, res) => {
        const username = req.headers['username'];
        const token = req.headers['token'];
        verifiedForAdminOperations(username, token, verified => {
            if (!verified) {
                res.send({
                    errormessage: 'Not permitted to perform operation.'
                });
                return
            }
            const usernameToDelete = req.headers['usernametodelete'];
            const filterschema = {
                username: usernameToDelete
            };
            db.collection('users').deleteOne(filterschema, (dberr, dbres) => {
                if (dberr) {
                    res.send({
                        errormessage: 'Unable to perform operation.'
                    });
                    return
                }
                res.send({
                    success: true
                });
            });
        });
    });

    app.route('/api/v1/admin-delete-sku').delete((req, res) => {
        const username = req.headers['username'];
        const token = req.headers['token'];
        verifiedForAdminOperations(username, token, verified => {
            if (!verified) {
                res.send({
                    errormessage: 'Not permitted to perform operation.'
                });
                return
            }
            const nameToDelete = req.headers['nametodelete'];
            const filterschema = {
                name: nameToDelete
            };
            db.collection('skus').deleteOne(filterschema, (dberr, dbres) => {
                if (dberr) {
                    res.send({
                        errormessage: 'Unable to perform operation.'
                    });
                    return
                }
                res.send({
                    success: true
                });
            });
        });
    });

    app.route('/api/v1/admin-delete-product-line').delete((req, res) => {
        const username = req.headers['username'];
        const token = req.headers['token'];
        verifiedForAdminOperations(username, token, verified => {
            if (!verified) {
                res.send({
                    errormessage: 'Not permitted to perform operation.'
                });
                return
            }
            const nameToDelete = req.headers['nametodelete'];
            const filterschema = {
                name: nameToDelete
            };
            db.collection('product-line').deleteOne(filterschema, (dberr, dbres) => {
                if (dberr) {
                    res.send({
                        errormessage: 'Unable to perform operation.'
                    });
                    return
                }
                res.send({
                    success: true
                });
            });
        });
    });

    app.route('/api/v1/delete-goal').delete((req,res) => {
        const username = req.headers['username'];
        const token = req.headers['token'];
        const nameToDelete = req.headers['nametodelete'];
        const filterschema = {
            name: nameToDelete
        };
        db.collection('goals').deleteOne(filterschema, (dberr, dbres) => {
            if (dberr) {
                res.send({
                    errormessage: 'Unable to perform operation.'
                });
                return
            }
            res.send({
                success: true
            });
        });
    });
    

    app.route('/api/v1/admin-delete-ingredient').delete((req, res) => {
        const username = req.headers['username'];
        const token = req.headers['token'];
        verifiedForAdminOperations(username, token, verified => {
            if (!verified) {
                res.send({
                    errormessage: 'Not permitted to perform operation.'
                });
                return
            }
            const nameToDelete = req.headers['nametodelete'];
            const filterschema = {
                name: nameToDelete
            };
            db.collection('ingredients').deleteOne(filterschema, (dberr, dbres) => {
                if (dberr) {
                    res.send({
                        errormessage: 'Unable to perform operation.'
                    });
                    return
                }
                res.send({
                    success: true
                });
            });
        });
    });

    app.route('/api/v1/create-user').post((req, res) => {
        const adminusername = req.headers['username'];
        const admintoken = req.headers['token'];
        verifiedForAdminOperations(adminusername, admintoken, verified => {
            if (!verified) {
                res.send({
                    errormessage: 'Not permitted to perform operation.'
                });
                return
            }
            let user_salt = crypto.randomBytes(16).toString('hex');
            let username = req.body['username'];
            let password = req.body['password'];
            let user = database_library.userModel({
                username: username,
                salt: user_salt,
                saltedHashedPassword: saltAndHash(password, user_salt),
                token: crypto.randomBytes(16).toString('hex')
            });
            user.save().then(
                doc => {
                    res.send({
                        success: true,
                        doc: doc
                    });
                    console.log(doc);
                    return;
                }
            ).catch(
                err => {
                    res.send({
                        errormessage: "Unable to save user."
                    });
                    console.log(err);
                    return;
                }
            );
        });
    });

});