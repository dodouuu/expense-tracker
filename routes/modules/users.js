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
// 去註冊頁
router.get('/register', (req, res) => {
  res.render('register')
})
// 在 register.hbs 按下 Register btn
router.post('/register', (req, res) => {
  // const { name, email, password, confirmPassword } = req.body
  const body = req.body
  const errors = []
  // if (!body.name) {
  //   errors.push({ message: '未填 name' })
  // }
  if (!body.email) {
    errors.push({ message: '未填 email' })
  }
  if (!body.password || !body.confirmPassword) {
    errors.push({ message: '未填 password' })
  }
  if (body.password !== body.confirmPassword) {
    errors.push({ message: '密碼、確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', { errors, body })
  }
  User.findOne(
    {
      email: body.email
    }
  )
    .then(user => {
      // console.log('register user=', user)
      if (user !== null) { // 有找到相同 email
        errors.push({ message: '此 Email 已註冊' })
        res.render('register', { errors, body }) // 送出表單後不要清空，保留剛剛填的資料
      } else { // 沒找到相同 email，註冊新 email
        bcrypt.genSalt(10) // 產生複雜度係數為 10的「鹽」
          .then(salt => bcrypt.hash(body.password, salt)) // 為使用者密碼「加鹽」，產生雜湊值
          .then(hash => {
            const newUser = new User({
              name: body.name,
              email: body.email,
              password: hash // 用雜湊值取代原本的使用者密碼

            })
            newUser.save()
              .then(() => res.redirect('/'))
              .catch(error => console.error(error))
          })

      }
    })
})

// 匯出路由模組
module.exports = router
