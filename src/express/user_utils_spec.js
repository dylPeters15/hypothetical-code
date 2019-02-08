const mongoose = require('mongoose');
const database = require('./database.js');
const user_utils = require('./user_utils.js');

// user_utils.getUsers("admin").then(users => {
//     console.log("Should only log admin: ", users);
// }).catch(err => {
//     console.log(Error(err));
// });

user_utils.getUsers(null, "a.*").then(users => {
    console.log("Should log all users starting with a: ", users);
}).catch(err => {
    console.log(Error(err));
});

// user_utils.createUser("asdf","pass").then(response => {
//     console.log(response);
// }).catch(err => {
//     console.log(Error(err));
// });

//    mongoose.connection.close();

