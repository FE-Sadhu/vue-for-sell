// 搭建一个小型的node服务 去 代理接口
// 要依赖express (node.js)

const express = require('express')

const app = express()

const appData = require('./data.json')
const seller = appData.seller
const goods = appData.goods
const ratings = appData.ratings

const router = express.Router() // 通过express router对这些接口进行了路由的代理

router.get('/seller', function (req, res) {
  res.json({
    errno: 0,
    data: seller
  })
})

router.get('/goods', function (req, res) {
  res.json({
    errno: 0,
    data: goods
  })
})

router.get('/ratings', function(req, res) {
  res.json({
    errno: 0,
    data: ratings
  })
})

app.use('/api', router) // 这里的/api等于是拼接了字符串了 => /api/seller等

app.use(express.static('./dist')) // 代理dist目录下的静态资源 （app的静态资源指向了dist目录）

const port = process.env.PORT || 8900 // 启用node.js没有传端口的话，默认就用8900这个端口

module.exports = app.listen(port, '0.0.0.0', function (err) { // 然后通过app.listen启动服务监听端口了
  if (err) {
    console.log(err)
    return
  }
  console.log('listening at http://localhost:' + port + '\n')
})
