const database_library = require('./database.js');

var successCallback = function() {
    console.log("it was a success");
};

var failCallback = function() {
    console.log("fail");
};

var db = new database_library.Database(successCallback, failCallback);
// var UserClass = new database_library.UserClass();
// console.log(admin);