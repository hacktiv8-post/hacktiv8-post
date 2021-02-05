const serverUrl = `http://localhost:4000/`;

// ================ HANDLE LOGIN ================

$(document).ready(() => {
  auth();
});

// HANDLE AUTH
const auth = () => {
  if (localStorage.access_token) {
    $("#login-area").hide();
    $("#register-area").hide();

    // NAVBAR
    $("#navbar-home").show();
    $("#navbar-logout").show();
    $("#navbar-login").hide();
    $("#navbar-register").hide();
    $("#dashboard-area").show();
    getDashboard();
  } else {
    // $("#login-area").show();
    //NAVBAR
    $("#navbar-home").hide();
    $("#navbar-logout").hide();
    $("#register-area").hide();
    $("#dashboard-area").hide();
    $("#navbar-login").show();
    $("#navbar-register").show();
    $("#login-area").show();
  }
};

//FETCH DATA IN DASHBOARD FROM DB

function getDashboard() {
  let latitude, longitude;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      $.ajax({
        url: serverUrl + "dashboard",
        method: "POST",
        headers: { access_token: localStorage.access_token },
        data: {
          latitude,
          longitude,
        },
      })
        .done(response => {
          // $(".dashboard-greeting").empty();
          // $(".dashboard-greeting").prepend(`
          //   <h3 id="dashboard-greeting">Hello ${localStorage.fullName},</br><span>todays weather:</span></h3>
          // `);
          getNews(response.articlesData);
          getCovid19(response.dataCovid);
          getWeather(response.weather);
        })
        .fail((err) => {
          $("#fail-condition").text(err).show();
          $("#dashboard-area").hide();
          $("#navbar-login").hide();
          $("#navbar-register").hide();
          $("#login-area").hide();
          $("#register-area").hide();
        });
    });
  } else {
    $("#fail-condition").text("sorry weather data is not available")
  }
}

function getWeather(weather) {
  let {
    temperature,
    weather_icons,
    weather_descriptions,
    region,
    cloudcover,
    pressure,
    localtime,
    humidity,
    uv_index
  } = weather;
  [weather_icons] = weather_icons;
  [weather_descriptions] = weather_descriptions;

  let time = localtime.slice(localtime.length-5, localtime.length);
  let date = new Date(localtime).toUTCString()
  date = date.slice(0, date.length-13)
  let dateTime = `${date} ${time}`

  $("#weather-area").empty();
  $("#weather-area").append(`
  <div class="weather-card">
    <div class="weather-card-header">
      <img src="${weather_icons}" alt="icon">
      <div id="weather-region">
        <h4 id="weather-location">${region}</h4>
        <div>${dateTime}</div>
      </div>
    </div>
    <h1 id="weather-temperature">${temperature}&deg;</h1>
    <div id="weather-detail">
      <div id="weather-detail1">
        <div id="weather-cloudcover">
          <h6>Cloudcover</h6>
          <h6>${cloudcover}</h6>
        </div>
        <div id="weather-pressure">
          <h6>Pressure</h6>
          <h6>${pressure}</h6>
        </div>
      </div>
      <div id="weather-detail2">
        <div id="weather-humidity">
          <h6>Humidity</h6>
          <h6>${humidity}</h6>
        </div>
        <div id="weather-uv_index">
          <h6>UV Index</h6>
          <h6>${uv_index}</h6>
        </div>
      </div>
    </div>
  </div>
  `)
}

function getCovid19(dataCovid) {
  let { country, confirmed, deaths, recovered, active, date } = dataCovid;
  let dateParsed = new Date(date).toUTCString()
  dateParsed = dateParsed.slice(0, dateParsed.length-13);

  $("#covid19-area").empty();
  $("#covid19-area").append(`
  <div class="card-covid19">
    <h2>Covid19 Info</h2>
    <p style="text-align: center;">in ${country}</p>
    <p>Confirmed: <span>${confirmed}</span></p>
    <p>Deaths: <span>${deaths}</span></p>
    <p>Recovered: <span>${recovered}</span></p>
    <p>Active: <span>${active}</span></p>
    <p>Updated: <span>${dateParsed}</span></p>
  </div>
  `);
}

