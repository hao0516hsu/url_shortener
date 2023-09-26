const express = require('express')
const router = express.Router()
const Url = require('../../models/url')

// 路由: Get首頁
router.get('/', (req, res) => {
  const pathName = req.route.path

  res.render('index', { pathName })
})

// 路由: 歷史頁面
router.get('/history', (req, res) => {
  const pathName = req.route.path
  const fullhost = req.protocol + '://' + req.headers.host
  const ip = req.ip

  Url.find({
    ip,
    expiration_date: { $gte: new Date() }
  })
    .lean()
    .then(historyUrl => {
      res.render('history', { pathName, historyUrl, fullhost })
    })
    .catch(err => console.log(err))
})

// 路由: 趨勢頁面
router.get('/trend', (req, res) => {
  const pathName = req.route.path
  res.render('trend', { pathName })
})

// 路由: 在瀏覽器能使用短網址
router.get('/:url_shorten', (req, res) => {
  // 清掉req.params的預設值'favicon.ico'
  if (req.params.url_shorten === 'favicon.ico') { req.params.url_shorten = '' }

  const url_shorten = req.params.url_shorten

  Url.find({ url_shorten })
    .lean()
    .then(url => res.redirect(url[0].url_origin))
    .catch(error => res.redirect('/'))
})

module.exports = router