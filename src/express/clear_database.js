const mongoose = require('mongoose');
const database = require('./database.js');
const user_utils = require('./user_utils.js');

mongoose.connect('mongodb://localhost/my-test-db').then(() => {
    mongoose.connection.db.dropDatabase();
    console.log("Database cleared.");
    user_utils.createUser("admin","hypocode123").then(value => {
        console.log("Admin user created.");
        mongoose.connection.close();
    });//can also add here .catch(err => {}) but choosing not to do so because we don't want to catch this error - the program should fail if there is an error here
});//can also add here .catch(err => {}) but choosing not to do so because we don't want to catch this error - the program should fail if there is an error here