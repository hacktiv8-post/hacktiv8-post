const router = require('express').Router()
const Controller = require('../controllers/controller')

router.post('/register', Controller.register)
router.post('/login', Controller.login)
// router.get('/dashboard', Controller.dashboard)

module.exports = router