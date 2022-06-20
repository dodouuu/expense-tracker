const express = require('express')
const router = express.Router()

// import modules home.js
const home = require('./modules/home')

// import modules users.js
const users = require('./modules/users')

// make request url begin with /users direct to modules/users.js
router.use('/users', users)

// make request url begin with / direct to modules/home.js
// router.use('/', authenticator, home)
router.use('/', home)

module.exports = router
