const mongoose = require('mongoose');
const database = require('./database.js');
const user_utils = require('./user_utils.js');

mongoose.connect('mongodb://localhost/my-test-db',function(){
    mongoose.connection.db.dropDatabase();
    console.log("Database cleared.");
    user_utils.getUsers();
    user_utils.createUser("admin","hypocode123").then(value => {
        console.log("Value: ",value);
    });//can also add here .catch(err => {}) but choosing not to do so because we don't want to catch this error - the program should fail if there is an error here
    console.log("Admin user created.");
});