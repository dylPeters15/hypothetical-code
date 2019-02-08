const mongoose = require('mongoose');
const database = require('./database.js');
const user_utils = require('./user_utils.js');

mongoose.connect('mongodb://localhost/my-test-db').then(() => {
    mongoose.connection.db.dropDatabase();
    console.log("Database cleared.");
    user_utils.createUser("admin","hypocode123").then(value => {
        console.log("Admin user created.");
        mongoose.connection.close();
    }).catch(err => {
        console.log(Error(err));
    });
}).catch(err => {
    console.log(Error(err));
});