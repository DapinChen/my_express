//导入数据库
const db = require('../db/index')

// 导入密码加密模块
const bcryptjs = require('bcryptjs')
// 导入JWT
const jwt = require('jsonwebtoken')
// 导入全局配置文件
const config = require('../config')
const { jwtSecretKey } = require('../config')

// 注册新用户处理函数
exports.regUser = (req, res) => {
    // 获取客户端提交的注册信息
    const userinfo = req.body
    // 校验用户名和密码
    // if (!userinfo.username || !userinfo.password) {
    //     return res.cc('用户名或密码错误')
    // }

    // 定义sql语句，查询用户是否存在
    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        // 执行语句失败
        if (err) {
            return res.cc(err)
        }
        // 判断用户是否存在
        if (results.length > 0) {
            return res.cc('用户名已存在，请重新注册用户名')
        }
        // 调用bcryptjs对密码进行加密
        userinfo.password = bcryptjs.hashSync(userinfo.password, 10)
        // 注册新用户，数据库插入新用户
        const regStr = 'insert into ev_users set ?'
        db.query(regStr, {username: userinfo.username, password: userinfo.password}, (err, results) => {
            if (err) {
                return res.cc(err)
            }
            // 判断影响行数是否为 1g x
            if (results.affectedRows !== 1) {
                return res.cc('注册失败，请稍后再试')
            }
            // return res.send({status: 0, message: '用户注册成功'})
            return res.cc('用户注册成功', 0)
        })
    })
}

// 登录的处理函数
exports.login = (req, res) => {
    // 接收表单数据
    const userinfo = req.body
    // 定义SQL语句
    const sql = 'select * from ev_users where username=?'
    // 执行SQL语句，根据username查询用户信息
    db.query(sql, userinfo.username, (err, results) => {
        // 执行语句失败
        if (err) {
            return res.cc(err)
        }
        // 执行SQL语句成功，但是获取到的数据条数不等于 1
        if (results.length !== 1) {
            return res.cc('登录失败')
        }
        // 判断密码是否正确
        const compareResult = bcryptjs.compareSync(userinfo.password, results[0].password)
        if (!compareResult) {
            return res.cc('登录失败')
        }
        // 在服务器端生成 Token 的字符串
        const user = {...results[0], password: '', user_pic: ''}
        //对用户的信息进行加密，生成 Token 字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {expiresIn: config.expiresIn})
        // 调用 res.send() 讲 Token 响应给客户端
        res.send({
            status: 0,
            message: '登录成功',
            token: 'Bearer' + tokenStr,
        })
    })
}