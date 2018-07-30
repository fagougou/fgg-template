const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const { mongoConnect } = require('./bin/connection')
const config = require('./config')
const app = express()

const ERRORCODE = require('./errorcode.json')

module.exports = app

// controller loader & model loader
const loader = require('./bin/loader')
app.model = loader.loadModel()
app.controller = loader.loadController()
app.plugin = loader.loadPlugin()

// TODO:: 限制controller只能 exports 对应的路由处理器
mongoConnect().then(startServer)
// view engine setup

function startServer() {
    // TODO:: 中间件处理

    app.use(logger('dev'))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))


    const { indexRouter, routerTable } = require('./routes/index')
    app.use(async function (req, res, next) {
        const method = req.method
        const reqPath = req.path.split('/')

        const matchedRouter = routerTable.find((item) => {
            let isMatched = true
            const routePath = item.path.split('/')
            if (routePath.length !== reqPath.length || method !== item.method) {
                isMatched = false
                return false
            }
            for (let i = 0; i < routePath.length; i++) {
                if (routePath[i] !== reqPath[i] && routePath[i].indexOf(':') < 0) {
                    isMatched = false
                    break
                }
            }
            return isMatched
        })

        if (matchedRouter && matchedRouter['authorise']) {
            auth = matchedRouter.auth || require('./routes/auth')

            try {
                const result = await auth(req)
                if (!result) {
                    next(new Error(`10003`))
                }
            } catch (e) {
                next(new Error(`10003`))
            }

        }
        next()
    })

    app.use('/', indexRouter) // 加载全部资源路由和动作路由

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        const err = new Error('10002')
        err.status = 404
        next(err)
    })

    // error handler
    // 千万不要删除这里的next!!!!
    app.use(function (err, req, res, next) {
        const DEFAULT_ERRORCODE = 40001

        // set locals, only providing error in development
        let errorcode = err.message
        const error = ERRORCODE[errorcode] || ERRORCODE[DEFAULT_ERRORCODE]
        let errorMsg = error.message
        if (!parseInt(errorcode)) {
            errorcode = DEFAULT_ERRORCODE
            errorMsg = err.message
        }
        const errorStatusCode = error.statusCode || 500
        res.locals.error = req.app.get('env') === 'development' ? err : {}
        console.error(`
        ========ERROR::${new Date()}::ERROR===========
        CODE: ${errorcode}
        MESSAGE: ${errorMsg}
        STACK: ${err.stack}
        ========END::${new Date()}::END===========
    `)
        // render the error page
        res
            .status(errorStatusCode || 500)
            .json({
                errorcode: errorcode,
                message: errorMsg,
                status: 'failed'
            })
    })

    // error handler
    // app.use(function (err, req, res, next) {
    //     // set locals, only providing error in development
    //     res.locals.message = err.message
    //     res.locals.error = req.app.get('env') === 'development' ? err : {}

    //     // render the error page
    //     res.status(err.status || 500)
    //     res.render('error')
    // })
}
