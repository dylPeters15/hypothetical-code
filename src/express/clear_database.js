const mongoose = require('mongoose');
const database = require('./database.js');
const user_utils = require('./v2/user_utils.js');
database.dropDatabase().then(response => {
    console.log("Database cleared: ", response);
    user_utils.createUser({
        username: "admin",
        password: "hypocode123",
        analyst: true,
        productmanager: true,
        businessmanager: true,
        admin: true,
        manufacturinglinestomanage: [],
        localuser: true
    }).then(value => {
        console.log("Admin user created.");
        mongoose.connection.close();
    }).catch(err => {
        console.log(Error(err));
    });
}).catch(err => {
    console.log(Error(err));
});