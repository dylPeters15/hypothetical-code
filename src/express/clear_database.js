const mongoose = require('mongoose');
const database = require('./database.js');
const user_utils = require('./user_utils.js');

mongoose.connect('mongodb://localhost/my-test-db',function(){
    mongoose.connection.db.dropDatabase();
    console.log("Database cleared.");
    user_utils.getUsers();
    user_utils.createUser("admin","hypocode123").then(function(value) {
        console.log("Value: ",value);
    });
    console.log("Admin user created.");
});