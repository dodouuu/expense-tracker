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
// press Login btn in views/login.hbs
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/', // login successfully direct to views/index.hbs
    failureRedirect: '/users/login', // login fallaciously direct to views/login.hbs
    failureFlash: true
  })
)
// press Log out btn
router.post('/logout', (req, res) => {
  req.logout((error) => { // Passport.js function for clear session
    if (error) {
      return next(error)
    } else {
      req.flash('success_msg', 'Log out successfully')
      res.redirect('/users/login')
    }
  })
})
// get views/register.hbs
router.get('/register', (req, res) => {
  res.render('register')
})
// press Register btn in views/register.hbs
router.post('/register', (req, res) => {
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

  User.findOne(
    {
      account: body.account
    }
  )
    .then(user => {
      // console.log('register user=', user)
      if (user !== null) { // find a same account
        errors.push({ message: 'the Account is registered' })
        res.render('register', { errors, body }) // keep data in fields, dont clear
      } else { // account not exist
        // register a new account
        // gen id = userCount + 1
        User.find({}).count((error, userCount) => {
          if (error) {
            console.error(error)
          } else {
            // console.log('uC=', userCount)

            bcrypt.genSalt(10) // saltRounds = 10
              .then(salt => bcrypt.hash(body.password, salt))
              .then(hash => {
                const newUser = new User({
                  id: userCount + 1,
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
      }
    })
})

module.exports = router
