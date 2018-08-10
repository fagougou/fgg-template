// 接口授权校验
// 授权成功 - 返回true 或者 promise reslove true
// 授权失败 - 返回false / promise reject false / throw error

module.exports = function defaultAuth () {
    return false
}
