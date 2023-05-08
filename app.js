const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const Url = require('./models/url')
const app = express()
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: "main" }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
// mongoose連線設定
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})
// function: shorten url
function shorten_url() {
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
  const upperCaseLetters = lowerCaseLetters.toUpperCase()
  const numbers = '012345679'
  const url_component = lowerCaseLetters.split('').concat(upperCaseLetters.split(''), numbers.split(''))
  let url_shorten = ''

  for (let i = 1; i <= 5; i++) {
    url_shorten += randomIndex(url_component)
  }
  return url_shorten
}
// function: random index
function randomIndex(array) {
  const letter = array[Math.floor(Math.random() * array.length)]
  return letter
}
// 路由: Get首頁
app.get('/', (req, res) => {
  res.render('index')
})
// 路由: Post首頁
app.post('/urls/', (req, res) => {
  const url_origin = req.body.url_origin

  Url.find({ url_origin: url_origin })
    .lean()
    .then((url) => res.redirect(`/urls/${url[0]._id}`)) 
    .catch(() => {
      Url.create({
        url_origin: url_origin,
        url_shorten: shorten_url()
      })
        .then((url) => res.redirect(`/urls/${url._id}`))
    })

})
// 路由: Get 完成頁
app.get('/urls/:id', (req, res) => {
  const id = req.params.id

  Url.findById(id)
    .lean()
    .then(url => res.render('show', { url }))
    .catch(error => console.log(error))

})
// 連線狀態
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})