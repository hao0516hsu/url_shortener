if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')

const app = express()
const port = 3000
// 載入路由
const routes = require('./routes/index')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
// 載入Mongoose設定
require('./config/mongoose')
// Handlebars設定
app.engine('handlebars', exphbs({ defaultLayout: "main" , helpers: handlebarsHelpers}))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(flash())

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')  
  res.locals.warning_msg = req.flash('warning_msg')  
  next()
})

// 路由設定
app.use(routes)

// 連線狀態
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})