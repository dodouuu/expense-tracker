// this file is for third party login

const express = require('express')
const router = express.Router()
const passport = require('passport')

// press Facebook Login  in views/login.hbs
// or press Facebook Register in views/register.hbs
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

// acquire user's agreement for Facebook authenticate
// continue step2 of login authenticate
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

module.exports = router
