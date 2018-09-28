/**
 * model controller
 */

const ObjectID = require('mongodb').ObjectID
const createAPI = function (Model) {
    // 根据查询条件获取资源列表
    const api = {}

    api.getList = function (req) {
        const query = req.query || {}
        const {
            condition,
            sort,
            limit,
            skip,
            select,
            $count,
            $populate
        } = getCondition(query)

        for (const key in condition) {
            const value = condition[key]

            try {
                if (new ObjectID(value) && value.length === 24) {
                    condition[key] = new ObjectID(value)
                }
            } catch (e) { console.error(e) }
        }

        if (Object.keys(condition).indexOf('isDleted') < 0) {
            condition['isDeleted'] = { $ne: true }
        }

        // 查询符合条件的文档数
        if ($count) {
            return Model.count(condition).then(count => {
                return { count: count }
            })
                .catch(e => {
                    throw new Error(`get resources error: ${e}`)
                })
        }

        return Model.find(condition)
            .select(select)
            .populate($populate)
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .lean()
            .then(docs => {
                if (docs && docs.length) {
                    return docs
                } else {
                    return []
                }
            })
            .catch(e => {
                throw new Error(`get resources error: ${e}`)
            })
    }

    api.getById = function (req) {
        const id = req.params.id
        const query = req.query || {}
        const { select, $populate } = getCondition(query)

        return Model.findById(id).select(select).populate($populate).lean()
            .then((doc) => {
                if (doc) {
                    return doc
                }

                throw new Error(`resource not found by id: ${id}`)
            })
            .catch(e => {
                throw new Error(`get resource id: ${id} error: ${e}`)
            })
    }

    // 新建资源
    api.create = function (req) {
        const doc = new Model(req.body)

        return doc.save()
            .then((result) => {
                return result
            }).catch(e => {
                throw new Error(`create resource failed:${e}`)
            })
    }

    // 根据id删除资源 - 假删除、添加isDeleted字段
    api.delete = function (req) {
        const id = req.params.id

        return Model.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
            .then(() => {
                return 'deleted'
            })
            .catch(e => {
                throw new Error(`delete resource failed:${e}`)
            })
    }

    // 根据条件批量删除资源
    api.deleteList = function (req) {
        const query = req.query
        const condition = getCondition(query).condition

        const update = {
            '$set': {
                isDeleted: true
            }
        }
        const options = {
            multi: true,
            new: true
        }

        return Model.update(condition, update, options)
            .then(result => {
                return `{ok:1, deleted: ${result.nModified}}`
            })
            .catch(e => {
                throw new Error(`delete resources failed:${e}`)
            })
    }

    // 根据id更新资源
    api.updateById = function (req) {
        const id = req.params.id
        const update = req.body.update
        const options = req.body.options

        return Model.findByIdAndUpdate(id, update, options)
            .then((result) => {
                return result
            })
            .catch(e => {
                throw new Error(`update resource failed:${e}`)
            })
    }

    // 批量更新资源
    api.updateMulti = function (req) {
        const condition = req.body.condition
        const update = {
            '$set': req.body.update
        }
        const options = req.body.options || {
            multi: true,
            new: true
        }

        return Model.update(condition, update, options)
            .then((result) => {
                return result
            })
            .catch(e => {
                throw new Error(`update resources by condition failed:${e}`)
            })
    }

    // 重载mongoose查找、删除方法
    api._find = function (condition = {}) {
        if (Object.keys(condition).indexOf('isDeleted') < 0) {
            condition['isDeleted'] = { $ne: true }
        }

        return Model.find(condition)
    }

    api._findOne = function (condition = {}) {
        if (Object.keys(condition).indexOf('isDeleted') < 0) {
            condition['isDeleted'] = { $ne: true }
        }

        return Model.findOne(condition)
    }

    api.remove = function (condition = {}) {
        const update = {
            '$set': {
                isDeleted: true
            }
        }
        const options = {
            multi: true,
            new: true
        }

        return Model.update(condition, update, options)
    }

    api.findOneAndRemove = function (condition = {}, update, options) {
        if (Object.keys(condition).indexOf('isDeleted') < 0) {
            condition['isDeleted'] = { $ne: true }
        }

        return Model.findOneAndUpdate(condition, update, options)
    }

    return api
}

// 获取查询条件
// TODO::完善查询操作 - 支持select、page等
const getCondition = function (query) {
    // const result = {}
    const sort = {}
    let limit = ''
    let skip = ''
    let select = ''
    let $count = ''

    if (query.$count) { // 获取符合条件的资源数量
        $count = query.$count
        delete query.$count
    }

    if (query.$sortby) { // 资源排序
        if (query.$sortby[0] === '-') {
            sort[query.$sortby.substr(1)] = -1
        } else {
            sort[query.$sortby.substr(0)] = 1
        }

        delete query.$sortby
    }

    if (query.$limit) {
        limit = parseInt(query.$limit)
        delete query.$limit
    }

    if (query.$skip) {
        skip = parseInt(query.$skip)
        delete query.$skip
    }

    if (query.$select) {
        select = JSON.parse(query.$select)
        delete query.$select
    }

    if (query.$or) {
        query.$or = JSON.parse(query.$or)['$or']
    }

    let populateKeys = ''

    if (query.$populate) {
        // populate功能
        const populate = query.$populate

        populateKeys = populate.substr(1, populate.length - 2).replace(/ /g, '').replace(/,/g, ' ')
        delete query.$populate
    }

    Object.keys(query).forEach((key) => {
        try {
            query[key] = JSON.parse(query[key])
        } catch (e) {
            console.error(e.stack)
        }
    })

    return {
        condition: query,
        sort: sort,
        limit: limit,
        skip: skip,
        select: select,
        $count: $count,
        $populate: populateKeys || ''
    }
}

module.exports = createAPI
