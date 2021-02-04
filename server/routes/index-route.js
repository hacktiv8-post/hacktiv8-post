const router = require('express').Router()
const Controller = require('../controllers/controller')

const authenticate = require('../middleware/auth')

router.post('/register', Controller.register)
router.post('/login', Controller.login)
router.use(authenticate)

router.get('/dashboard', (req, res)=>{
    res.send('test masuk ga???')
})


module.exports = router