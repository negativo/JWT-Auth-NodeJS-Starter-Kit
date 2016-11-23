const { testenv } = global
const app = require(testenv.app)
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = require('expect')

chai.use(chaiHttp)

describe('Server', () => {
  it('should bootstrap testing suite', (done) => {
    chai
    .request(app)
    .get('/api')
    .end((err, res) => {
      expect(res).toExist()
      done()
    })
  })
  it('should return api root', (done) => {
    chai
    .request(app)
    .get('/api')
    .end((err, res) => {
      expect(res).toExist()
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      done()
    })
  })
  it('should return 404 on unknown route api', (done) => {
    chai
    .request(app)
    .get('/api/random404')
    .end((err, res) => {
      expect(res.status).toBe(404)
      done()
    })
  })
})
