const serverUrl = `http://localhost:8000/`;

// HANDLE LOGIN

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
      $("#error-login").text(error.responseJSON.errors);
    })
    .always((_) => {
      $("#login-area").trigger("reset");
    });
};

// END HANDLE LOGIN

// HANDLE AUTH
const auth = () => {
  if (localStorage) {
    $("#login-area").hide();
  } else {
    $("#login-area").show();
  }
};

//END HANDLE AUTH
