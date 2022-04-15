// 导入mysql模块
const mysql = require('mysql')

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'mark123456',
    database: 'big_event',
})

module.exports = db