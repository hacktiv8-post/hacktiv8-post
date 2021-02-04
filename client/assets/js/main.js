const serverUrl = `http://localhost:8000/`;

// ================ HANDLE LOGIN ================

$(document).ready(() => {
  // $("#register-area").hide();
  // $("#login-area").hide();
  auth();
});

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
    })
    .fail((error) => {
      $("#error-login").text(error.responseJSON.error);
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
      $("#succes-register").text("Account succesfully created");
    })
    .fail((err) => {
      $("#error-register").text(err.responseJSON.error);
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
});

//  ================ END HANDLE REGISTER ================

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
  } else {
    // $("#login-area").show();
    //NAVBAR
    $("#navbar-home").hide();
    $("#navbar-logout").hide();
    $("#navbar-login").show();
    $("#navbar-register").show();
  }
};

//END HANDLE AUTH

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
});

$("#navbar-login").click((event) => {
  event.preventDefault();
  $("#register-area").hide();
  $("#login-area").show();
  $("#dashboard-area").hide();
});

// END HANDLE NAVBAR


