const { User } = require('../models')
const { checkPassword } = require('../helpers/bcrypt')
const { generateToken } = require('../helpers/jwt')
const axios = require('axios')

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
                    throw { name: 'Custom error', message: 'invalid email or password', code: 400 }
                }

                const access_token = generateToken({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                })

                res.status(200).json({ access_token })
            })
            .catch(err => {
                next(err)
            })
    }

    static dashboard(req, res, next) {
        
        let articlesData = []
        let weatherInfos = {}
        let country = "id"
        let newsUrl = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${process.env.NEWS_API_KEY}`
        let latt = 40.7831
        let long = -73.9712
        let weatherStackUrl = `http://api.weatherstack.com/current?access_key=${process.env.WEATHERSTACK_KEY}&query=${latt},${long}`
        
        axios.get(newsUrl)
            .then(response => {
                
                let articles = response.data.articles
                articlesData = articles.map(e => {
                    const source = e.source.name
                    const title = e.title
                    const description = e.description
                    const url = e.url
                    const urlToImage = e.urlToImage
                    const publishedAt = e.publishedAt
                    return {source, title, description, url, urlToImage, publishedAt}
                })

                return axios.get(weatherStackUrl)
            })
            .then(response => {
                weatherInfos = response.data
                const temperature = weatherInfos.current.temperature
                const weather_icons = weatherInfos.current.weather_icons
                const weather_descriptions = weatherInfos.current.weather_descriptions
                const weather = {temperature, weather_icons, weather_descriptions}
                console.log(weather)
                res.status(200).json({articlesData, weather})

            })
            .catch(err => {
                res.status(401).json(err)
            })
    }


}

module.exports = Controller