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

const recordSchema = new Schema({
  id: numberOptions,
  name: stringOptions,
  date: {
    type: Date,
    required: true
  },
  amount: numberOptions,
  userId: numberOptions,
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
