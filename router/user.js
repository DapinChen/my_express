const express = require('express')

const router = express.Router()

// 导入路由处理函数的模块
const user_handler = require('../router_handler/user')

//导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要验证的规则对象
const {reg_login_scheme} = require('../schema/user')

// 注册新用户
router.post('/reguser', expressJoi(reg_login_scheme), user_handler.regUser)

// 登录
router.post('/login', expressJoi(reg_login_scheme), user_handler.login)

module.exports = router