const urlController = require('../../controllers/url-controller')

const express = require('express')
const router = express.Router()

// 路由: Post首頁
router.post('/', urlController.postURL )

// 路由: Get 完成頁
router.get('/:id',urlController.getURL)

module.exports = router