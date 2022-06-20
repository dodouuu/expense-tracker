module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) { // function of Passport.js
      return next() // verify successfully
    }
    req.flash('warning_msg', 'Please Login first')
    res.redirect('/users/login') // verify fallaciously
  }
}
