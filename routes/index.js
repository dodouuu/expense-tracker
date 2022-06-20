const express = require('express')
const router = express.Router()

// import routes/modules/home.js
const home = require('./modules/home')
// import routes/modules/users.js
const users = require('./modules/users')

// import routes/modules/auth.js
const auth = require('./modules/auth')
// import middleware/auth.js
const { authenticator } = require('../middleware/auth')

// make request url begin with /users direct to routes/modules/users.js
router.use('/users', users)

// make request url begin with /auth direct to routes/modules/auth.js
router.use('/auth', auth)

// make request url begin with / direct to routes/modules/home.js
router.use('/', authenticator, home)

module.exports = router
