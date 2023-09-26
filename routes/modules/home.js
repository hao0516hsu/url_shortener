const urlController = require('../../controllers/url-controller')

const express = require('express')
const router = express.Router()

// 路由: Get首頁
router.get('/', urlController.getHome)

// 路由: 歷史頁面
router.get('/history', urlController.getHistory)

// 路由: 趨勢頁面
router.get('/trend', urlController.getTrend)

// 路由: 在瀏覽器能使用短網址
router.get('/:url_shorten', urlController.getShortenURL)

module.exports = router
