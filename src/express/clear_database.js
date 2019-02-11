const mongoose = require('mongoose');
const database = require('./database.js');
const user_utils = require('./user_utils.js');
database.dropDatabase().then(response => {
    console.log("Database cleared: ", response);
    user_utils.createUser("admin", "hypocode123").then(value => {
        console.log("Admin user created.");
        mongoose.connection.close();
    }).catch(err => {
        console.log(Error(err));
    });
}).catch(err => {
    console.log(Error(err));
});