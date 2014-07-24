function checkLoginState(){
  FB.getLoginStatus(function(response) {
    console.log(response.status);

    if (response.status === 'connected') {
      getAccessToken(response);
    }
    else {
      FB.login(function(user){
        getAccessToken(user);
      },{scope: 'email, user_birthday'});
    }
  });
}

function getAccessToken(res){
  $.post("/oauth/token", {
    facebook_token: res.authResponse.accessToken,
    grant_type: 'password',
    client_id: 'lingua-ios',
    client_secret: 'l1n9u4'
  }, function(data){
    console.log("Facebook token: " + res.authResponse.accessToken);
    console.log("Exchanged access token: " + data.access_token);
    console.log("Refresh token: " + data.refresh_token);
    
    document.cookie = "facebook_token = " + res.authResponse.accessToken;
    document.cookie = "refresh_token = " + data.refresh_token;
    window.prompt("Your access token. Copy to clipboard: ⌘+C, Enter", data.access_token);
  });
}

function refreshToken(){
  var refreshToken = document.cookie.replace(/(?:(?:^|.*;\s*)refresh_token\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
      facebookToken = document.cookie.replace(/(?:(?:^|.*;\s*)facebook_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

  if (refreshToken) {
    $.post("/oauth/token", {
      facebook_token: facebookToken,
      grant_type: 'refresh_token',
      client_id: 'lingua-ios',
      client_secret: 'l1n9u4',
      refresh_token: refreshToken
    }, function(data){
      document.cookie = "refresh_token = " + data.refresh_token;
      window.prompt("Your new access token. Copy to clipboard: ⌘+C, Enter", data.access_token);
    });
  } else {
    alert("You have not logged in to Facebook");
  }
}