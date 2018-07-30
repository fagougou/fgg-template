// 环境变量
let {
  NODE_ENV,
  NODE_ENV_BETA,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_USER,
  MONGO_PASSWORD,
  DB_NAME,
  DB_NAME_BETA,
  PORT
} = process.env

DB_NAME = 'famaomao'
DB_NAME_BETA = 'famaomao_test'

// 依赖服务列表

const isProduction = NODE_ENV === 'production'
const isBeta = isProduction && NODE_ENV_BETA === 'beta'


module.exports = {
  // 环境判断
  isProduction: isProduction,
  isBeta: isBeta,

  // 数据库连接配置
  db: {
    host: isProduction ? MONGO_HOST : 'localhost',
    port: isProduction ? MONGO_PORT : 27000,
    dbname: isProduction && !isBeta ? DB_NAME : DB_NAME_BETA,
    username: MONGO_USER,
    password: MONGO_PASSWORD,
    options: {
      native_parser: true,
      poolSize: 5,
      connectTimeoutMS: 40000,
      authSource: 'admin'
    }
  }

}