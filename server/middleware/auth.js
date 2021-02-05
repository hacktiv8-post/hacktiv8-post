const jwt = require('jsonwebtoken')

const authenticate = function(req, res, next){
    try{
        const token = req.headers.access_token
        const decoded = jwt.verify(token, process.env.SECRET);
        req.decoded = decoded
        next()
    }catch(err){
        // throw { name: 'Custom error', message: 'invalid email or password', code: 400}
        // let data = {name: 'Custom error'}
        next({ name: 'Custom error', message: 'invalid email or password', code: 400})
    }
}

module.exports = authenticate
