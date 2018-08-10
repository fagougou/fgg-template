/**
 * 加载路由、Model、插件
 *
 */
const fs = require('fs')
const path = require('path')
const mixin = require('merge-descriptors')
const CRUD = require('../plugins/restful')

this.loadController = function loadController () {
    // 加载插件、控制器和数据模型
    const controller = {}
    const mockCtrlers = fs.readdirSync(path.resolve(__dirname, '../controller/mock'))
    const prodCtrlers = fs.readdirSync(path.resolve(__dirname, '../controller/prod'))
    // 根据环境变量判断使用mock controller 还是 prod controller
    const ctrlers = process.env.MOCK ? mockCtrlers : prodCtrlers
    ctrlers.forEach((ctrler) => {
        const ctrlPath = process.env.MOCK ? path.resolve(__dirname, `../controller/mock/${ctrler}`) : path.resolve(__dirname, `../controller/prod/${ctrler}`)
        const stat = fs.statSync(ctrlPath)
        if (!stat.isDirectory()) {
            ctrler = ctrler.split('.')[0]
        }
        if (ctrler) {
            controller[ctrler] = require(ctrlPath)
        }
    })
    return controller
}

this.loadModel = function loadModel () {
    const models = {}
    const modelsFile = fs.readdirSync(path.resolve(__dirname, '../models'))

    modelsFile.forEach((model) => {
        const modelPath = path.resolve(__dirname, `../models/${model}`)
        const stat = fs.statSync(modelPath)
        if (!stat.isDirectory()) {
            model = model.split('.')[0]
        }
        if (model) {
            const mongooseModel = require(modelPath)
            models[model] = mixin(mongooseModel, CRUD(mongooseModel), false)
        }
    })
    return models
}

this.loadPlugin = function () {
    // 加载插件
    const plugins = {}
    const pluginFiles = fs.readdirSync(path.resolve(__dirname, '../plugins'))
    pluginFiles.forEach((plugin) => {
        const pluginPath = path.resolve(__dirname, `../plugins/${plugin}`)
        const stat = fs.statSync(pluginPath)
        if (!stat.isDirectory()) {
            plugin = plugin.split('.')[0]
        }
        if (plugin) {
            plugins[plugin] = require(pluginPath)
        }
    })
    return plugins
}

module.exports = this
