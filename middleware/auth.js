module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) { // function of Passport.js
      // check if request.session.passport.user exist
      return next() // verify successfully
    } else {
      req.flash('warning_msg', 'Please Login first')
      return res.redirect('/users/login') // verify fallaciously
    }
  }
}
