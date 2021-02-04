const router = require('express').Router()
const Controller = require('../controllers/controller')
const ControllerApi = require('../controllers/controllerApi')

router.post('/register', Controller.register)
router.post('/login', Controller.login)

module.exports = router