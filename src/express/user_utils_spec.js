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