const { User } = require('../models')
const { checkPassword } = require('../helpers/bcrypt')
const { generateToken } = require('../helpers/jwt')

class Controller {
    static register(req, res, next) {
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
                next(err)
            })
    }

    static login(req, res, next) {
        const { email, password } = req.body
        User.findOne({
            where: {
                email
            }
        })
            .then(user => {
                
                if (!user || !checkPassword(password, user.password)) {
                    throw { name: 'Custom error', message: 'invalid email or password', code: 400}
                }
                
                const access_token = generateToken({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                })
                
                res.status(200).json({access_token})
            })
            .catch(err => {
                next(err)
            })
    }


}

module.exports = Controller