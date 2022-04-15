// 导入express
const express = require('express')

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

//导入路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 启动服务器
app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007')
})

