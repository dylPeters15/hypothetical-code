const assert = require('assert');
const ingredient_utils = require('./ingredient_utils.js');
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

    it('creates ingredient with all fields', function (done) {
        ingredient_utils.createIngredient("salt", 123, "farms", "12oz", 20, "comment!").then(response => {
            assert.equal(response['ingredientname'], "salt");
            assert.equal(response['ingredientnumber'], 123);
            assert.equal(response['vendorinformation'], "farms");
            assert.equal(response['packagesize'], "12oz");
            assert.equal(response['costperpackage'], 20);
            assert.equal(response['comment'], "comment!");
            done();
        }).catch(err => {
            assert.fail(err);
        });
    });

    it('creates ingredient with no user specified number', function (done) {
        ingredient_utils.createIngredient("salt2", null, "farms", "12oz", 20, "comment!").then(response => {
            console.log('test')
            assert.equal(response['ingredientname'], "salt2");
            assert.notEqual(response['ingredientnumber'], null);
            assert.equal(response['vendorinformation'], "farms");
            assert.equal(response['packagesize'], "12oz");
            assert.equal(response['costperpackage'], 20);
            assert.equal(response['comment'], "comment!");
            done();
        }).catch(err => {
            assert.fail(err);
        });
    });

    // it('Throws error when creating user with existing username', function (done) {
    //     user_utils.createUser("admin", "password").then(response => {
    //         assert.equal(response['username'], "admin");
    //         user_utils.createUser("admin", "password2").then(innerresponse => {
    //             assert.fail(Error("Should not have responded: ", innerresponse));
    //         }).catch(err => {
    //             assert.notEqual(err, null);
    //             done();
    //         });
    //     }).catch(err => {
    //         assert.fail(Error(err))
    //     });
    // });

    // it('is empty', function (done) {
    //     user_utils.getUsers().then(users => {
    //         assert.equal(users.length, 0);
    //         done();
    //     }).catch(err => {
    //         assert.fail(err);
    //     });
    // });
});