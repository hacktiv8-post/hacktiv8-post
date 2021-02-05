const { User } = require("../models");
const { checkPassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");

class Controller {
  static register(req, res, next) {
    const { firstName, lastName, email, password } = req.body;

    User.create({
      firstName,
      lastName,
      email,
      password,
    })
      .then((data) => {
        res.status(201).json({
          id: data.id,
          email: data.email,
        });
      })
      .catch((err) => {
        let errorNotEmpty = [];
        let errorValidation = [];
        err.errors.forEach((el) => {
          if (el.validatorKey === "notEmpty") {
            errorNotEmpty.push(el);
          } else {
            errorValidation.push(el);
          }
        });
        if (errorNotEmpty.length > 0) {
          err.errors = errorNotEmpty;
          next(err);
        } else {
          next(err);
        }
      });
  }

  static login(req, res, next) {
    const { email, password } = req.body;
    User.findOne({
      where: {
        email,
      },
    })
      .then((user) => {
        const errors = [];
        if (!email) { errors.push("please insert email") }
        if (!password) { errors.push("please insert password") }
        if (errors.length !== 0) { throw { name: "Many custom error", message: errors, code: 400 } }
        if (!user || !checkPassword(password, user.password)) {
          throw {
            name: "Custom error",
            message: "invalid email or password",
            code: 400,
          };
        }

        const access_token = generateToken({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });

        let fullName = `${user.firstName} ${user.lastName}`
        res.status(200).json({ access_token, fullName });
      })
      .catch((err) => {
        next(err);
      });
  }

  static dashboard(req, res, next) {
    let articlesData = [];
    let weather = {};
    let country = "id";
    let newsUrl = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${process.env.NEWS_API_KEY}`;
    let latt = req.body.latitude;
    let long = req.body.longitude;
    let weatherStackUrl = `http://api.weatherstack.com/current?access_key=${process.env.WEATHERSTACK_KEY}&query=${latt},${long}`;

    axios
      .get(newsUrl)
      .then((response) => {
        let articles = response.data.articles;
        articlesData = articles.map((e) => {
          const source = e.source.name;
          const title = e.title;
          const description = e.description;
          const url = e.url;
          const urlToImage = e.urlToImage;
          const publishedAt = e.publishedAt;
          return { source, title, description, url, urlToImage, publishedAt };
        });

        return axios.get(weatherStackUrl);
      })
      .then((response) => {
        let weatherInfos = response.data;
        const temperature = weatherInfos.current.temperature;
        const weather_icons = weatherInfos.current.weather_icons;
        const weather_descriptions = weatherInfos.current.weather_descriptions;
        weather = { temperature, weather_icons, weather_descriptions };
        return axios({
          method: "get",
          url: `https://api.covid19api.com/live/country/indonesia`,
        });
      })
      .then((response) => {
        let temp = response.data[response.data.length - 1];

        const data = {
          country: temp.Country,
          confirmed: temp.Confirmed,
          deaths: temp.Deaths,
          recovered: temp.Recovered,
          active: temp.Active,
          date: temp.Date,
        };
        res.status(200).json({ articlesData, weather, dataCovid: data });
      })
      .catch((err) => {
        next(err);
      });
  }

  static async googleLogin(req, res, next) {
    try {
      const client = new OAuth2Client(process.env.CLIENT_ID);
      let firstName = "";
      let lastName = "";
      let email = "";
      const ticket = await client.verifyIdToken({
        idToken: req.body.id_token,
        audience: process.env.CLIENT_ID,
      });

      const payload = ticket.getPayload();
      firstName = payload.given_name;
      lastName = payload.family_name;
      email = payload.email;

      let user = await User.findOne({ where: { email: email } });

      if (user) {
        const fullName = payload.name;
        const access_token = generateToken({
          id: user.id,
          email: user.email,
        });

        res.status(201).json({ access_token, fullName });
      } else {
        let createUser = await User.create({
          firstName,
          lastName,
          email,
          password: process.env.USER_PW_GOOGLE,
        });
        const fullName = payload.name;
        const access_token = generateToken({
          id: createUser.id,
          email: createUser.email,
        });

        res.status(201).json({ access_token, fullName });
      }
    } catch (err) {
      next(err);
    }

  }

    static login(req, res, next) {
        const { email, password } = req.body
        User.findOne({
            where: {
                email
            }
        })
            .then(user => {
                const errors = [];
                if(!email) {
                    errors.push('please insert email')
                }
                if(!password) {
                    errors.push('please insert password')
                }
                if(errors.length !== 0) { throw { name: 'Many Custom error', message: errors, code: 400 } }

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
        let weather = {}
        let country = "id"
        let newsUrl = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${process.env.NEWS_API_KEY}`
        let latt = req.body.latitude
        let long = req.body.longitude
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
                    return { source, title, description, url, urlToImage, publishedAt }
                })
                return axios.get(weatherStackUrl)
            })
            .then(response => {
                let weatherInfos = response.data
                const { temperature, weather_icons, weather_descriptions, pressure, humidity, cloudcover, uv_index } = weatherInfos.current
                const { region, localtime } = weatherInfos.location;
                weather = {
                    temperature,
                    weather_icons,
                    weather_descriptions,
                    region,
                    cloudcover,
                    pressure,
                    localtime,
                    humidity,
                    uv_index
                }
                return axios({
                    method: "get",
                    url: `https://api.covid19api.com/live/country/indonesia`
                })


            })
            .then(response => {
                let temp = response.data[response.data.length - 1];

                const data = {
                    country: temp.Country,
                    confirmed: temp.Confirmed,
                    deaths: temp.Deaths,
                    recovered: temp.Recovered,
                    active: temp.Active,
                    date: temp.Date,
                }
                res.status(200).json({ articlesData, weather, dataCovid: data })
            })
            .catch(err => {
                next(err)
            })

    }

}

module.exports = Controller;
