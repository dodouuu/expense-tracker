// if NOT production mode => use .env to set environment variables
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
// Flash message package is about HINT for user
const flash = require('connect-flash')

const routes = require('./routes')
require('./config/mongoose')
const app = express()

// if operate in Heroku => PORT = process.env.PORT
// if operate in Local host => PORT = 3000
const PORT = process.env.PORT

// make .handlebars extname to .hbs
app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public')) // setting static files

// set body-parser process every request
app.use(express.urlencoded({ extended: true }))

// set methodOverride process every request
app.use(methodOverride('_method'))

app.use(session({
  // session use secret to verify string of session id
  secret: process.env.SESSION_SECRET,
  // if resave = true, force session save in session store everytime
  resave: false,
  // force Uninitialized session save in session store
  saveUninitialized: true
}))

// app.use(session()) must before app.use(passport.session())

// usePassport must before routes
usePassport(app)
app.use(flash())

// set local variables: res.locals for all templates in views
app.use((req, res, next) => {

  res.locals.isAuthenticated = req.isAuthenticated()
  // res.locals.isAuthenticated go to views/layouts/main.hbs

  res.locals.localUser = req.user
  // req.user come from passport.deserializeUser() in config/passport.js
  // localUser go to views/layouts/main.hbs

  res.locals.userAccount = req.flash('wrongAccont')
  // wrongAccont come from config/passport.js
  // userAccount go to views/login.hbs
  res.locals.userPasswd = req.flash('wrongPasswd')
  // wrongPasswd come from config/passport.js
  // userPasswd go to views/login.hbs

  res.locals.success_msg = req.flash('success_msg')
  // success_msg come from routes/modules/users.js
  // res.locals.success_msg go to views/partials/message.hbs

  res.locals.warning_msg = req.flash('warning_msg')
  // warning_msg come from middleware/auth.js
  // res.locals.warning_msg go to views/partials/message.hbs

  res.locals.login_error = req.flash('error')
  // req.flash('error') come from config/passport.js
  // login_error go to views/partials/message.hbs

  next()
})

app.use(routes)

// start and listen on the Express server
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
