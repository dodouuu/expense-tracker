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

const categorySchema = new Schema({
  id: numberOptions,
  name: stringOptions,
  name_en: stringOptions,
  fontawesomeStr: stringOptions
})

module.exports = mongoose.model('Category', categorySchema)
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
