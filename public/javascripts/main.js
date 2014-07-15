function checkLoginState(){
  FB.getLoginStatus(function(response) {
    console.log(response.status);

    if (response.status === 'connected') {
      $.post("/oauth/token", {
        facebook_token: response.authResponse.accessToken,
        grant_type: 'password',
        client_id: 'lingua-ios',
        client_secret: 'l1n9u4'
      }, function(data){
        console.log("Facebook token: " + response.authResponse.accessToken);
        console.log("Exchanged access token: " + data.access_token);
      });
    }
    else {
      FB.login(function(user){
        $.post("/oauth/token", {
          facebook_token: user.authResponse.accessToken,
          grant_type: 'password',
          client_id: 'lingua-ios',
          client_secret: 'l1n9u4'
        }, function(data){
          console.log("Facebook token: " + user.authResponse.accessToken);
          console.log("Exchanged access token: " + data.access_token);
        });
      },{scope: 'email, user_birthday'});
    }
  });
}