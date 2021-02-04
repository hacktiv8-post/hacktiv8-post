const router = require('express').Router()
const Controller = require('../controllers/controller')

router.post('/register', Controller.register)


module.exports = router