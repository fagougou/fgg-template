module.exports = this

const app = require('../../server')

this.test = function (req) {
    return app.plugin.httpRequest('POST', 'http://localhost:3000/sms')
    // return true
}

this.test3 = function (req) {
    return true
}

this.test2 = function (req) {
    return true
}

this.test4 = function (req) {
    return true
}

this.test5 = function (req) {
    return true
}

this.test6 = function (req) {
    return true
}
