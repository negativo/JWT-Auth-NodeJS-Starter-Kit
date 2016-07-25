var chai = require('chai');
var expect = require('expect');
var chaiHttp = require('chai-http');
var app = require('../api.js');

chai.use(chaiHttp);

describe('Server', () => {
  it('should spin the server', ( done ) => {
    chai
      .request(app)
      .get('/')
      .end((err,res) => {
        expect(res.status).toBe(200);
        expect(res).toExist();
        done();
      });
  });
  it('should return API index', ( done ) => {
    chai
      .request(app)
      .get('/api')
      .end((err,res) => {
        expect(res).toExist();
        expect(res.status).toBe(200);
        done();
      });
  });
})
