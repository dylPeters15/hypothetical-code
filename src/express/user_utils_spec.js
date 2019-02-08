process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const assert = require('assert');
const mongoose = require('mongoose');
const user_utils = require('./user_utils.js');

describe('loading express', function () {
    var database;
    beforeEach(function (done) {
        database = require('./database.js');
        database.dropDatabase().then(response => {
            console.log("Database dropped: ", response);
            done();
        });
    });
    after(function (done) {
        database.dropDatabase().then(response => {
            console.log("Database dropped: ", response);
            mongoose.connection.close().then(() => {
                console.log("Closed connection.");
                done();
            });
        });
    });

    it('creates admin user', function (done) {
        user_utils.createUser("admin", "password").then(response => {
            assert.equal(response['userName'], "admin");
            done();
        }).catch(err => {
            assert.fail(err);
        });
    });

    it('Throws error when creating user with existing username', function (done) {
        user_utils.createUser("admin", "password").then(response => {
            assert.equal(response['userName'], "admin");
            user_utils.createUser("admin", "password2").then(innerresponse => {
                assert.fail(Error("Should not have responded: ", innerresponse));
            }).catch(err => {
                assert.notEqual(err, null);
                done();
            });
        }).catch(err => {
            assert.fail(Error(err))
        });
    });

    it('is empty', function (done) {
        user_utils.getUsers().then(users => {
            assert.equal(users.length, 0);
            done();
        }).catch(err => {
            assert.fail(err);
        });
    });
});






















// const mongoose = require('mongoose');
// const database = require('./database.js');
// const user_utils = require('./user_utils.js');

// database.dropDatabase().then(response => {
//     console.log("Database dropped: ", response);
//     testCreateAdminUser();
// }).catch(err => {
//     console.log(Error(err));
// })

// function testCreateAdminUser() {
//     user_utils.createUser("admin","password").then(response => {
//         console.log("Admin user created");
//         testCreateExistingUser();
//     }).catch(err => {
//         console.log(Error(err));
//     });
// }

// function testCreateExistingUser() {
//     user_utils.createUser("admin","password").then(response => {
//         console.log("Admin user created");
//     }).catch(err => {
//         console.log(Error(err));
//     });
// }

// function testCreateasdfUser() {

// }

// user_utils.getUsers("admin").then(users => {
//     console.log("Should only log admin: ", users);
// }).catch(err => {
//     console.log(Error(err));
// });

// user_utils.getUsers(null, "a.*").then(users => {
//     console.log("Should log all users starting with a: ", users);
// }).catch(err => {
//     console.log(Error(err));
// });

// // user_utils.createUser("asdf","pass").then(response => {
// //     console.log(response);
// // }).catch(err => {
// //     console.log(Error(err));
// // });

// //    mongoose.connection.close();

