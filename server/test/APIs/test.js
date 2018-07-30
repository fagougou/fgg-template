const assert = require('assert')
const should = require('chai').should()
const expect = require('chai').expect
const port = process.env.PORT || 9004
const request = require('supertest')(`http://localhost:${port}`)
const self = this
// 针对test.json中的接口做测试
describe('Test API', function () {
  // test.json中的某个接口
  console.log(self)
  it('test', self.test)
})

this.test = function (done) {
  request
    .get('/test')
    .expect(200)
    .end((err, res) => {
      console.log('>>>>>>', res.body)
      expect(res.body).to.have.property('status')
      expect(res.body).to.have.property('data')
      expect(res.body.status).to.equal('ok');
      done()
    })
}

module.exports = this