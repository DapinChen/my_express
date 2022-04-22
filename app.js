// 导入express
const express = require('express')
const joi = require('joi')

// 创建服务器实例对象
const app = express()

//导入并配置cors中间件
const cors = require('cors')
app.use(cors())

//配置解析表单数据的中间件，这个中间件只能解析 application/x-www-form-urlencoded 格式的数据
app.use(express.urlencoded({ extended: false }))

// 在路由之前，创建响应数据的中间件
app.use((req, res, next) => {
    res.cc = function(err, status=1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
        })
    }
    next()
})

//在路由之前，配置解析 Token 的中间件
const expressJWT = require('express-jwt')
const config = require('./config')

app.use(expressJWT({secret: config.jwtSecretKey}).unless({path: [/^\/api/]}))

//导入路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 定义错误级别的中间件
app.use((err, req, res, next) =>{
    // 验证失败导致的错误
    if (err instanceof joi.ValidationError) res.cc(err)
    // 身份认证失败后的错误
    if (err.name === 'UnauthorizedError') {
        return res.cc('身份认证失败！')
    }
    // 未知错误
    res.cc(err)
})

// 启动服务器
app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007')
})

