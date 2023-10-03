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
  click_time: {
    type: Number,
    default: 0
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