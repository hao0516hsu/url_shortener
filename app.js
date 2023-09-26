const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

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
// 路由設定
app.use(routes)

// 連線狀態
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})