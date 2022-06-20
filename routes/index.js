// 引用 Express
const express = require('express')
// 引用 Express 路由器
const router = express.Router()

// import modules home.js
const home = require('./modules/home')


// 將網址結構符合 / 字串的 request 導向 home 模組
// router.use('/', authenticator, home)
router.use('/', home)

// 匯出路由器
module.exports = router
