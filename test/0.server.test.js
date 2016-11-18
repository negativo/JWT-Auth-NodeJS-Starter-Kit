var chai = require('chai');
var expect = require('expect');
var chaiHttp = require('chai-http');
var app = require('../api.js');

chai.use(chaiHttp);

describe('Server', () => {
  it('Should be online', ( done ) => {
    chai
      .request(app)
      .get('/')
      .end((err,res) => {
        expect(res.status).toBe(200);
        expect(res).toExist();
        done();
      });
  });
 
})
