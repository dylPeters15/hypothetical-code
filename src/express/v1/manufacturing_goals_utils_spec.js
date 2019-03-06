const assert = require('assert');
const goals_utils = require('./manufacturing_goals_utils.js');
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

    it('creates a goal', function (done) {
        done();
    });

});