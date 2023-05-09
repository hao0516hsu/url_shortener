const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

const routes = require('./routes/index')
require('./config/mongoose')

app.engine('handlebars', exphbs({ defaultLayout: "main" }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(routes)

// 連線狀態
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})