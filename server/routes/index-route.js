const router = require('express').Router()
const Controller = require('../controllers/controller')
const ControllerApi = require('../controllers/controllerApi')

router.post('/register', Controller.register)


module.exports = router