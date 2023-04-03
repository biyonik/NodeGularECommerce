const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cors = require('cors')
const connectDB = require('./config/database.config')
const app = express()
dotenv.config()

const API = process.env.API_URL
const PORT = process.env.PORT || 5000

connectDB()
  .then()
  .catch((err) => console.log(err))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('tiny'))
app.options('*', cors())

app.use(`${API}/products`, require('./api/1.0/routes/product.route'))
app.use(`${API}/categories`, require('./api/1.0/routes/category.route'))
app.use(`${API}/brands`, require('./api/1.0/routes/brand.route'))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
