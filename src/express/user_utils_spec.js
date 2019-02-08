const mongoose = require('mongoose');
const database = require('./database.js');
const user_utils = require('./user_utils.js');

user_utils.getUsers("admin").then(user => {
    console.log(user);
    mongoose.connection.close();
}).catch(err => {
    console.log(Error(err));
});
