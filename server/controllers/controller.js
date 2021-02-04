const {User} = require('../models')
const {checkPassword} = require('../helpers/bcrypt')
const {generateToken} = require('../helpers/jwt')

class Controller{
    static register(req, res){
        const {firstName, lastName, email, password} = req.body
        User.create({
            firstName,
            lastName,
            email,
            password
        })
        .then(data=>{
            res.status(201).json({
                id: data.id,
                email: data.email
            })
        })
        .catch(err=>{
            res.status(500).json({msg : err.errors})
        })
    }

    
}

module.exports = Controller