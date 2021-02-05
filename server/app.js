if(process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}

const express = require('express')
const router = require('./routes/index-route')
const app = express()
const port = process.env.PORT || 8000;
const {errorHandler} = require('./middleware/errorhandler')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(router)

app.use(errorHandler)


app.listen(port, ()=> console.log(`app is running on port ${port}`))