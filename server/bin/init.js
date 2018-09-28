// 1. 路由文件、接口
const fs = require('fs')
const path = require('path')
const _ = require('underscore')
const { routerTable } = require('../routes/index')

function generatorController () {
    // 根据路由表生成controller
    const routers = _.groupBy(routerTable, (item) => {
        return item.file
    })

    Object.keys(routers).forEach((key) => {
        const routersList = routers[key]
        const mockCtrlFile = path.resolve(__dirname, `../controller/mock/${key}.js`)
        const prodCtrlFile = path.resolve(__dirname, `../controller/prod/${key}.js`)
        const mockCtrlStr = getCtrlStr(mockCtrlFile)
        const prodCtrlStr = getCtrlStr(prodCtrlFile)

        fs.writeFileSync(mockCtrlFile, mockCtrlStr)
        fs.writeFileSync(prodCtrlFile, prodCtrlStr)
        process.exit(0)

        function getCtrlStr (file) {
            let ctrlStr = ''

            try {
                fs.accessSync(file)
            } catch (e) {
                console.error(e.stack)
                fs.writeFileSync(file, 'module.exports = this \n\n')
            }

            const ctrls = require(file)

            ctrlStr = fs.readFileSync(file, 'utf-8') || ''
            routersList.forEach((item) => {
                const handlerType = item.handler.split('.')[0]
                const handlerName = handlerType === 'controller' ? item.handler.split('.')[1] : null

                if (handlerName && typeof ctrls[handlerName] !== 'function') {
                    ctrlStr += `this.${handlerName} = function(req){\n\n    return true \n}\n`
                }
            })

            return ctrlStr
        }
    })
}

/** TODO
function generatorTestUnit () {
    // 生成测试文件
}
**/

generatorController()
