const assert = require('assert');
const formula_utils = require('./formula_utils.js');

describe('loading express', function () {
    var database;
    before(function (done) {
        database = require('./database.js');
        done();
    });
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

    it('creates a formula', function (done) {
        done();
    });

});