
const app = require('../server')
const router = require('express').Router()
const fs = require('fs')
const path = require('path')

// 读取路由注册文件，获取所有路由
// TODO:: 递归遍历目录，支持将关联的路由文件放在同一个目录中.
function getRouterTable () {
    let routerTable = []
    // 遍历routes下的json文件 合并成路由表
    const routerPath = path.resolve(__dirname, './')

    fs.readdirSync(routerPath).forEach((item) => {
        const routerConfig = path.resolve(__dirname, `./${item}`)
        const fileName = path.basename(routerConfig, '.json')

        if (path.extname(routerConfig) === '.json') {
            const authFile = path.resolve(__dirname, `./auth/${fileName}`)
            let auth = null

            try {
                auth = require(authFile)
            } catch (e) {
                console.error(e.stack)
            }

            const routers = require(routerConfig)

            routers.forEach((item) => {
                if (auth && typeof auth === 'function') {
                    item.auth = auth
                }

                item.file = fileName

                return item
            })
            routerTable = routerTable.concat(routers)
        }
    })

    return routerTable
}

const routerTable = getRouterTable()

// 加载路由
routerTable.forEach((r) => {
    const method = r.method.toLowerCase()

    // app.model/app.controller

    const handlerType = r.handler.split('.')[0]
    const handlerName = r.handler.split('.')[1]
    const modelName = r.file.substring(0, 1).toUpperCase() + r.file.substring(1)
    const handler = handlerType === 'model' ? app.model[modelName][handlerName] : app.controller[r.file] && app.controller[r.file][handlerName]

    router[method](`${r.path}`, async (req, res, next) => {
        try {
            const handlerResult = await handler(req)

            // handler
            if (handlerResult instanceof Promise) {
                res.send({
                    status: 'ok',
                    data: handlerResult
                })
            } else {
                const result = await handlerResult()

                // 直接返回controller执行结果
                if (req['Direct-Response']) {
                    res.send(result)
                } else {
                    res.send({
                        status: 'ok',
                        data: result
                    })
                }
            }
        } catch (e) {
            next(e)
        }
    })
    console.info(`[load router]:${method} - ${r.path}`)
})

module.exports = {
    indexRouter: router,
    routerTable: routerTable
}
