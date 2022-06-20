const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// import Facebook login strategy
const FacebookStrategy = require('passport-facebook').Strategy

// import bcrypt
const bcrypt = require('bcryptjs')

// import User model
const User = require('../models/user')

module.exports = app => {
  // initialize Passport module
  app.use(passport.initialize())
  app.use(passport.session())

  // set LocalStrategy
  passport.use(new LocalStrategy(
    {
      // make default verify username to account
      usernameField: 'account',
      passReqToCallback: true
    },
    (req, account, password, done) => {
      User.findOne({ account })
        .then(user => {
          // console.log('passport user=', user)
          if (user === null) { // account not exist
            // if first parameter = err => cant reach Database
            // if first parameter = null => reach Database successfully
            // if second parameter = false => cant find document in Database
            // third parameter is for warning message
            return done(null, false, { message: 'The Account is not registered!', account, password })
          } else {
            // user.password is a hashed passwd in Database
            // password is raw, not hashed
            // cant compare using ===, need to use bcrypt.compare()
            return bcrypt.compare(password, user.password)
              .then(isMatch => {
                if (!isMatch) { // wrong password
                  return done(null, false, { message: 'The Password is incorrect.' })
                } else {
                  return done(null, user)
                  // if second parameter = user => find document successfully
                }
              })
          }
        })
        .catch(err => done(err))

    }
  ))

  // 設定 Facebook 登入策略
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName'] // 要求 Facebook 開放的資料
  },
    (accessToken, refreshToken, profile, done) => {
      const { name, email } = profile._json
      User.findOne({ email })
        .then(user => {
          if (user === null) { // email not exist，註冊新 email
            const randomPassword = Math.random().toString(36).slice(-8) // 產生8位亂數
            bcrypt.genSalt(10) // 產生複雜度係數為 10的「鹽」
              .then(salt => bcrypt.hash(randomPassword, salt)) // 為使用者密碼「加鹽」，產生雜湊值
              .then(hash => User.create({
                name,
                email,
                password: hash
              }))
              .then(user => done(null, user))
              .catch(err => done(err, false))
          } else { // email exist 直接 return user
            return done(null, user)
          }
        })
    }
  ))

  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    // 第二個參數 id = MongoDB 預設的 _id
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}
