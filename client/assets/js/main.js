const serverUrl = `http://localhost:8000/`;

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
        .done((response) => {
          getWeather();
          getNews(response.articlesData);
          getCovid19(response.dataCovid);
        })
        .fail((err) => {
          console.log(err);
        });
    });
  } else {
    console.log("sorry weather data is not available");
  }
}

function getWeather() {}

function getCovid19(dataCovid) {
  let { country, confirmed, deaths, recovered, active, date } = dataCovid;
  $("#covid19-area").append(`
  <div class="card-covid19">
    <h1>${country}</h1>
    <p>confirmed: ${confirmed}</p>
    <p>deaths: ${deaths}</p>
    <p>recovered: ${recovered}</p>
    <p>active: ${active}</p>
    <p>date: ${date}</p>
  </div>
  `);
}

function getNews(news) {
  news.forEach((article) => {
    $("#news-area .cards").append(`
    <div class="card">
      <img src="${article.urlToImage}">
      <div class="detail">
        <h5><a href="${
          article.url
        }" target="_blank" style="text-decoration: none;">${
      article.title
    }</a></h5>
        <p>${article.description.slice(0, 100)} . . .</p>
        <p>by ${article.source} at ${new Date(
      article.publishedAt
    ).toUTCString()}</p>
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
      console.log(err);
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
  // var profile = googleUser.getBasicProfile();
  // console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
  // console.log("Name: " + profile.getName());
  // console.log("Image URL: " + profile.getImageUrl());
  // console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
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
    console.log("User signed out.");
  });
}
// END HANDLE AUTH
