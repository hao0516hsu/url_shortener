const mongoose = require('mongoose')
const Schema = mongoose.Schema

const urlSchema = new Schema({
  url_origin: {
    type: String,
    required: true
  },
  url_shorten: {
    type: String
  },
  ip: {
    type: String,
    required: true
  },
  created_date: {
    type: Date,
    required: true
  },
  expiration_date: {
    type: Date,
    required: true
  }
})

module.exports = mongoose.model('Url', urlSchema)