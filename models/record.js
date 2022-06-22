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
  formattedDate: stringOptions,
  amount: numberOptions,
  userId: numberOptions,
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
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
