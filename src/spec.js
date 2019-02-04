process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; 
var request = require('supertest');
describe('loading express', function () {
  var server;
  beforeEach(function () {
    server = require('./server.js');
    console.log(server);
  });
  afterEach(function () {
    server.close();
  });
  it('responds to /api/v1/login', function testSlash(done) {
  server
    request(server).get('/api/v1/login')
    .expect(403, done);
  });
//   it('404 everything else', function testPath(done) {
//     require(server)
//       .get('/foo/bar')
//       .expect(404, done);
//   });
});