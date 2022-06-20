const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(
  MONGODB_URI
)

const db = mongoose.connection

db.on('error', () => { // connect error
  console.log('mongoDB error!')
})

db.once('open', () => { // connect succsessful
  console.log('mongoDB connected!')
})

module.exports = db
