const assert = require('assert');
const user_utils = require('./user_utils.js');
const database = require('../database.js');

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
        user_utils.createUser("admin", "password", true, true).then(response => {
            assert.equal(response['username'], "admin");
            assert.equal(response['admin'], true);
            done();
        }).catch(err => {
            assert.fail(err);
        });
    });

    it('Throws error when creating user with existing username', function (done) {
        user_utils.createUser("admin", "password", true, true).then(response => {
            assert.equal(response['username'], "admin");
            user_utils.createUser("admin", "password2", true, true).then(innerresponse => {
                console.log(response);
                console.log(innerresponse);
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

    it('Can create local and federated user with same username', function (done) {
        user_utils.createUser("admin", "password", true, true).then(response => {
            assert.equal(response['username'], "admin");
            assert.equal(response['localuser'], true);
            user_utils.createUser("admin", "password2", true, false).then(innerresponse => {
                assert.equal(innerresponse['username'], "admin");
                assert.equal(innerresponse['localuser'], false);
                done();
            }).catch(err => {
                assert.fail(Error(err));
            });
        }).catch(err => {
            assert.fail(Error(err))
        });
    });
});