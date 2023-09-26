const express = require('express')
const router = express.Router()
const Url = require('../../models/url')
const date = new Date()

// 用Utility存放函數
const utility = {
  // Function: 產生短網址
  shorten_url() {
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
    const upperCaseLetters = lowerCaseLetters.toUpperCase()
    const numbers = '012345679'
    const url_component = lowerCaseLetters.split('').concat(upperCaseLetters.split(''), numbers.split(''))

    let url_shorten = ''

    for (let i = 1; i <= 5; i++) {
      url_shorten += utility.randomIndex(url_component)
    }
    return url_shorten
  },
  // Function: 產生亂數
  randomIndex(array) {
    const letter = array[Math.floor(Math.random() * array.length)]
    return letter
  }
}

// 路由: Post首頁
router.post('/', (req, res) => {
  const url_origin = req.body.url_origin
  const ip = req.ip
  const EXPIRATION = 10
  // console.log('req=                    ', req.clientIp)
  // console.log('res=                    ', res)
  Url.find({ url_origin })
    .lean()
    // 輸入相同網址時，直接給既有的短網，不另產生
    .then((url) => res.redirect(`/urls/${url[0]._id}`))
    // 輸入新的網址時，進到catch，新增資料到DB
    .catch(() => {
      Url.create({
        url_origin: url_origin,
        url_shorten: utility.shorten_url(),
        ip,
        created_date: new Date(),
        expiration_date: new Date(date.setDate(date.getDate() + EXPIRATION))
      })
        .then((url) => res.redirect(`/urls/${url._id}`))
    })

})

// 路由: Get 完成頁
router.get('/:id', (req, res) => {
  const id = req.params.id

  Url.findById(id)
    .lean()
    .then(url => res.render('show', { url }))
    .catch(error => console.log(error))

})

module.exports = router