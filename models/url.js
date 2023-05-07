const mongoose = require('mongoose')
const Schema = mongoose.Schema

const urlSchema = new Schema({
  url_origin: {
    type: String,
    required: true
  },
  url_shorten: {
    type: String
  }
})

module.exports = mongoose.model('Url', urlSchema)