1. https://newsapi.org/ => news api
2. https://covid19api.com/ => covid19
3. https://www.metaweather.com/api/ => weather


<h2>Table Database</h2>
<h3> Users </h3>
1. firstName => not null
2. lastName
3. email => not null, unique (isEmail, notEmpty || notNull)
4. password => not null (isLowerCase, isUpperCase, isNumeric, len[8, 255])



<h2>Login</h2>

* **ROUTE** <br>
  POST /login

* **REQUEST**  <br>
  body: `{ email, password }`

* **RESPONSE** <br>
  `200` : `{ access_token }` <br>
  `404` : `{ errors: "user must register first" }` <br>
  `500` : `{ errors: "internal server errors" }`
  

<h2>Register </h2>

* **ROUTE** <br>
  POST /register

* **REQUEST**  <br>
  body: `{ firstName, lastName, email, password }`

* **RESPONSE** <br>
  `201` : `{}` <br>
  `400` : `{ //validasi }` <br>
  `500` : `{ errors: "internal server errors" }`

<h2>logout</h2>

* **ROUTE** <br>
  GET /logout

* **REQUEST**  <br>
  headers: `{ access_token }`

* **RESPONSE** <br>
  `200` : `{}` <br>
  `500` : `{ errors: "internal server errors" }`


<h2>weather</h2>

* **ROUTE** <br>
  GET /weather

* **REQUEST**  <br>
  headers: `{ access_token }`
  body: `{ location: { latitude, longitude } }` || set default jakarta

* **RESPONSE** <br>
  `200` : `{ data: [{}, {}, ...args] }` <br>
  `404` : `{ errors: "not found" }` <br>
  `500` : `{ errors: "internal server errors" }`


<h2>covid19</h2>

* **ROUTE** <br>
  GET /covid19/:<kode negara>

* **REQUEST**  <br>
  headers: `{ access_token }`
  body: `{ location: { latitude, longitude } }` || set default indonesia

* **RESPONSE** <br>
  `200` : `{ data: [{}, {}, ...args] }` <br>
  `404` : `{ errors: "not found" }` <br>
  `500` : `{ errors: "internal server errors" }`

<h2>news</h2>

* **ROUTE** <br>
  GET /news/:<kode negara>

* **REQUEST**  <br>
  headers: `{ access_token }`
  body: `{ location: { latitude, longitude } }` || set default indonesia

* **RESPONSE** <br>
  `200` : `{ data: [{}, {}, ...args] }` <br>
  `404` : `{ errors: "not found" }` <br>
  `500` : `{ errors: "internal server errors" }`