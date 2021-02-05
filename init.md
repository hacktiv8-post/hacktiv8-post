1. https://newsapi.org/ => news api
2. https://covid19api.com/ => covid19
3. https://www.metaweather.com/api/ => weather

<h2>Table Database</h2>
<h3> Users </h3>
1. firstName => not null, not empty
2. lastName
3. email => not null, unique (isEmail, notEmpty)
4. password => not null (isLowerCase, isUpperCase, isNumeric, len[8, 255])

<h2>Login</h2>

- **ROUTE** <br>
  POST /login

- **REQUEST** <br>
  body: `{ email, password }`

- **RESPONSE** <br>
  `200` : `{ access_token, fullName }` <br>
  `400` : `{ errors: ["please insert email", "please insert password"] }` <br>
  `400` : `{ errors: "invalid email or password" }` <br>
  `500` : `{ errors: "internal server errors" }`

<h2>Register </h2>

- **ROUTE** <br>
  POST /register

- **REQUEST** <br>
  body: `{ firstName, lastName, email, password }`

- **RESPONSE** <br>
  `201` : `{}` <br>
  `400` : `{ errors: ["Minimum password length is 8 characters", "Please insert password", "Please insert email", "Email must be a valid email address", "First Name is required", "password must include numeric", "password must include lowercase", "password must include uppercase"] }`<br>
  `500`:`{ errors: "internal server errors" }`

<h2>Dashboard</h2>

- **ROUTE** <br>
  GET /dashboard

- **REQUEST** <br>
  headers: `{ access_token }`
  body: `{ location: { latitude, longitude } }`

- **RESPONSE** <br>
  `200` : `{ data: {articlesData, weather, dataCovid} }` <br>
  `404` : `{ errors: "Not found" }` <br>
  `500` : `{ errors: "internal server errors" }`

<h2>Google Login</h2>

- **ROUTE** <br>
  GET /google-login

- **REQUEST** <br>
  body: `{ id_token }`

- **RESPONSE** <br>
  `200` : `{ access_token, fullName }` <br>
  `404` : `{ errors: "not found" }` <br>
  `500` : `{ errors: "internal server errors" }`
