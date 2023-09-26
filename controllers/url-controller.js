const Url = require('../models/url')
const { shorten_url } = require('../helpers/url-helpers')
const date = new Date()

const urlController = {
  getHome: (req, res) => {
    const pathName = req.route.path

    res.render('index', { pathName })
  },
  getHistory: (req, res) => {
    const pathName = req.route.path
    const fullhost = req.protocol + '://' + req.headers.host
    const ip = req.ip

    Url.find({
      ip,
      expiration_date: { $gte: new Date() }
    })
      .lean()
      .then(historyUrl => res.render('history', { pathName, historyUrl, fullhost }))
      .catch(err => console.log(err))
  },
  getTrend: (req, res) => {
    const pathName = req.route.path

    res.render('trend', { pathName })
  },
  getShortenURL: (req, res) => {
    // 清掉req.params的預設值'favicon.ico'
    if (req.params.url_shorten === 'favicon.ico') { req.params.url_shorten = '' }

    const url_shorten = req.params.url_shorten

    Url.find({ url_shorten })
      .lean()
      .then(url => res.redirect(url[0].url_origin))
      .catch(() => res.redirect('/'))
  },
  postURL: (req, res) => {
    const url_origin = req.body.url_origin
    const ip = req.ip
    const EXPIRATION = 10
    // 錯誤處理
    // const fullhost = req.protocol + '://' + req.headers.host
    // console.log(url_origin.includes(fullhost))

    Url.find({ url_origin })
      .lean()
      // 輸入相同網址時，直接給既有的短網，不另產生
      .then((url) => {
        if (url[0]) return res.redirect(`/urls/${url[0]._id}`)

        return Url.create({
          url_origin: url_origin,
          url_shorten: shorten_url(),
          ip,
          created_date: new Date(),
          expiration_date: new Date(date.setDate(date.getDate() + EXPIRATION))
        })
          .then((url) => res.redirect(`/urls/${url._id}`))
      })
      .catch(err => cb(err))
  },
  getURL: (req, res) => {
    const id = req.params.id

    Url.findById(id)
      .lean()
      .then(url => res.render('show', { url }))
      .catch(error => console.log(error))

  }
}

module.exports = urlController
