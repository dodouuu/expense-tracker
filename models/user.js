const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

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
  name: {
    type: String,
    required: false
  },
  account: stringOptions,
  password: stringOptions,
  createdAt: {
    type: Date,
    default: Date.now
  },
  totalAmount: numberOptions,
  categoryAmount: [Number]
})
userSchema.plugin(AutoIncrement, { inc_field: 'id' })
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
