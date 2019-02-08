//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let mongoose = require("mongoose");
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
const server = require('./server.js');
const database = require('./database.js');
let should = chai.should();
const user_utils = require('./user_utils.js');
const assert = require('assert');

chai.use(chaiHttp);
//Our parent block
describe('testing REST API calls', function () {
    beforeEach(function (done) {
        database.dropDatabase().then(response => {
            console.log("Database dropped: ", response);
            user_utils.createUser("admin","password").then(innerResponse => {
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
            .end((err, res) => {
                // console.log("The err is: ",err);
                // console.log("The res is: ",res);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(1);
                  console.log("BODY: ",res.body);
                  done();
            });
      });

});














// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; 
// var request = require('supertest');
// describe('loading express', function () {
//   var server;
//   beforeEach(function () {
//     server = require('./server.js');
//     console.log(server);
//   });
//   afterEach(function () {
//     server.close();
//   });
//   it('responds to /api/v1/login', function(done) {
//     request(server).get('/api/v1/login')
//     .expect(403, done);
//   });
// //   it('404 everything else', function testPath(done) {
// //     require(server)
// //       .get('/foo/bar')
// //       .expect(404, done);
// //   });
// });















// const assert = require('assert');
// const server = require('./server.js');

// describe('loading express', function () {
//     var server;
//     before(function (done) {
//         database = require('./database.js');
//         done();
//     });
//     beforeEach(function (done) {
//         database.dropDatabase().then(response => {
//             console.log("Database dropped: ", response);
//             done();
//         });
//     });
//     afterEach(function (done) {
//         database.dropDatabase().then(response => {
//             console.log("Database dropped: ", response);
//             done();
//         });
//     });
//     afterEach(function (done) {
//         database.dropDatabase().then(response => {
//             console.log("Database dropped: ", response);
//             done();
//         });
//     });

//     it('creates a formula', function (done) {
//         done();
//     });

// });