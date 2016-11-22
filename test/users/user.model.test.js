const { testenv, getRandomInt, Promise } = global
const User = require(testenv.serverdir + 'models/user.model')
const chai = require('chai')
const expect = require('expect')

describe('User - Model', () => {

  it('should NOT create an user without username', (done) => {
    User.create({})
    .catch((err) => {
      expect(err.errors.username).toExist()
      done()
    })
  })

  it('should NOT create an user without password', (done) => {
    User.create({
      username: 'admin-test',
    })
    .catch((err) => {
      expect(err.errors.password).toExist()
      done()
    })
  })

  it('should NOT create an user without email', (done) => {
    User.create({
      username: 'admin-test',
      password: 'admin',
    })
    .catch((err) => {
      expect(err.errors.email).toExist()
      done()
    })
  })

  it('should NOT create an user without a VALID email', (done) => {
    User.create({
      username: 'admin-test',
      password: 'admin',
      email: 'testRandom.String/'
    })
    .catch((err) => {
      expect(err.errors.email).toExist()
      done()
    })
  })

  it('should create an user', (done) => {
    User.create({
      username: 'admin-test',
      password: 'admin',
      email: 'testguy@testdomain.com',
    })
    .then((res) => {
      expect(res).toExist()
      done()
    })
    .catch(done)
  })

  /**
   * CLEANUP
   */
  after((done) => {
    Promise.resolve(User.remove({})).then(done()).catch(done)
  })
})
