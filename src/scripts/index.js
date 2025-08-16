function loadpage(pageName) {
  $.ajax({
    method: "get",
    url: pageName,
    success: (response) => {
      $("section").html(response);
    },
  });
}

$(function () {
  $("#pwdcontainer").hide();
  $("#signin").click(() => {
    loadpage(`user-login.html`);
  });

  var email = "";
  $("#btnstart").click(() => {
    email = $("#Email").val();
    $.ajax({
      method: "get",
      url: "http://127.0.0.1:4400/getusers",
      success: (users) => {
        var user = users.find((item) => item.Email === email);
        if (user) {
          if (user.Email === email) {
            $("#pwdcontainer").show();
            $("#emailcontainer").hide();
            $("#error").hide();
          }
        } else {
          $("#error")
            .html(`user doesnt exist - <button class="btn btn-light m-3"
id="linkregister">Register</button>`);
        }
      },
    });
  });
  $("#btnsign").click(() => {
    $.ajax({
      method: "get",
      url: "http://127.0.0.1:4400/getusers",
      success: (users) => {
        var user = users.find((item) => item.Email === email);
        console.log(user);
        if (user) {
          if (user.Password === $("#Password").val()) {
            alert("login success");
            $("#pwdcontainer").hide();
            $("#signin").html(`${user.UserName} - Signout`);
            loadvideos();
          } else {
            alert("invalid password");
          }
        }
      },
    });
  });
  $(document).on("click", "#linkregister", () => {
    loadpage(`user-register.html`);
    $("#error").hide();
  });
  $(document).on("click", "#btnregister", () => {
    var user = {
      UserId: $("#UserId").val(),
      UserName: $("#UserName").val(),
      Password: $("#rPassword").val(),
      Email: $("#rEmail").val(),
      Mobile: $("#Mobile").val(),
    };
    $.ajax({
      method: "post",
      url: "http://127.0.0.1:4400/adduser",
      data: user,
    });
    alert(`register successfully..`);
    loadpage(`user-login.html`);
  });
  function loadvideos() {
    $("section").html("");
    $.ajax({
      method: "get",
      url: "http://127.0.0.1:4400/getvideos",
      success: (videos) => {
        videos.map((video) => {
          $(`<div class="box">
<iframe height="200" src=${video.Url} class="card-img-top"></iframe>
<div>
${video.Title}
</div>
</div>`).appendTo("section");
        });
      },
    });
  }
  $(document).on("click", "#btnlogin", () => {
    $.ajax({
      method: "get",
      url: "http://127.0.0.1:4400/getusers",
      success: (users) => {
        var user = users.find((item) => item.UserId == $("#LoginUserId").val());
        if (
          user.UserId == $("#LoginUserId").val() &&
          user.Password == $("#LoginPassword").val()
        ) {
          loadvideos();
          $("#signin").html(`${user.UserName} <button id="btnsignout" class="btn
btn-warning">Signout</button>`);
        } else {
          alert(`invalid username or password`);
        }
      },
    });
  });
  $(document).on("click", "#btnsignout", () => {
    location.reload();
  });
});
