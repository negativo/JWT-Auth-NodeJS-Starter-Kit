const { testenv } = global
const app = require(testenv.app)
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = require('expect')
const User = require(testenv.serverdir + 'models/user.model')

chai.use(chaiHttp)

describe('User - API', () => {
  var admin_token, user_token
  var normal_user = {
    username: 'TestUser' + Date.now(),
    password: 'password'
  }
  normal_user.email = `${normal_user.username}@randomprovider.com`

  var admin_user = {
    username: 'ADMIN' + Date.now(),
    password: 'password',
    admin: true,
  }
  admin_user.email = `${admin_user.username}@randomprovider.com`

  after(() => {
    testenv.adminAuthToken = admin_token
    testenv.userAuthToken = user_token
  })

  /**
   * USER CREATION
   */
  describe('Create', () => {
    it('should create admin user', (done) => {
      chai.request(app)
      .post('/api/user')
      .send(admin_user)
      .end((err, res) => {
        if(err) throw err
        let { body } = res
        admin_token = body.token
        expect(res.status).toBe(200)
        expect(body.success).toBe(true)
        expect(body.token).toExist()
        done()
      })
    })
    it('should create a normal user', (done) => {
      chai.request(app)
      .post('/api/user')
      .send(normal_user)
      .end((err, res) => {
        if(err) throw err
        let { body } = res
        expect(res.status).toBe(200)
        expect(body.success).toBe(true)
        expect(body.token).toExist()
        done()
      })
    })
    it('should NOT create a normal user with the same email', (done) => {
      let testNewUser = Object.assign({}, normal_user)
      testNewUser.username = 'randomUsername'
      chai.request(app)
      .post('/api/user')
      .send(testNewUser)
      .end((err, res) => {
        let { body } = res
        expect(res.status).toBe(400)
        expect(body.success).toBe(false)
        expect(body.message).toExist()
        done()
      })
    })
    it('should NOT create a normal user with the same username', (done) => {
      let testNewUser = Object.assign({}, normal_user)
      testNewUser.email = 'newRandomEmail@test.com'
      chai.request(app)
      .post('/api/user')
      .send(testNewUser)
      .end((err, res) => {
        let { body } = res
        expect(res.status).toBe(400)
        expect(body.success).toBe(false)
        expect(body.message).toExist()
        done()
      })
    })
    it('should return error if username exist', (done) => {
      chai.request(app)
      .post('/api/user')
      .send(normal_user)
      .end((err, res) => {
        expect(res.body.success).toBe(false)
        expect(res.body.message).toExist()
        done()
      })
    })
    it('should return error if password not provided', (done) => {
      chai.request(app)
      .post('/api/user')
      .send({ username: 'TEST' })
      .end((err, res) => {
        expect(res.body.success).toBe(false)
        expect(res.body.message).toExist()
        done()
      })
    })

    it('should given an username check if exists', (done) => {
      chai.request(app)
      .get(`/api/user/${normal_user.username}/exist`)
      .end((err,res) => {
        expect(res.status).toBe(409)
        expect(res.body.success).toBe(true)
        expect(res.body.exist).toBe(true)
        done()
      })
    })

    it('[NEW METHOD] should given an username check if exists', (done) => {
      chai.request(app)
      .get(`/api/user/username/${normal_user.username}/exist`)
      .end((err,res) => {
        expect(res.status).toBe(409)
        expect(res.body.success).toBe(true)
        expect(res.body.exist).toBe(true)
        done()
      })
    })

    it('[NEW METHOD] should given an user email check if exists', (done) => {
      chai.request(app)
      .get(`/api/user/email/${normal_user.email}/exist`)
      .end((err,res) => {
        expect(res.status).toBe(409)
        expect(res.body.success).toBe(true)
        expect(res.body.exist).toBe(true)
        done()
      })
    })
  })



  describe('Authentication', () => {
    it('should return auth error if password wrong', (done) => {
      wrongUser = Object.assign({}, normal_user)
      wrongUser.password = 'SomeRandomWrongPass'
      chai.request(app)
      .post('/api/user/auth')
      .send(wrongUser)
      .end((err, res) => {
        expect(res.status).toBe(401)
        expect(res.body.message).toExist()
        done()
      })
    })
    it('should authenticate user', (done) => {
      chai.request(app)
      .post('/api/user/auth')
      .send(normal_user)
      .end((err, res) => {
        if (err) throw err
        expect(res.status).toBe(200)
        expect(res.body.token).toExist()
        user_token = res.body.token
        done()
      })
    })
  })

  describe('Restricted Routes', () => {
    it('should fetch personal data', (done) => {
      chai.request(app)
      .get('/api/me')
      .set('Authorization', user_token)
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        done()
      })
    })
    it('should get admin only route', (done) => {
      chai.request(app)
      .get('/api/users')
      .set('Authorization', admin_token)
      .end((err, res) => {
        if(err) throw err
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        done()
      })
    })
    it('should NOT get restricted route', (done) => {
      chai.request(app)
      .get('/api/users')
      .set('Authorization', user_token)
      .end((err, res) => {
        expect(res.status).toBe(401)
        expect(res.status).toNotBe(200)
        done()
      })
    })
  })

  describe('Delete users', () => {
    it('should let user delete its own account', (done) => {
      chai.request(app)
      .delete('/api/me')
      .set('Authorization', user_token)
      .end((err, res) => {
        if(err) throw err
        expect(res.body.success).toBe(true)
        done()
      })
    })
  })

  after((done) => {
    Promise.resolve(
      User.remove({})
    ).then(done()).catch(done)
  })

})
