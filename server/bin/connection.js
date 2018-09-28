const q = require('q')
const config = require('../config')
const mongoose = require('mongoose')

exports.mongoConnect = function () {
    const d = q.defer()

    mongoose.connect(`mongodb://${config.db.username}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.dbname}`, config.db.options)
    mongoose.connection
        .once('open', () => {
            console.info('[app.js] Database : ' + config.db.host + ' connect successfully.')
            d.resolve()
        })
        .on('error', (err) => {
            console.info('[app.js] Database connect failed.')
            console.error(err)
            d.reject(err)
        })

    return d.promise
}
