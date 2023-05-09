const express = require('express')
const router = express.Router()
const Url = require('../../models/url')

// 用Utility存放函數
const utility = {
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
  randomIndex(array) {
    const letter = array[Math.floor(Math.random() * array.length)]
    return letter
  }
}

// 路由: Post首頁
router.post('/', (req, res) => {
  const url_origin = req.body.url_origin

  Url.find({ url_origin })
    .lean()
    .then((url) => res.redirect(`/urls/${url[0]._id}`))
    .catch(() => {
      Url.create({
        url_origin: url_origin,
        url_shorten: utility.shorten_url()
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