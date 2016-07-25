var chai     = require('chai');
var expect   = require('expect');
var chaiHttp = require('chai-http');
var app      = require('../api.js');

var User = require('../app/models/user.model');

chai.use(chaiHttp);

describe('Users', () => {
  var admin_user = {
    name: 'Simone' + Date.now(),
    password: 'password',
  };

  var normal_user = {
    name: 'Simone' + Date.now() + 15,
    password: 'password',
  };

  before((done) => {
    new User({
      name: admin_user.name,
      password: admin_user.password,
      admin: true,
    }).save((err, user) => {
      if(err) throw err;
      new User({
        name: normal_user.name,
        password: normal_user.password,
        admin: false,
      }).save((err, user) => {
        if(err) throw err;
        done();
      })
    })
  });

  it('should authenticate the admin user', (done) => {
    chai
      .request(app)
      .post('/api/auth')
      .send({
        name: admin_user.name,
        password: admin_user.password,
      })
      .end((err, res) => {
        expect(res).toExist();
        expect(res.status).toBe(200);
        expect(res.body.token).toExist()
        expect(res.body.token).toBeA('string');
        admin_user.authToken = res.body.token;
        done();
      });
  });

  it('should authenticate the normal user', (done) => {
    chai
      .request(app)
      .post('/api/auth')
      .send({
        name: normal_user.name,
        password: normal_user.password,
      })
      .end((err, res) => {
        expect(res).toExist();
        expect(res.status).toBe(200);
        expect(res.body.token).toExist()
        expect(res.body.token).toBeA('string');
        normal_user.authToken = res.body.token;
        done();
      });
  });

  it('should NOT authenticate with wrong password', (done) => {
    chai
      .request(app)
      .post('/api/auth')
      .send({
        name: admin_user.name,
        password: admin_user.password + '123123123',
      })
      .end((err, res) => {
        expect(res).toExist();
        expect(res.status).toBe(403);
        expect(res.body.message).toExist();
        expect(res.body.message).toBeA('string');
        done();
      });
  });

  it('should NOT authenticate with no username provided', (done) => {
    chai
      .request(app)
      .post('/api/auth')
      .send({})
      .end((err, res) => {
        expect(res).toExist();
        expect(res.status).toBe(400);
        expect(res.body.message).toExist();
        expect(res.body.message).toBeA('string');
        done();
      });
  });

  it('shoud REJECT invalid token', (done) => {
    chai
      .request(app)
      .get('/api/check')
      .set('Authorization', "normal_user.authToken")
      .end((err, res) => {
        let {body} = res;
        expect(res).toExist();
        expect(res.status).toBe(403);
        expect(body.success).toBe(false);
        expect(body.message).toExist();
        done();
      });
  });

  it('shoud access token restricted endpoint for NORMAL user', (done) => {
    chai
      .request(app)
      .get('/api/check')
      .set('Authorization', normal_user.authToken)
      .end((err, res) => {
        let {body} = res;
        expect(res).toExist();
        expect(res.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.user.admin).toBe(false);
        done();
      });
  });

  it('shoud NOT access token restricted endpoint for NORMAL user', (done) => {
    chai
      .request(app)
      .get('/api/check')
      .set('Authorization', "normal_user.authToken")
      .end((err, res) => {
        let {body} = res;
        expect(res).toExist();
        expect(res.status).toBe(403);
        expect(body.success).toBe(false);
        expect(body.message).toExist();
        done();
      });
  });

  it('shoud access token restricted endpoint for ADMIN user', (done) => {
    chai
      .request(app)
      .get('/api/check-admin')
      .set('Authorization', admin_user.authToken)
      .end((err, res) => {
        let {body} = res;
        expect(res).toExist();
        expect(res.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.user.admin).toBe(true);
        done();
      });
  });

  it('shoud NOT access token restricted endpoint for ADMIN user', (done) => {
    chai
      .request(app)
      .get('/api/check-admin')
      .set('Authorization', normal_user.authToken)
      .end((err, res) => {
        let {body} = res;
        expect(res).toExist();
        expect(res.status).toBe(403);
        expect(body.success).toBe(false);
        expect(body.message).toExist();
        done();
      });
  });


  /**
   * CLEANUP
   */
  after((done) => {
    User.findOne({ name: admin_user.name }, (err, usr) => {
      usr.remove((err) => {
        User.findOne({ name: normal_user.name }, (err, usr2) => {
          usr2.remove(done);
        })
      });
    });
  });
})
