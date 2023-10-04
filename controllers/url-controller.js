const QRCode = require('qrcode')
const Url = require('../models/url')
const { shorten_url, dateDiff } = require('../helpers/url-helpers')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

// 預設Trend頁面顯示前15名
const TREND_LIMIT = 15
// 目前預設短網址只能存活14天
const EXPIRATION = 14
// cookie存活30 days
const COOKIE_TIME = 30 * 24 * 60 * 60 * 1000
const COOKIE_SETTING = {
  encode: String,
  maxAge: COOKIE_TIME,
  httpOnly: true,
  secure: true,
  sameSite: 'none'
}

const urlController = {
  getHome: (req, res) => {
    // 用在分頁標籤
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

    Url.find({
      url_shorten: { $in: historyCookies },
      expiration_date: {$gte: new Date()}
    })
      .skip(offset)
      .limit(limit)
      .lean()
      .then(historyUrl => {
        const cnt = historyUrl.length
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
    const fullhost = req.protocol + '://' + req.headers.host
    Promise.all([
      // 最多點選
      Url
        .find({ expiration_date: { $gt: new Date() } })
        .lean()
        .sort({ click_time: -1, created_date: 1, url_origin: 1 })
        .limit(TREND_LIMIT)
      ,
      // 存活最久
      Url
        .find({ expiration_date: { $gt: new Date() } })
        .lean()
        .sort({ valid_days: -1, created_date: 1, url_origin: 1 })
        .limit(TREND_LIMIT)
    ])
      .then(([mostClickUrl, mostExpirUrl]) => {
        res.render('trend', { fullhost, pathName, mostClickUrl, mostExpirUrl })
      })
      .catch(err => console.log(err))
  },
  getShortenURL: (req, res) => {
    // 清掉req.params的預設值'favicon.ico'
    if (req.params.url_shorten === 'favicon.ico') { req.params.url_shorten = '' }
    const url_shorten = req.params.url_shorten
    const date = new Date()

    Url.findOne({ url_shorten })
      .then(shortenUrl => {
        if (!shortenUrl) throw new Error("Short URL is not existed")
        shortenUrl.click_time += 1
        shortenUrl.expiration_date = new Date(date.setDate(date.getDate() + EXPIRATION)).setHours(23, 59, 59, 999)
        shortenUrl.valid_days = dateDiff(shortenUrl.created_date, shortenUrl.expiration_date)
        return shortenUrl.save()
      })
      .then(url => res.redirect(url.url_origin))
      .catch(() => res.redirect('/'))
  },
  postURL: (req, res) => {
    const pathName = req.route.path
    const url_origin = req.body.url_origin
    const cookies = req.cookies.historyURL ? req.cookies.historyURL : ''
    const date = new Date()
    // 錯誤處理
    const errors = []
    const host = req.headers.host
    if (url_origin.includes(host)) {
      errors.push({ message: '不能使用此網域的網址！' })
    }
    if (!url_origin) {
      errors.push({ message: '網址不得為空白！' })
    }
    if (errors.length) {
      return res.render('index', { errors, pathName })
    }

    Url
      .findOne({ url_origin })
      .lean()
      // 輸入相同網址時，直接給既有的短網址，不另產生
      .then((url) => {
        if (url) {
          // 驗證cookies是否已包含縮網址
          if (!cookies.includes(url.url_shorten)) {
            // 若無則新增到cookie
            const allHistory = cookies ? cookies + '/' + url.url_shorten : url.url_shorten
            res.cookie('historyURL', allHistory, COOKIE_SETTING)
          }
          return res.redirect(`/urls/${url._id}`)
        }

        return Url.create({
          url_origin: url_origin,
          url_shorten: shorten_url(),
          created_date: new Date(),
          expiration_date: new Date(date.setDate(date.getDate() + EXPIRATION)).setHours(23, 59, 59, 999)
        })
          .then(newUrl => {
            // 新增資料時，順便新增到cookie
            const allHistory = cookies ? cookies + '/' + newUrl.url_shorten : newUrl.url_shorten
            res.cookie('historyURL', allHistory, COOKIE_SETTING)
            res.redirect(`/urls/${newUrl._id}`)
          })
      })
      .catch(err => console.log(err))
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
