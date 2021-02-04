const { User } = require('../models')
const { checkPassword } = require('../helpers/bcrypt')
const { generateToken } = require('../helpers/jwt')

class Controller {
    static register(req, res) {
        const { firstName, lastName, email, password } = req.body
        User.create({
            firstName,
            lastName,
            email,
            password
        })
            .then(data => {
                res.status(201).json({
                    id: data.id,
                    email: data.email
                })
            })
            .catch(err => {
                res.status(500).json({ msg: err.errors })
            })
    }

    static login(req, res) {
        const { email, password } = req.body
        User.findOne({
            where: {
                email
            }
        })
            .then(user => {
                
                if (!user || !checkPassword(password, user.password)) {
                    
                    throw { error: 'invalid email or password' }
                }
                
                const access_token = generateToken({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                })
                
                res.status(200).json({access_token})
            })
            .catch(err => {
                res.status(404).json(err)
            })
    }


}

module.exports = Controller