function getNews(news) {

  news.forEach(article => {
    let publishedAt = new Date(article.publishedAt).toUTCString()
    publishedAt = publishedAt.slice(0, publishedAt.length - 4);
    let articleDescription;
    if(article.description.length < 170) {
      articleDescription = article.description;
    } else {
      articleDescription = article.description.slice(0, 170) + " . . . .";
    }
    $("#news-area .cards").append(`
    <div class="card">
      <img src="${article.urlToImage}">
      <div class="detail">

        <h5><a href="${article.url}" target="_blank" style="text-decoration: none;">${article.title}</a></h5>
        <p>${articleDescription}</p>
        <p>by <strong>${article.source}</strong> at ${publishedAt} WIB</p>
      </div>
    </div>
    `);
  });
}

//END HANDLE AUTH

$("#btn-login").click((event) => {
  event.preventDefault();
  const email = $("#login-email").val();
  const password = $("#login-password").val();

  handleLogin(email, password);
});

const handleLogin = (email, password) => {
  $.ajax({
    method: "POST",
    url: `${serverUrl}login`,
    data: { email, password },
  })
    .done((response) => {
      localStorage.setItem("access_token", response.access_token);
      auth();
      $("#dashboard-area").show();
    })
    .fail((err) => {
      $("div.center form .login-error-message").empty();
      err.responseJSON.messages.forEach((errMessage) => {
        $("div.center form .login-error-message").append(`
            <p id="error-register" style="margin: -5px 0; color: red;">${errMessage}</p>
        `);
      });
    })
    .always((_) => {
      $("#login-email").val("");
      $("#login-password").val("");
    });
};

$("#btn-register-inlogin").click((event) => {
  event.preventDefault();
  $("#login-email").val("");
  $("#login-password").val("");
  $("#register-area").show();
  $("#login-area").hide();
  $("div.center form .login-error-message").empty();
});

// ============ END HANDLE LOGIN ================

// ================ HANDLE REGISTER ================
$("#btn-register").click((event) => {
  event.preventDefault();
  const firstName = $("#register-first-name").val();
  const lastName = $("#register-last-name").val();
  const email = $("#register-email").val();
  const password = $("#register-password").val();

  handleRegister(firstName, lastName, email, password);
});

const handleRegister = (firstName, lastName, email, password) => {
  $.ajax({
    method: "POST",
    url: `${serverUrl}register`,
    data: { firstName, lastName, email, password },
  })
    .done((response) => {
      $("#login-area").show();
      $("#register-area").hide();
      $("#succes-register").text("Account succesfully created");
    })
    .fail((err) => {
      $("div.center form .register-error-message").empty();
      err.responseJSON.messages.forEach((errMessage) => {
        $("div.center form .register-error-message").prepend(`
            <p id="error-register" style="margin: -5px 0; color: red;">${errMessage}</p>
        `);
      });
    })
    .always((_) => {
      $("#register-first-name").val("");
      $("#register-last-name").val("");
      $("#register-email").val("");
      $("#register-password").val("");
    });
};

$("#btn-login-inregister").click((event) => {
  event.preventDefault();
  $("#register-first-name").val("");
  $("#register-last-name").val("");
  $("#register-email").val("");
  $("#register-password").val("");
  $("#register-area").hide();
  $("#login-area").show();
  $("div.center form .register-error-message").empty();
});

//  ================ END HANDLE REGISTER ================

// HANDLE NAVBAR
$("#navbar-logout").click((event) => {
  event.preventDefault();
  localStorage.clear();
  auth();
});

$("#navbar-register").click((event) => {
  event.preventDefault();
  $("#register-area").show();
  $("#login-area").hide();
  $("#dashboard-area").hide();
  $("div.center form .login-error-message").empty();
});

$("#navbar-login").click((event) => {
  event.preventDefault();
  $("#register-area").hide();
  $("#login-area").show();
  $("#dashboard-area").hide();
  $("div.center form .register-error-message").empty();
});

// END HANDLE NAVBAR

// HANDLE AUTH
function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;

  $.ajax({
    url: `${serverUrl}google-login`,
    method: "POST",
    data: { id_token },
  })
    .done((response) => {
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("fullName", response.fullName);
      auth();
      $("#dashboard-area").show();
    })
    .fail((err) => {
      $("div.center form .login-error-message").empty();
      err.responseJSON.messages.forEach((errMessage) => {
        $("div.center form .login-error-message").append(`
            <p id="error-register" style="margin: -5px 0; color: red;">${errMessage}</p>
        `);
      });
    })
    .always((_) => {
      $("#login-email").val("");
      $("#login-password").val("");
    });
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    // console.log("User signed out.");
  });
}
// END HANDLE AUTH
