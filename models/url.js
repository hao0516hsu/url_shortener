const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { dateDiff } = require('../helpers/url-helpers')

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
  },
  valid_days: {
    type: Number,
    default: function () {
      return dateDiff(this.created_date, this.expiration_date)
    }
  }
})

module.exports = mongoose.model('Url', urlSchema)