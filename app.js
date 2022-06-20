// 非 production mode 才引用 .env 設定環境變數
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// require packages
const express = require('express')
const { engine } = require('express-handlebars')

const methodOverride = require('method-override')
const session = require('express-session')
// session must before usePassport
const usePassport = require('./config/passport')
// 提示訊息 package
const flash = require('connect-flash')

const routes = require('./routes')
require('./config/mongoose')
const app = express()

// 如果在 Heroku 環境則使用 process.env.PORT
// 否則為本地環境，使用 3000 
const PORT = process.env.PORT

// 設定短檔名 hbs
app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public')) // setting static files

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(express.urlencoded({ extended: true }))

// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))

app.use(session({
  // session 用來驗證 session id 的字串
  secret: process.env.SESSION_SECRET,
  // true時每次互動後強制把 session 更新到 session store
  resave: false,
  // 強制將未初始化的 session 存回 session store
  saveUninitialized: true
}))

// app.use(session()) must before app.use(passport.session())

// 呼叫 Passport 函式並傳入 app，寫在路由之前
usePassport(app)
app.use(flash())
// 設定本地變數 res.locals：所有 views 內的樣板都可以取用的變數
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  // console.log('user=', req.user)
  res.locals.success_msg = req.flash('success_msg')
  // success_msg from routes/modules/users.js
  res.locals.warning_msg = req.flash('warning_msg')
  // warning_msg from middleware/auth.js
  res.locals.login_error = req.flash('error')
  // login_error message from config/passport.js
  next()
})

// 將 request 導入路由器
app.use(routes)

// start and listen on the Express server
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
