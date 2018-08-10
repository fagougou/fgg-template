// 环境变量
const {
    NODE_ENV,
    NODE_ENV_BETA,
    MONGO_HOST,
    MONGO_PORT,
    MONGO_USER,
    MONGO_PASSWORD,
    DB_NAME
} = process.env

// 依赖服务列表
const isProduction = NODE_ENV === 'production'
const isBeta = isProduction && NODE_ENV_BETA === 'beta'

module.exports = {
    // 环境判断
    isProduction: isProduction,
    isBeta: isBeta,

    // 数据库连接配置
    db: {
        host: MONGO_HOST,
        port: MONGO_PORT,
        dbname: DB_NAME,
        username: MONGO_USER,
        password: MONGO_PASSWORD,
        options: {
            useNewUrlParser: true,
            poolSize: 5,
            connectTimeoutMS: 40000,
            authSource: 'admin'
        }
    }
}
