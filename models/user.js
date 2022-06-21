const mongoose = require('mongoose')
const Schema = mongoose.Schema

const stringOptions = {
  type: String,
  required: true
}

const numberOptions = {
  type: Number,
  required: true
}

const userSchema = new Schema({
  id: numberOptions,
  name: stringOptions,
  account: stringOptions,
  password: stringOptions,
  createdAt: {
    type: Date,
    default: Date.now
  },
  totalAmount: numberOptions
})

module.exports = mongoose.model('User', userSchema)
// mongoose SchemaType
// String
// Number
// Date
// Buffer
// Boolean
// Mixed
// ObjectId
// Array
// Decimal128
// Map
// Schema
