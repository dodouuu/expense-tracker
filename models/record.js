const mongoose = require('mongoose')
const Schema = mongoose.Schema

const stringOptions = {
  type: String,
  required: false
}

const numberOptions = {
  type: Number,
  required: false
}

const recordSchema = new Schema({
  id: numberOptions,
  name: stringOptions,
  date: {
    type: Date,
    required: false
  },
  amount: numberOptions,
  userId: {
    type: Number,
    ref: 'User'
  },
  categoryId: numberOptions
})

module.exports = mongoose.model('Record', recordSchema)
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
