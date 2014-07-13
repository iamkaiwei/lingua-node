function checkLoginState(){
  FB.getLoginStatus(function(response) {
    console.log(response.status);

    if (response.status === 'connected') {
      $.post("/users", {facebook_token: response.authResponse.accessToken}, function(data){
        console.log(data);
      });
    }
    else {
      FB.login(function(user){
        $.post("/users", {facebook_token: user.authResponse.accessToken}, function(data){
          console.log(data);
        });
      },{scope: 'email, user_birthday'});
    }
  });
}