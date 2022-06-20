const express = require('express')
const router = express.Router()

// import User model
const User = require('../../models/user')

const passport = require('passport')
const bcrypt = require('bcryptjs')

// get views/login.hbs
router.get('/login', (req, res) => {
  res.render('login')
})
// 輸入完帳號密碼 按下 Login btn
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/', // 登入成功呼叫首頁
    failureRedirect: '/users/login', // 登入失敗呼叫 login.hbs
    failureFlash: true
  })
)
// 按下 Log out btn
router.get('/logout', (req, res) => {
  req.logout() // Passport.js 函式，清除 session
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})
// get views/register.hbs
router.get('/register', (req, res) => {
  res.render('register')
})
// press Register btn in register.hbs
router.post('/register', (req, res) => {
  // const { name, email, password, confirmPassword } = req.body
  const body = { ...req.body }
  const errors = []
  if (!body.name) {
    errors.push({ message: 'unfilled Name' })
  }
  if (!body.account) {
    errors.push({ message: 'unfilled Account' })
  }
  if (!body.password) {
    errors.push({ message: 'unfilled Password' })
  }
  if (!body.confirmPassword) {
    errors.push({ message: 'unfilled confirmPassword' })
  }
  if (body.password !== body.confirmPassword) {
    errors.push({ message: 'Password、confirmPassword NOT match' })
  }
  if (errors.length) {
    return res.render('register', { errors, body })
  }

  let userNumber = 0
  User.find({}).count((error, userCount) => {
    if (error) {
      console.error(error)
    } else {
      userNumber = userCount
      // console.log('uN=', userNumber)
    }
  })

  User.findOne(
    {
      account: body.account
    }
  )
    .then(user => {
      // console.log('register user=', user)
      if (user !== null) { // find a same account
        errors.push({ message: 'the Email is registered' })
        res.render('register', { errors, body }) // keep data in fields, dont clear
      } else { // cant find a same account, register a new account
        bcrypt.genSalt(10) // saltRounds = 10
          .then(salt => bcrypt.hash(body.password, salt))
          .then(hash => {
            const newUser = new User({
              id: userNumber + 1,
              name: body.name,
              account: body.account,
              password: hash // use hash replace password
            })
            newUser.save()
              .then(() => res.redirect('/'))
              .catch(error => console.error(error))
          })

      }
    })
})

module.exports = router
