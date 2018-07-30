
const request = require('request')
const q = require('q')

module.exports = function (method, path, postData = {}) {
    const headers = { 'cache-control': 'no-cache', 'content-type': 'application/json' }
    const options = {
        method: method,
        url: path,
        headers: headers,
        body: postData,
        json: true
    }
    const d = q.defer()
    request(options, function (error, response, body) {
        if (error) {
            console.log(error.stack.toString())
            return d.reject(error)
        };
        try {
            d.resolve(body)
        } catch (e) {
            console.log(e.stack.toString())
            return d.reject(e)
        }
    })
    return d.promise
}
