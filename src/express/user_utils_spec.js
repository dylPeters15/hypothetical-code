const assert = require('assert');
const user_utils = require('./user_utils.js');
const database = require('./database.js');

describe('loading express', function () {
    beforeEach(function (done) {
        database.dropDatabase().then(response => {
            console.log("Database dropped: ", response);
            done();
        });
    });
    afterEach(function (done) {
        database.dropDatabase().then(response => {
            console.log("Database dropped: ", response);
            done();
        });
    });
    afterEach(function (done) {
        database.dropDatabase().then(response => {
            console.log("Database dropped: ", response);
            done();
        });
    });

    it('creates admin user', function (done) {
        user_utils.createUser("admin", "password", true).then(response => {
            assert.equal(response['username'], "admin");
            assert.equal(response['admin'], true);
            done();
        }).catch(err => {
            assert.fail(err);
        });
    });

    it('Throws error when creating user with existing username', function (done) {
        user_utils.createUser("admin", "password", true).then(response => {
            assert.equal(response['username'], "admin");
            user_utils.createUser("admin", "password2", true).then(innerresponse => {
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