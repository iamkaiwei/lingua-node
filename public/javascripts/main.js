function checkLoginState(){
  FB.getLoginStatus(function(response) {
    console.log(response.status);

    if (response.status === 'connected') {
      console.log(response.authResponse.accessToken);
      // $.post("/users", {facebook_token: response.authResponse.accessToken}, function(data){
      //   console.log(data);
      // });
    }
    else {
      FB.login(function(user){
        console.log(user.authResponse.accessToken);
        // $.post("/users", {facebook_token: user.authResponse.accessToken}, function(data){
        //   console.log(data);
        // });
      },{scope: 'email, user_birthday'});
    }
  });
}