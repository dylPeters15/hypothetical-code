//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let mongoose = require("mongoose");
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
const server = require('../server.js');
const database = require('../database.js');
let should = chai.should();
const user_utils = require('./user_utils.js');
const assert = require('assert');

chai.use(chaiHttp);
//Our parent block
describe('testing REST API calls', function () {
    beforeEach(function (done) {
        database.dropDatabase().then(response => {
            console.log("Database dropped: ", response);
            user_utils.createUser("admin","password", true, true).then(innerResponse => {
                console.log("Created admin user: ", innerResponse);
                done();
            });
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

    it('it should get user', function (done) {
        chai.request(server)
            .get('/users')
            .set('username', 'admin')
            .set('localuser', 'true')
            .end((err, res) => {
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(1);
                  assert.equal(res.body[0].username, "admin");
                  done();
            });
      });

      it('it should login user', function (done) {
        chai.request(server)
                .get('/login')
                .set('username', 'admin')
                .set('password', 'password')
                .end((err, res) => {
                  assert.equal(res.body.token.length, 32);
                  done();
                });
      });

      it('it should not login user', function (done) {
        chai.request(server)
                .get('/login')
                .set('username', 'admin')
                .set('password', 'asdf')
                .end((err, res) => {
                  assert.equal(res.body.err, "Incorrect username or password");
                  done();
                });
      });

});
