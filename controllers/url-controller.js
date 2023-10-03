const QRCode = require('qrcode')

const Url = require('../models/url')
const { shorten_url } = require('../helpers/url-helpers')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const date = new Date()
const EXPIRATION = 10
// 30 days
const COOKIE_TIME = 30 * 24 * 60 * 60 * 1000
const COOKIE_SETTING = {
  encode: String,
  maxAge: COOKIE_TIME,
  httpOnly: true,
  secure: true
}

const urlController = {
  getHome: (req, res) => {
    const pathName = req.route.path

    res.render('index', { pathName })
  },
  getHistory: (req, res) => {
    const pathName = req.route.path
    const fullhost = req.protocol + '://' + req.headers.host
    // 分頁參數
    const DEFAULT_LIMIT = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    // 歷史參數
    const historyCookies = req.cookies.historyURL ? req.cookies.historyURL.split('/') : []
    const cnt = historyCookies.length    

    Url.find({
      url_shorten: { $in: historyCookies }
    })
      .skip(offset)
      .limit(limit)
      .lean()
      .then(historyUrl => {
        res.render('history', {
          pathName,
          historyUrl,
          fullhost,
          pagination: getPagination(limit, page, cnt),
          page
        })
      })
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

    Url.findOne({ url_shorten })
      .then(shortenUrl => {
        if (!shortenUrl) throw new Error("Short URL is not existed")
        shortenUrl.click_time += 1
        shortenUrl.expiration_date = new Date(date.setDate(date.getDate() + EXPIRATION))
        return shortenUrl.save()
      })
      .then(url => res.redirect(url.url_origin))
      .catch(() => res.redirect('/'))
  },
  postURL: (req, res) => {
    const url_origin = req.body.url_origin
    // 錯誤處理
    // const fullhost = req.protocol + '://' + req.headers.host
    // console.log(url_origin.includes(fullhost))
    const cookies = req.cookies.historyURL ? req.cookies.historyURL : ''

    Url.findOne({ url_origin })
      .lean()
      // 輸入相同網址時，直接給既有的短網址，不另產生
      .then((url) => {
        if (url) {
          if (!cookies.includes(url.url_shorten)) {
            const allHistory = cookies ? cookies + '/' + url.url_shorten : url.url_shorten
            res.cookie('historyURL', allHistory, COOKIE_SETTING)
          }
          return res.redirect(`/urls/${url._id}`)
        }

        return Url.create({
          url_origin: url_origin,
          url_shorten: shorten_url(),
          // ip,
          created_date: new Date(),
          expiration_date: new Date(date.setDate(date.getDate() + EXPIRATION))
        })
          .then((url) => {
            const allHistory = cookies ? cookies + '/' + url.url_shorten : url.url_shorten
            res.cookie('historyURL', allHistory, COOKIE_SETTING)
            res.redirect(`/urls/${url._id}`)
          })
      })
      .catch(err => cb(err))
  },
  getURL: (req, res) => {
    const id = req.params.id
    const fullhost = req.protocol + '://' + req.headers.host + '/'
    // QR Code 設定
    const opts = {
      errorCorrectionLevel: 'H',
      type: 'image/jpeg',
      margin: 2,
      scale: 4,
      color: {
        dark: "#191717",
        light: "#F6F7F8"
      }
    }

    Url.findById(id)
      .lean()
      .then(url => {
        const shortenURL = fullhost + url.url_shorten
        QRCode.toDataURL(shortenURL, opts, (err, qrCode) => {
          res.render('show', { url, qrCode })
        })
      })
      .catch(error => console.log(error))

  }
}

module.exports = urlController
