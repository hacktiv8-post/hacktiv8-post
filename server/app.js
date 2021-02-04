const express = require('express')
const router = require('./routes/index-route')
const app = express()
const port = 8000
const {errorHandler} = require('./middleware/errorhandler')
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(router)

app.use(errorHandler)


app.listen(port, ()=> console.log(`todo app is running on port ${port}`))