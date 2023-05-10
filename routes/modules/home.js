const express = require('express')
const router = express.Router()
const Url = require('../../models/url')

// 路由: Get首頁
router.get('/', (req, res) => {
  res.render('index')
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